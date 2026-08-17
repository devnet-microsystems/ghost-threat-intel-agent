import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
import dotenv from 'dotenv';
dotenv.config();

const circle = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function run() {
    try {
        const tx = await circle.getTransaction({ id: "8f2b4b9e-31cb-5d0d-9a75-e2182e576cc4" });
        console.log("Tx Hash:", tx.data.transaction.txHash);
    } catch (e) {
        console.error(e.response ? e.response.data : e);
    }
}
run();
