const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/usuario.middleware');
const tareaController = require('../controllers/tarea.controller');

router.use(authMiddleware);

router.post('/', tareaController.crearTarea);
router.get('/', tareaController.obtenerTareas);
router.get('/:id', tareaController.obtenerTareaPorId);
router.put('/:id', tareaController.editarTarea);
router.put('/:id/completar', tareaController.marcarCompletada);
router.delete('/:id', tareaController.eliminarTarea);

module.exports = router;
