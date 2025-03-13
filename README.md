# VolunTrack (Servidor)

Este proyecto es el backend de una aplicación web, desarrollado con Node.js, Express y MongoDB. A continuación, se detallan las principales tecnologías y dependencias utilizadas.

## Tecnologías Utilizadas

### Dependencias Principales

- **Express**: Framework de Node.js para construir aplicaciones web y APIs. Versión utilizada: `^4.21.2`.
- **Mongoose**: Biblioteca de Node.js para modelar objetos MongoDB. Versión utilizada: `^8.11.0`.
- **bcrypt**: Biblioteca para el hashing de contraseñas. Versión utilizada: `^5.1.1`.
- **jsonwebtoken**: Implementación de JSON Web Tokens (JWT) para autenticación. Versión utilizada: `^9.0.2`.
- **express-jwt**: Middleware para validar JWT en Express. Versión utilizada: `^8.5.1`.
- **cors**: Middleware para habilitar CORS (Cross-Origin Resource Sharing). Versión utilizada: `^2.8.5`.
- **cookie-parser**: Middleware para manejar cookies en Express. Versión utilizada: `^1.4.7`.
- **dotenv**: Carga variables de entorno desde un archivo `.env`. Versión utilizada: `^16.4.7`.
- **morgan**: Middleware para el registro de solicitudes HTTP. Versión utilizada: `^1.10.0`.

### Dependencias de Desarrollo

- **nodemon**: Herramienta para reiniciar automáticamente el servidor durante el desarrollo. Versión utilizada: `^3.1.9`.

### Scripts Disponibles

- `npm start`: Inicia el servidor utilizando `node server.js`.
- `npm run dev`: Inicia el servidor en modo de desarrollo utilizando `nodemon server.js`.
