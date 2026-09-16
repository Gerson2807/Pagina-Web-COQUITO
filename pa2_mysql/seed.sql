-- Datos de referencia — Inversiones Coquito (versión MySQL)
USE coquito_db;

INSERT INTO tiendas (nombre, direccion) VALUES
  ('Confitería', 'Jr. Ancash 210, El Tambo, Huancayo'),
  ('Abarrotes', 'Av. Mariscal Castilla 480, El Tambo, Huancayo');

-- Usuario administrador de ejemplo (contraseña real: se crea desde /api/register)
INSERT INTO categorias (nombre, id_tienda) VALUES
  ('Galletas', 1), ('Caramelos', 1), ('Chocolates', 1), ('Snacks', 1), ('Bebidas', 1),
  ('Arroz y Menestras', 2), ('Aceites y Conservas', 2), ('Fideos', 2),
  ('Azúcar y Endulzantes', 2), ('Lácteos y Huevos', 2);

INSERT INTO productos (nombre, id_categoria, precio, stock, stock_minimo, unidad) VALUES
  ('Galletas Soda Field x6', 1, 3.50, 140, 20, 'unid.'),
  ('Galletas Oreo Original', 1, 4.80, 18, 20, 'paq.'),
  ('Caramelos Winter''s Menta', 2, 6.50, 44, 10, 'bolsa'),
  ('Chocolate Sublime', 3, 3.50, 74, 20, 'unid.'),
  ('Arroz Costeño Extra 5kg', 6, 24.90, 30, 8, 'bolsa'),
  ('Aceite Primor 1L', 7, 12.90, 22, 10, 'unid.'),
  ('Leche Gloria Evaporada', 10, 3.90, 60, 15, 'unid.');
