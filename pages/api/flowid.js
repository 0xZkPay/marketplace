// pages/api/flowid.js

import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await axios.post(`${BASE_URL}/onboard/flowid`, {
        addr: req.body.addr
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch flow id' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
