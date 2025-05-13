const express = require('express');
var path = require('path');

const app = express();

app.use(express.json());

app.use('/api/usuario', require('./routes/usuario.routes'));
app.use('/api/tareas', require('./routes/tarea.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

module.exports = app;
