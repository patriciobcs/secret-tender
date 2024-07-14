import { BrowserProvider } from "ethers";
import { createFhevmInstance } from "./utils/fhevm";
import { useState, useCallback, useEffect, useMemo, React } from "react";

const AUTHORIZED_CHAIN_ID = ["0x2382", "0x2383"]; // 9090, 9091
const BLOCKCHAIN_EXPLORER_URL = "https://explorer.inco.org/address/";

export const Connect = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [validNetwork, setValidNetwork] = useState(false);
  const [account, setAccount] = useState("");
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);

  const refreshAccounts = (accounts) => {
    setAccount(accounts[0] || "");
    setConnected(accounts.length > 0);
  };

  const hasValidNetwork = async () => {
    const currentChainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    return AUTHORIZED_CHAIN_ID.includes(currentChainId.toLowerCase());
  };

  const refreshNetwork = useCallback(async () => {
    if (await hasValidNetwork()) {
      await createFhevmInstance();
      setValidNetwork(true);
    } else {
      setValidNetwork(false);
    }
  }, []);

  const refreshProvider = (eth) => {
    const p = new BrowserProvider(eth);
    setProvider(p);
    return p;
  };

  useEffect(() => {
    const eth = window.ethereum;
    if (!eth) {
      setError("No wallet has been found");
      return;
    }

    const p = refreshProvider(eth);

    p.send("eth_accounts", [])
      .then(async (accounts) => {
        refreshAccounts(accounts);
        await refreshNetwork();
      })
      .catch(() => {
        // Do nothing
      });
    eth.on("accountsChanged", refreshAccounts);
    eth.on("chainChanged", refreshNetwork);
  }, [refreshNetwork]);

  const connect = async () => {
    if (!provider) {
      return;
    }
    const accounts = await provider.send("eth_requestAccounts", []);

    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setConnected(true);
      if (!(await hasValidNetwork())) {
        await switchNetwork();
      }
    }
  };

  const switchNetwork = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: AUTHORIZED_CHAIN_ID[0] }],
      });
    } catch (e) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: AUTHORIZED_CHAIN_ID[0],
            rpcUrls: ["https://testnet.inco.org"],
            chainName: "Inco Gentry Testnet",
            nativeCurrency: {
              name: "INCO",
              symbol: "INCO",
              decimals: 18,
            },
            blockExplorerUrls: ["https://explorer.inco.org/"],
          },
        ],
      });
    }
    await refreshNetwork();
  }, [refreshNetwork]);

  const child = useMemo(() => {
    if (!account || !provider) {
      return null;
    }

    if (!validNetwork) {
      return (
        <div>
          <p className="text-red-500">You&apos;re not on the correct network</p>
          <p>
            <button
              className="Connect__button bg-gray-200 hover:bg-blue-400"
              onClick={switchNetwork}>
              Switch to Inco Network Testnet
            </button>
          </p>
        </div>
      );
    }

    return children(account, provider);
  }, [account, provider, validNetwork, children, switchNetwork]);

  if (error) {
    return <p>No wallet has been found.</p>;
  }

  const connectInfos = (
    <div className="Connect__info">
      {!connected && (
        <button
          className="Connect__button bg-red-200 hover:bg-blue-400"
          onClick={connect}>
          Connect your wallet
        </button>
      )}
      {connected && (
        <div className="Connect__account">
          Connected with{" "}
          <a
            href={`${BLOCKCHAIN_EXPLORER_URL}${account}`}
            target="_blank"
            rel="noopener noreferrer">
            {account}
          </a>
        </div>
      )}
    </div>
  );

  return (
    <>
      {connectInfos}
      <div className="Connect__child">{child}</div>
    </>
  );
};
