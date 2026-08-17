import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const circle = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function runTestPayment() {
    try {
        console.log("🚀 Initiating Test USDC Payment on Arbitrum Sepolia...");
        
        const THREAT_INTEL_AGENT_WALLET = process.env.AGENT_WALLET_ID; 
        const BOUNTY_RECEIVER_WALLET = process.env.BOUNTY_WALLET_ID; 
        const USDC_TOKEN_ID = "7d9b2759-6464-535f-8048-7158a44a6bf7"; 
        
        console.log(`From Wallet: ${THREAT_INTEL_AGENT_WALLET}`);
        console.log(`To Wallet:   ${BOUNTY_RECEIVER_WALLET}`);

        const idempotencyKey = uuidv4();
        
        const paymentResponse = await circle.createTransaction({
            walletId: THREAT_INTEL_AGENT_WALLET,
            tokenId: USDC_TOKEN_ID,
            destinationAddress: BOUNTY_RECEIVER_WALLET,
            amounts: ["0.005"],
            fee: {
                type: "level",
                config: { feeLevel: "MEDIUM" }
            },
            idempotencyKey: idempotencyKey,
        });

        console.log("✅ SUCCESS! Transaction Sent!");
        console.log("Transaction ID:", paymentResponse.data.id);
        console.log(`Check it on Explorer: https://sepolia.arbiscan.io/tx/ (It will appear here shortly!)`);
        
    } catch (error) {
        console.error("❌ ERROR! Failed to send payment:");
        if (error.response && error.response.data) {
            console.error(JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

runTestPayment();
