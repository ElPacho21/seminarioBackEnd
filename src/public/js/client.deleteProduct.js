const socket = io();

// Función para eliminar un producto del servidor
const deleteProduct = () => {
    const productId = document.getElementById('productId').value;
    socket.emit('deleteProduct', productId);
}

// ELIMINAR PRODUCTO

document.getElementById('deleteForm').addEventListener('submit', (event) => {
    event.preventDefault();
    deleteProduct();
    this.reset();
})

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