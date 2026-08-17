import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
import dotenv from 'dotenv';
dotenv.config();

const circle = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function run() {
    try {
        console.log("Fetching tokens on MATIC-AMOY...");
        // Actually we don't need a wallet, we just need to list tokens or search for USDC on MATIC-AMOY?
        // Let's create an EOA wallet on MATIC-AMOY first to get a wallet, then ask for its balances (which will be 0, but maybe we can query supported tokens?)
        // Or we can just create a wallet set and wallet on MATIC-AMOY
        const walletSetResponse = await circle.createWalletSet({ name: "Amoy Set" });
        const walletSet = walletSetResponse.data?.walletSet;
        const walletResponse = await circle.createWallets({
            walletSetId: walletSet.id, blockchains: ["MATIC-AMOY"], count: 1, accountType: "EOA"
        });
        console.log("Amoy Wallet:", walletResponse.data.wallets[0]);
    } catch (e) {
        console.error(e.response ? e.response.data : e);
    }
}
run();
