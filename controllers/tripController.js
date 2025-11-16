import Trip from "../models/Trip.model.js";
import User from "../models/User.model.js";

// Obtener viajes con filtros
export const getTrips = async (req, res) => {
  try {
    const { inicio, cuposDisponibles } = req.query;
    const query = { estado: "disponible" };

    // Filtro por punto de inicio
    if (inicio) {
      query.inicio = { $regex: inicio, $options: "i" };
    }

    // Filtro por cupos disponibles mínimos
    if (cuposDisponibles) {
      query.cuposDisponibles = { $gte: Number(cuposDisponibles) };
    }

    const trips = await Trip.find(query)
      .populate("conductor", "nombre apellido correo numeroContacto placaVehiculo marca modelo capacidadVehiculo fotoVehiculo")
      .sort({ createdAt: -1 })
      .lean();

    return res.json(trips);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en servidor" });
  }
};

// Obtener viaje por ID
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("conductor", "nombre apellido correo numeroContacto placaVehiculo marca modelo capacidadVehiculo fotoVehiculo")
      .lean();

    if (!trip) {
      return res.status(404).json({ message: "Viaje no encontrado" });
    }

    return res.json(trip);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en servidor" });
  }
};

// Crear viaje (solo conductores)
export const createTrip = async (req, res) => {
  try {
    const { inicio, destino, ruta, hora, cupos, tarifa } = req.body;
    const conductorId = req.user._id;

    if (!inicio || !destino || !hora || !cupos) {
      return res.status(400).json({ message: "Datos incompletos del viaje" });
    }

    // Verificar que el usuario es conductor
    if (req.user.rol !== "conductor") {
      return res.status(403).json({ message: "Solo los conductores pueden crear viajes" });
    }

    // Verificar que el conductor tiene un vehículo registrado
    if (!req.user.placaVehiculo) {
      return res.status(400).json({ message: "Debes tener un vehículo registrado para crear viajes" });
    }

    const newTrip = await Trip.create({
      inicio,
      destino,
      ruta: ruta || "",
      hora,
      cupos: Number(cupos),
      cuposDisponibles: Number(cupos),
      tarifa: Number(tarifa) || 6000,
      conductor: conductorId
    });

    const tripPopulated = await Trip.findById(newTrip._id)
      .populate("conductor", "nombre apellido correo numeroContacto placaVehiculo marca modelo")
      .lean();

    return res.status(201).json({ message: "Viaje creado exitosamente", trip: tripPopulated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en servidor", error: err.message });
  }
};

// Obtener viajes del conductor
export const getMyTrips = async (req, res) => {
  try {
    const conductorId = req.user._id;
    const trips = await Trip.find({ conductor: conductorId })
      .populate("conductor", "nombre apellido")
      .sort({ createdAt: -1 })
      .lean();

    return res.json(trips);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en servidor" });
  }
};

// Actualizar viaje
export const updateTrip = async (req, res) => {
  try {
    const id = req.params.id;
    const trip = await Trip.findById(id);
    
    if (!trip) {
      return res.status(404).json({ message: "Viaje no encontrado" });
    }

    // Verificar que el usuario es el conductor del viaje
    if (trip.conductor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const { inicio, destino, ruta, hora, cupos, tarifa } = req.body;
    
    if (inicio) trip.inicio = inicio;
    if (destino) trip.destino = destino;
    if (ruta !== undefined) trip.ruta = ruta;
    if (hora) trip.hora = hora;
    if (tarifa) trip.tarifa = Number(tarifa);
    
    if (cupos !== undefined) {
      const newCupos = Number(cupos);
      const diferencia = newCupos - trip.cupos;
      trip.cupos = newCupos;
      trip.cuposDisponibles = Math.max(0, trip.cuposDisponibles + diferencia);
    }

    await trip.save();

    return res.json({ message: "Viaje actualizado", trip });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en servidor" });
  }
};

// Cancelar viaje
export const cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ message: "Viaje no encontrado" });
    }

    if (trip.conductor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No autorizado" });
    }

    trip.estado = "cancelado";
    await trip.save();

    return res.json({ message: "Viaje cancelado", trip });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en servidor" });
  }
};
