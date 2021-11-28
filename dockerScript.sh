#!/bin/bash
npm run start & sleep 300 && npx hardhat run scripts/transferTokens.ts --network localhost & npx hardhat run scripts/simSetup.ts --network localhost
