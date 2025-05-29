document.addEventListener('DOMContentLoaded', () => {
    const userLoginForm = document.getElementById('userLoginForm');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const userLoginError = document.getElementById('user-login-error');
    const adminLoginError = document.getElementById('admin-login-error');

    if (userLoginForm) {
        userLoginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const identifier = document.getElementById('user-identifier').value;
            const password = document.getElementById('user-password').value;

            try {
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ identifier, password, role: 'user' }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('userToken', data.token);
                    window.location.href = '/frontend/user_end/user.html';
                } else {
                    userLoginError.textContent = data.message || 'Login failed. Please check your credentials.';
                    userLoginError.style.display = 'block';
                }
            } catch (error) {
                console.error('User login error:', error);
                userLoginError.textContent = 'An unexpected error occurred. Please try again later.';
                userLoginError.style.display = 'block';
            }
        });
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('admin-password').value;

            try {
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password, role: 'admin' }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('adminToken', data.token);
                    window.location.href = '/frontend/admin_end /admin.html';
                } else {
                    adminLoginError.textContent = data.message || 'Admin login failed. Please check your credentials.';
                    adminLoginError.style.display = 'block';
                }
            } catch (error) {
                console.error('Admin login error:', error);
                adminLoginError.textContent = 'An unexpected error occurred. Please try again later.';
                adminLoginError.style.display = 'block';
            }
        });
    }
});