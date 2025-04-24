const axios = require('axios');
const https = require('https');
const express = require('express');
const db = require('./conexionbd');  // Asegúrate de que 'conexionbd.js' exporta la conexión a la base de datos

const app = express();
const port = 3000;

// API key de VirusTotal
const apiKey = '43651c3eaa330747592a1294021eda74e9a517841d286da7eb3f21e725415d70';

// Codificar la URL en base64 de forma segura
const encodeUrl = (url) => {
  return Buffer.from(url).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

// Crear un agente HTTPS que valide el certificado del servidor
const agent = new https.Agent({
  rejectUnauthorized: true,  // Rechaza conexiones con certificados no válidos
  secureProtocol: 'TLS_method', // Usa el protocolo más fuerte disponible (TLS 1.2 o 1.3)
});

// Función para verificar la URL con VirusTotal
const verifyUrlWithVirusTotal = async (url) => {
  try {
    const encodedUrl = encodeUrl(url);  // Codificar la URL a base64
    const response = await axios.get(`https://www.virustotal.com/api/v3/urls/${encodedUrl}`, {
      headers: {
        'x-apikey': apiKey  // Tu clave de API
      },
      httpsAgent: agent,  // Usar el agente HTTPS para manejar la conexión
    });

    console.log('Respuesta completa de VirusTotal:', JSON.stringify(response.data, null, 2));

    const results = response.data.data.attributes.last_analysis_results;
    let isMalicious = false;
    const flaggedCategories = ['malicious', 'phishing', 'suspicious', 'malware'];
for (const engine in results) {
  const category = results[engine].category;
  if (flaggedCategories.includes(category)) {
    console.log(`⚠️ Detectado por ${engine}: ${category} - ${results[engine].result}`);
    isMalicious = true;
    break;
  }
}

    return isMalicious;
  } catch (error) {
    console.error('Error al verificar la URL con VirusTotal:', error.response ? error.response.data : error.message);
    return false;
  }
};

// Función para verificar el certificado SSL de la URL
const checkSSL = async (url) => {
  // Asegurarse de que la URL comience con 'https://'
  const httpsUrl = url.startsWith('https://') ? url : `https://${url.replace(/^http:\/\//, '')}`;

  return new Promise((resolve, reject) => {
    https.get(httpsUrl, (res) => {
      if (res.connection.getPeerCertificate().valid_to) {
        resolve(true);  // SSL válido
      } else {
        resolve(false); // SSL no válido
      }
    }).on('error', (e) => {
      console.error(`Error al verificar SSL: ${e.message}`);
      reject(`Error al verificar SSL: ${e.message}`);  // Cambiar para dar más información del error
    });
  });
};

app.use(express.json());

// Endpoint para verificar la URL y almacenarla
app.post('/verificar-url', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).send('URL no proporcionada');
  }

  try {
    const isBlacklisted = await verifyUrlWithVirusTotal(url);
    const estado = isBlacklisted ? 'Maliciosa' : 'Segura';

    if (!isBlacklisted) {
      const sslValid = await checkSSL(url);
      if (!sslValid) {
        return res.status(200).send('La URL no tiene un certificado SSL válido, no se registró');
      }
    }

    if (isBlacklisted) {
      const query = 'INSERT INTO url_maliciosas (url, estado) VALUES (?, ?)';
      db.query(query, [url, estado], (err, results) => {
        if (err) {
          console.error('Error al registrar la URL:', err);
          res.status(500).send(`Error al registrar la URL: ${err.message}`);
          return;
        }
        console.log('URL registrada en la base de datos:', results);
        res.status(200).send(`URL ${estado} registrada correctamente`);
      });
    } else {
      res.status(200).send('La URL es segura, no se registró');
    }
  } catch (error) {
    console.error('Error al procesar la URL:', error);
    res.status(500).send('Error al procesar la URL');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});


