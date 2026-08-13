const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

const suffixes = [
    '-commercial-cleaning',
    '-industrial-cleaning',
    '-office-cleaning',
    '-factory-cleaning',
    '-warehouse-cleaning',
    '-it-park-cleaning'
];

function replaceSlugs(content) {
    let result = content;
    for (const suffix of suffixes) {
        const regex = new RegExp(suffix, 'g');
        result = result.replace(regex, '-cleaning-services');
    }
    return result;
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (['node_modules', 'dist', '.git'].includes(file)) continue;
            processDirectory(fullPath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let newContent = replaceSlugs(content);
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDirectory(rootDir);
console.log('HTML files fixed!');
