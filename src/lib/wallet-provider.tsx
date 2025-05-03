"use client";

import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import * as StellarSdk from "stellar-sdk";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WalletContextType {
  aptosConnected: boolean;
  stellarConnected: boolean;
  aptosAddress: string | null;
  stellarAddress: string | null;
  connectAptos: () => Promise<void>;
  connectStellar: () => Promise<void>;
  disconnectAptos: () => Promise<void>;
  disconnectStellar: () => Promise<void>;
  sendAptosTestToken: (amount: number) => Promise<string>;
  sendStellarDonation: (amount: string) => Promise<string>;
  stellarBalance: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [aptosConnected, setAptosConnected] = useState(false);
  const [stellarConnected, setStellarConnected] = useState(false);
  const [aptosAddress, setAptosAddress] = useState<string | null>(null);
  const [stellarAddress, setStellarAddress] = useState<string | null>(null);
  const [stellarKeypair, setStellarKeypair] = useState<StellarSdk.Keypair | null>(null);
  const [stellarBalance, setStellarBalance] = useState<string | null>(null);

  // Fetch Stellar balance when connected
  useEffect(() => {
    const fetchStellarBalance = async () => {
      if (stellarConnected && stellarAddress) {
        try {
          const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
          const account = await server.loadAccount(stellarAddress);
          const balance = account.balances.find((b: any) => b.asset_type === "native");
          if (balance) {
            setStellarBalance(balance.balance);
          }
        } catch (error) {
          console.error("Failed to fetch Stellar balance:", error);
        }
      }
    };

    fetchStellarBalance();
  }, [stellarConnected, stellarAddress]);

  const connectAptos = async () => {
    try {
      const wallet = new PetraWallet();
      await wallet.connect();
      const account = await wallet.account();
      setAptosAddress(account.address);
      setAptosConnected(true);
    } catch (error) {
      console.error("Failed to connect Aptos wallet:", error);
    }
  };

  const connectStellar = async () => {
    try {
      // For testnet, we'll generate a new keypair
      const keypair = StellarSdk.Keypair.random();
      setStellarKeypair(keypair);
      setStellarAddress(keypair.publicKey());
      setStellarConnected(true);

      // Fund the account with testnet lumens
      try {
        const response = await fetch(
          `https://friendbot.stellar.org?addr=${encodeURIComponent(keypair.publicKey())}`
        );
        if (!response.ok) {
          throw new Error("Failed to fund account with testnet lumens");
        }
        console.log("Account funded with testnet lumens");
      } catch (error) {
        console.error("Failed to fund account:", error);
      }
    } catch (error) {
      console.error("Failed to connect Stellar wallet:", error);
    }
  };

  const disconnectAptos = async () => {
    try {
      const wallet = new PetraWallet();
      await wallet.disconnect();
      setAptosAddress(null);
      setAptosConnected(false);
    } catch (error) {
      console.error("Failed to disconnect Aptos wallet:", error);
    }
  };

  const disconnectStellar = async () => {
    setStellarKeypair(null);
    setStellarAddress(null);
    setStellarConnected(false);
    setStellarBalance(null);
  };

  const sendAptosTestToken = async (amount: number): Promise<string> => {
    if (!aptosConnected) throw new Error("Aptos wallet not connected");
    try {
      const wallet = new PetraWallet();
      const transaction = {
        type: "entry_function_payload",
        function: "0x1::coin::transfer",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [aptosAddress, amount],
      };
      const pendingTransaction = await wallet.signAndSubmitTransaction(transaction);
      return pendingTransaction.hash;
    } catch (error) {
      console.error("Failed to send Aptos tokens:", error);
      throw error;
    }
  };

  const sendStellarDonation = async (amount: string): Promise<string> => {
    if (!stellarConnected || !stellarKeypair) throw new Error("Stellar wallet not connected");
    try {
      const response = await fetch("/api/stellar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          destination: "GCR6DYAXVJ5NGS27I6Z6OK6SEADK52SRWOYIFTAKMOOLUF4MPHJX22VD",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process donation");
      }

      const data = await response.json();
      return data.transactionHash;
    } catch (error) {
      console.error("Failed to send Stellar donation:", error);
      throw error;
    }
  };

  return (
    <AptosWalletAdapterProvider autoConnect={false}>
      <WalletContext.Provider
        value={{
          aptosConnected,
          stellarConnected,
          aptosAddress,
          stellarAddress,
          connectAptos,
          connectStellar,
          disconnectAptos,
          disconnectStellar,
          sendAptosTestToken,
          sendStellarDonation,
          stellarBalance,
        }}
      >
        {children}
      </WalletContext.Provider>
    </AptosWalletAdapterProvider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
} 