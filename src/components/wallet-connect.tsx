import { useWallet } from "@/lib/wallet-provider";
import { Button } from "./ui/button";
import { useState } from "react";

export function WalletConnect() {
  const {
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
  } = useWallet();

  const [aptosAmount, setAptosAmount] = useState<string>("");
  const [stellarAmount, setStellarAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAptosDeposit = async () => {
    if (!aptosAmount) return;
    setLoading(true);
    try {
      const amount = parseFloat(aptosAmount);
      const txHash = await sendAptosTestToken(amount);
      console.log("Aptos transaction successful:", txHash);
      setAptosAmount("");
    } catch (error) {
      console.error("Failed to send Aptos tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStellarDonation = async () => {
    if (!stellarAmount) return;
    setLoading(true);
    try {
      const txHash = await sendStellarDonation(stellarAmount);
      console.log("Stellar transaction successful:", txHash);
      setStellarAmount("");
    } catch (error) {
      console.error("Failed to send Stellar donation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Aptos Wallet</h3>
        {aptosConnected ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Connected: {aptosAddress}</p>
            <div className="flex gap-2">
              <input
                type="number"
                value={aptosAmount}
                onChange={(e) => setAptosAmount(e.target.value)}
                placeholder="Amount"
                className="rounded border p-2"
              />
              <Button onClick={handleAptosDeposit} disabled={loading}>
                {loading ? "Processing..." : "Deposit"}
              </Button>
            </div>
            <Button variant="outline" onClick={disconnectAptos}>
              Disconnect
            </Button>
          </div>
        ) : (
          <Button onClick={connectAptos}>Connect Petra Wallet</Button>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Stellar Wallet</h3>
        {stellarConnected ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Connected: {stellarAddress}</p>
            <div className="flex gap-2">
              <input
                type="number"
                value={stellarAmount}
                onChange={(e) => setStellarAmount(e.target.value)}
                placeholder="Amount"
                className="rounded border p-2"
              />
              <Button onClick={handleStellarDonation} disabled={loading}>
                {loading ? "Processing..." : "Donate"}
              </Button>
            </div>
            <Button variant="outline" onClick={disconnectStellar}>
              Disconnect
            </Button>
          </div>
        ) : (
          <Button onClick={connectStellar}>Connect Stellar Wallet</Button>
        )}
      </div>
    </div>
  );
} 