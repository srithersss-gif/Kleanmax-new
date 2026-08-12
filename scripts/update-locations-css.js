const fs = require('fs');
const path = require('path');

const cssPath = path.join(process.cwd(), 'assets/css/style.css');

const cssContent = `
/* ================================================== */
/* LOCATIONS DROPDOWN */
/* ================================================== */
.location-dropdown {
    width: 450px !important;
    padding: 0 !important;
}

.location-dropdown .dropdown-header {
    padding: 15px 20px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    background-color: var(--secondary-color);
    border-radius: var(--border-radius) var(--border-radius) 0 0;
}

.location-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px;
    background-color: var(--secondary-color);
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    
    /* Custom Scrollbar for Location Dropdown */
    scrollbar-width: thin;
    scrollbar-color: var(--primary-color) rgba(255, 255, 255, 0.05);
}

.location-grid::-webkit-scrollbar {
    width: 6px;
}
.location-grid::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0 0 var(--border-radius) 0;
}
.location-grid::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 10px;
}
.location-grid::-webkit-scrollbar-thumb:hover {
    background: #00d075;
}

.location-item {
    display: block;
    padding: 12px 16px;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.2s ease;
    margin: 2px;
}

.location-item:hover, .location-item:focus {
    color: var(--primary-color);
    background-color: rgba(0, 208, 117, 0.1);
    transform: translateX(3px);
}

/* Mobile Overrides for Locations Dropdown */
@media (max-width: 991px) {
    .location-dropdown {
        width: 100% !important;
        position: relative;
        box-shadow: none;
        border: none;
        max-height: none;
        background: transparent;
    }
    
    .location-dropdown .dropdown-header {
        background: transparent;
        padding: 15px;
    }

    .location-grid {
        grid-template-columns: 1fr;
        max-height: 60vh;
        background: rgba(255, 255, 255, 0.02);
        padding: 5px 15px;
    }
    
    .location-item {
        padding: 14px 15px; /* Larger touch target for mobile */
    }
}
`;

if (fs.existsSync(cssPath)) {
    fs.appendFileSync(cssPath, cssContent);
    console.log('Added Location Dropdown CSS to style.css');
}
