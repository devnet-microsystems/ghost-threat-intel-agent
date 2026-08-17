import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import dotenv from "dotenv";

dotenv.config();

const client = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function main() {
  console.log("⏳ Creazione di un nuovo Smart Contract Account (SCA) su ARB-SEPOLIA...");
  
  // 1. Create a Wallet Set
  const walletSetResponse = await client.createWalletSet({
    name: "Ghost Agent SCA Wallet Set",
  });

  const walletSet = walletSetResponse.data?.walletSet;
  if (!walletSet?.id) {
    throw new Error("Wallet set creation failed: no ID returned");
  }

  // 2. Create the SCA Agent Wallet
  const agentWalletResponse = await client.createWallets({
    walletSetId: walletSet.id,
    blockchains: ["ARB-SEPOLIA"],
    count: 1,
    accountType: "SCA", 
  });

  const agentWallet = agentWalletResponse.data?.wallets?.[0];

  console.log("✅ Fatto!\n");
  console.log("=========================================");
  console.log("👉 SOSTITUISCI QUESTO VALORE NEL TUO .env");
  console.log("=========================================");
  console.log(`AGENT_WALLET_ID="${agentWallet.id}"`);
  console.log("=========================================\n");
  
  console.log(`NUOVO Indirizzo Blockchain dell'Agente (SCA): ${agentWallet.address}`);
  
  console.log("\n🚰 PROSSIMI PASSI DA SEGUIRE ALLA LETTERA:");
  console.log("1. Vai sulla tua Circle Console -> Gas Station e Crea una Policy per Arbitrum Sepolia");
  console.log("2. Vai su https://faucet.circle.com e invia USDC (seleziona token USDC, rete Arbitrum Sepolia) a questo nuovo indirizzo SCA.");
}

main().catch((err) => {
  console.error("❌ Errore:", err?.response?.data || err.message || err);
  process.exit(1);
});
