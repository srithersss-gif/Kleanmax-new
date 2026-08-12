const fs = require('fs');
const path = require('path');
const locations = require('./locations');

const rootPath = process.cwd();
const templatePath = path.join(rootPath, 'location-template.html');
const template = fs.readFileSync(templatePath, 'utf8');

locations.forEach((loc, index) => {
    let output = template;
    
    const title = `Commercial & Industrial Cleaning Services in ${loc.name} | Kleanmax`;
    const description = loc.heroDescription;
    const heroDescription = loc.heroDescription;
    const aboutLocation = loc.aboutLocation;
    
    // Facilities List
    const facilitiesList = loc.facilities.map(f => 
        `<div class="industry-card fade-up">` +
            `<h4>${f}</h4>` +
            `<p>Specialized B2B cleaning, housekeeping and maintenance for ${f.toLowerCase()} in ${loc.name}.</p>` +
        `</div>`
    ).join('');
    
    // Location-Specific FAQs
    const faqHtml = loc.faqs.map(f => 
        `<div class="faq-item">` +
            `<button class="faq-question" aria-expanded="false">` +
                f.q + ` <span class="faq-icon"></span>` +
            `</button>` +
            `<div class="faq-answer">` +
                `<p>` + f.a + `</p>` +
            `</div>` +
        `</div>`
    ).join('');
    
    const faqJson = JSON.stringify(loc.faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
        }
    })));
    
    // Related Nearby Locations
    const related = [];
    for (let i = 1; i <= 6; i++) {
        const nextLoc = locations[(index + i) % locations.length];
        related.push(
            `<a href="/${nextLoc.slug}" style="background: rgba(255,255,255,0.1); color: inherit; padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; text-decoration: none; border: 1px solid rgba(0,0,0,0.1); display: inline-block;">${nextLoc.name}</a>`
        );
    }
    const relatedLocationsList = related.join('');

    output = output.replace(/\{\{title\}\}/g, title);
    output = output.replace(/\{\{description\}\}/g, description);
    output = output.replace(/\{\{name\}\}/g, loc.name);
    output = output.replace(/\{\{slug\}\}/g, loc.slug);
    output = output.replace(/\{\{heroDescription\}\}/g, heroDescription);
    output = output.replace(/\{\{aboutLocation\}\}/g, aboutLocation);
    output = output.replace(/\{\{facilitiesList\}\}/g, facilitiesList);
    output = output.replace(/\{\{faqHtml\}\}/g, faqHtml);
    output = output.replace(/\{\{faqJson\}\}/g, faqJson);
    output = output.replace(/\{\{relatedLocationsList\}\}/g, relatedLocationsList);
    
    const serviceDir = path.join(rootPath, ...loc.slug.split('/'));
    if (!fs.existsSync(serviceDir)) {
        fs.mkdirSync(serviceDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(serviceDir, 'index.html'), output);
    console.log(`Generated Location Page: ${loc.slug}/index.html`);
});

console.log('Finished generating all location pages.');
