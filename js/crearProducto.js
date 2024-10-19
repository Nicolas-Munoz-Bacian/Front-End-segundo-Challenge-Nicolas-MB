import { enviarProducto, listarProductos, eliminarProducto } from './api.js';

document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.querySelector('[data-formulario]');
    
    productForm.addEventListener('submit', async event => {
        event.preventDefault();
        
        const name = document.querySelector("[data-name]").value.trim();
        const price = document.querySelector("[data-price]").value.trim();
        const url = document.querySelector("[data-url]").value.trim();
        
        if (!name || !price || !url) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const newProduct = { name, price, url };

        try {
            await enviarProducto(newProduct);
            alert('Producto agregado exitosamente.');
            productForm.reset();
            // Lógica adicional para actualizar la lista de productos si es necesario
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });
});
