import React, { useState, useEffect } from 'react';
import './App.css'; // Importa tu archivo CSS

function App() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await listarProductos();
                setProducts(data);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }


    return (
        <div className="App">
            <h1>Mis Productos</h1>
            <AddProductForm onAddProduct={updateProductList} /> {/* Pasa la función */}
            <div className="products-container">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} onDelete={updateProductList} />
                ))}
            </div>
        </div>
    );
}

const AddProductForm = ({ onAddProduct }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !price || !image) {
            alert('Por favor, llena todos los campos obligatorios.');
            return;
        }

        const newProduct = { name, price: parseFloat(price), image, description };
        try {
            await enviarProducto(newProduct);
            setName('');
            setPrice('');
            setImage('');
            setDescription('');
            onAddProduct(); // Llama a la función para actualizar la lista
        } catch (error) {
            console.error('Error:', error);
            alert('Error al agregar el producto.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Agregar Producto</h2>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del producto" required data-name />
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Precio" required data-price />
            <input type="url" value={image} onChange={e => setImage(e.target.value)} placeholder="URL de la imagen" required data-url />
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción (opcional)" data-description></textarea>
            <button type="submit">Agregar</button>
        </form>
    );
};

const ProductCard = ({ product, onDelete }) => {
    const handleDelete = async () => {
        try {
            await eliminarProducto(product.id);
            onDelete();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el producto.');
        }
    };

    return (
        <div className="card" data-id={product.id}>
            <img className="image" src={product.image} alt={product.name} />
            <div className="card-container--info">
                <p className="name">{product.name}</p> {/* Nombre del producto */}
                <p className="description">{product.description || 'Sin descripción'}</p>
                <div className="card-container--value">
                    <p className="price">${product.price.toFixed(2)}</p>
                    <button onClick={handleDelete}>
                        <img src="./assets/bote-de-basura.png" alt="Eliminar producto" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
