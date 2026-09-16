-- =========================================================
-- Inversiones Coquito — Esquema de Base de Datos (MySQL 8)
-- Producto Académico N.º 02 — versión MySQL
-- =========================================================

CREATE DATABASE IF NOT EXISTS coquito_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE coquito_db;

CREATE TABLE tiendas (
    id_tienda     INT AUTO_INCREMENT PRIMARY KEY,
    nombre        VARCHAR(60) NOT NULL,
    direccion     VARCHAR(150) NOT NULL
);

CREATE TABLE usuarios (
    id_usuario     INT AUTO_INCREMENT PRIMARY KEY,
    nombres        VARCHAR(80) NOT NULL,
    apellidos      VARCHAR(80) NOT NULL,
    email          VARCHAR(120) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    rol            VARCHAR(30) NOT NULL CHECK (rol IN
                      ('gerente','admin_abarrotes','admin_confiteria','cajero','cliente')),
    id_tienda      INT,
    creado_en      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_tienda FOREIGN KEY (id_tienda) REFERENCES tiendas(id_tienda)
);

CREATE TABLE categorias (
    id_categoria   INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(60) NOT NULL,
    id_tienda      INT NOT NULL,
    CONSTRAINT fk_categorias_tienda FOREIGN KEY (id_tienda) REFERENCES tiendas(id_tienda)
);

CREATE TABLE productos (
    id_producto    INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(120) NOT NULL,
    id_categoria   INT NOT NULL,
    precio         DECIMAL(8,2) NOT NULL CHECK (precio >= 0),
    stock          INT NOT NULL DEFAULT 0,
    stock_minimo   INT NOT NULL DEFAULT 0,
    unidad         VARCHAR(20) NOT NULL DEFAULT 'unid.',
    CONSTRAINT fk_productos_categoria FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

CREATE TABLE ventas (
    id_venta       INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario     INT,
    id_tienda      INT NOT NULL,
    metodo_pago    VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('yape','plin','tarjeta','efectivo')),
    origen         VARCHAR(10) NOT NULL DEFAULT 'pos' CHECK (origen IN ('pos','web')),
    total          DECIMAL(10,2) NOT NULL,
    creado_en      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ventas_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_ventas_tienda FOREIGN KEY (id_tienda) REFERENCES tiendas(id_tienda)
);

CREATE TABLE venta_detalle (
    id_detalle       INT AUTO_INCREMENT PRIMARY KEY,
    id_venta         INT NOT NULL,
    id_producto      INT NOT NULL,
    cantidad         INT NOT NULL CHECK (cantidad > 0),
    precio_unitario  DECIMAL(8,2) NOT NULL,
    CONSTRAINT fk_ventadet_venta FOREIGN KEY (id_venta) REFERENCES ventas(id_venta) ON DELETE CASCADE,
    CONSTRAINT fk_ventadet_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

CREATE TABLE pedidos_web (
    id_pedido        INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente       INT,
    cliente_nombre   VARCHAR(120) NOT NULL,
    cliente_telefono VARCHAR(20),
    metodo_pago      VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('yape','plin','tarjeta')),
    estado           VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','entregado')),
    total            DECIMAL(10,2) NOT NULL,
    creado_en        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pedidosweb_usuario FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario)
);

CREATE TABLE pedido_detalle (
    id_detalle       INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido        INT NOT NULL,
    id_producto      INT NOT NULL,
    cantidad         INT NOT NULL CHECK (cantidad > 0),
    precio_unitario  DECIMAL(8,2) NOT NULL,
    CONSTRAINT fk_pedidodet_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos_web(id_pedido) ON DELETE CASCADE,
    CONSTRAINT fk_pedidodet_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

CREATE INDEX idx_productos_categoria ON productos(id_categoria);
CREATE INDEX idx_ventas_tienda ON ventas(id_tienda);
CREATE INDEX idx_pedidos_estado ON pedidos_web(estado);
