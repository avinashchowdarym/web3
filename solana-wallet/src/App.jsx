import React, { useState } from "react";
import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

function SolanaWallet() {
  const [seedPhrase, setSeedPhrase] = useState("");
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Generate a new seed phrase and create a wallet
  const generateWallet = () => {
    const keypair = Keypair.generate();
    const secretKey = keypair.secretKey;
    const seed = Array.from(secretKey.slice(0, 32));
    const phrase = seed.join(",");
    setSeedPhrase(phrase);
    setWallet(keypair);
  };

  // Restore wallet from seed phrase
  const restoreWallet = () => {
    const seed = Uint8Array.from(seedPhrase.split(",").map(Number));
    const keypair = Keypair.fromSeed(seed);
    setWallet(keypair);
  };

  // Fetch balance of the wallet
  const getBalance = async () => {
    if (wallet) {
      const publicKey = new PublicKey(wallet.publicKey);
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    }
  };

  // Transfer SOL to another wallet
  const transferSol = async () => {
    if (wallet && recipient && amount) {
      const transaction = await connection.requestAirdrop(
        wallet.publicKey,
        amount * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(transaction, "confirmed");

      const recipientPubKey = new PublicKey(recipient);
      const transferTransaction = {
        fromPubkey: wallet.publicKey,
        toPubkey: recipientPubKey,
        lamports: amount * LAMPORTS_PER_SOL,
      };
      const signature = await connection.sendTransaction(
        transferTransaction,
        [wallet]
      );
      await connection.confirmTransaction(signature, "confirmed");
      getBalance(); // Update balance after transfer
    }
  };

  return (
    <div>
      <h1>Solana Wallet</h1>

      <button onClick={generateWallet}>Generate Wallet</button>
      <div>
        <label>Seed Phrase:</label>
        <textarea
          value={seedPhrase}
          onChange={(e) => setSeedPhrase(e.target.value)}
        />
      </div>
      <button onClick={restoreWallet}>Restore Wallet</button>

      {wallet && (
        <div>
          <p>Public Key: {wallet.publicKey.toBase58()}</p>
          <button onClick={getBalance}>Get Balance</button>
          {balance !== null && <p>Balance: {balance} SOL</p>}
        </div>
      )}

      <div>
        <label>Recipient Address:</label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>
      <div>
        <label>Amount (SOL):</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <button onClick={transferSol}>Transfer SOL</button>
    </div>
  );
}

export default SolanaWallet;
