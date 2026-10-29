const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const header = document.querySelector('.site-header');
const mobileLayout = window.matchMedia('(max-width: 600px)');

function setMenuOpen(open, returnFocus = false) {
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navLinks.classList.toggle('is-open', open);
    if (returnFocus) navToggle.focus();
}

navToggle.addEventListener('click', () => {
    setMenuOpen(navToggle.getAttribute('aria-expanded') !== 'true');
});

navLinks.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuOpen(false);
});

document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false, true);
    }
});

header.addEventListener('focusout', (event) => {
    if (!header.contains(event.relatedTarget)) setMenuOpen(false);
});

function updateNavigation() {
    setMenuOpen(false);
    navToggle.hidden = !mobileLayout.matches;
}

mobileLayout.addEventListener('change', updateNavigation);
updateNavigation();
document.documentElement.classList.add('js');

// All content stays visible if JavaScript or IntersectionObserver is unavailable.
if ('IntersectionObserver' in window) {
    const links = [...navLinks.querySelectorAll('a')];
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            for (const link of links) {
                if (link.hash === `#${entry.target.id}`) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            }
        }
    }, { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main > section[id]').forEach((section) => observer.observe(section));
}

const videoDialog = document.getElementById('videoDialog');
const videoFrame = document.getElementById('videoFrame');
let videoTrigger;

if (typeof videoDialog.showModal === 'function') {
    document.querySelectorAll('a[data-video]').forEach((link) => {
        link.addEventListener('click', (event) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            videoTrigger = link;
            const iframe = document.createElement('iframe');
            iframe.title = link.dataset.videoTitle;
            iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(link.dataset.video)}?autoplay=1&rel=0`;
            iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            document.getElementById('videoTitle').textContent = link.dataset.videoTitle;
            document.getElementById('videoFallback').href = link.href;
            videoFrame.replaceChildren(iframe);
            setMenuOpen(false);
            videoDialog.showModal();
            document.body.classList.add('video-open');
        });
    });

    videoDialog.querySelector('.video-close').addEventListener('click', () => videoDialog.close());
    videoDialog.addEventListener('click', (event) => {
        if (event.target !== videoDialog) return;
        const bounds = videoDialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
            videoDialog.close();
        }
    });
    videoDialog.addEventListener('close', () => {
        videoFrame.replaceChildren();
        document.body.classList.remove('video-open');
        videoTrigger?.focus({ preventScroll: true });
    });
}

document.getElementById('footerYear').textContent = new Date().getFullYear();
