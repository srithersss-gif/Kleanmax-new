const fs = require('fs');
const path = require('path');

const cssPath = path.join(process.cwd(), 'assets', 'css', 'style.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Replace Dropdown Menu CSS
const cssStartMarker = '/* Dropdown Menu CSS - Multi-Level Premium */';
const cssEndMarker = '/* Mobile Accordion */';

const cssStartIdx = cssContent.indexOf(cssStartMarker);
const cssEndIdx = cssContent.indexOf(cssEndMarker);

if (cssStartIdx !== -1 && cssEndIdx !== -1) {
    const newCss = `/* Dropdown Menu CSS - Multi-Level Premium */
.has-dropdown, .has-submenu {
    position: relative;
}

.dropdown-icon, .submenu-icon {
    font-size: 0.75em;
    margin-left: 6px;
    vertical-align: middle;
    transition: transform var(--transition-fast);
}

.submenu-icon {
    margin-left: auto; /* Push to right */
}

/* Base Menu Styles */
.dropdown-menu, .dropdown-submenu {
    position: absolute;
    background-color: var(--secondary-color); /* Dark navy */
    box-shadow: var(--shadow-lg);
    border-radius: var(--border-radius);
    padding: 0.5rem 0;
    list-style: none;
    z-index: 1050;
    border: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    
    /* Scroll properties */
    max-height: 70vh;
    overflow-y: auto;
    overflow-x: hidden;
    
    /* Animation hidden state */
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: opacity var(--transition-fast), transform var(--transition-fast), visibility var(--transition-fast);
}

/* Widths */
.dropdown-menu.level-1 {
    width: 320px;
    top: 100%;
    left: 0;
    margin-top: 5px;
}

.dropdown-submenu.level-2 {
    width: 310px;
    /* Position handled by JS to prevent overflow clipping */
}

/* Custom Scrollbar for Premium Feel */
.dropdown-menu::-webkit-scrollbar,
.dropdown-submenu::-webkit-scrollbar {
    width: 5px;
}
.dropdown-menu::-webkit-scrollbar-track,
.dropdown-submenu::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 4px;
}
.dropdown-menu::-webkit-scrollbar-thumb,
.dropdown-submenu::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 4px;
}
.dropdown-menu::-webkit-scrollbar-thumb:hover,
.dropdown-submenu::-webkit-scrollbar-thumb:hover {
    background: var(--primary-dark);
}

/* Hover/Active States */
.has-dropdown.show > .dropdown-menu,
.has-submenu.show > .dropdown-submenu {
    opacity: 1;
    visibility: visible;
    transform: translate(0, 0);
}

.dropdown-item {
    margin: 0 !important;
    display: block;
    width: 100%;
}

/* Link Wrapper for flex layout (arrow on right) */
.submenu-link-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* Toggle button for mobile (hidden on desktop) */
.submenu-toggle {
    display: none;
    background: transparent;
    border: none;
    color: #ffffff;
    font-size: 1.25rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    line-height: 1;
    transition: color var(--transition-fast);
}

.submenu-toggle:hover {
    color: var(--primary-color);
}

.dropdown-menu a {
    display: flex;
    align-items: center;
    padding: 10px 18px;
    color: #ffffff;
    font-size: 0.95rem;
    min-height: 44px;
    transition: all var(--transition-fast);
    flex-grow: 1;
    text-decoration: none;
}

/* Hover effect */
.dropdown-menu a:hover, 
.submenu-link-wrapper:hover > a {
    background-color: rgba(255,255,255,0.05);
    color: var(--primary-color);
}

.submenu-link-wrapper:hover .submenu-icon {
    transform: translateX(4px);
    color: var(--primary-color);
}

`;
    cssContent = cssContent.substring(0, cssStartIdx) + newCss + cssContent.substring(cssEndIdx);
    fs.writeFileSync(cssPath, cssContent);
    console.log('Updated style.css');
}

// Update JS for boundary and position: fixed logic
const jsPath = path.join(process.cwd(), 'assets', 'js', 'main.js');
let jsContent = fs.readFileSync(jsPath, 'utf8');

const jsStartMarker = '// --- 7. Multi-Level Dropdown Manager ---';
const jsEndMarker = '// Set current year in footer';

const jsStartIdx = jsContent.indexOf(jsStartMarker);
const jsEndIdx = jsContent.indexOf(jsEndMarker);

if (jsStartIdx !== -1 && jsEndIdx !== -1) {
    const newJs = `// --- 7. Multi-Level Dropdown Manager ---
    const dropdowns = document.querySelectorAll('.has-dropdown, .has-submenu');
    let closeTimeout = null;

    // Desktop Hover
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 992) {
                clearTimeout(closeTimeout);
                
                // Close siblings
                const siblings = Array.from(this.parentElement.children).filter(el => el !== this);
                siblings.forEach(sibling => sibling.classList.remove('show'));
                
                // Positioning Submenu via JS to bypass overflow clipping
                if (this.classList.contains('has-submenu')) {
                    const submenu = this.querySelector('.dropdown-submenu');
                    if (submenu) {
                        const liRect = this.getBoundingClientRect();
                        
                        submenu.style.position = 'fixed';
                        // Align top of submenu with top of li
                        submenu.style.top = liRect.top + 'px';
                        
                        // Temporarily place on right to check bounds
                        submenu.style.left = liRect.right + 'px';
                        submenu.style.right = 'auto';
                        
                        // Check bounds safely after rendering a frame, but for instant we use offsetWidth
                        // Assume width is 310 as per CSS
                        if ((liRect.right + 310) > window.innerWidth - 10) {
                            // Open left
                            submenu.style.left = 'auto';
                            submenu.style.right = (window.innerWidth - liRect.left) + 'px';
                        }
                        
                        // Hide submenu if user scrolls the page (since it's fixed)
                        const onScroll = () => {
                            submenu.closest('.has-dropdown').classList.remove('show');
                            window.removeEventListener('scroll', onScroll);
                        };
                        window.addEventListener('scroll', onScroll, { once: true, passive: true });
                        
                        // Also hide if they scroll inside the level-1 dropdown
                        const parentMenu = this.closest('.level-1');
                        if (parentMenu) {
                            const onParentScroll = () => {
                                this.classList.remove('show');
                                parentMenu.removeEventListener('scroll', onParentScroll);
                            };
                            parentMenu.addEventListener('scroll', onParentScroll, { once: true, passive: true });
                        }
                    }
                }
                
                this.classList.add('show');
            }
        });

        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 992) {
                const that = this;
                closeTimeout = setTimeout(() => {
                    that.classList.remove('show');
                }, 150); // Compact hover tolerance
            }
        });
    });

    // Mobile Toggle
    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const parent = this.closest('.has-submenu');
            parent.classList.toggle('active');
            
            // Close other submenus
            const siblings = Array.from(parent.parentElement.children).filter(el => el !== parent && el.classList.contains('has-submenu'));
            siblings.forEach(sibling => sibling.classList.remove('active'));
        });
    });

    // Mobile main dropdown toggle
    const mainDropdownToggle = document.querySelector('.has-dropdown > .dropdown-toggle');
    if (mainDropdownToggle) {
        mainDropdownToggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                if (!this.parentElement.classList.contains('active')) {
                    e.preventDefault();
                    this.parentElement.classList.add('active');
                }
            }
        });
    }

    // Close all on ESC or Click Outside
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.has-dropdown.show, .has-submenu.show').forEach(el => el.classList.remove('show'));
            document.querySelectorAll('.has-dropdown.active, .has-submenu.active').forEach(el => el.classList.remove('active'));
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.has-dropdown') && !e.target.closest('.mobile-menu-toggle')) {
            document.querySelectorAll('.has-dropdown.show, .has-submenu.show').forEach(el => el.classList.remove('show'));
            document.querySelectorAll('.has-dropdown.active, .has-submenu.active').forEach(el => el.classList.remove('active'));
        }
    });
    
    `;
    jsContent = jsContent.substring(0, jsStartIdx) + newJs + jsContent.substring(jsEndIdx);
    fs.writeFileSync(jsPath, jsContent);
    console.log('Updated main.js');
}
