const express = require('express');
const bodyParser = require('body-parser');
const aws4 = require('aws4');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/aws-sign', (req, res) => {
  try {
    const {
      accessKeyId,
      secretAccessKey,
      region,
      service,
      host,
      uri,
      method,
      queryParams,
    } = req.body;

    const opts = {
      host,
      path: uri + (queryParams || ''),
      method,
      region,
      service,
    };

    aws4.sign(opts, {
      accessKeyId,
      secretAccessKey,
    });

    const endpoint = `https://${host}${opts.path}`;

    return res.json({
      endpoint,
      headers: opts.headers,
    });
  } catch (e) {
    console.error('Error al firmar:', e);
    res.status(500).json({ error: 'Error en el servidor de firma' });
  }
});

// 👉 AÑADIDO: Respuesta cuando entras desde el navegador
app.get('/', (req, res) => {
  res.send('Servidor de firma AWS activo');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor de firma AWS corriendo en puerto ${port}`);
});
