const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git') continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const files = getHtmlFiles(process.cwd());
let cleanedCount = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('\\n')) {
        // Replace literal \n string with actual newline
        content = content.replace(/\\n/g, '\n');
        fs.writeFileSync(file, content);
        cleanedCount++;
    }
}

console.log(`Cleaned literal \\n from ${cleanedCount} HTML files.`);
