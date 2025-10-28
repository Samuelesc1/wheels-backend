import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import tripRoutes from "./routes/trips.js";

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🚗 API Wheels funcionando correctamente");
});

// Rutas principales
app.use("/api", userRoutes);
app.use("/api", tripRoutes);

const PORT = process.env.PORT || 3000;

// ⬇️ ESTA LÍNEA ES LA QUE ARRANCA EL SERVIDOR
app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));
