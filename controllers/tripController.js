import Trip from "../models/Trip.model.js";

export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find().lean();
    return res.json(trips);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en servidor" });
  }
};

export const createTrip = async (req, res) => {
  try {
    const { inicio, destino, ruta, hora, cupos, tarifa, conductor } = req.body;
    if (!inicio || !destino || !hora || !cupos || !conductor) {
      return res.status(400).json({ message: "Datos incompletos del viaje" });
    }

    const newTrip = await Trip.create({
      inicio, destino, ruta, hora, cupos: Number(cupos), tarifa: Number(tarifa) || 6000, conductor
    });

    return res.status(201).json({ message: "Viaje creado", trip: newTrip });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en servidor" });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const id = req.params.id;
    const { cupos } = req.body;
    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ message: "Viaje no encontrado" });

    trip.cupos = Number(cupos);
    if (trip.cupos <= 0) trip.estado = "lleno";
    await trip.save();

    return res.json({ message: "Viaje actualizado", trip });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en servidor" });
  }
};
