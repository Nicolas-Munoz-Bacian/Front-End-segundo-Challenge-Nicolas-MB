// Importar funciones desde la API
import { enviarProducto, listarProductos, eliminarProducto } from './conexionAPI.js';

const productsContainer = document.getElementById('products-container');
const productForm = document.getElementById('product-form');
const clearFormButton = document.getElementById('clearFormBtn');

// Función para narrar texto
function narrar(texto) {
    const utterance = new SpeechSynthesisUtterance(texto);
    const voices = speechSynthesis.getVoices();
    const spanishVoice = voices.find(voice => voice.lang.startsWith('es')) || voices[0];
    utterance.voice = spanishVoice;
    speechSynthesis.speak(utterance);
}

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const productos = await añadirProductos();
        renderProducts(productos);
    } catch (error) {
        console.error('Error al inicializar:', error);
    }
});

// Evento para agregar un producto
productForm.addEventListener('submit', async event => {
    event.preventDefault();

    const name = document.querySelector("[data-name]").value.trim();
    const price = document.querySelector("[data-price]").value.trim();
    const url = document.querySelector("[data-url]").value.trim();

    if (!name || !price || !url) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const newProduct = { name, price: parseFloat(price), url };

    try {
        console.log('Enviando producto:', newProduct);
        await enviarProducto(newProduct);
        alert('Producto agregado exitosamente.');
        updateProductList();
        clearForm();
    } catch (error) {
        console.error('Error al agregar producto:', error);
        alert('Ocurrió un error al agregar el producto.');
    }
    
});

// Evento para limpiar el formulario (mueve esto afuera de renderProducts)
clearFormButton.addEventListener('click', clearForm);

// Función para limpiar el formulario
function clearForm() {
    document.querySelectorAll("[data-name]").forEach(element => element.value = '');
    document.querySelectorAll("[data-price]").forEach(element => element.value = '');
    document.querySelectorAll("[data-url]").forEach(element => element.value = '');
    narrar('Formulario limpiado.');
}

// Función para renderizar los productos
function renderProducts(products) {
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productCard = `
            <div class="card" data-id="${product.id}">
                <img class="image" src="${product.url}" alt="${product.name}"/>
                <div class="card-container--info">
                    <p class="name">${product.name}</p>
                    <div class="card-container--value">
                        <p class="price">$${product.price.toFixed(2)}</p>
                        <button class="btn__eliminar__producto" type="button" data-id="${product.id}">
                            <img src="./assets/bote-de-basura.png" alt="Eliminar producto">
                        </button>
                    </div>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productCard;
    });

    attachDeleteEventListeners();
}

// Función para actualizar la lista de productos
async function updateProductList() {
    try {
        const updatedProducts = await listarProductos(); //Corregido
        renderProducts(updatedProducts);
    } catch (error) {
        console.error('Error al actualizar la lista de productos:', error);
        narrar('Error al actualizar la lista de productos.');
    }
}

// Función para manejar la eliminación de productos
function attachDeleteEventListeners() {
    document.querySelectorAll('.btn__eliminar__producto').forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.getAttribute('data-id');
            try {
                await eliminarProducto(productId);
                alert('Producto eliminado exitosamente.');
                updateProductList();
                narrar('Producto eliminado exitosamente.');
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                const errorMessage = `Ocurrió un error al eliminar el producto. Código de error: ${error.message || 'Desconocido'}`;
                alert(errorMessage);
                narrar(errorMessage);
            }
        });
    });
}