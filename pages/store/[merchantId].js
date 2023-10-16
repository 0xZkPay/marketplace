import React from 'react';
import axios from 'axios';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, PublicKey } from '@solana/web3.js';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StoreProducts = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const router = useRouter();
  if (!router.isReady) {
    return null; // or a loading spinner, or some placeholder content
  }
  
  const { merchantId, name, type, domain, api_key } = router.query;
  
  const merchant = {
    id: merchantId,
    name: name,
    type: type,
    domain: domain,
    api_key: api_key
  };

  const handlePayment = async (merchant, product) => {
    try {
      if (!publicKey) throw new Error('Wallet not connected!');

      // Initiate new payment
      const paymentDetails = {
        amount_lamport: `${product.price}00000000`, // This can be dynamic based on the merchant's product price
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
          lamports: `${product.price}000000000`, // Convert SOL to lamports
        })
      );

      const signature = await sendTransaction(transaction, connection, { minContextSlot });
      console.log('Transaction sent:', signature);

      await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
      toast.success('Payment successful!');

      const pollPaymentUpdate = setInterval(async () => {
        try {
          const updatePaymentResponse = await axios.post('/api/updatePayment', {
            addr: receivingAddress
          }, {
            headers: {
              api_key: merchant.api_key
            }
          });
  
          const paymentMessage = updatePaymentResponse.data.message;
  
          if (paymentMessage === 'payment successful') {
            toast.success('Payment confirmed!');
            clearInterval(pollPaymentUpdate);
          } else if (paymentMessage === 'payment failed') {
            toast.error('Payment confirmation failed. Please check your transaction.');
            clearInterval(pollPaymentUpdate);
          } else if (paymentMessage === 'payment pending') {
            // If status is "payment pending", continue polling
          } else {
            toast.warning('Unknown payment status. Please check manually.');
            clearInterval(pollPaymentUpdate);
          }
  
        } catch (error) {
          console.error('Error polling payment update:', error);
          toast.error('Error while checking payment status. Please check manually.');
          clearInterval(pollPaymentUpdate);
        }
      }, 5000); // Poll every 5 seconds
  
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  // Mock products for demonstration purposes
  const mockProducts = [
    { id: 1, name: 'Sedan', price: 1 },
    { id: 2, name: 'SUV', price: 2 },
    { id: 2, name: 'Electric', price: 3 },
    // ... add more mock products as needed
  ];

  return (
    <div className="bg-black flex flex-col items-center">
      <h1 className="text-4xl font-semibold text-white mb-8 mt-8">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-medium mb-4 text-purple-500">{product.name}</h2>
            <p className="text-gray-500 mb-2">Price: {product.price} SOL</p>
            <button onClick={() => handlePayment(merchant, product)} className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 mt-4">Buy</button>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default StoreProducts;
