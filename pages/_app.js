import { useEffect, useState } from "react";
import "../styles/globals.css";

function App({ Component, pageProps }) {
  const API_URL = "http://localhost:9081";

  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (
      localStorage.getItem("api_key") === null ||
      localStorage.getItem("api_key") === undefined
    ) {
      fetch(API_URL + "/getKey", {
        method: "GET",
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((res) => res.json())
        .then((json) => {
          localStorage.setItem("api_key", json.Key._id);
        });
    }
  }, [apiKey]);

  return (
    <div className="bg-black h-screen">
      <Component {...pageProps} />
    </div>
  );
}

export default App;
