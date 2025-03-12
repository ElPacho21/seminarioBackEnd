const form = document.getElementById('signupForm');
const signupError = document.getElementById('signupError');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    signupError.textContent = '';
    signupError.style.display = 'none';

    const data = new FormData(form);
    const obj = {}

    data.forEach((value, key) => {
        obj[key] = value;
    });

    try {
        const response = await fetch('/api/auth/signup', {
            headers: {
                'Content-Type': 'application/json'
            }, 
            method: 'POST',
            body: JSON.stringify(obj),
            credentials: 'include'
        })
        const result = await response.json()

        if (result.status === 'success') {
            
            window.location.href = result.redirectUrl;
        } else {
            signupError.textContent = 'El email y la contraseña no coinciden.';
            signupError.style.color = 'red';
            signupError.style.display = 'block';
        }
    } catch (error) {
        console.error(error.message)    
    }
})