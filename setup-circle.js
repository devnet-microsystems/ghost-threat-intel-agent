import { randomBytes } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { registerEntitySecretCiphertext } from "@circle-fin/developer-controlled-wallets";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.CIRCLE_API_KEY;

if (!apiKey || apiKey === "ENTER_CIRCLE_API_KEY_HERE") {
  console.error("❌ ERROR: Your CIRCLE_API_KEY is missing or invalid.");
  console.error("Before running this script, you must paste your real API Key into the .env file!");
  process.exit(1);
}

const existingEnv = existsSync(".env") ? readFileSync(".env", "utf8") : "";

if (/CIRCLE_ENTITY_SECRET="?[a-f0-9]{64}"?/i.test(existingEnv)) {
  console.error("❌ CIRCLE_ENTITY_SECRET is already present in the .env file and seems valid.");
  console.error("Refusing to overwrite it to avoid losing access to your wallets.");
  process.exit(1);
}

async function registerSecret() {
  try {
    const entitySecret = randomBytes(32).toString("hex");
    const recoveryFilePath = "./recovery";

    mkdirSync(recoveryFilePath, { recursive: true });

    console.log("⏳ Registering the Entity Secret on Circle...");
    
    await registerEntitySecretCiphertext({
      apiKey,
      entitySecret,
      recoveryFileDownloadPath: recoveryFilePath,
    });

    const updatedEnv = existingEnv.replace(
      /CIRCLE_ENTITY_SECRET="?ENTER_ENTITY_SECRET_CIPHERTEXT_HERE"?/,
      `CIRCLE_ENTITY_SECRET="${entitySecret}"`
    );
    
    if (updatedEnv !== existingEnv) {
        writeFileSync(".env", updatedEnv);
    } else {
        appendFileSync(".env", `\nCIRCLE_ENTITY_SECRET="${entitySecret}"\n`);
    }

    console.log("✅ Entity Secret successfully registered!");
    console.log(`📁 Recovery file saved in: ${recoveryFilePath} (DO NOT LOSE THIS)`);
    console.log("📝 Your .env has been automatically updated with the new CIRCLE_ENTITY_SECRET.");
    console.log("\nNext step: Go to the Circle console and create your Developer-Controlled Wallet. Then copy the Wallet ID into the .env and run npm start!");
  } catch (error) {
    console.error("❌ Error during registration:", error.message);
  }
}

registerSecret();
