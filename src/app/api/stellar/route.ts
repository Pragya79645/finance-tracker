import { NextResponse } from "next/server";
import * as StellarSdk from "stellar-sdk";

// Initialize Stellar server
const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

// This should be stored in your backend environment variables
const STELLAR_SECRET_KEY = process.env.STELLAR_SECRET_KEY;

export async function POST(request: Request) {
  try {
    if (!STELLAR_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stellar secret key not configured" },
        { status: 500 }
      );
    }

    const { amount, destination } = await request.json();

    // Create source account from secret key
    const sourceKeypair = StellarSdk.Keypair.fromSecret(STELLAR_SECRET_KEY);
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

    // Build transaction
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: "100",
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination,
          asset: StellarSdk.Asset.native(),
          amount: amount.toString(),
        })
      )
      .setTimeout(30)
      .build();

    // Sign transaction
    transaction.sign(sourceKeypair);

    // Submit transaction
    const result = await server.submitTransaction(transaction);
    
    return NextResponse.json({ 
      success: true, 
      transactionHash: result.hash 
    });
  } catch (error) {
    console.error("Stellar transaction error:", error);
    return NextResponse.json(
      { error: "Failed to process transaction" },
      { status: 500 }
    );
  }
} 