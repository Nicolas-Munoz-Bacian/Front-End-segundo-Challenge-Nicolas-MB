const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Almacenamiento de productos en memoria
let products = [
  { id: 1, name: 'Leche Soprole', price: 1250, image: 'url-a-imagen-1' },
  { id: 2, name: 'Mermelada de Mango', price: 2500, image: 'url-a-imagen-2' },
  { id: 3, name: 'Zapatos de bebe', price: 5000, image: 'url-a-imagen-3'}
];

// Rutas CRUD

// Obtener todos los productos
app.get('/products', (req, res) => {
  res.json(products);
});

// Agregar un nuevo producto
app.post('/products', (req, res) => {
  const { name, price, image } = req.body;
  if (!name || !price || !image) {
    return res.status(400).json({ error: 'Por favor, envía todos los datos del producto.' });
  }
  const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const newProduct = { id: newId, name, price, image };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Actualizar un producto por ID
app.put('/products/:id', (req, res) => {
  const { name, price, image } = req.body;
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  if (!name || !price || !image) {
    return res.status(400).json({ error: 'Por favor, envía todos los datos del producto.' });
  }

  product.name = name;
  product.price = price;
  product.image = image;
  res.json(product);
});

// Eliminar un producto por ID
app.delete('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(product => product.id === productId);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  products.splice(productIndex, 1);
  res.status(204).send();
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
