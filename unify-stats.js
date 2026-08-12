const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

// Find all HTML files
function getHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === 'dist' || file === '.git' || file === 'backend' || file === 'scratch') continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const htmlFiles = getHtmlFiles(rootDir);

let replacements = 0;
for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('Clients Served')) {
        content = content.replace(/Clients Served/g, 'Projects');
        fs.writeFileSync(file, content);
        replacements++;
        console.log(`Updated HTML file: ${file}`);
    }
}
console.log(`Updated 'Clients Served' to 'Projects' in ${replacements} HTML files.`);

// Update templates and generators just in case
['generator.js', 'generator-locations.js', 'service-template.html', 'location-template.html'].forEach(f => {
    const filePath = path.join(rootDir, f);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('Clients Served')) {
            content = content.replace(/Clients Served/g, 'Projects');
            fs.writeFileSync(filePath, content);
            console.log(`Updated template/generator file: ${f}`);
        }
    }
});

// Update build-gallery.js
const galleryScriptPath = path.join(rootDir, 'scripts', 'build-gallery.js');
let galleryContent = fs.readFileSync(galleryScriptPath, 'utf8');

const newTrustBarHtml = `<!-- STATS -->
<section class="trust-bar">
    <div class="container trust-bar-grid">
        <div class="trust-stat fade-up">
            <div class="stat-icon-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M12 15l-2 5l9-11h-7l2-5l-9 11h7z" />
                </svg>
            </div>
            <div class="stat-number-wrap">
                <span class="stat-number" data-target="13">0</span><span class="stat-plus">+</span>
            </div>
            <span class="stat-label">Years Experience</span>
        </div>
        <div class="trust-stat fade-up delay-1">
            <div class="stat-icon-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M3 21h18M3 7v14M21 7v14M6 21V11m4 10V11m4 10V11m4 10V11M9 7h6M12 3v4" />
                </svg>
            </div>
            <div class="stat-number-wrap">
                <span class="stat-number" data-target="5000">0</span><span class="stat-plus">+</span>
            </div>
            <span class="stat-label">Projects</span>
        </div>
        <div class="trust-stat fade-up delay-2">
            <div class="stat-icon-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            </div>
            <div class="stat-number-wrap">
                <span class="stat-number" data-target="4.9">0.0</span><span class="stat-plus">★</span>
            </div>
            <span class="stat-label">Customer Rating</span>
        </div>
        <div class="trust-stat fade-up delay-3">
            <div class="stat-icon-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            </div>
            <div class="stat-number-wrap">
                <span class="stat-number">24/7</span>
            </div>
            <span class="stat-label">Service Availability</span>
        </div>
    </div>
</section>`;

const statsBarRegex = /<!-- STATS -->[\s\S]*?<\/section>/;
if (statsBarRegex.test(galleryContent)) {
    galleryContent = galleryContent.replace(statsBarRegex, newTrustBarHtml);
    fs.writeFileSync(galleryScriptPath, galleryContent);
    console.log('Updated scripts/build-gallery.js to use unified trust-bar');
} else {
    console.log('Could not find stats-bar section in build-gallery.js');
}
