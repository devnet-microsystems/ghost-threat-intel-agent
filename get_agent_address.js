import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
import dotenv from 'dotenv';
dotenv.config();

const circle = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function run() {
    try {
        const wallet = await circle.getWallet({ id: process.env.AGENT_WALLET_ID });
        console.log("Agent Address:", wallet.data.wallet.address);
    } catch (e) {
        console.error(e.response ? e.response.data : e);
    }
}
run();
