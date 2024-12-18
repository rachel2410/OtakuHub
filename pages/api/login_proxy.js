// pages/api/login_proxy.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Forward the request to your PHP backend
      const response = await fetch(
        'http://169.239.251.102:3341/~rachel.yeboah/otakuhub/login.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req.body),
        }
      );

      const data = await response.json();

      // Return the response from your PHP backend
      res.status(response.status).json(data);
    } catch (error) {
      console.error('Error processing login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Allow only POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
