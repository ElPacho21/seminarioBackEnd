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

const cartLink = document.getElementById('cart-btn');

const updateCartLink = () => {
    const storedCartId = localStorage.getItem('cartId');
    if (storedCartId && cartLink) {
        cartLink.href = `/api/viewscarts/${storedCartId}`;
    } else if (cartLink) {
        cartLink.href = '/api/viewscarts';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updateCartLink();
});