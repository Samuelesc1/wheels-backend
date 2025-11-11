import User from "../models/User.model.js";

// Listar usuarios
import User from "../models/User.model.js";

export const registerUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
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
