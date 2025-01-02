# Kaia Sourcify SDK
The Kaia Sourcify SDK simplifies the deployment and verification of smart contracts on the Kaia network using Sourcify.

Kaia_Sorcify_Ts SDK integrates with Hardhat and includes tools for contract deployment, verification, and verification status checks.

## Features

- Deployment: Easily deploy contracts to the Kaia network.

- Verification: Verify deployed contracts with Sourcify.

- Status Check: Check if a contract is already verified.

## Prerequisites

- Node.js (v16 or later)
- Hardhat installed
- A funded account with access to the Kaia network
- RPC endpoints for kairos and kaia networks

## Installation

Clone this repository:

git clone <https://github.com/Abidoyesimze/Hardhat-foundry-packages>

cd kaia-sourcify-sdk

## Install Dependencies

npm install
use `npm init -y`

Configure environment variables:

Create a `.env` file and add your signer

`SIGNER=your_signer_here`

## Hardhat Configuration

Ensure your hardhat.config.ts is configured for the Kaia or kairos network:

```

  networks: {
    kairos: {
      chainId: 1001,
      url: "https://responsive-green-emerald.kaia-kairos.quiknode.pro/",
      accounts: process.env.SIGNER ? [process.env.SIGNER] : [],
    },

    kaia: {
      chainId: 8217,
      url: "https://public-en.node.kaia.io",
      accounts: process.env.SIGNER ? [process.env.SIGNER] : [],
    },
  }
```
### Usage
1. `Deploy a Contract`
Create a deployment script, e.g., scripts/deploy.ts:

Run the script:

```
npx hardhat run scripts/deploy.ts --network kairos
```

2. `Verify a Contract`
Use the SDK to verify a deployed contract and run the verification script:
```
npx hardhat run scripts/verify.ts --network kairos
```

### Troubleshooting
- Error: Insufficient Funds
- Ensure your deployer account is funded with native tokens (e.g., KLAY).
- Verification Failed
- Verify that the contract bytecode matches the deployed code.
- Ensure compiler settings (e.g., optimizer) are consistent during deployment and verification.

## License
This project is licensed under the MIT License.



