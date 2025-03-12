const socket = io();

// Función para enviar un nuevo producto al servidor
const createProduct = async () => {
    const formData = new FormData();

    const thumbnailsInput = document.querySelectorAll('.thumbnail-input');
    thumbnailsInput.forEach((input) => {
        if (input.files[0]) {
            formData.append('thumbnails', input.files[0]); 
        }
    });
    
    // Enviar imágenes mediante un fetch
    const uploadResponse = await fetch('/api/viewsproducts/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
    });

    if (!uploadResponse.ok) {
        console.error('Error al cargar las imágenes');
        return;
    }

    const { filenames } = await uploadResponse.json();

    const product = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: document.getElementById('price').value,
        status: document.getElementById('status').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value,
        thumbnails: filenames,
    };

    socket.emit('createProduct', product);
}
// Función para enviar un nuevo producto al servidor
document.getElementById('postForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    createProduct();
});

document.addEventListener('DOMContentLoaded', () => {
    const thumbnailsContainer = document.getElementById('thumbnails-container');

    thumbnailsContainer.addEventListener('input', (event) => {
        if (event.target.classList.contains('thumbnail-input')) {
            const inputs = document.querySelectorAll('.thumbnail-input');
            
            inputs.forEach((input, index) => {
                if (input.value === '' && inputs.length > 1 && index !== inputs.length - 1) {
                    const br = input.nextElementSibling;
                    if (br && br.tagName === 'BR') {
                        thumbnailsContainer.removeChild(br);
                    }
                    thumbnailsContainer.removeChild(input);
                }
            });

            const lastInput = inputs[inputs.length - 1];

            if (lastInput.value !== '') {
                const newInput = document.createElement('input');
                newInput.type = 'file';
                newInput.name = 'thumbnails';
                newInput.className = 'thumbnail-input';
                newInput.placeholder = 'Thumbnail';
                
                thumbnailsContainer.appendChild(newInput);
                thumbnailsContainer.appendChild(document.createElement('br'));
            }
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