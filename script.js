
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initTheme();
    initRevealAnimations();
    initSmoothScroll();
});

/* =====================================================
   CUSTOM CURSOR
   ===================================================== */
function initCursor() {
    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursor-dot');

    if (!cursor || !cursorDot) return;

    // Check if touch device
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        cursorDot.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Dot follows immediately
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Smooth cursor ring animation
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * 0.15;
        cursorY += dy * 0.15;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const hoverTargets = document.querySelectorAll('a, button, .craft-card, .project-card, .fact');

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });

        target.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '0.5';
        cursorDot.style.opacity = '1';
    });
}

/* =====================================================
   THEME TOGGLE
   ===================================================== */
function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const toggleIcon = toggle.querySelector('.toggle-icon');

    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = savedTheme || (systemDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', defaultTheme);
    updateIcon(defaultTheme);

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateIcon(next);
    });

    function updateIcon(theme) {
        toggleIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

/* =====================================================
   SCROLL REVEAL ANIMATIONS
   ===================================================== */
function initRevealAnimations() {
    // Add reveal class to elements
    const revealElements = document.querySelectorAll(
        '.section-number, .section-title, .section-subtitle, ' +
        '.story-lead, .story-text p, .story-quote, .fact, ' +
        '.craft-card, .project-card, .connect-link, ' +
        '.connect-title, .connect-text'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    // Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

/* =====================================================
   SMOOTH SCROLL FOR NAV LINKS
   ===================================================== */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-links a, .nav-logo');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* =====================================================
   PARALLAX EFFECT ON HERO BLOB
   ===================================================== */
document.addEventListener('mousemove', (e) => {
    const blob = document.querySelector('.hero-doodle');
    if (!blob) return;

    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;

    blob.style.transform = `translateY(-50%) translate(${x}px, ${y}px)`;
});

/* =====================================================
   MINIMAL COUNTER ANIMATION
   ===================================================== */
const facts = document.querySelectorAll('.fact-number');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const text = target.textContent;

            // Only animate if it's a number
            if (!isNaN(parseInt(text))) {
                const end = parseInt(text);
                let current = 0;
                const duration = 2000;
                const step = end / (duration / 16);

                const timer = setInterval(() => {
                    current += step;
                    if (current >= end) {
                        target.textContent = text; // Restore original with any suffix
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(current) + (text.includes('+') ? '+' : '');
                    }
                }, 16);
            }

            counterObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

facts.forEach(fact => counterObserver.observe(fact));

/* =====================================================
   NAV SCROLL EFFECT
   ===================================================== */
let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.padding = '20px 48px';
    } else {
        nav.style.padding = '32px 48px';
    }

    lastScroll = currentScroll;
});

/* =====================================================
   PROJECT CARD HOVER TILT
   ===================================================== */
document.querySelectorAll('.project-visual').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* =====================================================
   ACTIVE NAV LINK HIGHLIGHT
   ===================================================== */
const sections = document.querySelectorAll('section[id]');
const navLinksForHighlight = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinksForHighlight.forEach(link => {
        link.style.opacity = '0.5';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.opacity = '1';
        }
    });
});
