const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules') continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const htmlFiles = getHtmlFiles(__dirname);

let updatedCount = 0;
for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    content = content.replace(/href="\/services#office"/g, 'href="/office-cleaning-services"');
    content = content.replace(/href="\/services#industrial"/g, 'href="/industrial-cleaning-services"');
    content = content.replace(/href="\/services#factory"/g, 'href="/factory-cleaning"');
    content = content.replace(/href="\/services#deep"/g, 'href="/deep-cleaning-services"');
    content = content.replace(/href="\/services#floor"/g, 'href="/floor-cleaning"');

    content = content.replace(/href="\/industries#corporate"/g, 'href="/office-cleaning-services"');
    content = content.replace(/href="\/industries#manufacturing"/g, 'href="/factory-cleaning"');
    content = content.replace(/href="\/industries#warehouse"/g, 'href="/warehouse-cleaning"');
    content = content.replace(/href="\/industries#hospital"/g, 'href="/hospital-cleaning"');
    content = content.replace(/href="\/industries#retail"/g, 'href="/retail-cleaning"');

    if (content !== original) {
        fs.writeFileSync(file, content);
        updatedCount++;
    }
}

console.log(`Updated footer links in ${updatedCount} HTML files.`);
