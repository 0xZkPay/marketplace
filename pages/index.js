export default function Home() {
  const API_URL = "http://localhost:9081";

  const buyItem = () => {
    fetch(API_URL + "");
  };

  return (
    <div className="bg-black flex flex-col items-center">
      <div
        className="flex mt-24 text-6xl font-semibold 
            text-white ml-48 mr-48 lg:w-1/4 mb-28
            "
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

      <div className="border shadow rounded-xl overflow-hidden mb-20">
        <img style={{ height: "20rem", width: "100%" }} src={"/hat.png"} />
        <div className="p-4">
          <p style={{ height: "56px" }} className="text-2xl font-semibold">
            Hat
          </p>
          <div style={{ height: "70px", overflow: "hidden" }}>
            <p className="text-gray-400">{"Hat"}</p>
          </div>
        </div>
        <div className="p-4 bg-black">
          <p className="text-2xl mb-2 font-bold text-white">1 BOB</p>
          <button
            className="w-full bg-indigo-500 text-white font-bol py-2 px-12 rounded"
            onClick={() => buyItem()}
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
