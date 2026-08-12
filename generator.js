const fs = require('fs');
const path = require('path');
const data = require('./data');

const templatePath = path.join(process.cwd(), 'service-template.html');
const template = fs.readFileSync(templatePath, 'utf-8');

const rootPath = process.cwd();

let sitemapUrls = [];
sitemapUrls.push('https://kleanmax.com/');
sitemapUrls.push('https://kleanmax.com/about');
sitemapUrls.push('https://kleanmax.com/services');
sitemapUrls.push('https://kleanmax.com/gallery');
sitemapUrls.push('https://kleanmax.com/locations');

data.forEach(service => {
    let output = template;

    const title = `${service.heroTitle} | Kleanmax`;
    const description = service.heroDescription;

    output = output.replace(/\{\{title\}\}/g, title);
    output = output.replace(/\{\{description\}\}/g, description);
    output = output.replace(/\{\{slug\}\}/g, service.slug);
    output = output.replace(/\{\{name\}\}/g, service.name);
    output = output.replace(/\{\{heroTitle\}\}/g, service.heroTitle);
    output = output.replace(/\{\{heroDescription\}\}/g, service.heroDescription);

    // 1. Included Services (Scope of Work) - 4-Column Top-Accent Grid
    const includedServicesList = service.includedServices.map(s => `<div class="inc-feature-strip fade-up"><div class="inc-check-badge">✓</div><div class="inc-feature-text">${s}</div></div>`).join('');
    output = output.replace(/\{\{includedServicesList\}\}/g, includedServicesList);

    // 2. Benefits List - 2-Column Card Grid
    const benefitsList = service.benefits.map((b, idx) => `<div class="benefit-card-new fade-up"><div class="benefit-num-tag">0${idx + 1}</div><h4>${b.title}</h4><p>${b.description}</p></div>`).join('');
    output = output.replace(/\{\{benefitsList\}\}/g, benefitsList);

    // 3. Industries List - 3-Column High-Contrast Cards
    const industriesList = service.industries.map(i => `<div class="industry-badge-card fade-up"><div class="industry-icon-box">🏢</div><h4>${i.title}</h4><p>${i.description}</p></div>`).join('');
    output = output.replace(/\{\{industriesList\}\}/g, industriesList);

    // 4. Equipment List - 3-Column Cards
    const equipmentList = service.equipment.map(e => `<div class="equipment-card-dark fade-up"><div class="equip-gear-icon">⚙️</div><h4>${e.name}</h4><p>${e.description}</p></div>`).join('');
    output = output.replace(/\{\{equipmentList\}\}/g, equipmentList);

    // 5. FAQs List
    const faqHtml = service.faqs.map(f => `
        <div class="faq-item">
            <button class="faq-question" aria-expanded="false">
                ${f.q} <span class="faq-icon"></span>
            </button>
            <div class="faq-answer">
                <p>${f.a}</p>
            </div>
        </div>
    `).join('');
    output = output.replace(/\{\{faqHtml\}\}/g, faqHtml);

    const faqJson = JSON.stringify(service.faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
        }
    })));
    output = output.replace(/\{\{faqJson\}\}/g, faqJson);

    // Write service index.html inside target directory
    const serviceDir = path.join(rootPath, service.slug);
    if (!fs.existsSync(serviceDir)) {
        fs.mkdirSync(serviceDir, { recursive: true });
    }

    fs.writeFileSync(path.join(serviceDir, 'index.html'), output);
    sitemapUrls.push(`https://kleanmax.com/${service.slug}`);
    console.log(`Generated Service Page: ${service.slug}/index.html`);
});

console.log('Finished generating all 12 unique service pages.');
