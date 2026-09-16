# Inversiones Coquito — PA2 con MySQL

Este es el mismo módulo de login del PA2, adaptado para correr con **MySQL**
en tu propia PC (VS Code), en vez de PostgreSQL. Los archivos `auth.js`,
`server.js` y `public/login.html` funcionan igual que antes; solo cambia
`db.js` (ahora usa el driver oficial `mysql2`) y `schema.sql` (sintaxis MySQL).

## 1. Instala MySQL en tu PC (si no lo tienes)

La forma más simple para un estudiante: instala **XAMPP**
(https://www.apachefriends.org/) — trae MySQL (como MariaDB) y phpMyAdmin
listos para usar, sin configurar nada a mano. Abre el "Panel de control de
XAMPP" e inicia el módulo **MySQL**.

Alternativa: instalar **MySQL Community Server** directo desde
https://dev.mysql.com/downloads/installer/.

## 2. Crea la base de datos y el usuario de la aplicación

Abre una terminal de MySQL (o phpMyAdmin > pestaña SQL) y ejecuta:

```sql
CREATE USER 'coquito_app'@'localhost' IDENTIFIED BY 'coquito_2026';
GRANT ALL PRIVILEGES ON coquito_db.* TO 'coquito_app'@'localhost';
FLUSH PRIVILEGES;
```

Luego ejecuta el contenido de `schema.sql` (crea la base y las 8 tablas) y
después `seed.sql` (datos de ejemplo). En phpMyAdmin: pestaña "Importar" o
pegar el contenido en la pestaña "SQL". Por línea de comandos:

```
mysql -u root -p < schema.sql
mysql -u root -p < seed.sql
```

## 3. Abre la carpeta en VS Code e instala las dependencias

```
npm install
```

(esto instala `mysql2`, el único paquete que necesita el proyecto).

## 4. Ejecuta el servidor

```
node server.js
```

Debe imprimir: `Servidor Coquito escuchando en http://localhost:4000`.
Abre `http://localhost:4000` en tu navegador — verás el mismo formulario de
login/registro del prototipo. Regístrate con un usuario de prueba y confirma
que puedes iniciar sesión con él.

## 5. Evidencia para el documento del PA2

Para que el PA2 quede honesto (evidencia real, no simulada), cuando lo
tengas corriendo:

1. Captura pantallazos del formulario de registro exitoso y del login
   exitoso (igual a las Figuras 2-6 del PA2 ya entregado).
2. En MySQL Workbench o phpMyAdmin, corre `SHOW TABLES;` y
   `SELECT * FROM usuarios;` y captura el resultado (para ver el
   password_hash cifrado, nunca en texto plano).
3. Mándame esas capturas aquí — con eso actualizo el documento
   PA2_Valdez_Alvarez.docx reemplazando las secciones d, e y f para que
   reflejen MySQL con evidencia real tuya, en vez de la versión con
   PostgreSQL que ya tienes.

Si prefieres no instalar nada por ahora, recuerda que el PA2 ya entregado
con PostgreSQL cumple igual el requisito de la rúbrica ("Postgres, MySQL,
etc."), así que no es obligatorio cambiarlo — solo hazlo si tu docente pidió
específicamente MySQL.
