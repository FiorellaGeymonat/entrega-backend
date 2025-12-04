# Entrega Final – Backend I

Proyecto de e-commerce básico desarrollado con **Node.js, Express y MongoDB (Mongoose)**.  
Incluye CRUD de productos, gestión completa de carritos y vistas Handlebars.

## 🚀 Tecnologías
- Node.js + Express  
- MongoDB + Mongoose  
- Handlebars  
- Dotenv  

## 📦 Funcionalidades principales
### Productos
- Listado con **paginación**, filtros y ordenamiento (`limit`, `page`, `sort`, `query`)
- Endpoints CRUD: GET, POST, PUT, DELETE
- Respuesta con formato solicitado por la consigna

### Carrito
- Crear carrito
- Agregar productos, actualizar cantidad, eliminar producto y **vaciar carrito**
- `GET /api/carts/:cid` devuelve productos con **populate**

### Vistas (Handlebars)
- `/products`: muestra los productos paginados
- Botón **Agregar al carrito** (POST desde la vista)
- `/carts/:cid`: muestra el carrito con productos populados

## 🛠️ Correr el proyecto
1. Instalar dependencias: npm install
2. Configurar variables en `.env` (ver `.env.sample`)
3. Ejecutar servidor: node src/server.js
4. 4. Healthcheck:  
`http://localhost:8080/health`

## 📌 Notas
- La persistencia principal es **MongoDB**
- El proyecto NO incluye `node_modules`
- `.env` está ignorado para seguridad

