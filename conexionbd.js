const mysql = require('mysql2');

// Crear la conexión
const connection = mysql.createConnection({
  host: 'localhost',         
  user: 'root',              
  password: 'upao', 
  database: 'plugin'        
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos como id ' + connection.threadId);
});

// Exportar la conexión para usarla en otros archivos si es necesario
module.exports = connection;
