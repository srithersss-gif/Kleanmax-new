const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'index.html',
    'about/index.html',
    'service-template.html'
];

const newDropdownHtml = `
<li class="nav-item has-dropdown">
    <a href="/services" class="nav-link dropdown-toggle" aria-haspopup="true" aria-expanded="false">
        Services <span class="dropdown-icon">▼</span>
    </a>
    <ul class="dropdown-menu level-1">
        <li class="dropdown-item has-submenu">
            <div class="submenu-link-wrapper">
                <a href="/office-cleaning-services">Office Cleaning Services</a>
                <button class="submenu-toggle" aria-expanded="false" aria-label="Toggle submenu">›</button>
            </div>
            <ul class="dropdown-submenu level-2">
                <li><a href="/office-cleaning-services">Corporate Office Cleaning</a></li>
                <li><a href="/office-cleaning-services">IT Park Cleaning</a></li>
                <li><a href="/office-cleaning-services">Daily Office Cleaning</a></li>
                <li><a href="/office-cleaning-services">Periodic Office Cleaning</a></li>
            </ul>
        </li>
        <li class="dropdown-item has-submenu">
            <div class="submenu-link-wrapper">
                <a href="/commercial-cleaning-services">Commercial Cleaning Services</a>
                <button class="submenu-toggle" aria-expanded="false" aria-label="Toggle submenu">›</button>
            </div>
            <ul class="dropdown-submenu level-2">
                <li><a href="/commercial-cleaning-services">Retail Cleaning</a></li>
                <li><a href="/commercial-cleaning-services">Showroom Cleaning</a></li>
                <li><a href="/commercial-cleaning-services">Mall Cleaning</a></li>
                <li><a href="/commercial-cleaning-services">Commercial Building Cleaning</a></li>
            </ul>
        </li>
        <li class="dropdown-item has-submenu">
            <div class="submenu-link-wrapper">
                <a href="/industrial-cleaning-services">Industrial Cleaning Services</a>
                <button class="submenu-toggle" aria-expanded="false" aria-label="Toggle submenu">›</button>
            </div>
            <ul class="dropdown-submenu level-2">
                <li><a href="/factory-cleaning">Factory Cleaning</a></li>
                <li><a href="/industrial-cleaning-services">Industrial Floor Cleaning</a></li>
                <li><a href="/industrial-cleaning-services">Production Area Cleaning</a></li>
                <li><a href="/industrial-cleaning-services">Heavy-Duty Industrial Cleaning</a></li>
            </ul>
        </li>
        <li class="dropdown-item">
            <a href="/factory-cleaning">Factory Cleaning</a>
        </li>
        <li class="dropdown-item has-submenu">
            <div class="submenu-link-wrapper">
                <a href="/warehouse-cleaning">Warehouse Cleaning</a>
                <button class="submenu-toggle" aria-expanded="false" aria-label="Toggle submenu">›</button>
            </div>
            <ul class="dropdown-submenu level-2">
                <li><a href="/warehouse-cleaning">Warehouse Floor Cleaning</a></li>
                <li><a href="/warehouse-cleaning">Aisle Cleaning</a></li>
                <li><a href="/warehouse-cleaning">High-Level Dusting</a></li>
                <li><a href="/warehouse-cleaning">Industrial Warehouse Cleaning</a></li>
            </ul>
        </li>
        <li class="dropdown-item">
            <a href="/deep-cleaning-services">Deep Cleaning Services</a>
        </li>
        <li class="dropdown-item has-submenu">
            <div class="submenu-link-wrapper">
                <a href="/floor-cleaning">Floor Care & Polishing</a>
                <button class="submenu-toggle" aria-expanded="false" aria-label="Toggle submenu">›</button>
            </div>
            <ul class="dropdown-submenu level-2">
                <li><a href="/floor-cleaning">Floor Scrubbing</a></li>
                <li><a href="/floor-cleaning">Floor Polishing</a></li>
                <li><a href="/floor-cleaning">Marble Polishing</a></li>
                <li><a href="/floor-cleaning">Granite Floor Care</a></li>
                <li><a href="/floor-cleaning">Epoxy Floor Cleaning</a></li>
            </ul>
        </li>
        <li class="dropdown-item has-submenu">
            <div class="submenu-link-wrapper">
                <a href="/glass-cleaning">Glass & Facade Cleaning</a>
                <button class="submenu-toggle" aria-expanded="false" aria-label="Toggle submenu">›</button>
            </div>
            <ul class="dropdown-submenu level-2">
                <li><a href="/glass-cleaning">Glass Cleaning</a></li>
                <li><a href="/glass-cleaning">Facade Cleaning</a></li>
                <li><a href="/glass-cleaning">Window Cleaning</a></li>
                <li><a href="/glass-cleaning">High-Rise Glass Cleaning</a></li>
            </ul>
        </li>
        <li class="dropdown-item">
            <a href="/hospital-cleaning">Hospital Cleaning</a>
        </li>
        <li class="dropdown-item">
            <a href="/housekeeping-services">Housekeeping Services</a>
        </li>
        <li class="dropdown-item">
            <a href="/janitorial-services">Janitorial Services</a>
        </li>
        <li class="dropdown-item">
            <a href="/disinfection-services">Sanitization & Disinfection</a>
        </li>
    </ul>
</li>`;

const activeDropdownHtml = newDropdownHtml.replace('class="nav-link dropdown-toggle"', 'class="nav-link dropdown-toggle active"');

filesToUpdate.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // First, fix the logo
    content = content.replace(/<span class="logo-text">Klean<span class="logo-accent">max<\/span><\/span>/g, '<img src="/assets/images/logo.png" alt="Kleanmax Logo" class="header-logo">');

    // Next, clean up the duplicate menu items that were accidentally injected
    // We will extract everything before the first `<li class="nav-item has-dropdown">`
    // and everything after the `<li><a href="/industries">Industries</a></li>`
    
    // Clean up Desktop Nav
    const desktopNavStartIdx = content.indexOf('<nav class="desktop-nav" aria-label="Main Navigation">');
    if (desktopNavStartIdx !== -1) {
        let navHtml = content.substring(desktopNavStartIdx, content.indexOf('</nav>', desktopNavStartIdx) + 6);
        
        let prefix = navHtml.substring(0, navHtml.indexOf('<li class="nav-item has-dropdown">'));
        if (prefix === navHtml) {
             prefix = navHtml.substring(0, navHtml.indexOf('<li class="has-dropdown">'));
        }
        const suffix = navHtml.substring(navHtml.indexOf('<li><a href="/industries">Industries</a></li>'));
        
        const isServicesActive = file === 'service-template.html';
        const rebuiltNavHtml = prefix + (isServicesActive ? activeDropdownHtml : newDropdownHtml) + '\n                    ' + suffix;
        
        content = content.replace(navHtml, rebuiltNavHtml);
    }
    
    // Clean up Mobile Nav
    const mobileNavStartIdx = content.indexOf('<nav class="mobile-nav" id="mobile-nav" aria-hidden="true">');
    if (mobileNavStartIdx !== -1) {
        let mobileNavHtml = content.substring(mobileNavStartIdx, content.indexOf('</nav>', mobileNavStartIdx) + 6);
        
        let prefixMobile = mobileNavHtml.substring(0, mobileNavHtml.indexOf('<li class="nav-item has-dropdown">'));
        if (prefixMobile === mobileNavHtml) {
            prefixMobile = mobileNavHtml.substring(0, mobileNavHtml.indexOf('<li class="has-dropdown">'));
        }
        const suffixMobile = mobileNavHtml.substring(mobileNavHtml.indexOf('<li><a href="/industries">Industries</a></li>'));
        
        const isServicesActive = file === 'service-template.html';
        const rebuiltMobileNavHtml = prefixMobile + (isServicesActive ? activeDropdownHtml : newDropdownHtml) + '\n                ' + suffixMobile;
        
        content = content.replace(mobileNavHtml, rebuiltMobileNavHtml);
    }
    
    fs.writeFileSync(file, content);
    console.log('Fixed header in', file);
});
