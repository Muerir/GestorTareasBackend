const express = require('express');
var path = require('path');
const cors = require('cors');

const app = express();

// Habilitar CORS solo para el frontend en localhost:3001
const allowedOrigins = [
  'http://localhost:3001',
  'https://gestor-de-tareas-silk.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.use('/api/usuario', require('./routes/usuario.routes'));
app.use('/api/tareas', require('./routes/tarea.routes'));

//const PORT = process.env.PORT || 5000;
//app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

module.exports = app;
