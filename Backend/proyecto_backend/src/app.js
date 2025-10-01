'use strict'

const express = require('express');
const morgan = require('morgan');
const pkg = require('../package.json');
const cors = require('cors'); // Importa el módulo cors
const usuariosRoutes = require('./routes/usuarios.routes')
const authRoutes = require('./routes/auth.routes');
const usu_rolRoutes = require('./routes/usu_rol.routes');
const productosRoutes = require('./routes/productos.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const ventasRoutes = require('./routes/ventas.routes');
const cajaRoutes = require('./routes/caja.routes');
const socketIo = require('socket.io');
const http = require('http'); // Importa el módulo http para crear el servidor
const app = express();
const multer = require('multer');
const path = require('path');

// Configuración de multer para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directorio donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre del archivo único
  }
});
const upload = multer({ storage: storage });

// Crear un servidor HTTP
const server = http.createServer(app);
// Configura el servidor de Socket.IO con CORS
app.use(cors({
    methods: ['GET', 'POST','PUT','DELETE'],
  }));
const io = socketIo(server, {
  cors: {
    //origin: "http://localhost:4200", // Cambia esta URL al origen de tu aplicación Angular
    origin: ["http://localhost:4200", "http://192.168.0.100:4200"],
    methods: ["GET", "POST","PUT", "DELETE"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

  io.on('connection', (socket) => {
    console.log('-----------------------------------------Un cliente se ha conectado.');

    // Maneja eventos personalizados aquí
    socket.on('evento_personalizado', (data) => {
      console.log('Evento personalizado recibido:', data);
      // Puedes emitir eventos a otros clientes aquí
      io.emit('evento_personalizado', data);
    });

    socket.on('disconnect', () => {
      console.log('Un cliente se ha desconectado.');
    });
  });
  
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });

 
  
app.set('pkg', pkg);

app.use(morgan('dev'));
app.use(express.json());

app.get('/',(req,res) =>{
    res.json({
        name: app.get('pkg').name,
        author: app.get('pkg').author,
        description:app.get('pkg').description,
        version: app.get('pkg').version
    });
})

//Rutas Principales para las API Rest
app.use('/api/usuarios',usuariosRoutes);
app.use('/api/usu_rol',usu_rolRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/productos',productosRoutes);
app.use('/api/categorias',categoriasRoutes);
app.use('/api/ventas',ventasRoutes);
app.use('/api/caja',cajaRoutes);





//export default app;//Exportamos este modulo
module.exports = app;//Exportamos este modulo
app.set('upload', upload);
