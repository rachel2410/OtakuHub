// pages/api/update_password.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const response = await fetch(
          'http://169.239.251.102:3341/~rachel.yeboah/otakuhub/update_password.php',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
          }
        );
  
        const data = await response.json();
  
        res.status(response.status).json(data);
      } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  