document.addEventListener('DOMContentLoaded', () => {
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('adminToken');
            localStorage.removeItem('userInfo');
            window.location.href = '/frontend/login.html';
        });
    }

    // Modal logic
    const showAddFormBtn = document.getElementById('show-add-form');
    const addProductModal = document.getElementById('add-product-modal');
    const closeAddFormBtn = document.getElementById('close-add-form');
    const addProductForm = document.getElementById('add-product-form');

    const editProductModal = document.getElementById('edit-product-modal');
    const closeEditFormBtn = document.getElementById('close-edit-form');
    const editProductForm = document.getElementById('edit-product-form');

    if (showAddFormBtn) showAddFormBtn.addEventListener('click', () => {
        addProductModal.style.display = 'block';
    });
    if (closeAddFormBtn) closeAddFormBtn.addEventListener('click', () => {
        addProductModal.style.display = 'none';
    });
    if (closeEditFormBtn) closeEditFormBtn.addEventListener('click', () => {
        editProductModal.style.display = 'none';
    });
    window.onclick = function(event) {
        if (event.target == addProductModal) addProductModal.style.display = 'none';
        if (event.target == editProductModal) editProductModal.style.display = 'none';
    };

    // Load products
    async function loadProducts() {
        const res = await fetch('http://localhost:3000/api/products');
        const products = await res.json();
        const tbody = document.getElementById('admin-products-table-body');
        tbody.innerHTML = products.map(product => `
            <tr>
                <td>${product.product_id || product.id}</td>
                <td>${product.product_name || product.name}</td>
                <td>${product.description}</td>
                <td>UGX ${product.price}</td>
                <td>${product.category_id}</td>
                <td><img src="${product.image_url}" alt="${product.product_name || product.name}" style="width:40px;height:40px;"></td>
                <td>
                    <button class="edit-btn" data-id="${product.product_id || product.id}">Edit</button>
                    <button class="delete-btn" data-id="${product.product_id || product.id}">Delete</button>
                </td>
            </tr>
        `).join('');
        attachActionListeners(products);
    }
    loadProducts();

    // Add product
    if (addProductForm) {
        addProductForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(addProductForm);
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                addProductModal.style.display = 'none';
                addProductForm.reset();
                loadProducts();
            } else {
                alert('Failed to add product.');
            }
        });
    }

    // Attach edit/delete listeners
    function attachActionListeners(products) {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = async function() {
                if (confirm('Delete this product?')) {
                    await fetch(`http://localhost:3000/api/products/${btn.dataset.id}`, { method: 'DELETE' });
                    loadProducts();
                }
            };
        });
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.onclick = function() {
                const product = products.find(p => (p.product_id || p.id) == btn.dataset.id);
                if (!product) {
                    alert('Product not found!');
                    return;
                }
                document.getElementById('edit-product-id').value = product.product_id || product.id;
                document.getElementById('edit-product-name').value = product.product_name || product.name;
                document.getElementById('edit-product-description').value = product.description;
                document.getElementById('edit-product-price').value = product.price;
                document.getElementById('edit-product-category').value = product.category_id;
                document.getElementById('edit-product-image-url').value = product.image_url;
                editProductModal.style.display = 'block';
            };
        });
    }

    // Edit product
    if (editProductForm) {
        editProductForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const id = document.getElementById('edit-product-id').value;
            const formData = new FormData(editProductForm);
            const response = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: 'PUT',
                body: formData
            });
            if (response.ok) {
                editProductModal.style.display = 'none';
                editProductForm.reset();
                loadProducts();
            } else {
                alert('Failed to update product.');
            }
        });
    }
});