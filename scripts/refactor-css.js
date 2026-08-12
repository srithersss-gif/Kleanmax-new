const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'assets', 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Global Overflow Fix
// Add overflow-x: hidden and max-width to html, body
if (!css.includes('max-width: 100vw;')) {
    css = css.replace(/body\s*{([^}]*)}/g, (match, inner) => {
        if (!inner.includes('overflow-x')) {
            return `body {${inner}\n    overflow-x: hidden;\n    max-width: 100vw;\n}`;
        }
        return `body {${inner.replace('overflow-x: hidden;', 'overflow-x: hidden;\n    max-width: 100vw;')}}`;
    });
    
    css = css.replace(/html\s*{([^}]*)}/g, (match, inner) => {
        return `html {${inner}\n    overflow-x: hidden;\n    max-width: 100vw;\n}`;
    });
}

// 2. Fluid Typography & Spacing
css = css.replace(/h1 \{ font-size: .*?; \}/g, 'h1 { font-size: clamp(2.125rem, 6vw, 3.5rem); }');
css = css.replace(/h2 \{ font-size: .*?; \}/g, 'h2 { font-size: clamp(1.75rem, 5vw, 2.5rem); }');
css = css.replace(/h3 \{ font-size: .*?; \}/g, 'h3 { font-size: clamp(1.25rem, 4vw, 1.75rem); }');

// Change default section padding for mobile, add desktop padding via media query at end
css = css.replace(/--section-padding: 4rem;/g, '--section-padding: 3rem;'); 
// We will append a media query at the end to restore 5rem for desktop

// 3. Container Padding
css = css.replace(/\.container\s*{([^}]*)}/g, (match, inner) => {
    return match; // padding is already 0 1.5rem
});

// 4. Hero Section Mobile First
// Look for .hero and .hero-container
if (!css.includes('.hero-container { flex-direction: column;')) {
    // Make sure hero buttons and layout are vertical by default
    css += `
/* ==========================================================================
   GLOBAL MOBILE RESPONSIVENESS OVERRIDES
   ========================================================================== */

/* Universal Box Sizing & Image constraints */
*, *::before, *::after {
    box-sizing: border-box;
}
img, video, iframe, canvas {
    max-width: 100%;
    height: auto;
}

/* Forms - Mobile Default */
input, textarea, select {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
}
.form-row, .form-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
}
.contact-page-form .form-row {
    flex-direction: column !important;
}

/* Buttons Touch Targets */
.btn {
    min-height: 44px;
}

/* Hero Section Mobile Default */
.hero-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
}
.hero-buttons {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
}
.hero-buttons .btn {
    width: 100%;
}

/* Header & Mobile Nav */
.mobile-nav {
    width: 100vw !important;
    max-width: 100vw !important;
    overflow-x: hidden !important;
}
.header-logo {
    max-width: 180px;
}

/* Footer Mobile Default */
.footer-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}
.footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
}

/* Grids - Mobile Defaults (1 column) */
.services-grid, 
.location-cards-grid, 
.industry-grid,
.about-grid,
.contact-cards,
.process-grid,
.benefits-grid,
.equipment-grid {
    display: grid;
    grid-template-columns: 1fr !important;
    gap: 1.5rem;
}
.gallery-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr) !important; /* Gallery keeps 2 cols minimum */
    gap: 1rem;
}
.location-grid {
    grid-template-columns: 1fr !important;
}

/* Contact page layout - Mobile */
.contact-layout {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}
.contact-form-wrapper, .contact-info-panel {
    width: 100%;
}

/* ==========================================================================
   DESKTOP PROTECTION (Restoring Desktop Styles)
   ========================================================================== */
@media (min-width: 768px) {
    .services-grid, 
    .location-cards-grid, 
    .industry-grid,
    .about-grid,
    .process-grid,
    .benefits-grid,
    .equipment-grid {
        grid-template-columns: repeat(2, 1fr) !important;
    }
    .gallery-grid {
        grid-template-columns: repeat(3, 1fr) !important;
    }
    .contact-cards {
        grid-template-columns: repeat(2, 1fr) !important;
    }
    .hero-buttons {
        flex-direction: row;
        width: auto;
    }
    .hero-buttons .btn {
        width: auto;
    }
    .form-row {
        flex-direction: row;
    }
    .contact-page-form .form-row {
        flex-direction: row !important;
    }
}

@media (min-width: 1024px) {
    :root {
        --section-padding: 5rem;
    }
    .services-grid, 
    .location-cards-grid, 
    .industry-grid {
        grid-template-columns: repeat(3, 1fr) !important;
    }
    .gallery-grid {
        grid-template-columns: repeat(4, 1fr) !important;
    }
    .contact-cards {
        grid-template-columns: repeat(4, 1fr) !important;
    }
    .footer-container {
        flex-direction: row;
        justify-content: space-between;
    }
    .footer-bottom {
        flex-direction: row;
        justify-content: space-between;
    }
    .contact-layout {
        flex-direction: row;
    }
}
`;
}

fs.writeFileSync(cssPath, css);
console.log('Successfully refactored style.css for mobile-first responsiveness.');
