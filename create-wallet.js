import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import dotenv from "dotenv";

dotenv.config();

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function main() {
  console.log("⏳ Creating Wallet Set and Wallets on ARB-SEPOLIA (Arbitrum Testnet)...");
  
  // 1. Create a Wallet Set
  const walletSetResponse = await client.createWalletSet({
    name: "Ghost Threat Intel Agent Wallet Set",
  });

  const walletSet = walletSetResponse.data?.walletSet;
  if (!walletSet?.id) {
    throw new Error("Wallet set creation failed: no ID returned");
  }

  // 2. Create the Agent Wallet (Sender)
  const agentWalletResponse = await client.createWallets({
    walletSetId: walletSet.id,
    blockchains: ["ARB-SEPOLIA"], // Using Arbitrum Sepolia for low fees
    count: 1,
    accountType: "EOA", 
  });

  // 3. Create a Bounty Receiver Wallet (Destination for the payout)
  const bountyWalletResponse = await client.createWallets({
    walletSetId: walletSet.id,
    blockchains: ["ARB-SEPOLIA"],
    count: 1,
    accountType: "EOA",
  });

  const agentWallet = agentWalletResponse.data?.wallets?.[0];
  const bountyWallet = bountyWalletResponse.data?.wallets?.[0];

  console.log("✅ Done!\n");
  console.log("=========================================");
  console.log("👉 PASTE THESE TWO VALUES INTO YOUR .env");
  console.log("=========================================");
  console.log(`AGENT_WALLET_ID="${agentWallet.id}"`);
  console.log(`BOUNTY_WALLET_ID="${bountyWallet.address}"`);
  console.log("=========================================\n");
  
  console.log(`Agent Blockchain Address: ${agentWallet.address}`);
  console.log(`Bounty Blockchain Address: ${bountyWallet.address}`);
  
  console.log("\n🚰 NEXT STEP:");
  console.log("Before starting the agent, you need to fund it with fake USDC to pay the bounties!");
  console.log(`Go to: https://faucet.circle.com/`);
  console.log(`Choose the "Arbitrum Sepolia" network and the "USDC" token, and send them to this address: ${agentWallet.address}`);
}

main().catch((err) => {
  console.error("❌ Error:", err?.response?.data || err.message || err);
  process.exit(1);
});
