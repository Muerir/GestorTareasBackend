const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

router.post('/registro', usuarioController.registrar);
router.post('/login', usuarioController.iniciarSesion);

module.exports = router;