const express = require("express");
const router = express.Router();
const Project = require("../models/Project.model.js");
const User = require("../models/User.model.js");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const isAdmin = require("../middleware/isAdmin.middleware.js");
const ActividadVoluntario = require("../models/Actividades.model.js");

// Crear una nueva actividad dentro de un proyecto
router.post("/:projectId/actividades", isAuthenticated, async (req, res) => {
  try {
    const { projectId } = req.params;
    const actividadData = req.body;

    // Verificar que el proyecto exista
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    // Crear la actividad y vincularla al proyecto
    const nuevaActividad = await ActividadVoluntario.create({
      ...actividadData,
      proyecto: projectId,
    });

    res.status(201).json(nuevaActividad);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creando la actividad", error });
  }
});

// Obtener todas las actividades de un proyecto
router.get("/:projectId/actividades", async (req, res) => {
  try {
    const { projectId } = req.params;
    const actividades = await ActividadVoluntario.find({ proyecto: projectId });
    res.status(200).json(actividades);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo actividades", error });
  }
});

// Inscribirse en una actividad
router.post("/:actividadId/inscribirse", isAuthenticated, async (req, res) => {
  try {
    const { actividadId } = req.params;
    const userId = req.payload._id;

    const actividad = await ActividadVoluntario.findById(actividadId);
    if (!actividad) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    if (actividad.participantes && actividad.participantes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "Ya estás inscrito en esta actividad" });
    }

    if (!actividad.participantes) {
      actividad.participantes = [];
    }

    actividad.participantes.push(userId);
    await actividad.save();

    res.status(200).json({ message: "Inscripción exitosa", actividad });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error inscribiéndose en la actividad", error });
  }
});

// Desapuntarse de una actividad
router.post(
  "/:actividadId/desinscribirse",
  isAuthenticated,
  async (req, res) => {
    try {
      const { actividadId } = req.params;
      const userId = req.payload._id;

      const actividad = await ActividadVoluntario.findById(actividadId);
      if (!actividad) {
        return res.status(404).json({ message: "Actividad no encontrada" });
      }

      if (!actividad.participantes.includes(userId)) {
        return res
          .status(400)
          .json({ message: "No estás inscrito en esta actividad" });
      }

      actividad.participantes = actividad.participantes.filter(
        (id) => id.toString() !== userId
      );
      await actividad.save();

      res.status(200).json({ message: "Desinscripción exitosa", actividad });
    } catch (error) {
      res.status(500).json({ message: "Error al desinscribirse", error });
    }
  }
);

// Obtener las actividades en las que un usuario está inscrito
router.get("/mis-actividades", isAuthenticated, async (req, res) => {
  try {
    const userId = req.payload._id;
    const actividades = await ActividadVoluntario.find({
      participantes: userId,
    });
    res.status(200).json(actividades);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error obteniendo actividades del usuario", error });
  }
});

// Eliminar una actividad de un proyecto
router.delete("/:actividadId", isAuthenticated, async (req, res) => {
  try {
    const { actividadId } = req.params;
    const actividad = await ActividadVoluntario.findById(actividadId);
    if (!actividad) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    await ActividadVoluntario.findByIdAndDelete(actividadId);
    res.status(200).json({ message: "Actividad eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando la actividad", error });
  }
});

// Modificar información de una actividad
router.put("/:actividadId", isAuthenticated, async (req, res) => {
  try {
    const { actividadId } = req.params;
    const updateData = req.body;

    // Verificar si la actividad existe
    const actividad = await ActividadVoluntario.findById(actividadId);
    if (!actividad) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    // Aplicar actualización con $set para evitar errores de formato
    const actividadActualizada = await ActividadVoluntario.findByIdAndUpdate(
      actividadId,
      { $set: updateData }, // <<--- Aquí usamos $set
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Actividad actualizada",
      actividad: actividadActualizada,
    });
  } catch (error) {
    console.error("Error modificando la actividad:", error);
    res.status(500).json({
      message: "Error modificando la actividad",
      error: error.message,
    });
  }
});

module.exports = router;
