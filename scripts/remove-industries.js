const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'index.html',
    'about/index.html',
    'service-template.html'
];

filesToUpdate.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove the Industries link
    content = content.replace(/\s*<li><a href="\/industries">Industries<\/a><\/li>/g, '');
    
    fs.writeFileSync(file, content);
    console.log('Removed Industries from', file);
});
