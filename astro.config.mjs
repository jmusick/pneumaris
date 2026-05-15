// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://pneumarisband.com',
	server: {
		host: true,
		port: 4321,
	},
	integrations: [icon(), sitemap()],
});
