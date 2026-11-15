export const SITE_VERSION = "2.3.0";
export const SITE_URL = "https://pneumarisband.com";
export const SITE_NAME = "Pneumaris";
export const SITE_TWITTER_HANDLE = "@pneumarisband";

export interface SocialProfile {
	key: "spotify" | "applemusic" | "soundcloud" | "youtube" | "tiktok" | "x" | "instagram" | "facebook";
	label: string;
	href: string;
	icon: string;
}

/**
 * The band's social and streaming profiles: the only place these URLs live.
 * The header renders them in this order, the homepage's MusicGroup JSON-LD lists
 * them all in `sameAs`, and the music and contact pages pick entries by `key`.
 * Per-album links are separate (src/data/releases.ts).
 */
export const SOCIAL_PROFILES: readonly SocialProfile[] = [
	{ key: "spotify", label: "Spotify", href: "https://open.spotify.com/artist/0LwtEDzdDXRarZ1H4eLqnU", icon: "simple-icons:spotify" },
	{ key: "applemusic", label: "Apple Music", href: "https://music.apple.com/us/artist/pneumaris/1896511324", icon: "simple-icons:applemusic" },
	{ key: "soundcloud", label: "SoundCloud", href: "https://soundcloud.com/pneumaris", icon: "simple-icons:soundcloud" },
	{ key: "youtube", label: "YouTube", href: "https://www.youtube.com/@Pneumaris", icon: "simple-icons:youtube" },
	{ key: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@pneumaris", icon: "simple-icons:tiktok" },
	{ key: "x", label: "Twitter / X", href: "https://x.com/pneumarisband", icon: "simple-icons:x" },
	{ key: "instagram", label: "Instagram", href: "https://www.instagram.com/pneumaris/", icon: "simple-icons:instagram" },
	{ key: "facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61589446647657", icon: "simple-icons:facebook" },
];

/** Looks up one profile by key; throws at build time if the key is missing. */
export function socialProfile(key: SocialProfile["key"]): SocialProfile {
	const profile = SOCIAL_PROFILES.find((p) => p.key === key);
	if (!profile) throw new Error(`No social profile with key "${key}"`);
	return profile;
}

/**
 * Etsy merch shop, linked as "Merch" in the header nav and named in the
 * privacy policy's External Links. Null hides both while the shop is down;
 * restore "https://www.etsy.com/shop/EgamiDesigns?section_id=59398309" to bring
 * them back.
 */
export const MERCH_SHOP_URL: string | null = null;

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
