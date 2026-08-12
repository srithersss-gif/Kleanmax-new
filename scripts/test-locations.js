const fs = require('fs');
const path = require('path');
const locations = require('./locations');

const rootPath = process.cwd();
let errors = 0;

console.log('--- STARTING QA TEST ---');

locations.forEach(loc => {
    const slugPath = loc.slug.split('/');
    const indexPath = path.join(rootPath, ...slugPath, 'index.html');
    
    // Check 1: File exists
    if (!fs.existsSync(indexPath)) {
        console.error('ERROR: Missing page for ' + loc.slug);
        errors++;
        return;
    }
    
    const content = fs.readFileSync(indexPath, 'utf8');
    
    // Check 2: Canonical doesn't have .html
    if (content.includes('rel="canonical" href="https://kleanmax.com/' + loc.slug + '.html"')) {
        console.error('ERROR: Canonical has .html in ' + loc.slug);
        errors++;
    }
    
    // Check 3: Unique H1 exists
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
    if (!h1Match || !h1Match[1].includes(loc.name)) {
        console.error('ERROR: Missing or incorrect H1 in ' + loc.slug);
        errors++;
    }
    
    // Check 4: Form contains correct pre-filled location
    if (!content.includes('value="' + loc.name + '"')) {
        console.error('ERROR: Form missing location value in ' + loc.slug);
        errors++;
    }
    
    // Check 5: JSON-LD exists
    if (!content.includes('"@type": "FAQPage"')) {
        console.error('ERROR: Missing FAQ Schema in ' + loc.slug);
        errors++;
    }
});

console.log('--- QA TEST COMPLETE ---');
if (errors === 0) {
    console.log('SUCCESS: All 25 location pages passed QA checks.');
} else {
    console.log('FAILED: Found ' + errors + ' errors.');
}
