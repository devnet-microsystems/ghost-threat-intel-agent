import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
import dotenv from 'dotenv';
dotenv.config();

const circle = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function run() {
    try {
        console.log("Checking balances for Amoy wallet...");
        const balances = await circle.getWalletTokenBalance({
            id: "279fcdbd-11ee-5727-9060-86ffd33a358d" // New Amoy wallet
        });
        console.log(JSON.stringify(balances.data, null, 2));
    } catch (e) {
        console.error(e.response ? e.response.data : e);
    }
}
run();
