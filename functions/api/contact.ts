import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

interface Env {
	CONTACT_EMAIL: SendEmail;
	CONTACT_SENDER_EMAIL?: string;
}

interface ContactPayload {
	name?: string;
	email?: string;
	subject?: string;
	message?: string;
	website?: string;
}

const defaultToEmail = "contact@pneumarisband.com";

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json",
		},
	});
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function isValidEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
	if (!env.CONTACT_EMAIL) {
		return jsonResponse({ ok: false, error: "Email service is not configured." }, 500);
	}

	const payload = (await request.json().catch(() => null)) as ContactPayload | null;
	if (!payload) {
		return jsonResponse({ ok: false, error: "Invalid request body." }, 400);
	}

	const name = String(payload.name ?? "").trim();
	const email = String(payload.email ?? "").trim();
	const subject = String(payload.subject ?? "").trim();
	const message = String(payload.message ?? "").trim();
	const website = String(payload.website ?? "").trim();

	// Honeypot — silently discard bot submissions.
	if (website) {
		return jsonResponse({ ok: true });
	}

	if (!name || !email || !subject || !message) {
		return jsonResponse({ ok: false, error: "All fields are required." }, 400);
	}

	if (!isValidEmail(email)) {
		return jsonResponse({ ok: false, error: "Please enter a valid email address." }, 400);
	}

	if (message.length > 5000) {
		return jsonResponse({ ok: false, error: "Message is too long." }, 400);
	}

	const senderEmail = env.CONTACT_SENDER_EMAIL || defaultToEmail;

	const mime = createMimeMessage();
	mime.setSender({ name: "Pneumaris Contact Form", addr: senderEmail });
	mime.setRecipient(defaultToEmail);
	mime.setSubject(`[Pneumaris] ${subject}`);
	mime.addMessage({
		contentType: "text/html",
		data: `
			<h2>New Contact Form Message</h2>
			<p><strong>Name:</strong> ${escapeHtml(name)}</p>
			<p><strong>Email:</strong> ${escapeHtml(email)}</p>
			<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
			<hr />
			<p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
		`,
	});

	try {
		const emailMessage = new EmailMessage(senderEmail, defaultToEmail, mime.asRaw());
		await env.CONTACT_EMAIL.send(emailMessage);
	} catch (err) {
		console.error("Email send error:", err);
		return jsonResponse({ ok: false, error: "Unable to send your message right now." }, 502);
	}

	return jsonResponse({ ok: true });
};
