const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio."],
    },
    edad: {
      type: Number,
    },
    telefono: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    rol: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
