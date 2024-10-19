// API functions

export async function listarProductos() {
    try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
            throw new Error('Error al obtener productos');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en la solicitud GET:', error);
        throw error;
    }
}

export async function enviarProducto(producto) {
    try {
        const response = await fake('http://localhost:3000/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });

        if (!response.ok) {
            throw new Error('Error al enviar el producto');
        }

        return await response.json();
    } catch (error) {
        console.log('Error al enviar producto:', error);
        throw error;
    }
}

export async function eliminarProducto(id) {
    try {
        const response = await fetch(`http://localhost:3000/products/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        throw error;
    }
}
