import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { createHmac } from 'node:crypto';

dotenv.config();

const app = express();
app.use(express.json());

// Auth Middleware: Verify HMAC Signature
app.use('/api/analyze-threat', (req, res, next) => {
  const signature = req.headers['x-signature'];
  const secret = process.env.AGENT_SECRET;

  if (!signature || !secret) {
    return res.status(401).json({ error: "Unauthorized. Missing signature or secret." });
  }

  const payload = JSON.stringify(req.body);
  const expectedSignature = createHmac('sha256', secret).update(payload).digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: "Unauthorized. Invalid signature." });
  }

  next();
});

// 1. Initialize Gemini 3.7 Flash
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 2. Initialize Circle SDK (Testnet)
const circle = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

// Wallet IDs (from Circle Console)
const THREAT_INTEL_AGENT_WALLET = process.env.AGENT_WALLET_ID;
const BOUNTY_RECEIVER_WALLET = process.env.BOUNTY_WALLET_ID;

// Token ID for USDC on Polygon Amoy (Circle Testnet)
const USDC_TOKEN_ID = "7d9b2759-6464-535f-8048-7158a44a6bf7";

app.post('/api/analyze-threat', async (req, res) => {
  const { ip_address, headers, failed_attempts } = req.body;

  if (!ip_address) {
    return res.status(400).json({ error: "Missing ip_address in payload" });
  }

  console.log(`[AGENT] Received threat analysis request for IP: ${ip_address}`);

  try {
    // --- STEP 1: AI THREAT ANALYSIS (Gemini 3.7 Flash) ---
    console.log(`[AGENT] Consulting Gemini 3.7 Flash for threat intelligence...`);

    const prompt = `You are a cybersecurity AI. Analyze this threat data from a WordPress WebAuthn plugin.
    IP: ${ip_address}
    Failed Attempts: ${failed_attempts}
    Headers: ${JSON.stringify(headers)}
    
    Determine if this is a "High-Level Botnet". 
    Reply strictly with a JSON object: {"is_botnet": true|false, "confidence": 0-100, "reason": "short explanation"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });

    // Clean up response if it contains markdown formatting
    let aiOutput = response.text;
    if (aiOutput.includes('```json')) {
      aiOutput = aiOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    const aiAnalysis = JSON.parse(aiOutput);

    console.log(`[AGENT] Gemini Analysis Complete:`, aiAnalysis);

    // --- STEP 2: AUTONOMOUS USDC PAYMENT (Circle SDK) ---
    if (aiAnalysis.is_botnet && aiAnalysis.confidence > 80) {
      console.log(`[AGENT] Threat verified. Initiating autonomous 0.10 USDC bounty payment to detection node...`);

      const idempotencyKey = uuidv4();

      const paymentResponse = await circle.createTransaction({
        walletId: THREAT_INTEL_AGENT_WALLET,
        tokenId: USDC_TOKEN_ID,
        destinationAddress: BOUNTY_RECEIVER_WALLET, // Assuming this is an address for the bounty wallet
        amounts: ["0.005"],
        fee: {
          type: "level",
          config: { feeLevel: "MEDIUM" }
        },
        idempotencyKey: idempotencyKey,
      });

      console.log(`[AGENT] Transaction Initiated! Transaction ID: ${paymentResponse.data.id}`);
      console.log(`[AGENT] Check status on block explorer soon.`);

      return res.json({
        status: "success",
        action_taken: "Bounty Paid",
        bounty_amount: "0.005 USDC",
        circle_transaction_id: paymentResponse.data.id,
        ai_analysis: aiAnalysis
      });

    } else {
      console.log(`[AGENT] Threat not severe enough for bounty. Logging only.`);
      return res.json({
        status: "ignored",
        action_taken: "Logged",
        ai_analysis: aiAnalysis
      });
    }

  } catch (error) {
    console.error("[AGENT] Error during execution:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🛡️ Ghost Threat Intel Agent running on port ${PORT}`);
  console.log(`💰 Agent USDC Wallet ID: ${THREAT_INTEL_AGENT_WALLET}`);
});
