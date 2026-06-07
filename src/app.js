function init() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkEls = navLinks.querySelectorAll('a');
    const sections = document.querySelectorAll('section[id]');

    let lastScrollY = 0;

    function onScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function toggleNav(active) {
        navToggle.classList.toggle('active', active);
        navLinks.classList.toggle('active', active);
        document.body.style.overflow = active ? 'hidden' : '';
    }

    navToggle.addEventListener('click', () => {
        toggleNav(!navLinks.classList.contains('active'));
    });

    navLinkEls.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleNav(false);
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !nav.contains(e.target)) {
            toggleNav(false);
        }
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinkEls.forEach(link => {
                    const href = link.getAttribute('href');
                    link.classList.toggle('active', href === `#${id}`);
                });
            }
        });
    }, {
        rootMargin: '-40% 0px -55% 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));

    const fadeEls = document.querySelectorAll('.section');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    fadeEls.forEach(el => {
        el.classList.add('fade-in');
        fadeObserver.observe(el);
    });

    const year = new Date().getFullYear();
    const footerYear = document.querySelector('.footer p');
    if (footerYear) {
        footerYear.textContent = `\u00A9 ${year} Jeremy Robert Anderson. All rights reserved.`;
    }
}

document.addEventListener('DOMContentLoaded', init);
