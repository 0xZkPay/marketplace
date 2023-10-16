import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const GlobalContext = createContext();

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [merchantData, setMerchantData] = useState(null);
  const [apiKey, setApiKey] = useState(null);

  // Function to update user details
  const updateUser = (newDetails) => {
    setUser(newDetails);
  };

  const fetchUserDetails = async (token) => {
    try {
      const response = await axios.get("/api/getUser", {
        headers: {
          authorization: token,
        },
      });
      setUser(response.data.payload.user);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <GlobalContext.Provider value={{ user, setUser, fetchUserDetails, merchantData, setMerchantData, apiKey, setApiKey }}>
      {children}
    </GlobalContext.Provider>
  );
};
