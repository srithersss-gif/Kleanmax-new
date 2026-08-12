const fs = require('fs');

['frontend/index.html', 'frontend/about.html'].forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/href="about\.html"/g, 'href="/about"');
    content = content.replace(/href="services\.html"/g, 'href="/services"');
    content = content.replace(/href="services\.html#/g, 'href="/services#');
    content = content.replace(/href="industries\.html"/g, 'href="/industries"');
    content = content.replace(/href="industries\.html#/g, 'href="/industries#');
    content = content.replace(/href="gallery\.html"/g, 'href="/gallery"');
    content = content.replace(/href="locations\.html"/g, 'href="/locations"');
    content = content.replace(/href="privacy\.html"/g, 'href="/privacy"');
    content = content.replace(/href="terms\.html"/g, 'href="/terms"');
    content = content.replace(/href="index\.html#/g, 'href="/#');
    fs.writeFileSync(f, content);
});

console.log('Clean URLs updated.');
