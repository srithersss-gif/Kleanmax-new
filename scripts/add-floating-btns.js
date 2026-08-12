const fs = require('fs');
const path = require('path');

// 1. Add CSS to style.css
const cssPath = path.join(__dirname, 'assets', 'css', 'style.css');
if (fs.existsSync(cssPath)) {
    let css = fs.readFileSync(cssPath, 'utf8');
    if (!css.includes('.floating-btns')) {
        const floatingCSS = `
/* ==========================================================================
   Floating Action Buttons
   ========================================================================== */
.floating-btns {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: .75rem;
    z-index: 999; /* Ensure it's above everything */
}
.float-btn {
    width: 52px; height: 52px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
    box-shadow: 0 4px 14px rgba(0,0,0,.22);
    text-decoration: none;
    transition: transform .2s;
}
.float-btn:hover { transform: scale(1.1); }
.float-wa  { background: #25D366; }
.float-call{ background: var(--primary-color); }
@media (max-width: 640px) {
    .float-btn { width: 46px; height: 46px; font-size: 1.1rem; }
    .floating-btns { bottom: 1rem; right: 1rem; }
}
`;
        fs.appendFileSync(cssPath, floatingCSS);
        console.log('Added floating buttons CSS to style.css');
    }
}

// 2. Add HTML to all .html files
const htmlSnippet = `
<!-- Floating Buttons -->
<div class="floating-btns">
    <a href="https://wa.me/917338882034" target="_blank" rel="noopener" class="float-btn float-wa" aria-label="WhatsApp Kleanmax">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
    </a>
    <a href="tel:+917338882034" class="float-btn float-call" aria-label="Call Kleanmax">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.72A2 2 0 012 .91h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
    </a>
</div>\n\n`;

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
            if (!content.includes('class="floating-btns"')) {
                // Find where to insert it (right before <script src="assets/js/main.js"> or </body>)
                let replaced = false;
                if (content.includes('<script src="assets/js/main.js"></script>')) {
                    content = content.replace('<script src="assets/js/main.js"></script>', htmlSnippet + '<script src="assets/js/main.js"></script>');
                    replaced = true;
                } else if (content.includes('<script src="/assets/js/main.js"></script>')) {
                    content = content.replace('<script src="/assets/js/main.js"></script>', htmlSnippet + '<script src="/assets/js/main.js"></script>');
                    replaced = true;
                } else if (content.includes('</body>')) {
                    content = content.replace('</body>', htmlSnippet + '</body>');
                    replaced = true;
                }
                
                if (replaced) {
                    fs.writeFileSync(fullPath, content);
                    console.log('Added floating buttons to: ' + fullPath);
                }
            }
        }
    }
}

processDir(__dirname);

// Update templates that generate pages
const templates = ['service-template.html', 'location-template.html'];
templates.forEach(t => {
    const p = path.join(__dirname, t);
    if (fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf8');
        if (!content.includes('class="floating-btns"')) {
            if (content.includes('</body>')) {
                content = content.replace('</body>', htmlSnippet + '</body>');
                fs.writeFileSync(p, content);
                console.log('Added floating buttons to template: ' + p);
            }
        }
    }
});
