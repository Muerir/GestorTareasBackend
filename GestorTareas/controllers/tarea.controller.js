const { Tarea } = require('../models');
const { Op } = require('sequelize');

exports.crearTarea = async (req, res) => {
    try {
        const { titulo, descripcion, fechaLimite } = req.body;

        const nuevaTarea = await Tarea.create({
            titulo,
            descripcion,
            fechaLimite,
            UsuarioId: req.usuarioId // viene del middleware JWT
        });

        res.status(201).json(nuevaTarea);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear la tarea', error });
    }
};

exports.editarTarea = async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, estado, fechaLimite } = req.body;

    try {
        const tarea = await Tarea.findOne({ where: { id, UsuarioId: req.usuarioId } });

        if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

        if (tarea.estado === 'completada') {
            return res.status(400).json({ mensaje: 'No se puede modificar una tarea completada' });
        }

        if (estado) {
            if (estado === 'en progreso' && tarea.estado !== 'pendiente') {
                return res.status(400).json({ mensaje: 'Solo se puede cambiar a "en progreso" desde "pendiente"' });
            }
            if (estado === 'pendiente') {
                return res.status(400).json({ mensaje: 'No se puede volver a "pendiente"' });
            }
            tarea.estado = estado;
        }

        if (titulo) tarea.titulo = titulo;
        if (descripcion !== undefined) tarea.descripcion = descripcion;
        if (fechaLimite !== undefined) tarea.fechaLimite = fechaLimite;

        await tarea.save();
        res.json(tarea);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al editar la tarea', error });
    }
};

exports.marcarCompletada = async (req, res) => {
    const { id } = req.params;

    try {
        const tarea = await Tarea.findOne({ where: { id, UsuarioId: req.usuarioId } });

        if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

        if (tarea.estado !== 'en progreso') {
            return res.status(400).json({ mensaje: 'Solo se puede completar una tarea en progreso' });
        }

        tarea.estado = 'completada';
        await tarea.save();

        res.json({ mensaje: 'Tarea completada exitosamente', tarea });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al completar la tarea', error });
    }
};

exports.eliminarTarea = async (req, res) => {
    const { id } = req.params;

    try {
        const tarea = await Tarea.findOne({ where: { id, UsuarioId: req.usuarioId } });

        if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

        if (tarea.estado !== 'completada') {
            return res.status(400).json({ mensaje: 'Solo se pueden eliminar tareas completadas' });
        }

        await tarea.destroy();
        res.json({ mensaje: 'Tarea eliminada exitosamente' });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al eliminar la tarea', error });
    }
};

exports.obtenerTareas = async (req, res) => {
    const { estado, desde, hasta, busqueda } = req.query;

  try {
    const condiciones = {
      UsuarioId: req.usuarioId
    };

    // Filtrar por estado
    if (estado) {
      condiciones.estado = estado;
    }

    // Filtrar por rango de fechas
    if (desde || hasta) {
      condiciones.fechaLimite = {};
      if (desde) {
        condiciones.fechaLimite[Op.gte] = new Date(desde);
      }
      if (hasta) {
        condiciones.fechaLimite[Op.lte] = new Date(hasta);
      }
    }

    // Filtro por texto en título o descripción
    const filtroTexto = busqueda
      ? {
          [Op.or]: [
            { titulo: { [Op.iLike]: `%${busqueda}%` } },
            { descripcion: { [Op.iLike]: `%${busqueda}%` } }
          ]
        }
      : {};

    const tareas = await Tarea.findAll({
      where: {
        ...condiciones,
        ...filtroTexto
      }
    });

    res.json(tareas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener tareas', error });
  }
};

exports.obtenerTareaPorId = async (req, res) => {
    const { id } = req.params;
  
    try {
      const tarea = await Tarea.findOne({
        where: { id, UsuarioId: req.usuarioId }
      });
  
      if (!tarea) {
        return res.status(404).json({ mensaje: 'Tarea no encontrada' });
      }
  
      res.json(tarea);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener la tarea', error });
    }
  };
  