import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import tripRoutes from "./routes/trips.routes.js";
import bookingRoutes from "./routes/bookings.routes.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://stalwart-quokka-02adde.netlify.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Aumentar el límite del body para permitir imágenes base64 en registros de conductores
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/bookings", bookingRoutes);

// Ruta raíz
app.get("/", (req, res) => res.send("🚗 API Wheels (JS) funcionando"));

// Conexión a MongoDB y arranque
const PORT = process.env.PORT || 3000;
const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/wheels";

// Verificar que MONGO_URI esté configurado
if (!process.env.MONGO_URI) {
  console.error("⚠️  MONGO_URI no está configurado en las variables de entorno");
  console.error("   Configura MONGO_URI en Render.com → Environment");
}

console.log("🔗 Intentando conectar a MongoDB...");
console.log("   URI configurada:", MONGO.replace(/:[^:@]+@/, ':****@')); // Oculta la contraseña en los logs

mongoose
  .connect(MONGO)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err.message);
    if (err.message.includes("authentication failed")) {
      console.error("\n💡 Posibles soluciones:");
      console.error("   1. Verifica el usuario y contraseña en MongoDB Atlas");
      console.error("   2. Verifica que MONGO_URI esté correctamente configurado en Render");
      console.error("   3. Si la contraseña tiene caracteres especiales, codifícalos en la URL");
      console.error("   4. Verifica Network Access en MongoDB Atlas (debe permitir 0.0.0.0/0)");
    }
    process.exit(1);
  });
