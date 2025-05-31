document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user) {
        window.location.href = '/frontend/login.html';
        return;
    }

    document.getElementById('user-name').textContent = user.username || 'User';
    document.getElementById('user-email').textContent = user.email || '';

    fetch(`http://localhost:3000/api/orders/user/${user.user_id}?limit=3`)
        .then(res => res.json())
        .then(orders => {
            const ul = document.getElementById('recent-orders');
            if (!orders.length) {
                ul.innerHTML = '<li>No recent orders.</li>';
            } else {
                ul.innerHTML = orders.map(order =>
                    `<li>Order #${order.order_id} - UGX ${order.total_amount} (${order.status})</li>`
                ).join('');
            }
        })
        .catch(() => {
            document.getElementById('recent-orders').innerHTML = '<li>Error loading orders.</li>';
        });

    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        window.location.href = '/frontend/login.html';
    });
});