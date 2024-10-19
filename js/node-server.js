// server.js

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Archivo de base de datos
const middlewares = jsonServer.defaults();

// Usar middlewares predeterminados de json-server
server.use(middlewares);

// Puedes agregar tus propios middlewares aquí si es necesario
server.use((req, res, next) => {
  // Puedes agregar lógica personalizada aquí
  console.log('Tiempo:', Date.now());
  next();
});

// Usar el router para manejar las solicitudes
server.use(router);

// Definir el puerto
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server está corriendo en http://localhost:${PORT}`);
});
