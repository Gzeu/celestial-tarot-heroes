#!/bin/bash

set -e

echo "🚀 Deploying Celestial Tarot Heroes MVP to Devnet..."

# Build MVP contract
echo "📦 Building MVP contract..."
cd contracts/celestial-heroes-mvp
sc-meta all build

if [ ! -f "output/celestial-heroes-mvp.wasm" ]; then
    echo "❌ Error: WASM file not found"
    exit 1
fi

echo "✅ MVP contract built"

# Deploy
echo "🌐 Deploying to Devnet..."
DEPLOY_OUTPUT=$(mxpy contract deploy \
    --bytecode=output/celestial-heroes-mvp.wasm \
    --pem="$HOME/wallet-devnet.pem" \
    --gas-limit=20000000 \
    --chain=D \
    --proxy=https://devnet-gateway.multiversx.com \
    --recall-nonce \
    --send)

echo "$DEPLOY_OUTPUT"

CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oP 'erd1[a-z0-9]{58}' | head -1)

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "❌ Error: Could not extract contract address"
    exit 1
fi

echo ""
echo "✅ MVP Deployed!"
echo "Contract: $CONTRACT_ADDRESS"
echo "Explorer: https://devnet-explorer.multiversx.com/accounts/$CONTRACT_ADDRESS"
echo ""
echo "Next: Update dapp/.env with:"
echo "REACT_APP_CONTRACT_ADDRESS=$CONTRACT_ADDRESS"
