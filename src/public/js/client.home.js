const socket = io();

socket.on('updateProducts', (products) => {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    products.forEach(product => {
        productsContainer.innerHTML += `
            <div>
                <p>ID: ${product._id}</p>
                <h3>Title: ${product.title}</h3>
                <p>Description: ${product.description}</p>
                <p>Code: ${product.code}</p>
                <p>Price: $${product.price}</p>
                <p>Status: ${product.status}</p>
                <p>Stock: ${product.stock}</p>
                <p>Category: ${product.category}</p>
                <p>Thumbnails:</p>
                <ul>
                    ${product.thumbnails.map(thumbnail => `<li>${thumbnail}</li>`).join('')}
                </ul>
            </div>
        `;
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

// CART

const productToAdd = document.querySelectorAll('.add-to-cart');
const cartLink = document.getElementById('cart-btn');

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
});

productToAdd.forEach((element) => {
    element.addEventListener('click', async (event) => {
        event.preventDefault();
        const productCard = event.target.closest('.product-card')
        const productId = productCard.dataset.product
        try {
            let storedCartId = await getCartIdFromSession();
            if (!storedCartId) {
                console.log('POST CARRITO')
                const response = await fetch('/api/carts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        products: [{ product: productId, quantity: 1 }],
                    }),
                    credentials: 'include'
                });
                const newCart = await response.json();
                storedCartId = newCart.payload._id;
                
            } else {
                await fetch(`/api/carts/${storedCartId}/products/${productId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product: productId }),
                    credentials: 'include'
                });
                console.log(`Producto ${productId} agregado al carrito ${storedCartId}`);
            }

            updateCartLink()

            Swal.fire({
                text: `Se ha agregado el produco al carrito`,
                toast: true,
                position: 'bottom-left',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                icon: 'success' 
            })
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    });
});

// PRODUCT DETAILS

const productDetails = document.querySelectorAll('.product-details');

productDetails.forEach(element => {
    element.addEventListener('click', async (event) => {
        event.preventDefault();
        const productCard = event.target.closest('.product-card')
        const productId = productCard.dataset.product
        console.log('Endpoint alcanzado');
        window.location.href = `/api/viewsproducts/products/${productId}`;
    });
})