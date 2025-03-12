const socket = io();

const swal = async () => {
    try {
        const chatBox = document.getElementById('chatBox');
        const btnClicked = document.getElementById('sendButton');

        const response = await fetch('/api/chat/user', {
            method: 'GET',
            credentials: 'include'
        })
        const result = await response.json();
        const user = result.nickName;
        socket.emit('newUser', user);

        socket.on('userConnected', user => {
            Swal.fire({
                text: `Se ha conectado ${user}`,
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                icon: 'success' 
            })
        })

        const sendMessage = () => {
            if(chatBox.value.trim().length > 0) {
                socket.emit('message', {user, message: chatBox.value});
                chatBox.value = '';
            }
        }

        chatBox.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                sendMessage();
            }
        })

        btnClicked.addEventListener('click', sendMessage);

    } catch (error) {
        console.log(error);
    }
}

socket.on('messageLogs', (data) => {
    const log = document.getElementById('messageLogs');
    let messages = '';
    let lastDate = '';

    data.forEach(msg => {
        const date = new Date(msg.date);

        const day = date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
        
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        if (day !== lastDate) {
            messages += `<h3>${day}</h3>`;
            lastDate = day;
        }

        messages += `
            <div class="message">
                <div class="message-content">
                    <strong>${msg.email}:</strong> 
                    <span>${msg.message}</span>
                </div>
                <span class="time">${timeString}</span>
            </div>

        `;
    });

    log.innerHTML = messages;

    const lastMessage = log.lastElementChild;
    if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth", block: "end" });
    }
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

swal();