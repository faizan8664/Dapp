# Digital ATM React DApp 

## Overview

Welcome to the Digital ATM React DApp! This project combines Ethereum, Solidity, and React to create a simple decentralized application. Users can connect their MetaMask wallet, manage funds, and track transaction history.

## Smart Contract (Solidity)

The heart of this DApp is the smart contract (`Assessment.sol`) written in Solidity. It lives on the Ethereum blockchain at address `0x5FbDB2315678afecb367f032d93F642f64180aa3`. The contract handles deposits, withdrawals, and provides some extra features like array and string matching.

## Frontend (React)

The frontend, built with React, lets users interact with their Ethereum wallet via MetaMask. You can check your balance, deposit, withdraw, switch between light and dark mode, and view transaction history.

## Usage

- Connect your MetaMask wallet.
- Check your balance and transaction history.
- Deposit and withdraw funds.
- Toggle between light and dark mode.
- View detailed transaction info using QR codes.

## Smart Contract Deployment

The smart contract is already deployed on Ethereum at `0x5FbDB2315678afecb367f032d93F642f64180aa3`. If needed, update the contract address in the React app.

## Technologies Used

- Solidity
- Ethereum
- React
- MetaMask
- ethers.js
- Hardhat (for local development and testing)

# Starter Next/Hardhat Project

After cloning the github, you will want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal type:npm install qrcode.react then  npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/

## Author

mohammed faiz
mohammedfaiz866@gmail.com
