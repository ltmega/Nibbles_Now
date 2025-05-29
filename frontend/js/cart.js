const CART_KEY = 'nibblesNowCart';

function getCart() {
    const cartData = localStorage.getItem(CART_KEY);
    return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function addToCart(product) {
    let cart = getCart();
    const existing = cart.find(item => item.product_id == product.product_id);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart(cart);
    alert(`Added ${product.product_name} to cart!`);
}

function updateCartCount() {
    const cart = getCart();
    document.querySelectorAll('#cart-item-count').forEach(span => {
        span.textContent = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    });
}

// Only run cart display logic if on cart page
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    const cartItemsContainer = document.getElementById('cart-items-container');
    if (!cartItemsContainer) return;

    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartDeliveryFeeElement = document.getElementById('cart-delivery-fee');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-btn');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    function displayCartItems() {
        cartItemsContainer.innerHTML = '';
        const cart = getCart();

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            checkoutButton.disabled = true;
            return;
        }

        emptyCartMessage.style.display = 'none';
        checkoutButton.disabled = false;

        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <img src="${item.image_url || '/frontend/images/placeholder.jpg'}" alt="${item.product_name}">
                <div class="cart-item-details">
                    <h4>${item.product_name}</h4>
                    <p class="cart-item-price">UGX ${item.price.toLocaleString()}</p>
                    <div class="cart-item-quantity">
                        <label for="quantity-${item.product_id}">Quantity:</label>
                        <input type="number" id="quantity-${item.product_id}" name="quantity" value="${item.quantity}" min="1">
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item" data-product-id="${item.product_id}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemDiv);

            const quantityInput = cartItemDiv.querySelector(`#quantity-${item.product_id}`);
            quantityInput.addEventListener('change', function() {
                updateItemQuantity(item.product_id, this.value);
            });

            const removeButton = cartItemDiv.querySelector('.remove-item');
            removeButton.addEventListener('click', function() {
                removeItemFromCart(this.dataset.productId);
            });
        });
    }

    function updateItemQuantity(productId, quantity) {
        let cart = getCart();
        const item = cart.find(item => item.product_id == productId);
        if (item) {
            item.quantity = parseInt(quantity, 10);
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.product_id != productId);
            }
            saveCart(cart);
            displayCartItems();
        }
    }

    function removeItemFromCart(productId) {
        let cart = getCart();
        cart = cart.filter(item => item.product_id != productId);
        saveCart(cart);
        displayCartItems();
    }

    function calculateCartTotal() {
        const cart = getCart();
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * (item.quantity || 1);
        });
        const deliveryFee = 5000;
        const total = subtotal + deliveryFee;
        return { subtotal, deliveryFee, total };
    }

    function updateCartSummary() {
        const { subtotal, deliveryFee, total } = calculateCartTotal();
        cartSubtotalElement.textContent = `UGX ${subtotal.toLocaleString()}`;
        cartDeliveryFeeElement.textContent = `UGX ${deliveryFee.toLocaleString()}`;
        cartTotalElement.textContent = `UGX ${total.toLocaleString()}`;
    }

    function updateCartDisplay() {
        displayCartItems();
        updateCartSummary();
        updateCartCount();
    }

    // Initialize cart display
    updateCartDisplay();

    checkoutButton.addEventListener('click', () => {
        window.location.href = '/frontend/html/checkout.html';
    });
});

// Make addToCart globally accessible
window.addToCart = addToCart;