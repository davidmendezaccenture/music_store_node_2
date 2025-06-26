const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());

// Servir archivos estáticos

app.use(express.static(path.join(__dirname, "src")));

// API para productos
// Obtener todos los productos
app.get("/api/products", (req, res) => {
  // Leer el archivo de productos (catálogo)
  fs.readFile(
    path.join(__dirname, "src/assets/data/products.json"),
    "utf8",
    (err, data) => {
      // Si ocurre un error al leer el archivo, devolver error 500
      if (err) {
        console.error("Error al leer el archivo de productos:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }
      try {
        // Intentar parsear el JSON de productos
        const products = JSON.parse(data);
        // Devolver el catálogo de productos como respuesta JSON
        res.json(products);
      } catch (parseError) {
        // Si el JSON está corrupto, devolver error
        console.error("Error al parsear el JSON de productos:", parseError);
        res
          .status(500)
          .json({ error: "Error al procesar los datos de productos" });
      }
    }
  );
});
// Servir el archivo register.html cuando se solicite la ruta /register.html
app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/pages/register.html'));    
});   

// Servir index.html para login
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'index.html'));
});

// POST /api/register: registrar un nuevo usuario
app.post("/api/register", (req, res) => {
  // Extraer los datos del body de la petición
  const { username, password, email } = req.body;

  // Validar que todos los campos obligatorios estén presentes
  if (!username || !password || !email) {
    return res.status(400).json({
      error: "Los campos username, password y email son obligatorios.",
    });
  }

  // Validar formato simple de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "El Email no tiene un formato válido." });
  }

  // Ruta al archivo donde se almacenan los usuarios
  const usersPath = path.join(__dirname, "backend/data/users.json");

  // Leer el archivo de usuarios
  fs.readFile(usersPath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error al leer el archivo de usuarios:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    let users = [];
    if (data) {
      try {
        users = JSON.parse(data);
      } catch (parseError) {
        return res
          .status(500)
          .json({ error: "Error al procesar los datos de usuarios" });
      }
    }

    // Comprobar si el username o email ya existen
    const exists = users.some(
      (u) => u.username === username || u.email === email
    );
    if (exists) {
      return res.status(409).json({ error: "El usuario o email ya existen." });
    }

    // Añadir el nuevo usuario
    users.push({ username, password, email });

    // Guardar el array actualizado en el archivo JSON
    fs.writeFile(usersPath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error("Error al guardar usuario:", err);
        return res
          .status(500)
          .json({ error: "No se pudo guardar el usuario." });
      }
      // Responder con éxito
      res.status(201).json({ message: "Usuario registrado correctamente." });
    });
  });
});
// Login
app.post("/api/login", (req, res) => {
  // Extraer los datos del body de la petición
  const { email, password } = req.body;

  // Validar que los campos obligatorios estén presentes
  if (!email || !password) {
    return res.status(400).json({
      error: "Los campos email y password son obligatorios.",
    });
  }

  // Validar formato de email simple
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "El Email no tiene un formato válido." });
  }

  // Ruta al archivo donde se almacenan los usuarios
  const usersPath = path.join(__dirname, "backend/data/users.json");

  // Leer el archivo de usuarios
  fs.readFile(usersPath, "utf8", (err, data) => {
    // Si ocurre un error distinto a que el archivo no exista, devolver error
    if (err && err.code !== "ENOENT") {
      console.error("Error al leer el archivo de usuarios:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (!data) {
      return res.status(404).json({ error: "No hay usuarios registrados." });
    }

    let users = [];
    try {
      // Intentar parsear el JSON de usuarios
      users = JSON.parse(data);
    } catch (parseError) {
      // Si el JSON está corrupto, devolver error
      return res
        .status(500)
        .json({ error: "Error al procesar los datos de usuarios" });
    }

    // Buscar el usuario por email y contraseña
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }
    // Si las credenciales son correctas, devolver el usuario
    res.status(200).json({
      message: `¡Hola, ${user.username}! Login exitoso.`, // Mensaje de bienvenida
      // Devolver solo los datos necesarios del usuario para evitar exponer la contraseña
      user: { username: user.username, email: user.email },
    });
  });
});

// --- ENDPOINTS PARA EL CARRITO ---

// Obtener carrito del usuario
app.get("/api/cart", (req, res) => {
  const user = req.query.user || "guest"; // Por defecto, usuario invitado

  // Ruta al archivo donde se almacenan los carritos
  const cartsPath = path.join(__dirname, "backend/data/carts.json");
  // Leer el archivo de carritos
  fs.readFile(cartsPath, "utf8", (err, data) => {
    // Si ocurre un error al leer el archivo, devuelve error 500
    if (err) {
      console.error("Error al leer el archivo de carritos:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    let carts = {};
    if (data) {
      try {
        // Intentar parsear el JSON de carritos
        carts = JSON.parse(data);
      } catch (parseError) {
        // Si el JSON está corrupto, devolver error
        return res
          .status(500)
          .json({ error: "Error al procesar los datos del carrito" });
      }
    }

    // Obtener el carrito del usuario (o array vacío si no existe)
    const cart = carts[user] || [];
    // Devolver el carrito del usuario
    res.status(200).json(cart);
  });
});

// Guardar carrito del usuario
app.post("/api/cart", (req, res) => {
  const user = req.body.user || "guest"; // Por defecto, usuario invitado
  const items = req.body.items || []; // Items del carrito
  // Validar que los items sean un array
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: "Los items deben ser un array." });
  }

  // Ruta al archivo donde se almacenan los carritos
  const cartsPath = path.join(__dirname, "backend/data/carts.json");
  // Leer el archivo de carritos
  fs.readFile(cartsPath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error al leer el archivo de carritos:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    let carts = {};
    if (data) {
      try {
        // Intentar parsear el JSON de carritos
        carts = JSON.parse(data);
      } catch (parseError) {
        // Si el JSON está corrupto, devolver error
        return res
          .status(500)
          .json({ error: "Error al procesar los datos del carrito" });
      }
    }

    // Actualizar el carrito del usuario
    carts[user] = items;
    // Guardar el carrito actualizado en el archivo
    fs.writeFile(cartsPath, JSON.stringify(carts, null, 2), (err) => {
      if (err) {
        console.error("Error al guardar el carrito:", err);
        return res
          .status(500)
          .json({ error: "No se pudo guardar el carrito." });
      }
      // Responder con éxito
      res.status(200).json({ message: "Carrito guardado correctamente." });
    });
  });
});

// formulario de contacto
app.post("/api/contacto", (req, res) => {
  const { nombre, email, mensaje, telefono } = req.body;
  console.log("Datos recibidos:", req.body);

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  const contacto = {
    nombre,
    email,
    mensaje,
    telefono: telefono || "",
    fecha: new Date().toISOString(),
  };

  const contactosPath = path.join(__dirname, "backend/data/contacto.json");

  fs.readFile(contactosPath, "utf8", (err, data) => {
    let contactos = [];
    if (!err && data) {
      try {
        contactos = JSON.parse(data);
      } catch (parseErr) {
        console.error("Error al parsear contactos anteriores:", parseErr);
      }
    }

    contactos.push(contacto);

    fs.writeFile(contactosPath, JSON.stringify(contactos, null, 2), (err) => {
      if (err) {
        console.error("Error al guardar contacto:", err);
        return res.status(500).json({ error: "No se pudo guardar el mensaje." });
      }

      // Envío de correo
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'riffzonemusicstore@gmail.com',
          pass: 'clwi algp blim osmd'
        }
      });

      const mailOptions = {
        from: '"RiffZone Contacto" <riffzonemusicstore@gmail.com>',
        to: 'riffzonemusicstore@gmail.com',
        subject: 'Mensaje de contacto recibido de RiffZone Contacto',
        text: `
        Nombre: ${nombre}
        Email: ${email}
        Teléfono: ${telefono || "opcional"}
        Mensaje:
        ${mensaje}
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error al enviar el correo:", error);
          return res.status(500).json({ error: "Mensaje guardado, pero error al enviar correo." });
        } else {
          console.log("Correo enviado:", info.response);
          return res.status(200).json({ mensaje: "Mensaje recibido y correo enviado." });
        }
      });
    });
  });
});

// Endpoint para obtener la clave de la API de Google Maps
app.get("/api/google-maps-key", (req, res) => {
  const googleMapsApiKey = "AIzaSyBZixuMMJuXiVXq7GItB6L3puwHJ2wf77E";
  res.json({ apiKey: googleMapsApiKey });
});

// Redirigir la raíz al index.html de pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/pages/index.html"));
});

module.exports = app; // Exportar la app para pruebas
// Esto permite que se pueda importar en tests u otros módulos si es necesario

// Para ejecutar el servidor directamente desde este archivo
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}
