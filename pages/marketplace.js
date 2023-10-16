import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, PublicKey } from '@solana/web3.js';
import Modal from "../components/Modal"; // Import the Modal component
import Navbar from '../components/Navbar';

const Marketplace = () => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  useEffect(() => {
    const fetchMerchants = async () => {
      const token = sessionStorage.getItem('pasetoToken');

      try {
        const response = await axios.get('/api/getMerchants', {
          headers: {
            authorization: token
          }
        });
        setMerchants(response.data.payload.merchants);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the stores:', error);
        setLoading(false);
      }
    };

    if (typeof window !== "undefined" && connected && sessionStorage.getItem('pasetoToken')) {
      fetchMerchants();
    }
  }, [connected]);

  const handlePayment = async (merchant) => {
    try {
      if (!publicKey) throw new Error('Wallet not connected!');

      // Initiate new payment
      const paymentDetails = {
        amount_lamport: 100000000, // This can be dynamic based on the merchant's product price
        product_id: merchant.id,
        product_name: merchant.name
      };

      const newPaymentResponse = await axios.post('/api/newPayment', paymentDetails, {
        headers: {
          api_key: merchant.api_key
        }
      });

      if (newPaymentResponse.data.message !== "receiving address generated") {
        throw new Error('Failed to generate receiving address');
      }

      const receivingAddress = newPaymentResponse.data.payload.addr;

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const amountToTransfer = 10; // This should be dynamic based on the merchant's product price

      const transaction = new Transaction({
        feePayer: publicKey,
        recentBlockhash: blockhash,
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(receivingAddress),
          lamports: 1100000000, // Convert SOL to lamports
        })
      );

      const signature = await sendTransaction(transaction, connection, { minContextSlot });
      console.log('Transaction sent:', signature);

      await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
      alert('Payment successful!');

      // Poll for payment update in the background
      const pollPaymentUpdate = setInterval(async () => {
        try {
          const updatePaymentResponse = await axios.post('/api/updatePayment', {
            addr: receivingAddress
          }, {
            headers: {
              api_key: merchant.api_key
            }
          });

          // Handle the updatePaymentResponse as needed
          // If payment is successful or failed, clear the interval
          clearInterval(pollPaymentUpdate);
        } catch (error) {
          console.error('Error polling payment update:', error);
        }
      }, 5000); // Poll every 5 seconds

    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="bg-black flex flex-col items-center">
      <div
        className="flex mt-24 text-6xl font-semibold 
            text-white ml-48 mr-48 lg:w-1/4 mb-28"
      >
        Marketplace to showcase functionality of ZkPay
      </div>

      <a href="http://localhost:3000" target="_blank" rel="noreferrer">
        <button
          className="hover:bg-gradient-to-r
            from-indigo-500 via-purple-500 to-indigo-500 mb-20
            animate-text bg-gradient-to-r from gray-500 via gray-400 to-gray-300 hover:text-indigo-500
            from-indigo-500 hover:text-white via-purple-500 to-indigo-500 border-indigo-500 border-2 rounded-lg p-4 shadow-lg font-bold"
        >
          View Dashboard
        </button>
      </a>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {merchants.map((merchant) => (
            <div key={merchant.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-medium mb-4 text-purple-500">{merchant.name}</h2>
              <p className="text-gray-500 mb-2">Type: {merchant.type}</p>
              <p className="text-gray-500 mb-2">Domain: {merchant.domain}</p>
              <button onClick={() => handlePayment(merchant)} className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 mt-4">Buy</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
