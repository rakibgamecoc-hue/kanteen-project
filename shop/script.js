// Product filtering and mobile navigation
document.addEventListener('DOMContentLoaded', () => {
    const categoryLinks = document.querySelectorAll('.category-link');
    const products = document.querySelectorAll('.product-card');
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

    function filterProducts(category) {
        products.forEach(product => {
            const productCategory = product.dataset.category;
            if (category === 'all' || productCategory === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    categoryLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            categoryLinks.forEach(categoryLink => categoryLink.classList.remove('active'));
            event.currentTarget.classList.add('active');

            const category = event.currentTarget.textContent.toLowerCase().replace(/\s+/g, '-');
            filterProducts(category);
        });
    });

    const allLink = document.querySelector('.category-link');
    if (allLink) {
        allLink.classList.add('active');
    }
});
