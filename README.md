# Dappazon
## reference:
Dapp University

## Limitation:

- the chrome browser can any have Metamask, anotherwise cannot buy products
- the wallet will be logged out when page refresh
- For localhost testnet only
- browser provider cannot find chainId 31337 and only returns mainnet(ETH) , but using JsonRpcProvider works
- the program is based on ethers 5.7, v6 will not be work as big change invloved.

## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/)

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`$ npm install`

### 3. Run tests
`$ npx hardhat test`

### 4. Start Hardhat node
`$ npx hardhat node`

### 5. Run deployment script
In a separate terminal execute:
`$ npx hardhat run ./scripts/deploy.js --network localhost`

### 6. Start frontend
`$ npm run start`
