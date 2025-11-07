import User from "../models/User.model.js";

// Listar usuarios
export const listUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    return res.json(users);
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
