// API functions
export async function listarProductos() {
    try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) throw new Error('Error al obtener productos');
        return await response.json();
    } catch (error) {
        console.error('Error en la solicitud GET:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}

export async function enviarProducto(producto) {
    try {
        const response = await fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });

        if (!response.ok) throw new Error('Error al enviar el producto');
        return await response.json();
    } catch (error) {
        console.error('Error al enviar producto:', error);
        throw error; // Lanza el error para que se maneje en otro lugar
    }
}

export async function eliminarProducto(id) {
    try {
        const response = await fetch(`http://localhost:3000/products/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar el producto');
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        throw error; // Lanza el error para que se maneje en otro lugar
    }
}
  

// Función para actualizar la lista de productos
async function updateProductList() {
    try {
            // Obtener los productos actualizados de la API
        const updatedProducts = await listarProductos();

            // Renderizar la lista de productos actualizada
        renderProducts(updatedProducts);
    } catch (error) {
        console.error('Error al actualizar la lista de productos:', error);
    }
}

// Renderizar productos
function renderProducts(products) {
    const productsContainer = document.getElementById('products-container'); 
    productsContainer.innerHTML = ''; 
  
    products.forEach(product => {
        const priceWithCurrency = `$ ${product.price.toFixed(2)}`; // Formato con el signo de dólar
        const productCard = `
            <div class="card" data-id="${product.id}">
                <img class="image" src="${product.url}" alt="${product.name}"/>
                <div class="card-container--info">
                    <p class="name">${product.name}</p>
                    <div class="card-container--value">
                        <p class="price">${priceWithCurrency}</p>
                        <button class="btn__eliminar__producto" type="button" data-id="${product.id}">
                            <img src="./assets/bote-de-basura.png" alt="Eliminar producto"/>
                        </button>
                    </div>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productCard;
    });


    // Añadir eventos a los botones de borrar después de renderizar
    document.querySelectorAll('.btn__eliminar__producto').forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}