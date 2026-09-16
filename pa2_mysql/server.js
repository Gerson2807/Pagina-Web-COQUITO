// server.js — Backend del módulo de Autenticación (registro / login)
// Inversiones Coquito · Producto Académico N.º 02 — versión MySQL
//
// Igual que la versión PostgreSQL: usa el módulo nativo "http" de Node.js
// (no requiere Express). Aquí SÍ puedes instalar dependencias npm sin
// restricciones (a diferencia del entorno de prueba en la nube), así que
// si prefieres, puedes migrar esto a Express sin problema — la lógica de
// las rutas sería la misma.

const http = require("http");
const fs = require("fs");
const path = require("path");
const { queryObjects, query } = require("./db.js");
const { hashPassword, verifyPassword } = require("./auth.js");

const PORT = process.env.PORT || 4000;
const PUBLIC_DIR = path.join(__dirname, "public");

const ROLES_VALIDOS = ["gerente", "admin_abarrotes", "admin_confiteria", "cajero", "cliente"];

function sendJSON(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

// ---------------------------------------------------------------
// POST /api/register — crea un nuevo usuario en la base de datos
// ---------------------------------------------------------------
async function handleRegister(req, res) {
  const body = await readBody(req);
  const { nombres, apellidos, email, password, rol } = body;

  if (!nombres || !apellidos || !email || !password) {
    return sendJSON(res, 400, { ok: false, error: "Todos los campos son obligatorios." });
  }
  const rolFinal = ROLES_VALIDOS.includes(rol) ? rol : "cliente";

  const existentes = await queryObjects(
    "SELECT id_usuario FROM usuarios WHERE email = ?",
    [email.toLowerCase().trim()],
    ["id_usuario"]
  );
  if (existentes.length > 0) {
    return sendJSON(res, 409, { ok: false, error: "Ese correo ya está registrado." });
  }

  const password_hash = hashPassword(password);
  // MySQL no soporta "RETURNING": se inserta y luego se recupera la fila
  // con el id_usuario que el propio motor generó (result.insertId).
  const result = await query(
    `INSERT INTO usuarios (nombres, apellidos, email, password_hash, rol)
     VALUES (?, ?, ?, ?, ?)`,
    [nombres.trim(), apellidos.trim(), email.toLowerCase().trim(), password_hash, rolFinal]
  );
  const nuevos = await queryObjects(
    "SELECT id_usuario, nombres, apellidos, email, rol, creado_en FROM usuarios WHERE id_usuario = ?",
    [result.insertId],
    ["id_usuario", "nombres", "apellidos", "email", "rol", "creado_en"]
  );
  sendJSON(res, 201, { ok: true, usuario: nuevos[0] });
}

// ---------------------------------------------------------------
// POST /api/login — valida credenciales contra la base de datos
// ---------------------------------------------------------------
async function handleLogin(req, res) {
  const body = await readBody(req);
  const { email, password } = body;
  if (!email || !password) {
    return sendJSON(res, 400, { ok: false, error: "Correo y contraseña son obligatorios." });
  }

  const rows = await queryObjects(
    "SELECT id_usuario, nombres, apellidos, email, password_hash, rol FROM usuarios WHERE email = ?",
    [email.toLowerCase().trim()],
    ["id_usuario", "nombres", "apellidos", "email", "password_hash", "rol"]
  );
  if (rows.length === 0) {
    return sendJSON(res, 401, { ok: false, error: "Credenciales inválidas." });
  }
  const usuario = rows[0];
  const valido = verifyPassword(password, usuario.password_hash);
  if (!valido) {
    return sendJSON(res, 401, { ok: false, error: "Credenciales inválidas." });
  }
  delete usuario.password_hash;
  sendJSON(res, 200, { ok: true, usuario });
}

// ---------------------------------------------------------------
// GET /api/usuarios — lista usuarios registrados (demo/depuración)
// ---------------------------------------------------------------
async function handleListUsuarios(req, res) {
  const rows = await queryObjects(
    "SELECT id_usuario, nombres, apellidos, email, rol, creado_en FROM usuarios ORDER BY id_usuario",
    [],
    ["id_usuario", "nombres", "apellidos", "email", "rol", "creado_en"]
  );
  sendJSON(res, 200, { ok: true, usuarios: rows });
}

// ---------------------------------------------------------------
// GET /api/productos — lista productos (demo del módulo de inventario)
// ---------------------------------------------------------------
async function handleListProductos(req, res) {
  const rows = await queryObjects(
    `SELECT p.id_producto, p.nombre, c.nombre AS categoria, p.precio, p.stock
     FROM productos p JOIN categorias c ON c.id_categoria = p.id_categoria
     ORDER BY p.id_producto`,
    [],
    ["id_producto", "nombre", "categoria", "precio", "stock"]
  );
  sendJSON(res, 200, { ok: true, productos: rows });
}

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };

function serveStatic(req, res) {
  let file = req.url === "/" ? "/login.html" : req.url;
  const filePath = path.join(PUBLIC_DIR, file);
  if (!filePath.startsWith(PUBLIC_DIR)) return sendJSON(res, 403, { ok: false });
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      return res.end("No encontrado");
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "text/plain" });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/api/register") return await handleRegister(req, res);
    if (req.method === "POST" && req.url === "/api/login") return await handleLogin(req, res);
    if (req.method === "GET" && req.url === "/api/usuarios") return await handleListUsuarios(req, res);
    if (req.method === "GET" && req.url === "/api/productos") return await handleListProductos(req, res);
    if (req.method === "GET") return serveStatic(req, res);
    sendJSON(res, 404, { ok: false, error: "Ruta no encontrada." });
  } catch (err) {
    console.error(err);
    sendJSON(res, 500, { ok: false, error: "Error interno del servidor." });
  }
});

server.listen(PORT, () => console.log(`Servidor Coquito escuchando en http://localhost:${PORT}`));
