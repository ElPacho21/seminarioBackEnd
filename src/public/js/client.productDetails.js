const cartLink = document.getElementById('cart-btn');

const getCartIdFromSession = async () => {
    try {
        const response = await fetch('/api/viewscarts/session/cart', {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        if (!data.cartId) return null
        return data.cartId;
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

const updateCartLink = async () => {
    const storedCartId = await getCartIdFromSession();
    if (storedCartId && cartLink) {
        cartLink.href = `/api/viewscarts/${storedCartId}`;
    } else if (cartLink) {
        cartLink.href = '/api/viewscarts';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updateCartLink();
    const thumbnails = document.querySelectorAll('.thumbnail-detail-product');
    const mainImage = document.getElementById('main-product-image');
    const decreaseQuantityBtn = document.getElementById('decrease-quantity-btn');
    const increaseQuantityBtn = document.getElementById('increase-quantity-btn');
    const quantityInput = document.getElementById('quantity-input');
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            // DYNAMIC IMAGE
            thumbnails.forEach(thumb => thumb.classList.remove('selected'));

            thumbnail.classList.add('selected');

            mainImage.src = thumbnail.src;
        });
    });

    decreaseQuantityBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    increaseQuantityBtn.addEventListener('click', () => {
        const maxQuantity = parseInt(increaseQuantityBtn.dataset.stock);
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < maxQuantity) {
            quantityInput.value = currentValue + 1;
        }
    });

    addToCartBtn.addEventListener('click', async () => {
        const productId = addToCartBtn.dataset.product;
        let storedCartId = await getCartIdFromSession();
        const quantity = parseInt(quantityInput.value);
        try {
            if (storedCartId) {
                await fetch(`/api/carts/${storedCartId}/products/${productId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product: productId, quantity }),
                    credentials: 'include'
                });
                
            } else {
                const newCartResponse = await fetch('/api/carts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        products: [{ product: productId, quantity }]
                    }),
                    credentials: 'include'
                });
                const newCart = await newCartResponse.json();
                storedCartId = newCart.payload._id;
            }
            Swal.fire({
                text: `Se ha agregado ${quantity} unidad(es) del producto al carrito.`,
                toast: true,
                position: 'bottom-left',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                icon: 'success' 
            })
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error.message);
            Swal.fire({
                text: `Hubo un error al agregar el producto al carrito.`,
                icon: 'error',
                timer: 2000,
                timerProgressBar: true
            });
        }
    });
});

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