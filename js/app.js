const apiUrl = 'http://localhost:8080/api/v1/products';

window.onload = () => {
    fetchProducts();
};

document.getElementById('productForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const productName = document.getElementById('productName').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    
    addProduct(productName, productPrice);
});

function fetchProducts() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching products');
            }
            return response.json();
        })
        .then(data => renderProducts(data))
        .catch(error => console.error('Fetch error:', error));
}

function addProduct(name, price) {
    fetch(apiUrl + '/insert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName: name, productPrice: price }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error adding product');
        }
        return response.json();
    })
    .then(() => fetchProducts())
    .catch(error => console.error('Error:', error));
}

function deleteProduct(id) {
    fetch(apiUrl + '/delete/' + id, {
        method: 'DELETE',
    })
    .then(() => fetchProducts())
    .catch(error => console.error('Delete error:', error));
}

function renderProducts(products) {
    const productContainer = document.getElementById('productContainer');
    productContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('card');
        
        const productName = document.createElement('h3');
        productName.textContent = product.productName;
        
        const productPrice = document.createElement('p');
        productPrice.textContent = `${product.productPrice} €`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-button');
        deleteBtn.addEventListener('click', () => {
            deleteProduct(product.productId);
        });
        
        productCard.appendChild(productName);
        productCard.appendChild(productPrice);
        productCard.appendChild(deleteBtn);
        productContainer.appendChild(productCard);
    });
}
