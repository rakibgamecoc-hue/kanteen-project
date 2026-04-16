// Mobile navigation
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav__toggle');
    const navPanel = document.querySelector('.nav-panel');
    const navBackdrop = document.querySelector('.nav-backdrop');
    const navLinks = document.querySelectorAll('.nav__link');
    const mobileNavQuery = window.matchMedia('(max-width: 800px)');

    function setNavState(isOpen) {
        if (!navToggle || !navPanel || !navBackdrop) {
            return;
        }

        navToggle.setAttribute('aria-expanded', String(isOpen));
        navPanel.classList.toggle('active', isOpen);
        navBackdrop.classList.toggle('active', isOpen);
        document.body.classList.toggle('nav-open', isOpen);
    }

    if (navToggle && navPanel && navBackdrop) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            setNavState(!isOpen);
        });

        navBackdrop.addEventListener('click', () => setNavState(false));

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNavQuery.matches) {
                    setNavState(false);
                }
            });
        });

        mobileNavQuery.addEventListener('change', event => {
            if (!event.matches) {
                setNavState(false);
            }
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                setNavState(false);
            }
        });
    }
});
