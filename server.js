import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import tripRoutes from "./routes/trips.routes.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:3000",
    "stalwart-quokka-02adde.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);

// Ruta raíz
app.get("/", (req, res) => res.send("🚗 API Wheels (JS) funcionando"));

// Conexión a MongoDB y arranque
const PORT = process.env.PORT || 3000;
const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/wheels";

mongoose
  .connect(MONGO)
  .then(() => {
    console.log(" Conectado a MongoDB");
    app.listen(PORT, () => console.log(` Servidor corriendo en puerto ${PORT}`));
  })
  .catch((err) => {
    console.error(" Error conectando a MongoDB:", err);
    process.exit(1);
  });
