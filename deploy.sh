#!/bin/bash

set -e

echo "🚀 Deploying Celestial Tarot Heroes to MultiversX Devnet..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | xargs)
else
    echo "❌ Error: .env file not found"
    echo "Copy deploy-devnet.env.example to .env and configure it"
    exit 1
fi

# Build smart contract
echo "📦 Building smart contract..."
cd contracts/celestial-heroes
sc-meta all build

if [ ! -f "output/celestial-heroes.wasm" ]; then
    echo "❌ Error: WASM file not found after build"
    exit 1
fi

echo "✅ Contract built successfully"

# Deploy to Devnet
echo "🌐 Deploying to Devnet..."
DEPLOY_OUTPUT=$(mxpy contract deploy \
    --bytecode=output/celestial-heroes.wasm \
    --pem="$WALLET_PEM_PATH" \
    --gas-limit=60000000 \
    --chain=D \
    --proxy=https://devnet-gateway.multiversx.com \
    --recall-nonce \
    --send)

echo "$DEPLOY_OUTPUT"

# Extract contract address
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oP 'erd1[a-z0-9]{58}' | head -1)

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "❌ Error: Could not extract contract address"
    exit 1
fi

echo "✅ Contract deployed at: $CONTRACT_ADDRESS"

# Update dApp config
cd ../../dapp

echo "📝 Updating dApp configuration..."
echo "REACT_APP_CONTRACT_ADDRESS=$CONTRACT_ADDRESS" > .env

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. cd dapp"
echo "2. npm install"
echo "3. npm start"
echo ""
echo "🔗 Contract Explorer: https://devnet-explorer.multiversx.com/accounts/$CONTRACT_ADDRESS"
