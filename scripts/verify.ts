// Example verification script (scripts/verify.ts)
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { KaiaHardhatSourcifySDK } from "../src/kaia-sourcify-sdk";

async function main() {
  const hre = require("hardhat");
  const sdk = new KaiaHardhatSourcifySDK(hre);

  try {
    // Example verification
    await sdk.verifyContract({
      contractAddress: "0xAE94cF00Af538b39c6caC0d0Dbbbe0Bf459dD6f7",
      contractPath: "contracts/Token.sol",
    //  constructorArgs: ["Token Name", "SYMBOL"] // Optional
    });

    // Check verification status
    const isVerified = await sdk.isVerified("0xYourContractAddress");
    console.log(`Verification status: ${isVerified ? "Verified" : "Not Verified"}`);
  } catch (error) {
    console.error("Verification failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });