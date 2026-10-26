// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://pneumarisband.com',
	vite: {
		// Keep even small application scripts external for the production CSP.
		build: { assetsInlineLimit: 0 },
	},
	server: {
		// Loopback only by default. Use `npm run dev:network` to opt in to LAN access.
		host: 'localhost',
		port: 4321,
	},
	integrations: [icon(), sitemap()],
});
