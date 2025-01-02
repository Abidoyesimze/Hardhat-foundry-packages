import { ethers } from "hardhat";

async function main() {
  console.log("Deploying the Token contract...");

  // Get the contract factory
  const Token = await ethers.getContractFactory("Token");

  // Deploy the contract (add constructor arguments if needed)
  const token = await Token.deploy(); // Replace with .deploy(arg1, arg2, ...) if the constructor has arguments

    // Get the deployed contract address
 const tokenAddress = await token.getAddress(); // Correctly await the resolved address

 console.log(`Token contract deployed to: ${tokenAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
