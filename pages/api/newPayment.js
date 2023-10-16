import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await axios.post(`${BASE_URL}/core/payment`, req.body, {
        headers: {
            'api_key': req.headers.api_key
        }
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create new payment' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
