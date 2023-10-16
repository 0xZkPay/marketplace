import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await axios.post(`${BASE_URL}/onboard/verify`, req.body);
      res.status(200).json(response.data);
    } catch (error) {
      // Extract the error message from the caught error
      const errorMessage = error.response?.data?.error || "An unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
