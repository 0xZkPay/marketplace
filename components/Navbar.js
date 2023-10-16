import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useGlobalContext } from "../contexts/GlobalContext";
import dynamic from "next/dynamic";
import { ed25519 } from "@noble/curves/ed25519";
import axios from "axios";
import bs58 from "bs58";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  HomeModernIcon,
  UserCircleIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
  Bars3CenterLeftIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const Navbar = () => {
  const [dropdownActive, setDropdownActive] = useState(false);
  const { publicKey, wallet, signMessage, connected } = useWallet();
  const [authInitiated, setAuthInitiated] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false); // State for mobile nav
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const { user, fetchUserDetails, setUser } = useGlobalContext();
  const [loading, setLoading] = useState(true);

  const getPasetoToken = () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("pasetoToken");
    }
    return null;
  };

  const setPasetoToken = (token) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pasetoToken", token);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && connected) {
    fetchUserDetails(sessionStorage.getItem("pasetoToken")).then(() => {
      setLoading(false);
    });
  }
  }, [connected, getPasetoToken()]);

  useEffect(() => {
    if (!connected) {
      setUser(null);
    }
  }, [connected]);

  const handleWalletConnect = async () => {
    setTimeout(async () => {
      if (getPasetoToken() || authInitiated) return;

      const addr = publicKey.toString();
      try {
        const response = await axios.post("/api/flowid", { addr });
        const { eula, flowId } = response.data.payload;
        const message = `${flowId}${eula}`;

        if (!signMessage)
          throw new Error("Wallet does not support message signing!");
        const encodedMessage = new TextEncoder().encode(message);
        const signature = await signMessage(encodedMessage);
        if (!ed25519.verify(signature, encodedMessage, publicKey.toBytes()))
          throw new Error("Message signature invalid!");

        const name = "John Doe";
        const city = "Nashville";
        const { data } = await axios.post("/api/verify", {
          flowid: flowId,
          public_key: addr,
          signature: bs58.encode(signature),
          name,
          city,
        });
        setPasetoToken(data.payload.paseto_token);
        setAuthInitiated(true);
      } catch (error) {
        console.error("Error during the signing process:", error);
      }
    }, 500);
  };

  useEffect(() => {
    if (connected) {
      handleWalletConnect();
    }
  }, [publicKey, wallet, connected]);

  const router = useRouter(); // Use the useRouter hook

  // Function to determine if a route is active
  const isActiveRoute = (route) => {
    return router.pathname === route;
  };

  const closeMobileNav = () => {
    setIsNavOpen(false);
  };

  return (
    <div className="relative z-50 bg-gray-900 text-purple-300 w-full">
      <nav className="flex flex-row justify-between items-center flex-wrap pt-2 pl-6 pr-6">
        <button
          className="lg:hidden p-4"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <Bars3CenterLeftIcon className="h-6 w-6 text-purple-300" />
        </button>
        <Link href="/">
          <h1 className="font-semibold text-4xl lg:ml-4 mb-2 cursor-pointer">
            zkPay
          </h1>
        </Link>

        <div className="hidden lg:flex space-x-4 ">
          
          <div
            className="relative"
            onMouseEnter={() => setSettingsOpen(true)}
            onMouseLeave={() => setSettingsOpen(false)}
          >
            <button className="flex items-center space-x-2 cursor-pointer">
              <span className="text-lg">Settings</span>
              <ChevronDownIcon className="h-5 w-5" />
            </button>
            {settingsOpen && (
              <div className="absolute left-0 w-48 bg-gray-800 border border-purple-500 rounded-md shadow-lg text-purple-300">
                <Link
                  href="/edit-user"
                  className="block px-4 py-2 hover:text-purple-300"
                >
                  Edit User
                </Link>
              </div>
            )}
          </div>

          
        </div>
        <div className="relative">
          <button onClick={() => setDropdownActive(!dropdownActive)}>
            <img
              src={`https://robohash.org/${publicKey}`}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-purple-500"
            />
          </button>
          {dropdownActive && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-purple-500 rounded-md shadow-lg text-purple-300">
              <div className="py-1">
                {loading ? (
                  <div className="block px-4 py-2 text-sm">Loading...</div>
                ) : (
                  <>
                    <div className="block px-4 py-2 text-sm border-b border-purple-400">
                      {user?.name}
                    </div>
                    <div className="block px-4 py-2 text-sm border-b border-purple-400">
                      {user?.city}
                    </div>
                  </>
                )}
                <div className="block px-4 py-2 text-sm">
                  <WalletMultiButton className="w-full" />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <aside
        className={`sidebar bg-gray-800 text-purple-100 p-4 space-y-4 fixed h-full w-full top-0 left-0 z-60 lg:hidden transform ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div
          className="absolute top-5 right-6 cursor-pointer"
          onClick={closeMobileNav}
        >
          <XMarkIcon className="h-6 w-6 text-purple-300 lg:hidden" />
        </div>
        <ul>
          
          
          
          
          <li
            className={`mb-2 mt-2 flex items-center space-x-2 cursor-pointer p-2 rounded transition duration-300 ease-in-out ${
              isActiveRoute("/settings") ? "bg-gray-700" : ""
            }`}
            onClick={() => {
              setSettingsOpen(!settingsOpen);
            }}
          >
            <UserCircleIcon className="h-6 w-6" />
            <span className="text-lg ">Settings</span>
            <ChevronDownIcon className="h-5 w-5 ml-auto" />
          </li>
          {settingsOpen && (
            <li
              className={`pl-6 ${
                isActiveRoute("/edit-user") ? "bg-gray-700" : ""
              }`}
              onClick={closeMobileNav}
            >
              <Link
                href="/edit-user"
                className="block py-1 hover:text-purple-300 mb-2"
              >
                Edit User
              </Link>
            </li>
          )}
        </ul>
      </aside>
    </div>
  );
};

export default Navbar;
