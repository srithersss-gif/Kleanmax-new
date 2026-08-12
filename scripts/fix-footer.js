const fs = require('fs');
const path = require('path');

const filesToFix = [
    'index.html',
    'about/index.html',
    'service-template.html',
    'location-template.html'
];

filesToFix.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find the footer area
        const footerStart = content.indexOf('<footer');
        if (footerStart !== -1) {
            let footerContent = content.substring(footerStart);
            let headerContent = content.substring(0, footerStart);
            
            // In the footer, we need to replace the injected dropdown back to the simple link
            // The injected dropdown starts with: <li class="nav-item has-dropdown">\n    <a href="/locations"
            // and ends with: </div>\n    </div>\n</li>
            
            // A simple regex to catch the whole location dropdown in the footer
            const dropdownRegex = /<li class="nav-item has-dropdown">[\s\S]*?<a href="\/locations"[\s\S]*?<\/li>/;
            
            if (dropdownRegex.test(footerContent)) {
                footerContent = footerContent.replace(dropdownRegex, '<li><a href="/locations">Locations</a></li>');
                content = headerContent + footerContent;
                fs.writeFileSync(filePath, content);
                console.log('Fixed footer in', file);
            }
        }
    }
});
