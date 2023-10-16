import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
        console.log(`Bearer ${req.headers.authorization}`)
      const response = await axios.get(`${BASE_URL}/manage/user`, {
        headers: {
          'Authorization': `Bearer ${req.headers.authorization}`
        }
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
