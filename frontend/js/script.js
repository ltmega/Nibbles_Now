// script.js

// Example function (adjust based on your actual logic)
function displayProducts(products) {
    const productsContainer = document.getElementById('product-list-container'); // Replace with your actual container ID

    if (productsContainer) {
        productsContainer.innerHTML = ''; // Clear previous content
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-item'); // Example class
            productDiv.innerHTML = `
                <h3>${product.name || 'Product Name Unavailable'}</h3>
                <p class="price">UGX ${product.price ? product.price.toLocaleString() : 'N/A'}</p>
                ${product.image_url ? `<img src="${product.image_url}" alt="${product.name || 'Product Image'}">` : '<p>No image available</p>'}
                <button class="add-to-cart" data-product-id="${product.id || product.product_id}">Add to Cart</button>
            `;
            productsContainer.appendChild(productDiv);

            // Example event listener (you might have this in a separate file or function)
            const addToCartButton = productDiv.querySelector('.add-to-cart');
            if (addToCartButton) {
                addToCartButton.addEventListener('click', function() {
                    const productId = this.dataset.productId;
                    console.log(`Added product with ID ${productId} to cart`);
                    // Your actual addToCart logic here (calling a function or making an API request)
                });
            }
        });
    } else {
        console.error("Error: 'product-list-container' not found in the HTML!");
    }
}

// Example of how you might fetch and display products (adjust the URL)
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(data => {
            displayProducts(data);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            const productsContainer = document.getElementById('product-list-container');
            if (productsContainer) {
                productsContainer.innerHTML = '<p>Error loading products. Please try again later.</p>';
            }
        });
});

// You might have other global utility functions here