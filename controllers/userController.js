let users = []; // arreglo temporal donde se guardan los usuarios

// ✅ REGISTRO DE USUARIO
export const registerUser = (req, res) => {
  const { nombre, correo, password, rol } = req.body;

  if (!nombre || !correo || !password || !rol) {
    return res.status(400).json({ message: "❌ Datos incompletos" });
  }

  const exists = users.find(u => u.correo === correo);
  if (exists) {
    return res.status(400).json({ message: "⚠️ Usuario ya registrado" });
  }

  const newUser = {
    id: users.length + 1,
    nombre,
    correo,
    password,
    rol
  };

  users.push(newUser);
  res.status(201).json({ message: "✅ Usuario registrado correctamente", user: newUser });
};

// ✅ LOGIN DE USUARIO
export const loginUser = (req, res) => {
  const { correo, password } = req.body; // 👈 asegúrate de que diga "password"

  const user = users.find(u => u.correo === correo && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "❌ Credenciales incorrectas" });
  }

  res.json({ message: "✅ Inicio de sesión exitoso", user });
};
