import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  idUniversidad: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  numeroContacto: { type: String, required: true },
  foto: { type: String },
  rol: { type: String, enum: ["pasajero", "conductor"], required: true },
  // campos conductor
  placaVehiculo: { type: String },
  fotoVehiculo: { type: String },
  capacidadVehiculo: { type: Number },
  fotoSOAT: { type: String },
  marca: { type: String },
  modelo: { type: String },
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
