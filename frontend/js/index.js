document.addEventListener('DOMContentLoaded', () => {
    const featuredSnacksContainer = document.getElementById('featured-snacks-container');

    async function fetchFeaturedSnacks() {
        try {
            const response = await fetch('http://localhost:3000/api/products/featured-snacks');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const featuredSnacks = await response.json();
            displayFeaturedSnacks(featuredSnacks);
        } catch (error) {
            console.error('Failed to fetch featured snacks:', error);
            featuredSnacksContainer.innerHTML = '<p class="error-message">Failed to load popular snacks.</p>';
        }
    }

    function displayFeaturedSnacks(snacks) {
        featuredSnacksContainer.innerHTML = '';
        snacks.forEach(snack => {
            const snackCard = document.createElement('div');
            snackCard.classList.add('featured-card');
            snackCard.innerHTML = `
                <img src="${snack.image_url || '/frontend/images/placeholder.jpg'}" alt="${snack.product_name}">
                <h3>${snack.product_name}</h3>
                <p class="price">UGX ${snack.price.toLocaleString()}</p>
                <button class="add-to-cart" data-product-id="${snack.product_id}">Add to Cart</button>
            `;
            featuredSnacksContainer.appendChild(snackCard);
        });

        // Add event listeners to the "Add to Cart" buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.productId;
                // Implement your addToCart logic here
                alert(`Added product with ID ${productId} to cart!`);
            });
        });
    }

    fetchFeaturedSnacks();
});