document.addEventListener('DOMContentLoaded', () => {
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('adminToken');
            localStorage.removeItem('userInfo');
            window.location.href = '/frontend/login.html';
        });
    }

});