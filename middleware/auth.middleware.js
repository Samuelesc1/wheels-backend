import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "secretKey";

export const authenticate = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    
    // Si viene como "Bearer token", extraer solo el token
    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ message: "No autorizado para esta acción" });
    }
    next();
  };
};

