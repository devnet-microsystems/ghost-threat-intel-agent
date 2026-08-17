import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import dotenv from "dotenv";

dotenv.config();

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function main() {
  console.log("⏳ Creazione di Wallet su POLYGON AMOY...");
  
  const walletSetResponse = await client.createWalletSet({
    name: "Ghost Agent Amoy Set",
  });
  const walletSet = walletSetResponse.data?.walletSet;

  const agentWalletResponse = await client.createWallets({
    walletSetId: walletSet.id,
    blockchains: ["MATIC-AMOY"],
    count: 1,
    accountType: "EOA", 
  });

  const bountyWalletResponse = await client.createWallets({
    walletSetId: walletSet.id,
    blockchains: ["MATIC-AMOY"],
    count: 1,
    accountType: "EOA", 
  });

  const agentWallet = agentWalletResponse.data?.wallets?.[0];
  const bountyWallet = bountyWalletResponse.data?.wallets?.[0];

  console.log("✅ Fatto!\n");
  console.log("=========================================");
  console.log("👉 SOSTITUISCI QUESTI VALORI NEL TUO .env");
  console.log("=========================================");
  console.log(`AGENT_WALLET_ID="${agentWallet.id}"`);
  console.log(`BOUNTY_WALLET_ID="${bountyWallet.address}"`);
  console.log("=========================================\n");
  
  console.log(`INDIRIZZO AGENTE: ${agentWallet.address}`);
  console.log(`INDIRIZZO TAGLIA: ${bountyWallet.address}`);
}

main().catch((err) => {
  console.error("❌ Errore:", err?.response?.data || err.message || err);
  process.exit(1);
});
