import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { CreateUserDTO } from "../dtos/createUser.dto.js";
import { LoginUserDTO } from "../dtos/loginUser.dto.js";
import { UserEntity } from "../entities/User.entity.js";

const JWT_SECRET = process.env.JWT_SECRET || "secretKey";

export const register = async (req, res) => {
  try {
    const data = CreateUserDTO(req.body);

    // Validaciones mínimas
    if (!data.nombre || !data.correo || !data.password || !data.rol) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const exists = await User.findOne({ correo: data.correo });
    if (exists) return res.status(400).json({ message: "Usuario ya registrado" });

    const hashed = await bcrypt.hash(data.password, 10);
    data.password = hashed;

    const userDoc = await User.create(data);
    const userEntity = new UserEntity({ id: userDoc._id, ...userDoc.toObject() });

    // No devolver password
    const { password, ...safe } = userDoc.toObject();
    return res.status(201).json({ message: "Usuario registrado", user: safe });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en servidor", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, password } = LoginUserDTO(req.body);
    if (!correo || !password) return res.status(400).json({ message: "Datos incompletos" });

    const user = await User.findOne({ correo });
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign({ id: user._id, rol: user.rol }, JWT_SECRET, { expiresIn: "1d" });

    const { password: pw, ...safe } = user.toObject();
    return res.json({ message: "Login exitoso", token, user: safe });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en servidor", error: err.message });
  }
};
