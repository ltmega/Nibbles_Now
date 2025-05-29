document.addEventListener('DOMContentLoaded', () => {
    const categoryListContainer = document.getElementById('category-list-container');
    const desiredOrder = [
        'Local Snacks',
        'Beverages',
        'Packaged Snacks',
        'Healthy Options'
    ];

    async function fetchCategoriesWithProducts() {
        const response = await fetch('http://localhost:3000/api/categories/with-products');
        let categories = await response.json();

        // Sort and filter categories in the desired order, remove undefined
        categories = desiredOrder.map(name => categories.find(cat => cat.category_name === name)).filter(Boolean);

        displayCategories(categories);
    }

    function displayCategories(categories) {
        categoryListContainer.innerHTML = '';
        categories.forEach(category => {
            // Only render the section if there are products (even if just one)
            if (category.products && category.products.length > 0) {
                const section = document.createElement('section');
                section.classList.add('category-section');
                section.innerHTML = `
                    <h2 class="category-title">${category.category_name}</h2>
                    <div class="product-list-horizontal">
                        ${category.products.slice(0, 4).map(product => `
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
                categoryListContainer.appendChild(section);
            }
        });

        attachAddToCartListeners();
        attachViewMoreListeners();
    }

    function attachAddToCartListeners() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const product = {
                    product_id: this.dataset.productId,
                    product_name: this.dataset.productName,
                    price: Number(this.dataset.productPrice),
                    image_url: this.dataset.productImage
                };
                if (window.addToCart) {
                    window.addToCart(product);
                }
            });
        });
    }

    function attachViewMoreListeners() {
        document.querySelectorAll('.view-more-btn').forEach(button => {
            button.addEventListener('click', function() {
                const category = JSON.parse(this.dataset.category);
                const productListRow = this.parentElement.querySelector('.product-list-horizontal');
                productListRow.innerHTML = category.products.map(product => `
                    <div class="product-card">
                        <img src="${product.image_url || '/frontend/images/default.jpg'}" alt="${product.product_name}">
                        <h4>${product.product_name}</h4>
                        <p>${product.description || ''}</p>
                        <p class="price">UGX ${Number(product.price).toLocaleString()}</p>
                        <button class="button add-to-cart" data-product-id="${product.product_id}" data-product-name="${product.product_name}" data-product-price="${product.price}" data-product-image="${product.image_url}">Add to Cart</button>
                    </div>
                `).join('');
                this.style.display = 'none';
                attachAddToCartListeners();
            });
        });
    }

    fetchCategoriesWithProducts();
});