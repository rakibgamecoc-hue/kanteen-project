// Product filtering, navigation, and cart interaction

document.addEventListener('DOMContentLoaded', () => {
    const categoryLinks = document.querySelectorAll('.category-link');
    const products = document.querySelectorAll('.product-card');
    const navToggle = document.querySelector('.nav__toggle');
    const navPanel = document.querySelector('.nav-panel');
    const navBackdrop = document.querySelector('.nav-backdrop');
    const navLinks = document.querySelectorAll('.nav__link');
    const mobileNavQuery = window.matchMedia('(max-width: 800px)');
    const navIcons = document.querySelector('.nav-icons');
    const cartState = {};

    function setNavState(isOpen) {
        if (!navToggle || !navPanel || !navBackdrop) {
            return;
        }

        navToggle.setAttribute('aria-expanded', String(isOpen));
        navPanel.classList.toggle('active', isOpen);
        navBackdrop.classList.toggle('active', isOpen);
        document.body.classList.toggle('nav-open', isOpen);
    }

    function updateCartSummary() {
        const count = Object.values(cartState).reduce((total, item) => total + item.quantity, 0);
        const summary = document.querySelector('.nav__cart-summary');
        if (summary) {
            summary.textContent = `Cart: ${count}`;
        }
    }

    function createCartSummary() {
        if (!navIcons) return;
        const summary = document.createElement('div');
        summary.className = 'nav__cart-summary';
        summary.textContent = 'Cart: 0';
        navIcons.appendChild(summary);
    }

    function createQuantityControl(product, productId, productName) {
        let counter = product.querySelector('.quantity-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'quantity-counter';
            counter.style.display = 'none';
            counter.innerHTML = `
                <button type="button" class="minus">-</button>
                <input type="number" value="1" min="1" aria-label="Quantity for ${productName}">
                <button type="button" class="plus">+</button>
            `;
            product.appendChild(counter);
        }

        const input = counter.querySelector('input');
        const plus = counter.querySelector('.plus');
        const minus = counter.querySelector('.minus');
        const cartIcon = product.querySelector('.cart');

        function syncCart(quantity) {
            const qty = Math.max(0, Number(quantity) || 1);
            if (qty === 0) {
                delete cartState[productId];
            } else {
                cartState[productId] = { name: productName, quantity: qty };
            }
            updateCartSummary();
        }

        if (cartIcon) {
            cartIcon.style.cursor = 'pointer';
            cartIcon.addEventListener('click', () => {
                cartIcon.style.display = 'none';
                counter.style.display = 'flex';
                input.value = '1';
                syncCart(1);
            });
        }

        plus.addEventListener('click', () => {
            const currentQuantity = Number(input.value) || 1;
            input.value = currentQuantity + 1;
            syncCart(currentQuantity + 1);
        });

        minus.addEventListener('click', () => {
            const currentQuantity = Number(input.value) || 1;
            if (currentQuantity > 1) {
                input.value = currentQuantity - 1;
                syncCart(currentQuantity - 1);
            } else {
                input.value = 1;
                counter.style.display = 'none';
                if (cartIcon) cartIcon.style.display = 'inline-block';
                syncCart(0);
            }
        });

        input.addEventListener('input', () => {
            const currentQuantity = Math.max(1, Number(input.value) || 1);
            input.value = currentQuantity;
            syncCart(currentQuantity);
        });
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

    createCartSummary();

    products.forEach((product, index) => {
        const titleElement = product.querySelector('.product-card__title');
        const productName = titleElement ? titleElement.textContent.trim() : `Product ${index + 1}`;
        const productId = product.dataset.productId || `product-${index + 1}`;
        product.dataset.productId = productId;
        createQuantityControl(product, productId, productName);
    });
});
