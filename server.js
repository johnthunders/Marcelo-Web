const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// Conexión a la base de datos
// Usamos path.join para que no haya errores de rutas en Windows
const dbPath = path.join(__dirname, 'it_nomads.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("Error al abrir BD:", err.message);
    else console.log("Base de Datos SQLite conectada correctamente.");
});


// RUTA DE LOGIN (Versión Limpia)
app.post('/api/login', (req, res) => {
    // Usamos .trim() para eliminar espacios accidentales al inicio o final
    const username = req.body.username ? req.body.username.trim() : "";
    const password = req.body.password ? req.body.password.trim() : "";
    
    // Estos corchetes [] en el log te ayudarán a ver si hay espacios invisibles
    console.log(`Intento de login para: [${username}]`);

    const sql = `SELECT id, username, role, name FROM users WHERE username = ? AND password = ?`;
    
    db.get(sql, [username, password], (err, row) => {
        if (err) {
            console.error("Error en la consulta SQL:", err.message);
            return res.status(500).json({ success: false, message: "Error en servidor" });
        }
        
        if (row) {
            console.log(`✅ Login exitoso para el usuario: ${row.name}`);
            res.json({ success: true, user: row });
        } else {
            console.log(`❌ Credenciales incorrectas para: [${username}]`);
            // Enviamos un mensaje claro para que React sepa qué pasó
            res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
        }
    });
});


// Configuración para el despliegue en Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`>>> Servidor corriendo en el puerto: ${PORT}`);
    console.log(`>>> Esperando peticiones...`);
});