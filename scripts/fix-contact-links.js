const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                processDir(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Replace href="#contact" with href="/contact" in nav items (specifically list items)
            if (content.includes('href="#contact"')) {
                // Ensure we don't break anchor links on the homepage if we want them, 
                // but the prompt said "contact us page interlink in header", so /contact is globally correct for nav.
                content = content.replace(/href="#contact"/g, 'href="/contact"');
                modified = true;
            }
            
            if (content.includes('href="/#contact"')) {
                content = content.replace(/href="\/\#contact"/g, 'href="/contact"');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated: ' + fullPath);
            }
        }
    }
}

processDir(__dirname);

// Also update build-gallery.js
const bgPath = path.join(__dirname, 'build-gallery.js');
if (fs.existsSync(bgPath)) {
    let bgContent = fs.readFileSync(bgPath, 'utf8');
    if (bgContent.includes('href="/#contact"')) {
        bgContent = bgContent.replace(/href="\/\#contact"/g, 'href="/contact"');
        fs.writeFileSync(bgPath, bgContent);
        console.log('Updated: ' + bgPath);
    }
}
