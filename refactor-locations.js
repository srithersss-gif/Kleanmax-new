const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const locationsFile = path.join(rootDir, 'locations.js');
const sitemapFile = path.join(rootDir, 'sitemap.xml');
const locationsIndexFile = path.join(rootDir, 'locations', 'index.html');

// We are replacing these exact known suffixes to avoid double-replacing
const suffixes = [
    '-commercial-cleaning',
    '-industrial-cleaning',
    '-office-cleaning',
    '-factory-cleaning',
    '-warehouse-cleaning',
    '-it-park-cleaning'
];

function replaceSlugs(content) {
    let result = content;
    for (const suffix of suffixes) {
        // e.g. /chennai/guindy-commercial-cleaning -> /chennai/guindy-cleaning-services
        // We will just do a global replace for all known suffixes
        const regex = new RegExp(suffix, 'g');
        result = result.replace(regex, '-cleaning-services');
    }
    return result;
}

// 1. Update locations.js slugs
let locationsData = fs.readFileSync(locationsFile, 'utf8');
locationsData = replaceSlugs(locationsData);
fs.writeFileSync(locationsFile, locationsData);
console.log('Updated locations.js slugs');

// 2. Delete old location folders in chennai directory
const chennaiDir = path.join(rootDir, 'chennai');
if (fs.existsSync(chennaiDir)) {
    const files = fs.readdirSync(chennaiDir);
    for (const file of files) {
        const fullPath = path.join(chennaiDir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fs.rmSync(fullPath, { recursive: true, force: true });
        }
    }
    console.log('Cleaned old location folders in chennai/');
}

// 3. Update locations/index.html links
if (fs.existsSync(locationsIndexFile)) {
    let indexHtml = fs.readFileSync(locationsIndexFile, 'utf8');
    indexHtml = replaceSlugs(indexHtml);
    fs.writeFileSync(locationsIndexFile, indexHtml);
    console.log('Updated locations/index.html links');
}

// 4. Update sitemap.xml links
if (fs.existsSync(sitemapFile)) {
    let sitemap = fs.readFileSync(sitemapFile, 'utf8');
    sitemap = replaceSlugs(sitemap);
    fs.writeFileSync(sitemapFile, sitemap);
    console.log('Updated sitemap.xml links');
}

console.log('Refactoring complete. Please run "node generator-locations.js" to generate the new pages.');
