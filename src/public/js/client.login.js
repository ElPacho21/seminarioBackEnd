const form = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    loginError.textContent = '';
    loginError.style.display = 'none';

    const data = new FormData(form);
    const obj = {}

    data.forEach((value, key) => {
        obj[key] = value;
    });

    const url = '/api/auth/login'
    const headers = {
        'Content-Type': 'application/json'
    }
    const method = 'POST'
    const body = JSON.stringify(obj);

    try {
        const response = await fetch(url, { headers, method, body, credentials: 'include' });
        const result = await response.json();

        if (result.status === 'success') {
            window.location.href = result.redirectUrl;
        } else {
            loginError.textContent = 'El email y la contraseña no coinciden.';
            loginError.style.color = 'red';
            loginError.style.display = 'block';
        }
    } catch (err) {
        console.log(err);
    }
});