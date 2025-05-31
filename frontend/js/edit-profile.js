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

    // Load current profile
    fetch(`http://localhost:3000/api/users/${user.user_id}`)
        .then(res => res.json())
        .then(profile => {
            document.getElementById('username').value = profile.username || '';
            document.getElementById('email').value = profile.email || '';
            document.getElementById('phone_number').value = profile.phone_number || '';
            document.getElementById('address').value = profile.address || '';
        });

    // Handle form submit
    document.getElementById('edit-profile-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const updated = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            phone_number: document.getElementById('phone_number').value,
            address: document.getElementById('address').value
        };
        const res = await fetch(`http://localhost:3000/api/users/${user.user_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        });
        if (res.ok) {
            alert('Profile updated!');
            window.location.href = '/frontend/user_end/profile.html';
        } else {
            alert('Update failed.');
        }
    });
});