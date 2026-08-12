/**
 * Kleanmax - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Strict 10-digit mobile number input restriction
    document.querySelectorAll('input[type="tel"], input[name="phone"]').forEach(input => {
        input.setAttribute('maxlength', '10');
        input.setAttribute('pattern', '[0-9]{10}');
        input.setAttribute('placeholder', '10-digit mobile number');

        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
            const group = e.target.closest('.form-group');
            if (group && group.classList.contains('error')) {
                group.classList.remove('error');
            }
        });
    });


    // --- 1. Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mobileNav.classList.toggle('open');

            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        // Close menu when clicking a link (unless it's a dropdown toggle)
        const mobileLinks = mobileNav.querySelectorAll('a:not(.dropdown-toggle)');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('open');
                document.body.style.overflow = '';
            }
        });

        // Mobile Accordion Logic
        const dropdownToggles = mobileNav.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent navigating to /services or /locations on mobile
                const parentItem = toggle.parentElement;
                parentItem.classList.toggle('active');
            });
        });

        const submenuToggles = mobileNav.querySelectorAll('.submenu-toggle');
        submenuToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const parentItem = toggle.closest('.has-submenu');
                if (parentItem) {
                    parentItem.classList.toggle('active');
                }
            });
        });
    }

    // --- 2. Sticky Header ---
    const header = document.getElementById('header');

    const handleScroll = () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // --- 3. Scroll Animations & Number Counters ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animateNumber(element, target) {
        if (!element || element.dataset.animated === 'true') return;
        element.dataset.animated = 'true';

        const duration = 1800; // ms
        const start = 0;
        const startTime = performance.now();
        const isDecimal = target % 1 !== 0;

        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentVal = start + (target - start) * easeProgress;

            element.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = isDecimal ? target.toFixed(1) : target;
            }
        }

        requestAnimationFrame(updateNumber);
    }

    function triggerTrustStats() {
        const statNumbers = document.querySelectorAll('.trust-stat .stat-number');
        statNumbers.forEach(el => {
            if (el.dataset.target) {
                animateNumber(el, parseFloat(el.dataset.target));
            }
        });
    }

    if (!prefersReducedMotion) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.05
        };

        const fadeUpObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);

                    if (entry.target.classList.contains('trust-stat') || entry.target.closest('.trust-bar')) {
                        triggerTrustStats();
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-up').forEach(el => fadeUpObserver.observe(el));
    } else {
        document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
        triggerTrustStats();
    }

    // Failsafe: Ensure visible class and stat animations kick in reliably
    setTimeout(() => {
        document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
        triggerTrustStats();
    }, 400);

    // --- 5. FAQ Accordion ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;

            // Close all others first (optional, standard accordion behavior)
            faqQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                q.nextElementSibling.style.maxHeight = null;
            });

            // If it wasn't expanded, open it
            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // --- 6. Form Validation & Google Apps Script Backend Submission ---
    // Paste your deployed Google Apps Script Web App URL here!
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7zgBWQ9mTSsgqdOu5Shg05eX9VPnfM0VaRSxoCelPw7pGj9NAFwhG79-vMJ8OdLtSmw/exec';
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {

        const statusDiv = form.querySelector('.form-status');
        const submitBtn = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            let isValid = true;
            const inputs = form.querySelectorAll('input[required], select[required]');

            inputs.forEach(input => {
                const group = input.closest('.form-group') || input.parentElement;
                const errorMsg = group ? group.querySelector('.error-msg') : null;

                if (!input.value.trim()) {
                    isValid = false;
                    if (group) group.classList.add('error');
                    if (errorMsg) errorMsg.textContent = 'This field is required.';
                } else {
                    if (group) group.classList.remove('error');
                }

                if ((input.type === 'tel' || input.name === 'phone') && input.value.trim()) {
                    const cleanPhone = input.value.replace(/\D/g, '');
                    if (cleanPhone.length !== 10) {
                        isValid = false;
                        if (group) group.classList.add('error');
                        if (errorMsg) errorMsg.textContent = 'Please enter a valid mandatory 10-digit mobile number.';
                    } else {
                        input.value = cleanPhone;
                    }
                }
            });

            if (!isValid) return;

            const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
            const loader = submitBtn ? submitBtn.querySelector('.loader') : null;

            if (btnText) btnText.classList.add('hidden');
            if (loader) loader.classList.remove('hidden');
            if (submitBtn) submitBtn.disabled = true;
            if (statusDiv) {
                statusDiv.textContent = '';
                statusDiv.className = 'form-status';
            }

            try {
                const formData = new FormData(form);
                formData.append('pageUrl', window.location.href);

                const searchParams = new URLSearchParams();
                for (const [key, value] of formData.entries()) {
                    searchParams.append(key, value);
                }

                // Submit to Google Apps Script if URL configured
                if (GOOGLE_APPS_SCRIPT_URL && !GOOGLE_APPS_SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT')) {
                    await fetch(GOOGLE_APPS_SCRIPT_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        body: searchParams
                    });
                } else {
                    // Friendly fallback delay if URL not pasted yet
                    await new Promise(resolve => setTimeout(resolve, 1200));
                }

                if (statusDiv) {
                    statusDiv.textContent = 'Thank you! Your inspection request has been submitted. Our team will contact you within 30 minutes.';
                    statusDiv.classList.add('status-success');
                }
                form.reset();

            } catch (error) {
                if (statusDiv) {
                    statusDiv.textContent = 'Submission error. Please call us directly at +91 73388 82034.';
                    statusDiv.classList.add('status-error');
                }
            } finally {
                if (btnText) btnText.classList.remove('hidden');
                if (loader) loader.classList.add('hidden');
                if (submitBtn) submitBtn.disabled = false;
            }
        });

        form.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', () => {
                const group = input.closest('.form-group');
                if (group && group.classList.contains('error')) {
                    group.classList.remove('error');
                }
            });
        });
    });

    // --- 7. Multi-Level Dropdown Manager ---
    const dropdowns = document.querySelectorAll('.has-dropdown, .has-submenu');
    let closeTimeout = null;

    // Desktop Hover
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function () {
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

        dropdown.addEventListener('mouseleave', function () {
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
        toggle.addEventListener('click', function (e) {
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
        mainDropdownToggle.addEventListener('click', function (e) {
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

    // Set current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
