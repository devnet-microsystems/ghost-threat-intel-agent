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
   git clone https://github.com/DevMicrosystemsLTD/ghost-threat-intel-agent.git
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
Send a POST request to `/api/analyze-threat` with the following JSON payload:
```json
{
  "ip_address": "192.168.1.100",
  "failed_attempts": 5,
  "headers": {
    "User-Agent": "python-requests/2.25.1",
    "Accept": "*/*"
  }
}
```

## Proof of Execution
- **Agent Wallet Address:** `0x166f7f48331e30fabe1649ee8edb68f2afcdf2f1` (Arbitrum Sepolia Testnet)
- **Bounty Receiver Wallet:** `0x2b5c290e8c6f06ef5cbc53358637b6123f1f8421`
- **Block Explorer URL:** `[INSERT_YOUR_TRANSACTION_URL_HERE]`
- **Demo Video:** `[INSERT_YOUTUBE_OR_LOOM_LINK_HERE]`
