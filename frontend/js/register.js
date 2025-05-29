document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const registrationError = document.getElementById('registration-error');
    const registrationSuccess = document.getElementById('registration-success');

    if (registrationForm) {
        registrationForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const full_name = document.getElementById('register-fullname').value;
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;

            if (password !== confirmPassword) {
                registrationError.textContent = 'Passwords do not match.';
                registrationError.style.display = 'block';
                registrationSuccess.style.display = 'none';
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ full_name, username, email, password })
                });
                const data = await response.json();
                if (response.ok) {
                    registrationSuccess.textContent = data.message || 'Registration successful!';
                    registrationSuccess.style.display = 'block';
                    registrationError.style.display = 'none';
                    registrationForm.reset();
                    // Redirect to login page after 2 seconds
                    setTimeout(() => {
                        window.location.href = '/frontend/login.html';
                    }, 2000);
                } else {
                    registrationError.textContent = data.message || 'Registration failed.';
                    registrationError.style.display = 'block';
                    registrationSuccess.style.display = 'none';
                }
            } catch (error) {
                registrationError.textContent = 'An error occurred. Please try again.';
                registrationError.style.display = 'block';
                registrationSuccess.style.display = 'none';
            }
        });
    }
});