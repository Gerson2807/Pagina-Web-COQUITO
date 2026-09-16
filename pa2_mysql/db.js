// db.js — Módulo de conexión a la base de datos (MySQL)
// Inversiones Coquito · Producto Académico N.º 02 — versión MySQL
//
// Usa el driver oficial "mysql2" (npm install mysql2), con un pool de
// conexiones reutilizable. query() ejecuta cualquier sentencia con
// parámetros "?"; queryObjects() además selecciona columnas puntuales
// para mantener la misma interfaz que usan auth.js y server.js.

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "coquito_app",
  password: process.env.DB_PASSWORD || "coquito_2026",
  database: process.env.DB_NAME || "coquito_db",
  waitForConnections: true,
  connectionLimit: 10,
});

// Ejecuta una sentencia SQL parametrizada.
// - SELECT devuelve un arreglo de filas (objetos con nombre de columna).
// - INSERT/UPDATE/DELETE devuelven un ResultSetHeader (insertId, affectedRows).
async function query(sql, params = []) {
  const [result] = await pool.execute(sql, params);
  return result;
}

// Azúcar sintáctico para SELECTs: ejecuta y selecciona solo las columnas pedidas.
async function queryObjects(sql, params, columns) {
  const rows = await query(sql, params);
  return rows.map((r) => Object.fromEntries(columns.map((c) => [c, r[c]])));
}

module.exports = { query, queryObjects, pool };
