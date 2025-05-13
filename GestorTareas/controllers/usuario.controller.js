require('dotenv').config();
const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

exports.registrar = async (req, res) => {
    try {
        const { nombre, correo, contrasena } = req.body;

        const usuarioExistente = await Usuario.findOne({ where: { correo } });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'El correo ya está registrado' });
        }

        const usuario = await Usuario.create({ nombre, correo, contrasena });

        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return res.status(400).json({ mensaje: mensajes });
        }

        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar el usuario' });
    }
};

exports.iniciarSesion = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        const usuario = await Usuario.findOne({ where: { correo } });
        if (!usuario || !usuario.validarContrasena(contrasena)) {
            return res.status(401).json({ mensaje: 'Correo o Contraseña incorrectos' });
        }

        const token = jwt.sign({ id: usuario.id }, SECRET_KEY, { expiresIn: '2h' });

        res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al iniciar sesión' });
    }
};
