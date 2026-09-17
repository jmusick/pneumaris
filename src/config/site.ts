export const SITE_VERSION = "1.13.0";
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
