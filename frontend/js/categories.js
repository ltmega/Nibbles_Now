document.addEventListener('DOMContentLoaded', () => {
    const categoryListContainer = document.getElementById('category-list-container');
    const imageMap = {
        'Local Snacks': '/frontend/images/groundnuts.jpg',
        'Packaged Snacks': '/frontend/images/chocolate.jpg',
        'Beverages': '/frontend/images/coke.jpg',
        'Healthy Options': '/frontend/images/fruitsalad.jpg'
    };

    async function fetchCategoriesWithProducts() {
        const response = await fetch('http://localhost:3000/api/categories/with-products');
        const categories = await response.json();
        displayCategories(categories);
    }

    function displayCategories(categories) {
        categoryListContainer.innerHTML = '';
        categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.classList.add('category-card-section');
            // Show only first 4 products by default
            const productsToShow = category.products.slice(0, 4);
            categoryCard.innerHTML = `
                <div class="category-header">
                    <img src="${imageMap[category.category_name] || '/frontend/images/default.jpg'}" alt="${category.category_name}">
                    <h3>${category.category_name}</h3>
                </div>
                <div class="product-list-grid">
                    ${productsToShow.map(product => `
                        <div class="product-card">
                            <img src="${product.image_url || '/frontend/images/default.jpg'}" alt="${product.product_name}">
                            <h4>${product.product_name}</h4>
                            <p>${product.description || ''}</p>
                            <p class="price">UGX ${Number(product.price).toLocaleString()}</p>
                            <button class="button add-to-cart" data-product-id="${product.product_id}" data-product-name="${product.product_name}" data-product-price="${product.price}" data-product-image="${product.image_url}">Add to Cart</button>
                        </div>
                    `).join('')}
                </div>
                ${category.products.length > 4 ? `<button class="view-more-btn" data-category='${JSON.stringify(category)}'>View More</button>` : ''}
            `;
            categoryListContainer.appendChild(categoryCard);
        });

        // Add event listeners for Add to Cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const product = {
                    product_id: this.dataset.productId,
                    product_name: this.dataset.productName,
                    price: Number(this.dataset.productPrice),
                    image_url: this.dataset.productImage
                };
                addToCart(product);
            });
        });

        // View More functionality
        document.querySelectorAll('.view-more-btn').forEach(button => {
            button.addEventListener('click', function() {
                const category = JSON.parse(this.dataset.category);
                const productListGrid = this.parentElement.querySelector('.product-list-grid');
                productListGrid.innerHTML = category.products.map(product => `
                    <div class="product-card">
                        <img src="${product.image_url || '/frontend/images/default.jpg'}" alt="${product.product_name}">
                        <h4>${product.product_name}</h4>
                        <p>${product.description || ''}</p>
                        <p class="price">UGX ${Number(product.price).toLocaleString()}</p>
                        <button class="button add-to-cart" data-product-id="${product.product_id}" data-product-name="${product.product_name}" data-product-price="${product.price}" data-product-image="${product.image_url}">Add to Cart</button>
                    </div>
                `).join('');
                this.style.display = 'none';
            });
        });
    }

    fetchCategoriesWithProducts();
});