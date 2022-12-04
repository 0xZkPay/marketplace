import { useState } from "react";
import QRCode from "react-qr-code";

export default function Modal() {
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const API_URL = "http://localhost:9081";
  const [zkAddress, setZkAddress] = useState("");

  if (
    typeof window !== "undefined" &&
    localStorage.getItem("orderId") === null
  ) {
    localStorage.setItem("orderId", 1);
  }

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const checkTransaction = async () => {
    await delay(120000);
    fetch(
      API_URL +
        `/getPaymentStatus/${localStorage.getItem(
          "orderId"
        )}/${localStorage.getItem("api_key")}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success") {
          setProcessing(false);
          setSuccess(true);
          localStorage.setItem(
            "orderId",
            Number(localStorage.getItem("orderId") + 1)
          );
        }
      });
  };

  const buyItem = () => {
    fetch(
      API_URL +
        `/getAddressToPay/${1000000000}/${localStorage.getItem(
          "orderId"
        )}/${localStorage.getItem("api_key")}`
    )
      .then((res) => res.json())
      .then((json) => {
        setZkAddress(json.zkAddress);
      });
    setShowModal(true);
    setProcessing(true);
    checkTransaction();
  };
  return (
    <>
      {success ? (
        <button
          className="w-full bg-green-500 text-white font-bol py-2 px-12 rounded"
          type="button"
          onClick={() => console.log("success")}
        >
          Payment Success
        </button>
      ) : processing ? (
        <button
          className="w-full bg-indigo-500 text-white font-bol py-2 px-12 rounded"
          type="button"
          onClick={() => console.log("Processing")}
        >
          Processing
        </button>
      ) : (
        <button
          className="w-full bg-indigo-500 text-white font-bol py-2 px-12 rounded"
          type="button"
          onClick={() => buyItem()}
        >
          Pay with ZkPay
        </button>
      )}
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Scan QR to get ZK address
                  </h3>
                </div>
                <h4 className="text-xl ml-8 mr-8 mt-8">{zkAddress}</h4>
                <div className="flex justify-center mt-12">
                  <QRCode value={zkAddress} />
                </div>
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed"></p>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
