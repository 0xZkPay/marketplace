import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
const Marketplace = () => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { connected } = useWallet();

  useEffect(() => {
    const fetchMerchants = async () => {
      const token = sessionStorage.getItem("pasetoToken");

      try {
        const response = await axios.get("/api/getMerchants", {
          headers: {
            authorization: token,
          },
        });
        setMerchants(response.data.payload.merchants);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the stores:", error);
        setLoading(false);
      }
    };

    if (
      typeof window !== "undefined" &&
      connected &&
      sessionStorage.getItem("pasetoToken")
    ) {
      fetchMerchants();
    }
  }, [connected]);

  return (
    <div className="bg-black flex flex-col items-center">
      <div className="flex mt-24 text-6xl font-semibold text-white mb-16">
        Marketplace
      </div>
      
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {merchants.map((merchant) => (
            <div
              key={merchant.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-medium mb-4 text-purple-500">
                {merchant.name}
              </h2>
              <p className="text-gray-500 mb-2">Type: {merchant.type}</p>
              <p className="text-gray-500 mb-2">Domain: {merchant.domain}</p>
              <Link
                href={`/store/${merchant.id}?name=${merchant.name}&type=${merchant.type}&domain=${merchant.domain}&api_key=${merchant.api_key}`}
                className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 mt-4"
              >
                View Store
              </Link>
              
            </div>
          ))}
          
        </div>
        
      )}
      <a href="http://localhost:3000" target="_blank" rel="noreferrer">
        <button className="hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 mb-20 animate-text bg-gradient-to-r from gray-500 via gray-400 to-gray-300 hover:text-indigo-500 from-indigo-500 hover:text-white via-purple-500 to-indigo-500 border-indigo-500 border-2 rounded-lg p-4 shadow-lg font-bold">
          View Dashboard
        </button>
      </a>
    </div>
  );
};

export default Marketplace;
