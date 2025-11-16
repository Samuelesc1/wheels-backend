import User from "../models/User.model.js";

// Obtener perfil del usuario autenticado
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").lean();
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en servidor" });
  }
};

// Obtener usuario por id
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en servidor" });
  }
};

// Actualizar perfil
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    // Si está cambiando a conductor, validar que tenga datos del vehículo
    if (updates.rol === "conductor") {
      if (!updates.placaVehiculo || !updates.marca || !updates.modelo || !updates.capacidadVehiculo) {
        return res.status(400).json({ 
          message: "Para ser conductor debes proporcionar: placa, marca, modelo y capacidad del vehículo" 
        });
      }
    }

    // Si ya es conductor y está actualizando datos del vehículo, validar que solo tenga uno
    const user = await User.findById(userId);
    if (user.rol === "conductor" && updates.placaVehiculo && updates.placaVehiculo !== user.placaVehiculo) {
      // Verificar que no haya otro usuario con esa placa
      const existingDriver = await User.findOne({ 
        placaVehiculo: updates.placaVehiculo,
        _id: { $ne: userId }
      });
      if (existingDriver) {
        return res.status(400).json({ message: "Esta placa ya está registrada por otro conductor" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    return res.json({ message: "Perfil actualizado", user: updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en servidor", error: err.message });
  }
};

// Cambiar rol de usuario
export const changeRole = async (req, res) => {
  try {
    const userId = req.user._id;
    const { newRole } = req.body;

    if (!["pasajero", "conductor"].includes(newRole)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const user = await User.findById(userId);

    // Si está cambiando a conductor, debe tener datos del vehículo
    if (newRole === "conductor") {
      if (!user.placaVehiculo || !user.marca || !user.modelo || !user.capacidadVehiculo) {
        return res.status(400).json({ 
          message: "Para ser conductor debes tener un vehículo registrado. Actualiza tu perfil primero." 
        });
      }
    }

    user.rol = newRole;
    await user.save();

    const { password: _, ...safeUser } = user.toObject();

    return res.json({ 
      message: `Rol cambiado a ${newRole === "conductor" ? "conductor" : "pasajero"}`, 
      user: safeUser 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en servidor", error: err.message });
  }
};
