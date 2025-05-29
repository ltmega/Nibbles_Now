document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('popular-snacks-container');

    async function fetchPopularSnacks() {
        try {
            const response = await fetch('http://localhost:3000/api/products/featured-snacks');
            if (!response.ok) throw new Error('Failed to fetch popular snacks');
            const snacks = await response.json();
            displayPopularSnacks(snacks);
        } catch (error) {
            container.innerHTML = '<p class="error-message">Failed to load popular snacks.</p>';
        }
    }

    function displayPopularSnacks(snacks) {
        container.innerHTML = '';
        snacks.forEach(snack => {
            const card = document.createElement('div');
            card.className = 'popular-snacks-card';
            card.innerHTML = `
                <img src="${snack.image_url || '/frontend/images/placeholder.jpg'}" alt="${snack.product_name}">
                <h3>${snack.product_name}</h3>
                <div class="price">UGX ${Number(snack.price).toLocaleString()}</div>
                <button class="button add-to-cart-btn">Add to Cart</button>
            `;
            card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                if (window.addToCart) {
                    window.addToCart({
                        product_id: snack.product_id,
                        product_name: snack.product_name,
                        price: snack.price,
                        image_url: snack.image_url
                    });
                } else {
                    alert('Add to cart not available.');
                }
            });
            container.appendChild(card);
        });
    }

    fetchPopularSnacks();
});