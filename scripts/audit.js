const fs = require('fs');
const path = require('path');

const dirPath = __dirname;
let htmlFiles = [];
let allLinks = new Set();
let brokenLinks = [];
let missingAlt = [];
let htmlExtensionLinks = [];
let badAssetPaths = [];

function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                scanDir(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            htmlFiles.push(fullPath);
        }
    }
}

scanDir(dirPath);

console.log(`Scanning ${htmlFiles.length} HTML files...`);

htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = file.replace(dirPath, '').replace(/\\/g, '/');

    // 1. Check for .html in hrefs
    const hrefRegex = /href=["']([^"']+)["']/g;
    let match;
    while ((match = hrefRegex.exec(content)) !== null) {
        const link = match[1];
        if (link.endsWith('.html') && !link.includes('http')) {
            htmlExtensionLinks.push({ file: relativePath, link });
        }
        
        // 2. Check broken internal links
        if (link.startsWith('/') && !link.includes('http') && link !== '/') {
            let targetPath = link;
            if (targetPath.includes('#')) targetPath = targetPath.split('#')[0];
            if (targetPath.endsWith('/')) targetPath = targetPath.slice(0, -1);
            
            if (targetPath.length > 0) {
                // Determine if target exists (either as directory with index.html or explicit file)
                const checkDir = path.join(dirPath, targetPath, 'index.html');
                const checkFile = path.join(dirPath, targetPath);
                
                // Exclude assets from index.html check
                if (!targetPath.startsWith('/assets/')) {
                    if (!fs.existsSync(checkDir) && !fs.existsSync(checkFile + '.html') && !fs.existsSync(checkFile)) {
                         brokenLinks.push({ file: relativePath, link });
                    }
                } else {
                     if (!fs.existsSync(checkFile)) {
                         badAssetPaths.push({ file: relativePath, asset: link });
                     }
                }
            }
        }
    }

    // 3. Check for missing alt tags
    const imgRegex = /<img[^>]+>/g;
    while ((match = imgRegex.exec(content)) !== null) {
        const imgTag = match[0];
        if (!imgTag.includes('alt=')) {
            missingAlt.push({ file: relativePath, tag: imgTag });
        }
    }
    
    // 4. Asset checks (src)
    const srcRegex = /src=["']([^"']+)["']/g;
    while ((match = srcRegex.exec(content)) !== null) {
        const src = match[1];
        if (src.startsWith('/') && !src.includes('http')) {
             const checkFile = path.join(dirPath, src);
             if (!fs.existsSync(checkFile)) {
                 badAssetPaths.push({ file: relativePath, asset: src });
             }
        }
    }
});

console.log('--- AUDIT RESULTS ---');
console.log(`HTML URLs found in href: ${htmlExtensionLinks.length}`);
if (htmlExtensionLinks.length > 0) console.log(htmlExtensionLinks.slice(0, 5));

console.log(`Broken internal links: ${brokenLinks.length}`);
if (brokenLinks.length > 0) console.log(brokenLinks.slice(0, 5));

console.log(`Images missing ALT text: ${missingAlt.length}`);
if (missingAlt.length > 0) console.log(missingAlt.slice(0, 5));

console.log(`Broken asset paths (imgs/js): ${badAssetPaths.length}`);
if (badAssetPaths.length > 0) console.log(badAssetPaths.slice(0, 5));

// Check config files
console.log('--- CONFIG CHECK ---');
console.log('.htaccess exists:', fs.existsSync(path.join(dirPath, '.htaccess')));
console.log('robots.txt exists:', fs.existsSync(path.join(dirPath, 'robots.txt')));
console.log('sitemap.xml exists:', fs.existsSync(path.join(dirPath, 'sitemap.xml')));

