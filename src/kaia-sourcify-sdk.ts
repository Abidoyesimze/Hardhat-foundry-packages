// src/kaia-sourcify-sdk.ts
import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as path from "path";
import axios from "axios";

interface VerificationParams {
  contractAddress: string;  // Address of the deployed contract
  contractPath: string;     // Path to the contract file (e.g., "contracts/Token.sol")
  constructorArgs?: any[];  // Optional constructor arguments
}

export class KaiaHardhatSourcifySDK {
  private hre: HardhatRuntimeEnvironment;
  
  constructor(hre: HardhatRuntimeEnvironment) {
    this.hre = hre;
  }

  /**
   * Extract contract name from source file
   */
  private getContractName(contractPath: string): string {
    const contractName = path.basename(contractPath, '.sol');
    return `${contractPath}:${contractName}`;
  }

  /**
   * Verify a contract using Sourcify
   */
  async verifyContract(params: VerificationParams): Promise<void> {
    const { contractAddress, contractPath, constructorArgs = [] } = params;

    try {
      // Get the full contract identifier
      const contractIdentifier = this.getContractName(contractPath);

      console.log(`Verifying contract at ${contractAddress}...`);
      console.log(`Contract: ${contractIdentifier}`);
      
      if (constructorArgs.length > 0) {
        console.log(`Constructor arguments: ${constructorArgs.join(', ')}`);
      }

      // Attempt verification
      await this.hre.run("verify:verify", {
        address: contractAddress,
        contract: contractIdentifier,
        constructorArguments: constructorArgs,
      });

      console.log("Contract verified successfully!");
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Verification failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Check if a contract is already verified
   */
  async isVerified(contractAddress: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.hre.config.sourcify.apiUrl}/check/1001/${contractAddress}`
      );
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}