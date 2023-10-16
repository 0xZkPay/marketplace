// /pages/api/getMerchants.js
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const pasetoToken = req.headers.authorization

    if (!pasetoToken) {
      return res.status(401).json({ message: 'Authentication token is missing.' });
    }

    // Fetching all merchants associated with the user based on the Paseto authentication token
    const response = await axios.get(`${BASE_URL}/manage/merchant`, {
      headers: {
        'Authorization': `Bearer ${pasetoToken}`
      }
    });

    if (response.data) {
      return res.status(200).json(response.data);
    } else {
      return res.status(404).json({ message: 'Merchants not found.' });
    }
  } catch (error) {
    console.error('Error fetching merchants:', error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
}
