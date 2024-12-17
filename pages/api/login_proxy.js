const http = require('http');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const options = {
    hostname: '169.239.251.102',
    port: 3341,
    path: '/~rachel.yeboah/otakuhub/login.php',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
    res.status(500).json({ error: 'Proxy request failed', details: err.message });
  });

  // Pipe the request body to the proxy request
  req.pipe(proxyReq);
}
