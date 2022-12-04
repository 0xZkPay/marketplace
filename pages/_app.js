import { useEffect, useState } from "react";
import "../styles/globals.css";

function App({ Component, pageProps }) {
  const API_URL = "http://localhost:9081";

  const [apiKey, setApiKey] = useState("");

  return (
    <div className="bg-black h-screen">
      <Component {...pageProps} />
    </div>
  );
}

export default App;
