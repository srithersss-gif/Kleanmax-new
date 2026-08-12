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

            // Replace href="#quote-form">Contact</a> with href="/contact">Contact</a>
            if (content.includes('href="#quote-form">Contact</a>')) {
                content = content.replace(/href="#quote-form">Contact<\/a>/g, 'href="/contact">Contact</a>');
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

// Update scripts if they have the header
const scripts = ['build-gallery.js', 'update-dropdown.js', 'data.js'];
scripts.forEach(s => {
    const p = path.join(__dirname, s);
    if (fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf8');
        if (content.includes('href="#quote-form">Contact</a>')) {
            content = content.replace(/href="#quote-form">Contact<\/a>/g, 'href="/contact">Contact</a>');
            fs.writeFileSync(p, content);
            console.log('Updated script: ' + p);
        }
    }
});
