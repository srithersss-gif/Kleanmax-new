const fs = require('fs');
const path = require('path');

const serviceTemplatePath = path.join(__dirname, 'service-template.html');
const mainContentPath = path.join(__dirname, 'location-main-content.html');
const outPath = path.join(__dirname, 'location-template.html');

let template = fs.readFileSync(serviceTemplatePath, 'utf8');
const mainContent = fs.readFileSync(mainContentPath, 'utf8');

// Replace meta tags
template = template.replace(/<title>\{\{title\}\}<\/title>/, '<title>{{title}}</title>');
template = template.replace(/<meta name="description" content="\{\{description\}\}">/, '<meta name="description" content="{{description}}">');
template = template.replace(/\/assets\/images\/services\/\{\{slug\}\}\.png/g, '/assets/images/locations/default-location.png');

const mainStart = template.indexOf('<main>');
const mainEnd = template.indexOf('</main>') + 7;

template = template.substring(0, mainStart) + mainContent + template.substring(mainEnd);

fs.writeFileSync(outPath, template);
console.log('location-template.html generated successfully.');
