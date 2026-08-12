const fs = require('fs');
const path = require('path');
const locations = require('./locations');

const filesToUpdate = [
    'index.html',
    'about/index.html',
    'service-template.html',
    'location-template.html'
];

// Generate Location Dropdown HTML
let locationLinks = locations.map(loc => 
    `                <a href="/${loc.slug}" class="location-item">${loc.name}</a>`
).join('\n');

const locationsDropdownHTML = `<li class="nav-item has-dropdown">
    <a href="/locations" class="nav-link dropdown-toggle" aria-haspopup="true" aria-expanded="false">
        Locations <span class="dropdown-icon">▼</span>
    </a>
    <div class="dropdown-menu location-dropdown">
        <div class="dropdown-header">Chennai</div>
        <div class="location-grid">
${locationLinks}
        </div>
    </div>
</li>`;

filesToUpdate.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find existing Locations link and replace
        const regex = /<li><a href="\/locations">Locations<\/a><\/li>/g;
        if (regex.test(content)) {
            content = content.replace(regex, locationsDropdownHTML);
            fs.writeFileSync(filePath, content);
            console.log('Updated Locations nav in', file);
        } else {
            console.log('Locations link not found in', file);
        }
    }
});
