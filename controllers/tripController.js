let trips = []; // arreglo temporal donde se guardan los viajes

//  Obtener todos los viajes
export const getTrips = (req, res) => {
  res.json(trips);
};

//  Crear un nuevo viaje
export const createTrip = (req, res) => {
  const { inicio, destino, hora, cupos, tarifa, conductor } = req.body;

  if (!inicio || !destino || !hora || !cupos || !tarifa || !conductor) {
    return res.status(400).json({ message: "❌ Datos del viaje incompletos" });
  }

  const newTrip = {
    id: trips.length + 1,
    inicio,
    destino,
    hora,
    cupos,
    tarifa,
    conductor,
    estado: "disponible"
  };

  trips.push(newTrip);
  res.status(201).json({ message: "✅ Viaje creado correctamente", trip: newTrip });
};

// ✅ Actualizar cupos de un viaje
export const updateTrip = (req, res) => {
  const id = parseInt(req.params.id);
  const { cupos } = req.body;

  const trip = trips.find(t => t.id === id);
  if (!trip) {
    return res.status(404).json({ message: "❌ Viaje no encontrado" });
  }

  trip.cupos = cupos;
  if (trip.cupos <= 0) trip.estado = "lleno";

  res.json({ message: "✅ Viaje actualizado correctamente", trip });
};
