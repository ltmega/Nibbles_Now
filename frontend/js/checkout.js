document.addEventListener('DOMContentLoaded', () => {
    // Update cart count in nav
    if (window.updateCartCount) updateCartCount();

    // Display cart summary
    function displayCheckoutCartSummary() {
        const cart = JSON.parse(localStorage.getItem('nibblesNowCart') || '[]');
        const summaryDiv = document.getElementById('checkout-cart-summary');
        const checkoutForm = document.getElementById('checkout-form');
        if (!summaryDiv || !checkoutForm) return;

        if (!cart.length) {
            summaryDiv.innerHTML = '<p>Your cart is empty. <a href="/frontend/categories.html">Shop now!</a></p>';
            checkoutForm.style.display = 'none';
            return;
        }
        let subtotal = 0;
        summaryDiv.innerHTML = `
            <h3>Your Order</h3>
            <ul class="checkout-cart-list">
                ${cart.map(item => {
                    subtotal += item.price * (item.quantity || 1);
                    return `<li>
                        <strong>${item.product_name}</strong> x${item.quantity || 1} - UGX ${(item.price * (item.quantity || 1)).toLocaleString()}
                    </li>`;
                }).join('')}
            </ul>
            <div class="summary-item"><span>Subtotal:</span> <span>UGX ${subtotal.toLocaleString()}</span></div>
            <div class="summary-item"><span>Delivery Fee:</span> <span>UGX 5,000</span></div>
            <div class="summary-item total"><span>Total:</span> <span>UGX ${(subtotal + 5000).toLocaleString()}</span></div>
        `;
    }

    displayCheckoutCartSummary();

    // Handle checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const cart = JSON.parse(localStorage.getItem('nibblesNowCart') || '[]');
            const username= document.getElementById('full-name').value;
            const deliveryAddress = document.getElementById('address').value;

            try {
                // Get or create user by name
                const userRes = await fetch('http://localhost:3000/api/users/get-or-create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username })
                });
                const userData = await userRes.json();
                if (!userRes.ok) throw new Error(userData.message || 'User error');
                const userId = userData.userId;

                // Place order
                const response = await fetch('http://localhost:3000/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, deliveryAddress, cart })
                });
                const data = await response.json();
                if (response.ok) {
                    localStorage.removeItem('nibblesNowCart');
                    if (window.updateCartCount) updateCartCount();
                    checkoutForm.style.display = 'none';
                    document.getElementById('checkout-success').style.display = 'block';
                    document.getElementById('checkout-cart-summary').innerHTML = '';
                } else {
                    alert(data.message || 'Order failed. Please try again.');
                }
            } catch (err) {
                alert('Order failed. Please try again.');
            }
        });
    }
});