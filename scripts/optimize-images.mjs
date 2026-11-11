import sharp from "sharp";

// Source masters live in assets-src/ (not deployed). Optimized derivatives are
// written to public/ and are what the site actually references: display and
// social images in public/images/, full-size downloads in public/downloads/, and
// the favicons at the public/ root where browsers look for them. Re-run this
// script (`node scripts/optimize-images.mjs`) whenever a source master changes.
const path = (dir, name) => new URL(`../${dir}/${name}`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const src = (name) => path("assets-src", name);
const pub = (name) => path("public", name);
const image = (name) => path("public/images", name);
const download = (name) => path("public/downloads", name);

async function run() {
	// Wordmark companion for the larger homepage introduction.
	await sharp(src("intro-emblem-v1.png"))
		.resize({ width: 640, height: 640, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
		.webp({ quality: 88, alphaQuality: 100 })
		.toFile(image("intro-emblem-v1.webp"));

	// Text-free hooded emblem adapted from the existing illustrated brand artwork.
	await sharp(src("header-emblem-v1.png"))
		.resize({ width: 208, height: 208, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
		.webp({ quality: 88, alphaQuality: 100 })
		.toFile(image("header-emblem-v1.webp"));

	// Approved Reverie cover, promoted from the album media library.
	await sharp(src("reverie.png")).resize(1200, 1200).webp({ quality: 84 }).toFile(image("reverie.webp"));
	await sharp(src("reverie.png"))
		.resize(1200, 630, { fit: "contain", background: "#111015" })
		.jpeg({ quality: 85, mozjpeg: true }).toFile(image("reverie-social.jpg"));

	// Promoted from assets/albums/anathema/artwork/anathema-3000x3000.png.
	await sharp(src("anathema.png"))
		.resize({ width: 960, height: 960 })
		.webp({ quality: 82 })
		.toFile(image("anathema.webp"));

	// header.png -> header.webp (About page image)
	await sharp(src("header.png"))
		.resize({ width: 1920, withoutEnlargement: true })
		.webp({ quality: 76 })
		.toFile(image("header.webp"));

	// header.png -> og-image.jpg (1200x630 default social share crop)
	await sharp(src("header.png"))
		.resize({ width: 1200, height: 630, fit: "cover", position: "top" })
		.jpeg({ quality: 82, mozjpeg: true })
		.toFile(image("og-image.jpg"));

	// logo.png -> favicon + apple touch icon (must stay raster PNG for compatibility)
	await sharp(src("logo.png"))
		.resize({ width: 32, height: 32, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
		.png()
		.toFile(pub("favicon-32.png"));

	await sharp(src("logo.png"))
		.resize({ width: 180, height: 180, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
		.png()
		.toFile(pub("apple-touch-icon.png"));

	// The first wallpaper download is its own master: it is already 3440 x 1440,
	// and a sharp re-encode is larger than its existing PNG compression. Only the
	// Extras preview is generated from it.
	await sharp(download("pneumaris-wallpaper-3440x1440.png"))
		.resize({ width: 1280, withoutEnlargement: true })
		.webp({ quality: 80 })
		.toFile(image("wallpaper-preview.webp"));

	// Preserve the original upscaled master; deliver a matching ultrawide wallpaper.
	// The centered crop trims a small amount vertically without stretching the art.
	await sharp(src("wallpaper-2.png"))
		.resize({ width: 3440, height: 1440, fit: "cover", position: "centre" })
		.png({ compressionLevel: 9 })
		.toFile(download("pneumaris-wallpaper-2-3440x1440.png"));
	await sharp(download("pneumaris-wallpaper-2-3440x1440.png"))
		.resize({ width: 1280 })
		.webp({ quality: 80 })
		.toFile(image("wallpaper-2-preview.webp"));

	console.log("done");
}

run();
