# Ghost Threat Intel Agent (Circle Agentic Economy Prize)

This repository contains the standalone, autonomous Agent built for the **Build with Gemini XPRIZE (Circle Agentic Economy Prize)**.

## What is this?
This is a Node.js microservice that acts as an autonomous threat intelligence syndicate. It is designed to be pinged by our primary, closed-source WordPress SaaS plugin (*Sovereign AI Overseer*). We built this standalone microservice specifically to demonstrate our agentic economy integration for the **Build with Gemini XPRIZE** without exposing the proprietary PHP core of our flagship product.

When a brute-force attack is detected by the WordPress plugin, the IP telemetry is sent here via a webhook. **Google Gemini 3.7 Flash** analyzes the payload. If the AI determines the threat is a "High-Level Botnet", the Agent **autonomously pays a bounty of 0.005 USDC** (a true nanopayment) to the detecting node using the **Circle Developer-Controlled Wallets SDK**.

This proves true agentic economic activity: The AI holds its own wallet, makes an executive decision based on real-time data, and settles funds in USDC without human intervention.

## Requirements
- Node.js 18+
- A Google Gemini API Key
- A Circle Web3 Services Account (Testnet)

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/devnet-microsystems/ghost-threat-intel-agent.git
   cd ghost-threat-intel-agent
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the `.env.example` file to `.env` and fill in your API keys and Wallet IDs:
   ```bash
   cp .env.example .env
   ```
4. Start the Agent:
   ```bash
   npm start
   ```

## API Endpoint
This endpoint is protected by HMAC-SHA256 authentication. You must sign the JSON payload using your `AGENT_SECRET` and include it in the `x-signature` header.

### Example Request (Node.js)
```javascript
const crypto = require('crypto');
const axios = require('axios');

const secret = 'YOUR_AGENT_SECRET';
const payload = JSON.stringify({
  ip_address: "198.51.100.22",
  failed_attempts: 15000,
  headers: {
    "user-agent": "Mozilla/5.0 ...",
    "x-attack-vector": "Distributed WebAuthn Sybil Attack"
  }
});

const signature = crypto.createHmac('sha256', payload).update(secret).digest('hex');

axios.post('https://YOUR_CLOUD_RUN_URL/api/analyze-threat', payload, {
  headers: {
    'Content-Type': 'application/json',
    'x-signature': signature
  }
}).then(res => console.log(res.data));
```

## Proof of Execution
- **Agent Wallet Address:** `0x414c34d815dcd1a87328c720fc19ecd81612feef` (Polygon Amoy Testnet)
- **Bounty Receiver Wallet:** `0x69b4f89aa5769bab67236d4a4410addcef8dd9ce`
- **Block Explorer URL:** `https://amoy.polygonscan.com/tx/0xf612acf9201f5c2e7ffc14f739ddbcd21f87cd76b7b058284cd3997f2b91d0ae`
- **Demo Video:** `https://youtu.be/vOTt2emA-gg`
