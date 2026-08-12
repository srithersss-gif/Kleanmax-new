const fs = require('fs');
const path = require('path');
const locations = require('./locations');

// Generate the proper Locations dropdown inner list
const locationLIs = locations.map(loc => 
    `                                <a href="/${loc.slug}" class="location-item">${loc.name}</a>`
).join('\n');

const correctNavHTML = `                    <li class="nav-item has-dropdown">
                        <a href="/locations" class="nav-link dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                            Locations <span class="dropdown-icon">▼</span>
                        </a>
                        <div class="dropdown-menu location-dropdown">
                            <div class="dropdown-header">Chennai</div>
                            <div class="location-grid">
${locationLIs}
                            </div>
                        </div>
                    </li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>`;

function getAllHtmlFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            if(file !== 'node_modules' && file !== '.git') {
                arrayOfFiles = getAllHtmlFiles(dirPath + "/" + file, arrayOfFiles);
            }
        } else {
            if(file.endsWith('.html')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const htmlFiles = getAllHtmlFiles(__dirname);
let updatedCount = 0;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // We need to match from `<li class="nav-item has-dropdown">` (where href="/locations") 
    // all the way down to `</nav>`
    const regex = /<li class="nav-item has-dropdown">\s*<a href="\/locations"[\s\S]*?<\/nav>/;
    
    if (regex.test(content)) {
        content = content.replace(regex, correctNavHTML);
        fs.writeFileSync(file, content);
        updatedCount++;
    }
});

console.log(`Successfully fixed navigation in ${updatedCount} files.`);
