import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cuposReservados: { type: Number, required: true, min: 1 },
    puntoRecogida: { type: String, required: true },
    estado: { type: String, enum: ["pendiente", "confirmado", "cancelado"], default: "pendiente" }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);

