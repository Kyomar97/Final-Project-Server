const { Schema, model } = require("mongoose");

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del programa es obligatorio."],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, "La descripción del programa es obligatoria."],
    },
    objetivo: {
      type: String,
      required: [true, "El objetivo del programa es obligatorio."],
    },
    ubicacion: {
      isla: {
        type: String,
        required: [true, "La isla es obligatoria."],
      },
      municipio: {
        type: String,
        required: [true, "El municipio es obligatorio."],
      },
    },
    fecha_inicio: {
      type: Date,
      required: [true, "La fecha de inicio es obligatoria."],
    },
    fecha_fin: {
      type: Date,
      required: [true, "La fecha de finalización es obligatoria."],
    },
    estado: {
      type: String,
      required: [true, "El estado del programa es obligatorio."],
      enum: ["activo", "pendiente", "finalizado", "cancelado"],
      default: "pendiente",
    },
    beneficiarios: {
      type: Number,
      default: 0,
    },
    recursos: {
      presupuesto: {
        type: Number,
      },
      financiadores: {
        type: [String],
        default: [],
      },
      voluntarios: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Projects = model("Project", projectSchema);

module.exports = Projects;
