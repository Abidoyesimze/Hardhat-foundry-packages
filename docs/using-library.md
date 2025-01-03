# OpenZeppelin Library

## Introduction
A library for secure smart contract development. Build on a solid foundation of community-vetted code.

- **Implementations**: Standards like ERC20 and ERC721.
- **Permissioning Scheme**: Flexible role-based.
- **Reusable Components**: Build custom contracts and complex decentralized systems.

---

## Use of Interactive Wizard

### OpenZeppelin Wizard
An interactive widget to create popular standards like ERC20, ERC721, KIP7, KIP17, etc.

### Kaiachain Wizard
A similar interactive tool tailored for Kaiachain standards.

---

## Using with Hardhat

This package adds functions to your Hardhat scripts to deploy and upgrade proxies for your contracts. Depends on ethers.js.

Check out the step-by-step tutorial, which demonstrates the process from creating, testing, and deploying, all the way through to upgrading with Gnosis Safe.

### Installation
```bash
$ npm install --save-dev @openzeppelin/hardhat-upgrades
$ npm install --save-dev @nomicfoundation/hardhat-ethers ethers # peer dependencies
```

And register the plugin in your `hardhat.config.js`:

```javascript
require('@openzeppelin/hardhat-upgrades');
```

---

## Usage in Scripts

### Proxies
You can use this plugin in a Hardhat script to deploy an upgradeable instance of one of your contracts via the `deployProxy` function:

```javascript
// scripts/create-box.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const Box = await ethers.getContractFactory("Box");
  const box = await upgrades.deployProxy(Box, [42]);
  await box.waitForDeployment();
  console.log("Box deployed to:", await box.getAddress());
}

main();
