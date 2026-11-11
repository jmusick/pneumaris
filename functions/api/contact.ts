/**
 * Contact form endpoint — POST /api/contact
 *
 * A Cloudflare Pages Function, and the site's only server-side code; every
 * page is still static (see AGENTS.md). It exists because sending mail needs
 * an API token, and a token cannot be shipped to a browser.
 *
 * The flow: validate the fields, verify the Cloudflare Turnstile token, then
 * send one message through the Cloudflare Email Sending REST API to the band's
 * inbox, with the visitor's address as reply-to. Ported from the simonrook.com
 * contact function, which uses the same account and APIs. Integration notes:
 *
 * - The token needs the `Email Sending: Edit` permission, scoped to the account.
 * - Reply-to is the snake_case top-level field `reply_to`. A camelCase
 *   `replyTo` 400s with `invalid_request_schema`, and a `headers: {'Reply-To'}`
 *   object 400s with `email.invalid`. Don't "fix" the casing below.
 * - The `from` domain (pneumarisband.com) must stay onboarded in Email Sending.
 * - Success is `data.success`, not merely a 2xx.
 *
 * Every request ends in exactly one structured log line (see `logEvent`) and
 * one JSON response carrying `API_HEADERS`. Tests: tests/contact.test.mjs.
 */

export interface Env {
	CLOUDFLARE_API_TOKEN?: string;
	CLOUDFLARE_ACCOUNT_ID?: string;
	EMAIL_FROM_CONTACT?: string;
	CONTACT_TO_EMAIL?: string;
	TURNSTILE_SECRET_KEY?: string;
}

/** The slice of Cloudflare's `PagesFunction` context this handler uses. */
type PagesFunction<E> = (context: { request: Request; env: E }) => Promise<Response>;

interface ContactPayload {
	name?: unknown;
	email?: unknown;
	subject?: unknown;
	message?: unknown;
	captchaToken?: unknown;
	/** Honeypot — a real person never fills this in; see the form markup. */
	website?: unknown;
}

/**
 * Lengths are JS string lengths (UTF-16 code units), matching the form's
 * `maxlength` attributes in src/pages/contact.astro. Keep the two in step.
 */
export const LIMITS = {
	name: 100,
	/** RFC 5321 path limit. */
	email: 254,
	subject: 140,
	message: 5000,
	/** Cloudflare's documented maximum Turnstile token length. */
	captchaToken: 2048,
} as const;

/**
 * Byte budget for the raw request body, enforced before JSON parsing. A full
 * legitimate submission is under 20 KB: every capped field at 3 UTF-8 bytes per
 * code unit is (100 + 254 + 140 + 5000) × 3 = 16,482, plus a 2,048-byte token
 * and JSON keys and escapes. 40 KiB leaves about 2× headroom.
 */
const MAX_BODY_BYTES = 40 * 1024;

/**
 * Deadlines for the two upstream calls. Each fails closed: a verification
 * timeout never sends mail, and a send timeout is never retried (the mail may
 * already be on its way).
 */
const VERIFY_TIMEOUT_MS = 5_000;
const SEND_TIMEOUT_MS = 10_000;

/** Sender must be on a verified Email Sending domain; overridable per environment. */
const DEFAULT_FROM = "contact@pneumarisband.com";
/** Email Routing's catch-all forwards this to the band's mailbox. */
const DEFAULT_TO = "hello@pneumarisband.com";

/**
 * `public/_headers` covers static assets only — Pages never applies it to
 * Function responses — so the relevant subset is repeated here. HSTS and
 * Referrer-Policy must match `_headers`; the CSP is a JSON-only lockdown, not
 * the site policy.
 */
const API_HEADERS = {
	"Content-Type": "application/json",
	// No CORS headers by design: this backs one form on this origin.
	"Cache-Control": "no-store",
	"X-Content-Type-Options": "nosniff",
	"Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"X-Frame-Options": "DENY",
	"Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
} as const;

type Stage = "method" | "parse" | "validate" | "honeypot" | "verify" | "config" | "send" | "unhandled";

/**
 * What gets logged. Only these fields, only from fixed vocabularies or numbers
 * — never anything the visitor typed, the token, secrets, or upstream bodies.
 */
interface Diagnostic {
	stage: Stage;
	/** Our own fixed code, e.g. `verify_timeout`, `sent`. */
	code: string;
	timeout?: boolean;
	upstreamStatus?: number;
	/** Turnstile `error-codes` or Email Sending numeric error codes, filtered. */
	upstreamCodes?: (string | number)[];
	/** Exception class name only (`TypeError`), never its message. */
	errorName?: string;
}

interface Outcome {
	status: number;
	body: Record<string, unknown>;
	diag: Diagnostic;
	headers?: Record<string, string>;
}

const outcome = (
	status: number,
	body: Record<string, unknown>,
	stage: Stage,
	code: string,
	extra: Omit<Diagnostic, "stage" | "code"> = {},
): Outcome => ({ status, body, diag: { stage, code, ...extra } });

const SENT: Record<string, unknown> = { message: "Thanks — your message has been sent." };
const MALFORMED: Record<string, unknown> = { error: "Malformed request." };
const SEND_FAILED = "Could not send your message. Please try again in a moment.";

const json = (payload: Record<string, unknown>, status: number, headers: Record<string, string>): Response =>
	new Response(JSON.stringify(payload), { status, headers: { ...API_HEADERS, ...headers } });

const errorName = (error: unknown): string | undefined => {
	const name = (error as { name?: unknown } | null)?.name;
	return typeof name === "string" && /^[A-Za-z]{1,40}$/.test(name) ? name : undefined;
};

/** `AbortSignal.timeout` rejects fetch (and body reads) with a `TimeoutError`. */
const isTimeout = (error: unknown): boolean => errorName(error) === "TimeoutError";

const logEvent = (requestId: string, status: number, diag: Diagnostic): void => {
	// Built field by field rather than spread, so nothing can ride along.
	const event: Record<string, unknown> = {
		event: "contact",
		requestId,
		status,
		stage: diag.stage,
		code: diag.code,
	};
	if (diag.timeout) event.timeout = true;
	if (typeof diag.upstreamStatus === "number") event.upstreamStatus = diag.upstreamStatus;
	if (diag.upstreamCodes?.length) event.upstreamCodes = diag.upstreamCodes;
	if (diag.errorName) event.errorName = diag.errorName;

	if (status >= 500) console.error(event);
	else if (status >= 400) console.warn(event);
	else console.log(event);
};

const asString = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

/** Same pattern as the form's client-side check in src/pages/contact.astro. */
const isValidEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const escapeHtml = (value: string): string =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");

/** Strip CR/LF from anything interpolated into a header-like field. */
const singleLine = (value: string): string => value.replace(/[\r\n]+/g, " ").trim();

/**
 * Read the body as UTF-8 text without ever holding more than MAX_BODY_BYTES.
 * Content-Length is checked first as a cheap early out, but it is optional and
 * can lie, so the streamed bytes are counted too.
 */
const readBody = async (request: Request): Promise<{ ok: true; text: string } | { ok: false; outcome: Outcome }> => {
	const tooLarge = (code: string) => ({
		ok: false as const,
		outcome: outcome(413, { error: "Request too large." }, "parse", code),
	});

	const declared = Number(request.headers.get("Content-Length"));
	if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return tooLarge("body_too_large_declared");

	if (!request.body) return { ok: true, text: "" };

	const reader = request.body.getReader();
	const chunks: Uint8Array[] = [];
	let total = 0;
	try {
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			total += value.byteLength;
			if (total > MAX_BODY_BYTES) {
				// Stop pulling; whatever else the client sends is never buffered.
				reader.cancel().catch(() => {});
				return tooLarge("body_too_large");
			}
			chunks.push(value);
		}
	} catch (error) {
		return { ok: false, outcome: outcome(400, MALFORMED, "parse", "body_unreadable", { errorName: errorName(error) }) };
	}

	const bytes = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}

	try {
		return { ok: true, text: new TextDecoder("utf-8", { fatal: true }).decode(bytes) };
	} catch {
		return { ok: false, outcome: outcome(400, MALFORMED, "parse", "invalid_encoding") };
	}
};

const verifyTurnstile = async (request: Request, env: Env, token: string): Promise<Outcome | null> => {
	if (!env.TURNSTILE_SECRET_KEY) {
		// `code` is for diagnosis, not display: the two "not configured" states are
		// indistinguishable to a visitor but need telling apart from outside.
		return outcome(
			503,
			{ error: "The contact form is not configured.", code: "turnstile_unconfigured" },
			"config",
			"turnstile_unconfigured",
		);
	}

	if (!token) {
		return outcome(400, { error: "Please complete the verification check." }, "validate", "token_missing");
	}
	if (token.length > LIMITS.captchaToken) {
		// Can't be a real token; don't spend a Siteverify call finding that out.
		return outcome(400, { error: "Verification failed. Please try again." }, "validate", "token_too_long");
	}

	const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
	const remoteIp = request.headers.get("CF-Connecting-IP");
	if (remoteIp) body.set("remoteip", remoteIp);

	const unreachable = { error: "Could not reach the verification service." };
	let upstreamStatus: number | undefined;
	try {
		const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: body.toString(),
			signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
		});
		upstreamStatus = response.status;
		if (!response.ok) return outcome(502, unreachable, "verify", "verify_http_error", { upstreamStatus });

		const data = (await response.json()) as { success?: unknown; "error-codes"?: unknown } | null;
		if (data?.success !== true) {
			// Siteverify's error codes are a small documented vocabulary; keep only
			// values shaped like one.
			const codes = Array.isArray(data?.["error-codes"])
				? data["error-codes"].filter((c): c is string => typeof c === "string" && /^[a-z0-9-]{1,64}$/.test(c)).slice(0, 5)
				: [];
			return outcome(400, { error: "Verification failed. Please try again." }, "verify", "verify_rejected", {
				upstreamStatus,
				upstreamCodes: codes,
			});
		}
		return null;
	} catch (error) {
		if (isTimeout(error)) {
			return outcome(504, unreachable, "verify", "verify_timeout", { timeout: true, upstreamStatus });
		}
		return outcome(502, unreachable, "verify", "verify_unreachable", { upstreamStatus, errorName: errorName(error) });
	}
};

/**
 * Sends once and reports what happened; it never retries. A timeout is
 * ambiguous (the provider may have accepted the mail), and an automatic retry
 * could deliver it twice.
 */
const sendEmail = async (
	message: { to: string; from: string; subject: string; text: string; html: string; replyTo: string },
	env: Env,
): Promise<Outcome | null> => {
	let upstreamStatus: number | undefined;
	try {
		const response = await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					to: message.to,
					from: message.from,
					subject: message.subject,
					text: message.text,
					html: message.html,
					reply_to: message.replyTo,
				}),
				signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
			},
		);
		upstreamStatus = response.status;

		const data = (await response.json().catch((error: unknown) => {
			// A deadline hit mid-body is still a timeout; anything else is just an
			// unparseable answer.
			if (isTimeout(error)) throw error;
			return null;
		})) as { success?: unknown; errors?: unknown } | null;

		if (!response.ok || data?.success !== true) {
			// Error messages can echo request fields, so only the numeric codes are kept.
			const codes = Array.isArray(data?.errors)
				? data.errors
						.map((e) => (e as { code?: unknown } | null)?.code)
						.filter((c): c is number => Number.isInteger(c))
						.slice(0, 5)
				: [];
			return outcome(502, { error: SEND_FAILED }, "send", "send_rejected", { upstreamStatus, upstreamCodes: codes });
		}
		return null;
	} catch (error) {
		if (isTimeout(error)) {
			return outcome(
				504,
				{
					error:
						"We couldn't confirm your message was sent. Please wait a few minutes before trying again, so it doesn't arrive twice.",
				},
				"send",
				"send_timeout",
				{ timeout: true, upstreamStatus },
			);
		}
		return outcome(502, { error: SEND_FAILED }, "send", "send_unreachable", {
			upstreamStatus,
			errorName: errorName(error),
		});
	}
};

const buildBodies = (fields: { name: string; email: string; subject: string; message: string }) => {
	const text = [
		"New message from the pneumarisband.com contact form",
		"",
		`Name:    ${fields.name}`,
		`Email:   ${fields.email}`,
		`Subject: ${fields.subject}`,
		"",
		"Message:",
		fields.message,
	].join("\n");

	const safe = {
		name: escapeHtml(fields.name),
		email: escapeHtml(fields.email),
		subject: escapeHtml(fields.subject),
		message: escapeHtml(fields.message),
	};

	const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <title>Contact form message</title>
  </head>
  <body style="margin:0;padding:24px;background-color:#f3f4f6;color:#111827;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:700px;margin:0 auto;border-collapse:collapse;">
      <tr>
        <td style="background-color:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;">
          <h2 style="margin:0 0 16px 0;font-size:20px;line-height:1.3;">New message from the Pneumaris contact form</h2>
          <p style="margin:0 0 6px 0;"><strong>Name:</strong> ${safe.name}</p>
          <p style="margin:0 0 6px 0;"><strong>Email:</strong> <a href="mailto:${safe.email}" style="color:#0f172a;">${safe.email}</a></p>
          <p style="margin:0 0 16px 0;"><strong>Subject:</strong> ${safe.subject}</p>
          <div style="white-space:pre-wrap;background-color:#f9fafb;border:1px solid #e5e7eb;padding:12px;border-radius:8px;">${safe.message}</div>
          <p style="margin:16px 0 0 0;font-size:13px;color:#6b7280;">Reply directly to this email to answer the sender.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

	return { text, html };
};

type Field = "name" | "email" | "subject" | "message";

const handlePost = async (request: Request, env: Env): Promise<Outcome> => {
	const body = await readBody(request);
	if (!body.ok) return body.outcome;

	let parsed: unknown;
	try {
		parsed = JSON.parse(body.text);
	} catch {
		return outcome(400, MALFORMED, "parse", "malformed_json");
	}

	// `null`, numbers, strings and arrays are all valid JSON; only an object is a
	// submission. Field values must be strings (or absent/null).
	if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
		return outcome(400, MALFORMED, "parse", "invalid_shape");
	}
	const payload = parsed as ContactPayload;
	const values = [payload.name, payload.email, payload.subject, payload.message, payload.captchaToken, payload.website];
	if (values.some((value) => value !== undefined && value !== null && typeof value !== "string")) {
		return outcome(400, MALFORMED, "parse", "invalid_field_type");
	}

	// Honeypot: bots fill every field they find. Answer as if sent so they learn
	// nothing from the failure, but send nothing.
	if (asString(payload.website)) {
		return outcome(200, SENT, "honeypot", "honeypot");
	}

	const name = singleLine(asString(payload.name));
	const email = asString(payload.email);
	const subject = singleLine(asString(payload.subject));
	const message = asString(payload.message);

	// `field` lets the form mark the matching input; the client checks the same
	// rules first, so these mostly catch requests that bypass the page.
	const invalid = (field: Field, error: string, code: string) => outcome(400, { error, field }, "validate", code);

	if (!name) return invalid("name", "Please enter your name.", "name_missing");
	if (name.length > LIMITS.name) return invalid("name", `Name must be ${LIMITS.name} characters or fewer.`, "name_too_long");
	if (!email) return invalid("email", "Please enter your email address.", "email_missing");
	if (email.length > LIMITS.email) {
		return invalid("email", `Email must be ${LIMITS.email} characters or fewer.`, "email_too_long");
	}
	if (!isValidEmail(email)) return invalid("email", "Please enter a valid email address.", "invalid_email");
	if (!subject) return invalid("subject", "Please enter a subject.", "subject_missing");
	if (subject.length > LIMITS.subject) {
		return invalid("subject", `Subject must be ${LIMITS.subject} characters or fewer.`, "subject_too_long");
	}
	if (!message) return invalid("message", "Please enter a message.", "message_missing");
	if (message.length > LIMITS.message) {
		return invalid("message", `Message must be ${LIMITS.message} characters or fewer.`, "message_too_long");
	}

	const captchaFailure = await verifyTurnstile(request, env, asString(payload.captchaToken));
	if (captchaFailure) return captchaFailure;

	if (!env.CLOUDFLARE_API_TOKEN || !env.CLOUDFLARE_ACCOUNT_ID) {
		return outcome(
			503,
			{
				error: "The contact form is not configured.",
				code: "email_unconfigured",
				// Names the missing half without disclosing any value.
				missing: [
					!env.CLOUDFLARE_API_TOKEN && "CLOUDFLARE_API_TOKEN",
					!env.CLOUDFLARE_ACCOUNT_ID && "CLOUDFLARE_ACCOUNT_ID",
				].filter(Boolean),
			},
			"config",
			"email_unconfigured",
		);
	}

	const { text, html } = buildBodies({ name, email, subject, message });

	const sendFailure = await sendEmail(
		{
			to: env.CONTACT_TO_EMAIL || DEFAULT_TO,
			from: env.EMAIL_FROM_CONTACT || DEFAULT_FROM,
			// `from` stays on the verified domain — putting the visitor's address
			// there is what gets a domain flagged for spoofing. Their address goes
			// in reply_to so replying from the inbox reaches them.
			replyTo: email,
			subject: `[pneumarisband.com] ${subject} — ${name}`,
			text,
			html,
		},
		env,
	);
	// Deliberately vague to the browser; the diagnostic goes to the Function log.
	if (sendFailure) return sendFailure;

	return outcome(201, SENT, "send", "sent");
};

/**
 * One catch-all handler rather than `onRequestPost` — exporting both a
 * method-specific handler and a catch-all in the same module makes which one
 * wins ambiguous, so the method check lives here instead.
 *
 * The request ID is random per request (not derived from the IP or anything
 * submitted). It is returned as `X-Request-Id` so a failure seen in a browser
 * or `curl` can be matched to its log line.
 */
export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
	const requestId = crypto.randomUUID();

	let result: Outcome;
	try {
		result =
			request.method === "POST"
				? await handlePost(request, env)
				: {
						...outcome(405, { error: "Method not allowed." }, "method", "method_not_allowed"),
						headers: { Allow: "POST" },
					};
	} catch (error) {
		result = outcome(500, { error: "Something went wrong. Please try again in a moment." }, "unhandled", "unhandled", {
			errorName: errorName(error),
		});
	}

	logEvent(requestId, result.status, result.diag);
	return json(result.body, result.status, { ...result.headers, "X-Request-Id": requestId });
};
