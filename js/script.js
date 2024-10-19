// Importar funciones desde la API
import { enviarProducto, listarProductos, eliminarProducto } from './conexionAPI.js';

const productsContainer = document.getElementById('products-container');
const productForm = document.getElementById('product-form');
const clearFormButton = document.getElementById('clearFormBtn');

// Función para narrar texto con voz robótica femenina
function narrar(texto) {
    const utterance = new SpeechSynthesisUtterance(texto);
    const voices = speechSynthesis.getVoices();
// Filtrar las voces para encontrar una voz femenina
    const femaleVoice = voices.find(voice => voice.name.toLowerCase().includes('female')) || voices[0];
    utterance.voice = femaleVoice;
    speechSynthesis.speak(utterance);
}

// Cargar productos al iniciar y añadir event listener al botón Limpiar.
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const productos = await listarProductos();
        renderProducts(productos);
        // Asegurar que el evento del boton de limpiar se adjunte al cargar la página.
        clearFormButton.addEventListener('click', clearForm); //Aquí se añade el evento una sola vez
    } catch (error) {
        console.error('Error al inicializar:', error);
        narrar('Error al cargar los productos.');
    }
});

// Evento para agregar un producto
productForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.querySelector("[data-name]").value.trim();
    let price = document.querySelector("[data-price]").value.trim();
    const url = document.querySelector("[data-url]").value.trim();


    // Eliminar el signo de dólar si existe
    price = price.replace('$', '');

    //Validar que el precio sea un número
    if (isNaN(parseFloat(price))) {
      alert('Por favor, ingrese un precio válido.');
      return;
    }

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
        narrar('Producto agregado exitosamente.');
    } catch (error) {
        console.error('Error al agregar producto:', error);
        alert('Ocurrió un error al agregar el producto.');
        narrar('Ocurrió un error al agregar el producto.');
    }
});

// Evento para limpiar el formulario (mueve esto afuera de renderProducts)
clearFormButton.addEventListener('click', clearForm);

// Función para limpiar el formulario (solo una función ahora)
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