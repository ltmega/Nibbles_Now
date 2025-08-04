document.addEventListener('DOMContentLoaded', () => {
  const showAddFormBtn = document.getElementById('show-add-form');
  const addProductModal = document.getElementById('add-product-modal');
  const closeAddFormBtn = document.getElementById('close-add-form');
  const addProductForm = document.getElementById('add-product-form');

  showAddFormBtn.addEventListener('click', () => {
    addProductModal.style.display = 'block';
  });
  closeAddFormBtn.addEventListener('click', () => {
    addProductModal.style.display = 'none';
  });
  window.onclick = function(event) {
    if (event.target == addProductModal) {
      addProductModal.style.display = 'none';
    }
  };

  addProductForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    // ...fetch logic as before...
    addProductModal.style.display = 'none';
    addProductForm.reset();
    // reload products
  });

  // ...rest of your product table JS...
  // Admin logout logic and add product form toggle
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('logout-btn').addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('adminToken');
            localStorage.removeItem('userInfo');
            window.location.href = '/frontend/login.html';
        });

        const showAddFormBtn = document.getElementById('show-add-form');
        const addProductForm = document.getElementById('add-product-form');
        const cancelAddFormBtn = document.getElementById('cancel-add-form');

        showAddFormBtn.addEventListener('click', function() {
            addProductForm.style.display = '';
            showAddFormBtn.style.display = 'none';
        });
        cancelAddFormBtn.addEventListener('click', function() {
            addProductForm.style.display = 'none';
            showAddFormBtn.style.display = '';
        });

        // Load products
        async function loadProducts() {
            const res = await fetch('http://localhost:3000/api/products');
            const products = await res.json();
            const tbody = document.getElementById('admin-products-table-body');
            tbody.innerHTML = products.map(product => `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.description}</td>
                    <td>UGX ${product.price}</td>
                    <td>${product.category_id}</td>
                    <td><img src="${product.image_url}" alt="${product.name}" style="width:40px;height:40px;"></td>
                    <td><button onclick="deleteProduct(${product.id})">Delete</button></td>
                </tr>
            `).join('');
        }
        loadProducts();

        // Add product
        addProductForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('product-name').value;
            const description = document.getElementById('product-description').value;
            const price = document.getElementById('product-price').value;
            const category = document.getElementById('product-category').value;
            const image = document.getElementById('product-image').value;
            await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, price, category_id: category, image_url: image })
            });
            addProductForm.reset();
            addProductForm.style.display = 'none';
            showAddFormBtn.style.display = '';
            loadProducts();
        });
    });
    // Delete product
    async function deleteProduct(id) {
        await fetch(`http://localhost:3000/api/products/${id}`, { method: 'DELETE' });
        // Reload products after delete
        document.addEventListener('DOMContentLoaded', () => {
            loadProducts();
        });
    }

});