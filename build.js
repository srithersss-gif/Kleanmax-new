const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- Kleanmax Hostinger Build Script ---');

// 1. Run generators to ensure all files are up to date
console.log('\n[1/3] Running site generators...');
try {
    execSync('node generator.js', { stdio: 'inherit' });
    execSync('node generator-locations.js', { stdio: 'inherit' });
} catch (error) {
    console.error('Error running generators. Please ensure generator.js and generator-locations.js are working correctly.', error.message);
    process.exit(1);
}

// 2. Create dist folder
console.log('\n[2/3] Preparing dist folder...');
const distDir = path.join(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);

// 3. Gather files to copy
let filesToCopy = [
    'index.html',
    'favicon.ico',
    'favicon.png',
    'favicon.svg',
    'robots.txt',
    'sitemap.xml',
    'assets'
];

// 3a. Add generated service directories
const data = require('./data.js');
data.forEach(service => {
    if (fs.existsSync(path.join(process.cwd(), service.slug))) {
        if (!filesToCopy.includes(service.slug)) {
            filesToCopy.push(service.slug);
        }
    }
});

// 3b. Add generated location directories
const locations = require('./locations.js');
locations.forEach(loc => {
    const rootSlug = loc.slug.split('/')[0]; // e.g., 'chennai'
    if (fs.existsSync(path.join(process.cwd(), rootSlug))) {
        if (!filesToCopy.includes(rootSlug)) {
            filesToCopy.push(rootSlug);
        }
    }
});

// 3c. Add other static pages
const staticPages = ['about', 'contact', 'gallery', 'locations', 'privacy', 'services', 'terms'];
staticPages.forEach(page => {
    if (fs.existsSync(path.join(process.cwd(), page))) {
        if (!filesToCopy.includes(page)) {
            filesToCopy.push(page);
        }
    }
});

// Helper function to recursively copy files and directories
function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    
    if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        const destDir = path.dirname(dest);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(src, dest);
    }
}

console.log('\n[3/3] Copying files to dist...');
filesToCopy.forEach(item => {
    const src = path.join(process.cwd(), item);
    const dest = path.join(distDir, item);
    if (fs.existsSync(src)) {
        copyRecursiveSync(src, dest);
        console.log(`  copied: ${item}`);
    }
});

// 4. Create an .htaccess file for Hostinger for optimal performance
const htaccessContent = `
# Enforce HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove trailing slash if not a directory
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} (.*)/$
RewriteRule ^(.*)/$ $1 [L,R=301]

# Enable Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
</IfModule>
`;

fs.writeFileSync(path.join(distDir, '.htaccess'), htaccessContent.trim());
console.log('  generated: .htaccess');

console.log('\n=== BUILD SUCCESS ===');
console.log('Your project is ready to be uploaded to Hostinger.');
console.log('Please zip the contents of the "dist" folder and upload it to your "public_html" directory on Hostinger.');
