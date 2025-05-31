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

    fetch(`http://localhost:3000/api/orders/user/${user.user_id}`)
        .then(res => res.json())
        .then(orders => {
            const tbody = document.getElementById('orders-table-body');
            if (!orders.length) {
                tbody.innerHTML = '<tr><td colspan="4">No orders found.</td></tr>';
            } else {
                tbody.innerHTML = orders.map(order => `
                    <tr>
                        <td>${order.order_id}</td>
                        <td>${order.order_date}</td>
                        <td>UGX ${Number(order.total_amount).toLocaleString()}</td>
                        <td>${order.status || 'N/A'}</td>
                    </tr>
                `).join('');
            }
        })
        .catch(() => {
            document.getElementById('orders-table-body').innerHTML = '<tr><td colspan="4">Error loading orders.</td></tr>';
        });
});