import "../styles/globals.css";

function App({ Component, pageProps }) {
  return (
    <div className="bg-black h-screen">
      <Component {...pageProps} />
    </div>
  );
}

export default App;
