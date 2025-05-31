document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user) {
        window.location.href = '/frontend/login.html';
        return;
    }

    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        window.location.href = '/frontend/login.html';
    });

    fetch(`http://localhost:3000/api/users/${user.user_id}`)
        .then(res => res.json())
        .then(profile => {
            document.getElementById('profile-container').innerHTML = `
                <p><strong>Username:</strong> ${profile.username}</p>
                <p><strong>Email:</strong> ${profile.email || ''}</p>
                <p><strong>Phone:</strong> ${profile.phone_number || ''}</p>
                <p><strong>Address:</strong> ${profile.address || ''}</p>
            `;
        })
        .catch(() => {
            document.getElementById('profile-container').innerHTML = '<p>Error loading profile.</p>';
        });
});