const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/db');
const { Tour } = require('../src/models');
const { logError, logInfo } = require('./logger');

const BASE_URL = process.env.BASE_URL || 'http://localhost:7180';
const sitemapDir = path.join(__dirname, '../public');
const filePath = path.join(sitemapDir, 'sitemap.xml');

// STATIC ROUTES
const staticRoutes = [
	'/',
	'/login',
	'/signup',
	'/me',
	'/admin/tours',
	'/admin/plugins',
];

if (!fs.existsSync(sitemapDir)) {
	console.log('Public directory not found, creating...');
	fs.mkdirSync(sitemapDir, { recursive: true });
}

async function generateSitemap() {
	try {
		const urls = [];
		await sequelize.authenticate();
		console.log(
			'Connection to the database has been established successfully.',
		);
		const tours = await Tour.findAll({
			attributes: ['slug', 'updatedAt'],
		});

		staticRoutes.forEach((route) => {
			urls.push(`
        <url>
            <loc>${BASE_URL}${route}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
            <lastmod>${new Date().toISOString()}</lastmod>
        </url>
      `);
		});

		tours.forEach((tour) => {
			urls.push(`
        <url>
            <loc>${BASE_URL}/tour/${tour.slug}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.9</priority>
            <lastmod>${tour.updatedAt.toISOString()}</lastmod>
        </url>
      `);
		});

		const sitemapContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${urls.join('\n')}
    </urlset>
  `.trim();

		await new Promise((resolve, reject) => {
			const writeStream = fs.createWriteStream(filePath);
			writeStream.on('error', (err) => {
				logError('Error writing sitemap:', err);
				reject(err);
			});
			writeStream.on('finish', () => {
				console.log('Generated file path:', filePath);
				logInfo('Sitemap successfully generated:', filePath);
				resolve();
			});

			writeStream.end(sitemapContent);
		});
	} catch (error) {
		logError(error);
	}
}

generateSitemap().finally(() => {
	console.log('Sitemap generation process finished.');
	process.exit(0);
});
