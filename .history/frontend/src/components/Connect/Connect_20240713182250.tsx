import { BrowserProvider } from "ethers";
import { createFhevmInstance } from "../../fhevmjs";
import React, { useState, useCallback, useEffect, useMemo } from "react";

const AUTHORIZED_CHAIN_ID = ["0x2382", "0x2383"]; // 9090, 9091

interface ConnectProps {
  children: (account: string, provider: BrowserProvider) => React.ReactNode;
}

export const Connect: React.FC<ConnectProps> = ({ children }) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [validNetwork, setValidNetwork] = useState<boolean>(false);
  const [account, setAccount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  const refreshAccounts = (accounts: string[]) => {
    setAccount(accounts[0] || "");
    setConnected(accounts.length > 0);
  };

  const hasValidNetwork = async (): Promise<boolean> => {
    const currentChainId: string = await window.ethereum.request({
      method: "eth_chainId",
    });
    console.log(`Current Chain ID: ${currentChainId}`);
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

  const refreshProvider = (eth: any) => {
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
      .then(async (accounts: string[]) => {
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
    const accounts: string[] = await provider.send("eth_requestAccounts", []);

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
      console.log("Switched to the correct network");
    } catch (e) {
      console.error("Error switching network", e);
      try {
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
        console.log("Added and switched to the correct network");
      } catch (addError) {
        console.error("Error adding network", addError);
      }
    }
    await refreshNetwork();
  }, [refreshNetwork]);

  const child = useMemo<React.ReactNode>(() => {
    if (!account || !provider) {
      return null;
    }

    if (!validNetwork) {
      return (
        <div>
          <p>You're not on the correct network</p>
          <p>
            <button className="Connect__button" onClick={switchNetwork}>
              Switch to Inco Gentry Testnet
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
        <button className="Connect__button" onClick={connect}>
          Connect your wallet
        </button>
      )}
      {connected && (
        <div className="Connect__account">Connected with {account}</div>
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
