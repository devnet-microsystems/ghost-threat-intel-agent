#!/bin/bash
IP="185.220.101.14"
PAYLOAD='{"ip_address":"185.220.101.14","failed_attempts":4,"headers":{"user-agent":"Hydra-BruteForce/8.6","x-forwarded-for":"185.220.101.14","x-attack-vector":"JNDI:LDAP SQL_INJECTION"}}'
SECRET="SOVEREIGN_AGENT_SECRET_2026"
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')

curl -X POST http://localhost:4000/api/analyze-threat \
  -H "Content-Type: application/json" \
  -H "x-signature: $SIGNATURE" \
  -d "$PAYLOAD"
echo ""
