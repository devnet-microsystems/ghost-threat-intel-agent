import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
import dotenv from 'dotenv';
dotenv.config();

const circle = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function run() {
    try {
        console.log("Checking for policies...");
        // This might not exist on developer-controlled-wallets, maybe it's under a different client?
        // Let's just print circle object keys to see what's available
        console.log(Object.keys(circle));
    } catch (e) {
        console.error(e);
    }
}
run();
