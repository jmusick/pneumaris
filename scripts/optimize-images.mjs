import sharp from "sharp";

// Source masters live in assets-src/ (not deployed). Optimized derivatives are
// written to public/ and are what the site actually references. Re-run this
// script (`node scripts/optimize-images.mjs`) whenever a source master changes.
const src = (name) => new URL(`../assets-src/${name}`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const pub = (name) => new URL(`../public/${name}`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

async function run() {
	// header.png -> header.webp (hero background + about page image)
	await sharp(src("header.png"))
		.resize({ width: 1920, withoutEnlargement: true })
		.webp({ quality: 76 })
		.toFile(pub("header.webp"));

	// header.png -> og-image.jpg (1200x630 standard social share crop)
	await sharp(src("header.png"))
		.resize({ width: 1200, height: 630, fit: "cover", position: "top" })
		.jpeg({ quality: 82, mozjpeg: true })
		.toFile(pub("og-image.jpg"));

	// logo-circle.png -> logo-circle.webp (displayed max 320px, export at 2x)
	await sharp(src("logo-circle.png"))
		.resize({ width: 640, height: 640 })
		.webp({ quality: 82 })
		.toFile(pub("logo-circle.webp"));

	// logo.png -> logo.webp (header brand mark, displayed at 120px height, export at 2x)
	await sharp(src("logo.png"))
		.resize({ height: 480, withoutEnlargement: true })
		.webp({ quality: 84 })
		.toFile(pub("logo.webp"));

	// logo.png -> favicon + apple touch icon (must stay raster PNG for compatibility)
	await sharp(src("logo.png"))
		.resize({ width: 32, height: 32, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
		.png()
		.toFile(pub("favicon-32.png"));

	await sharp(src("logo.png"))
		.resize({ width: 180, height: 180, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
		.png()
		.toFile(pub("apple-touch-icon.png"));

	console.log("done");
}

run();
