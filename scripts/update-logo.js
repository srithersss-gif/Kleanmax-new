const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'index.html',
    'about/index.html',
    'service-template.html'
];

const logoHtml = '<img src="/assets/images/logo.png" alt="Kleanmax Logo" class="header-logo">';

filesToUpdate.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace text logo with image logo
    content = content.replace(/<h2>Klean<span>max<\/span><\/h2>/g, logoHtml);
    
    fs.writeFileSync(file, content);
    console.log('Updated logo in', file);
});

// Update CSS
const cssPath = 'assets/css/style.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Replace colors
cssContent = cssContent.replace(/--primary-color: #0d9488;/g, '--primary-color: #15b26d;');
cssContent = cssContent.replace(/--primary-dark: #0f766e;/g, '--primary-dark: #0e8c56;');
cssContent = cssContent.replace(/--primary-light: #ccfbf1;/g, '--primary-light: #e6f7ef;');
cssContent = cssContent.replace(/--primary-color: #0d9488/g, '--primary-color: #15b26d');
cssContent = cssContent.replace(/--primary-dark: #0f766e/g, '--primary-dark: #0e8c56');

// Add logo CSS if not exists
if (!cssContent.includes('.header-logo')) {
    cssContent += '\n\n.header-logo {\n    height: 50px;\n    width: auto;\n    object-fit: contain;\n    display: block;\n}\n';
}

fs.writeFileSync(cssPath, cssContent);
console.log('Updated CSS colors and logo styles');
