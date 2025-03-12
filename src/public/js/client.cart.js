// REMOVE PRODUCT

const getCartIdFromSession = async () => {
    try {
        const response = await fetch('/api/viewscarts/session/cart', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        if (!data.cartId) return null
        return data.cartId;
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

const refreshRemoveButton = () => {
    const removeButton = document.querySelectorAll('.cart-remove-button');
    removeButton.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const cartItem = event.target.closest('.cart-item');
            const productId = cartItem.dataset.product;
            const cartId = await getCartIdFromSession();
            await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
    
            const response = await fetch(`/api/carts/${cartId}`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            updateCart(data);
            refreshRemoveButton();
        })
    })
}
const updateCart = (data) => {
    const products = data.payload.products;
    const cartContainer = document.querySelector('.cart-container');
    cartContainer.innerHTML = '';

    if (products.length) {
        const cartItemsHTML = products.map((item) => `
            <div class="cart-item" data-product="${item.product._id}">
                <img src="/images/${item.product.thumbnails[0]}" alt="${item.product.title}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${item.product.title}</h3>
                    <p class="product-price">Precio: $${item.product.price}</p>
                    <p class="product-quantity">Cantidad: ${item.quantity}</p>
                    <p class="product-subtotal">Subtotal: $${item.product.price * item.quantity}</p>
                </div>
                <div class="cart-remove-button">
                    <span class="material-symbols-outlined">delete</span>
                </div>
            </div>
        `).join('');

        const cartSummaryHTML = `
            <div class="cart-summary">
                <h3 class="summary-title">Resumen del Carrito</h3>
                <p class="total">Total de productos: ${products.length}</p>
                <p class="total">
                    Total a pagar: $${products.reduce((acc, current) => acc + current.product.price * current.quantity, 0)}
                </p>
                <button class="checkout-button">Proceder al Pago</button>
            </div>
        `;

        cartContainer.innerHTML = `
            <div class="cart-items">
                ${cartItemsHTML}
            </div>
            ${cartSummaryHTML}
        `;
    } else {
        cartContainer.innerHTML = `
            <p class="empty-cart-message">El carrito está vacío</p>
        `;
    }
};

refreshRemoveButton()

// SIDEBAR

const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

const openSidebar = () => {
    sidebar.style.left = '0';
    overlay.style.display = 'block';
}

const closeSidebar = () => {
    sidebar.style.left = '-250px';
    overlay.style.display = 'none';
}

menuToggle.addEventListener('click', openSidebar);

overlay.addEventListener('click', closeSidebar);