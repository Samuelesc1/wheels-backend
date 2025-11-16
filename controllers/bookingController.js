import Booking from "../models/Booking.model.js";
import Trip from "../models/Trip.model.js";

// Crear reserva
export const createBooking = async (req, res) => {
  try {
    const { tripId, cuposReservados, puntoRecogida } = req.body;
    const passengerId = req.user._id;

    if (!tripId || !cuposReservados || !puntoRecogida) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Viaje no encontrado" });
    }

    if (trip.estado === "lleno") {
      return res.status(400).json({ message: "El viaje está lleno" });
    }

    if (trip.cuposDisponibles < cuposReservados) {
      return res.status(400).json({ 
        message: `Solo hay ${trip.cuposDisponibles} cupos disponibles` 
      });
    }

    // Verificar si el pasajero ya tiene una reserva en este viaje
    const existingBooking = await Booking.findOne({ 
      trip: tripId, 
      passenger: passengerId,
      estado: { $in: ["pendiente", "confirmado"] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Ya tienes una reserva en este viaje" });
    }

    // Crear reserva
    const booking = await Booking.create({
      trip: tripId,
      passenger: passengerId,
      cuposReservados: Number(cuposReservados),
      puntoRecogida
    });

    // Actualizar cupos disponibles del viaje
    trip.cuposDisponibles -= Number(cuposReservados);
    await trip.save();

    const bookingPopulated = await Booking.findById(booking._id)
      .populate("trip", "inicio destino hora tarifa")
      .populate("passenger", "nombre apellido correo numeroContacto");

    return res.status(201).json({ 
      message: "Reserva creada exitosamente", 
      booking: bookingPopulated 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en servidor", error: err.message });
  }
};

// Obtener reservas del usuario
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ passenger: userId })
      .populate({
        path: "trip",
        populate: { path: "conductor", select: "nombre apellido correo numeroContacto placaVehiculo marca modelo" }
      })
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en servidor" });
  }
};

// Cancelar reserva
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    if (booking.passenger.toString() !== userId.toString()) {
      return res.status(403).json({ message: "No autorizado" });
    }

    // Devolver cupos al viaje
    const trip = await Trip.findById(booking.trip);
    if (trip) {
      trip.cuposDisponibles += booking.cuposReservados;
      if (trip.estado === "lleno") {
        trip.estado = "disponible";
      }
      await trip.save();
    }

    booking.estado = "cancelado";
    await booking.save();

    return res.json({ message: "Reserva cancelada", booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en servidor" });
  }
};

