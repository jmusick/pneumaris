export const SITE_VERSION = "2.1.0";
export const SITE_URL = "https://pneumarisband.com";
export const SITE_NAME = "Pneumaris";
export const SITE_TWITTER_HANDLE = "@pneumarisband";

/**
 * Google Analytics 4 measurement ID.
 *
 * This is third-party tracking, so src/pages/privacy-policy.astro describes it.
 * Changing or removing it means updating that page in the same commit.
 */
export const GA_MEASUREMENT_ID: string | null = "G-DE6XTGT291";

/**
 * The ID actually handed to the loader. Null in `astro dev` so local page views
 * never reach the property — the consent banner still renders there so it can be
 * worked on, it just has nothing to load when accepted.
 */
export const ANALYTICS_ID: string | null = import.meta.env.PROD ? GA_MEASUREMENT_ID : null;

/**
 * Cloudflare Turnstile site key for the contact form (widget
 * "pneumaris-contact-form", hostname pneumarisband.com). It's public by design;
 * the matching secret lives only in the Pages project's TURNSTILE_SECRET_KEY.
 * PUBLIC_TURNSTILE_SITE_KEY overrides it for a local `wrangler pages dev` build
 * (see README "Contact Form"). `astro dev` always uses the test key instead.
 */
export const TURNSTILE_SITE_KEY: string =
	import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAF8IKXCxATGhHV4i";
