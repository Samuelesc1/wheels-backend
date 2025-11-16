import mongoose from "mongoose";

const TripSchema = new mongoose.Schema(
  {
    inicio: { type: String, required: true },
    destino: { type: String, required: true },
    ruta: { type: String },
    hora: { type: String, required: true },
    cupos: { type: Number, required: true },
    cuposDisponibles: { type: Number, required: true },
    tarifa: { type: Number, default: 6000 },
    conductor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    estado: { type: String, enum: ["disponible", "lleno", "cancelado"], default: "disponible" }
  },
  { timestamps: true }
);

// Middleware para actualizar estado cuando cupos disponibles llegan a 0
TripSchema.pre("save", function(next) {
  if (this.cuposDisponibles <= 0) {
    this.estado = "lleno";
  } else if (this.estado === "lleno" && this.cuposDisponibles > 0) {
    this.estado = "disponible";
  }
  next();
});

const Trip = mongoose.model("Trip", TripSchema);
export default Trip;
