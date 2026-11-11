/**
 * Contact form rules shared by the page (src/pages/contact.astro, which
 * renders `maxlength` from these and checks them before sending) and the Pages
 * Function (functions/api/contact.ts, which enforces them). One source, so the
 * browser never accepts what the server rejects.
 *
 * Lengths are JS string lengths (UTF-16 code units), which is also what
 * `maxlength` counts.
 */
export const CONTACT_LIMITS = {
	name: 100,
	/** RFC 5321 path limit. */
	email: 254,
	subject: 140,
	message: 5000,
} as const;

export const CONTACT_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
