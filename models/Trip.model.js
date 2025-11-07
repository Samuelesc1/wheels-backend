import mongoose from "mongoose";

const TripSchema = new mongoose.Schema(
  {
    inicio: { type: String, required: true },
    destino: { type: String, required: true },
    ruta: { type: String },
    hora: { type: String, required: true },
    cupos: { type: Number, required: true },
    tarifa: { type: Number, default: 6000 },
    conductor: { type: String, required: true },
    estado: { type: String, enum: ["disponible", "lleno"], default: "disponible" }
  },
  { timestamps: true }
);

// **AQUI ESTA LO IMPORTANTE**
const Trip = mongoose.model("Trip", TripSchema);
export default Trip;
