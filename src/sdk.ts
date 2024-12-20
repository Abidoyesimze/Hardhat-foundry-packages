// src/sdk.ts

import axios from 'axios';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
// Added imports for Node.js environment compatibility
import FormData from 'form-data';
import { Blob } from 'buffer';

dotenv.config();

const KAIA_CHAIN_ID = 1001;
const SOURCIFY_URL = 'https://sourcify.dev/server';

interface VerificationResponse {
  status: 'success' | 'failure';
  message: string;
  result?: {
    address: string;
    status: string;
    timestamp: string;
  };
}

interface ContractVerificationParams {
  contractAddress: string;
  sourcePath: string;
}

export class KaiaSourcifySDK {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;

  constructor() {
    const rpcUrl = process.env.KAIA_RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;

    if (!rpcUrl) {
      throw new Error('KAIA_RPC_URL not found in environment variables');
    }

    if (!privateKey) {
      throw new Error('PRIVATE_KEY not found in environment variables');
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);
  }

  /**
   * Read and validate contract source code
   * @param sourcePath Path to the contract source code file
   * @returns Contract source code
   */
  private readContractSource(sourcePath: string): string {
    try {
      const absolutePath = path.resolve(sourcePath);
      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Contract source file not found at ${sourcePath}`);
      }
      return fs.readFileSync(absolutePath, 'utf8');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to read contract source: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Extract contract name from source path
   * @param sourcePath Path to contract source file
   * @returns Contract name
   */
  private getContractName(sourcePath: string): string {
    const fileName = path.basename(sourcePath, '.sol');
    const sourceCode = this.readContractSource(sourcePath);
    
    // Try to find the contract name in the source code
    const contractMatch = sourceCode.match(/contract\s+(\w+)/);
    if (contractMatch && contractMatch[1]) {
      return contractMatch[1];
    }
    
    return fileName;
  }

  /**
   * Verify a smart contract on Kaia chain using Sourcify
   * @param params Contract verification parameters
   * @returns Promise<VerificationResponse>
   */
  async verifyContract(params: ContractVerificationParams): Promise<VerificationResponse> {
    try {
      const { contractAddress, sourcePath } = params;

      // Validate contract address
      if (!ethers.isAddress(contractAddress)) {
        throw new Error('Invalid contract address');
      }

      // Get contract bytecode
      const bytecode = await this.provider.getCode(contractAddress);
      if (bytecode === '0x') {
        throw new Error('Contract not deployed at specified address');
      }

      // Read contract source code
      const sourceCode = this.readContractSource(sourcePath);
      const contractName = this.getContractName(sourcePath);

      // Prepare verification request
      const formData = new FormData();
      formData.append('address', contractAddress);
      formData.append('chain', KAIA_CHAIN_ID.toString());
      formData.append('files', new Blob([sourceCode], { type: 'text/plain' }), path.basename(sourcePath));
      formData.append('contractName', contractName);

      // Send verification request
      const response = await axios.post(
        `${SOURCIFY_URL}/verify`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return {
        status: 'success',
        message: 'Contract verified successfully',
        result: response.data
      };
    } catch (error) {
      return {
        status: 'failure',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Check if a contract is verified on Sourcify
   * @param contractAddress Address of the contract to check
   * @returns Promise<boolean>
   */
  async isVerified(contractAddress: string): Promise<boolean> {
    try {
      if (!ethers.isAddress(contractAddress)) {
        throw new Error('Invalid contract address');
      }

      const response = await axios.get(
        `${SOURCIFY_URL}/check/${KAIA_CHAIN_ID}/${contractAddress}`
      );
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get metadata for a verified contract
   * @param contractAddress Address of the contract
   * @returns Promise<any>
   */
  async getContractMetadata(contractAddress: string): Promise<any> {
    try {
      if (!ethers.isAddress(contractAddress)) {
        throw new Error('Invalid contract address');
      }

      const response = await axios.get(
        `${SOURCIFY_URL}/files/${KAIA_CHAIN_ID}/${contractAddress}`
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch contract metadata');
    }
  }
}
