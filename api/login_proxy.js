const https = require('https');
const http = require('http');

export default function handler(req, res) {
  const options = {
    hostname: '169.239.251.102',
    port: 3341,
    path: '/~rachel.yeboah/otakuhub/login.php',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    let data = '';

    proxyRes.on('data', (chunk) => {
      data += chunk;
    });

    proxyRes.on('end', () => {
      res.status(proxyRes.statusCode).send(data);
    });
  });

  proxyReq.on('error', (err) => {
    res.status(500).json({ error: 'Failed to fetch resource', details: err.message });
  });

  req.pipe(proxyReq);
}
