const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActividadesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    categoria: {
      type: String,
      required: true,
      enum: [
        "educacion",
        "salud",
        "medioambiente",
        "derechos_humanos",
        "desarrollo_comunitario",
        "emergencias",
        "cultura",
        "deporte",
        "inclusion_social",
        "administrativa",
        "comunicacion",
        "tecnologia",
        "otra",
      ],
    },
    tipoDeActividad: {
      type: String,
      required: true,
      enum: ["presencial", "virtual", "mixta"],
    },
    frecuencia: {
      type: String,
      enum: [
        "diaria",
        "semanal",
        "quincenal",
        "mensual",
        "trimestral",
        "puntual",
        "flexible",
      ],
      default: "flexible",
    },
    duracionEstimada: {
      horas: {
        type: Number,
        required: true,
      },
      unidadTiempo: {
        type: String,
        enum: ["hora", "dia", "semana", "mes"],
        default: "hora",
      },
    },
    habilidadesRequeridas: [
      {
        type: String,
        trim: true,
      },
    ],
    conocimientosNecesarios: [
      {
        type: String,
        trim: true,
      },
    ],
    materialesNecesarios: [
      {
        type: String,
        trim: true,
      },
    ],
    objetivos: [
      {
        type: String,
        trim: true,
      },
    ],

    contactoResponsable: {
      nombre: String,
      email: String,
      telefono: String,
    },

    ubicacion: {
      direccion: String,
      coordenadas: {
        lat: Number,
        lng: Number,
      },
      notas: String,
    },
    proyecto: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    participantes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ActividadVoluntario = mongoose.model(
  "ActividadVoluntario",
  ActividadesSchema
);

module.exports = ActividadVoluntario;
