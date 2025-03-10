const express = require("express");
const router = express.Router();
const Project = require("../models/Project.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const isAdmin = require("../middleware/isAdmin.middleware.js");

// GET - Obtener todos los proyectos
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener proyectos", error: error.message });
  }
});
// GET - Obtener proyectos por organización
router.get("/organization/:organizationName", async (req, res) => {
  try {
    const organizationName = req.params.organizationName;
    const projects = await Project.find({ organizacion: organizationName });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los proyectos de la organización",
      error: error.message,
    });
  }
});
// GET - Obtener un proyecto específico por ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    res.status(200).json(project);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el proyecto", error: error.message });
  }
});

// POST - Crear un nuevo proyecto (solo admin)
router.post("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al crear el proyecto", error: error.message });
  }
});

// PUT - Actualizar un proyecto (solo admin)
router.put("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({
      message: "Error al actualizar el proyecto",
      error: error.message,
    });
  }
});

// DELETE - Eliminar un proyecto (solo admin)
router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const projectId = req.params.id;

    // Primero, eliminar el proyecto de los proyectos_asignados de todos los usuarios
    await User.updateMany(
      { proyectos_asignados: projectId },
      { $pull: { proyectos_asignados: projectId } }
    );

    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    res.status(200).json({ message: "Proyecto eliminado con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el proyecto", error: error.message });
  }
});

// POST - Unirse a un proyecto
router.post("/:id/join", isAuthenticated, async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.payload._id; // Usar el ID del payload JWT

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    // Verificar si el usuario ya está en el proyecto
    const user = await User.findById(userId);
    if (user.projects.includes(projectId)) {
      return res
        .status(400)
        .json({ message: "Ya estás registrado en este proyecto" });
    }

    // Añadir el proyecto al usuario
    await User.findByIdAndUpdate(userId, {
      $push: { projects: projectId },
    });

    // Incrementar el número de voluntarios
    await Project.findByIdAndUpdate(projectId, {
      $inc: { "recursos.voluntarios": 1 },
    });

    res.status(200).json({ message: "Te has unido al proyecto con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al unirse al proyecto", error: error.message });
  }
});

// PATCH - Abandonar un proyecto
router.patch("/:id/leave", isAuthenticated, async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.payload._id; // Usar el ID del payload JWT

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    // Verificar si el usuario está en el proyecto
    const user = await User.findById(userId);
    if (!user.projects.includes(projectId)) {
      return res
        .status(400)
        .json({ message: "No estás registrado en este proyecto" });
    }

    // Eliminar el proyecto del usuario
    await User.findByIdAndUpdate(userId, {
      $pull: { projects: projectId },
    });

    // Decrementar el número de voluntarios si es mayor que 0
    if (project.recursos.voluntarios > 0) {
      await Project.findByIdAndUpdate(projectId, {
        $inc: { "recursos.voluntarios": -1 },
      });
    }

    res.status(200).json({ message: "Has abandonado el proyecto con éxito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al abandonar el proyecto",
      error: error.message,
    });
  }
});

module.exports = router;
