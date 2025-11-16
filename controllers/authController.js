import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "secretKey";

export const register = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      idUniversidad,
      correo,
      numeroContacto,
      password,
      rol,
      foto,
      placaVehiculo,
      fotoVehiculo,
      capacidadVehiculo,
      fotoSOAT,
      marca,
      modelo
    } = req.body;

    if (!nombre || !correo || !password || !rol) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const exists = await User.findOne({ correo });
    if (exists) {
      return res.status(400).json({ message: "Usuario ya registrado" });
    }

    // Validar que si es conductor, tenga todos los datos del vehículo
    if (rol === "conductor") {
      if (!placaVehiculo || !marca || !modelo || !capacidadVehiculo) {
        return res.status(400).json({ 
          message: "Los conductores deben proporcionar: placa, marca, modelo y capacidad del vehículo" 
        });
      }

      // Validar que la placa no esté ya registrada (un conductor = un vehículo)
      const existingDriver = await User.findOne({ placaVehiculo });
      if (existingDriver) {
        return res.status(400).json({ message: "Esta placa ya está registrada por otro conductor" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nombre,
      apellido,
      idUniversidad,
      correo,
      numeroContacto,
      password: hashedPassword,
      rol,
      foto,
      placaVehiculo: rol === "conductor" ? placaVehiculo : undefined,
      fotoVehiculo: rol === "conductor" ? fotoVehiculo : undefined,
      capacidadVehiculo: rol === "conductor" ? Number(capacidadVehiculo) : undefined,
      fotoSOAT: rol === "conductor" ? fotoSOAT : undefined,
      marca: rol === "conductor" ? marca : undefined,
      modelo: rol === "conductor" ? modelo : undefined
    });

    const { password: _, ...safeUser } = newUser.toObject();

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: safeUser,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error en servidor",
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const user = await User.findOne({ correo });
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: _, ...safeUser } = user.toObject();

    res.json({
      message: "Login exitoso",
      token,
      user: safeUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en servidor", error: err.message });
  }
};

