// deploy-helper.ts
import { ethers } from "hardhat";
import { MockDataFeedAggregator } from "../typechain-types";

interface NetworkConfig {
  dataFeed: string;
  coordinator: string;
  keyHash: string;
  accountId: number;
  pythDataFeed: string;
}

export class DeployHelper {
  private activeNetworkConfig: NetworkConfig;
  private readonly DECIMALS = 8;
  private readonly INITIAL_PRICE = "15000000"; // 0.15 with 8 decimals

  constructor() {
    const chainId = process.env.CHAIN_ID ? parseInt(process.env.CHAIN_ID) : 31337; // Default to localhost

    if (chainId === 1001) {
      this.activeNetworkConfig = this.getKaiaKairosConfig();
    } else if (chainId === 8217) {
      this.activeNetworkConfig = this.getKaiaMainnetConfig();
    } else {
      this.activeNetworkConfig = this.getLocalConfig();
    }
  }

  private getKaiaKairosConfig(): NetworkConfig {
    return {
      dataFeed: "0x1408cb13D84bA8Cb533FdF332db5D78290B071C9",
      coordinator: "0xDA8c0A00A372503aa6EC80f9b29Cc97C454bE499",
      keyHash: "0xd9af33106d664a53cb9946df5cd81a30695f5b72224ee64e798b278af812779c",
      accountId: 777,
      pythDataFeed: "0x2880aB155794e7179c9eE2e38200202908C17B43"
    };
  }

  private getKaiaMainnetConfig(): NetworkConfig {
    return {
      dataFeed: "0x6a08d36e8C10D5d89529c7443cEBF37EA2cd01D4",
      coordinator: "0x3F247f70DC083A2907B8E76635986fd09AA80EFb",
      keyHash: "0x6cff5233743b3c0321a19ae11ab38ae0ddc7ddfe1e91b162fa8bb657488fb157",
      accountId: 777,
      pythDataFeed: "0x2880aB155794e7179c9eE2e38200202908C17B43"
    };
  }

  private async getLocalConfig(): Promise<NetworkConfig> {
    if (this.activeNetworkConfig?.dataFeed) {
      return this.activeNetworkConfig;
    }

    const MockDataFeed = await ethers.getContractFactory("MockDataFeedAggregator");
    const mockDataFeed = await MockDataFeed.deploy(this.DECIMALS, this.INITIAL_PRICE);
    await mockDataFeed.getAddress();

    console.log("MockDataFeed deployed to:", mockDataFeed.getAddress);

    return {
      dataFeed: mockDataFeed.getAddress,
      coordinator: "0xDA8c0A00A372503aa6EC80f9b29Cc97C454bE499",
      keyHash: "0xd9af33106d664a53cb9946df5cd81a30695f5b72224ee64e798b278af812779c",
      accountId: 777,
      pythDataFeed: "0x2880aB155794e7179c9eE2e38200202908C17B43"
    };
  }

  public async getActiveNetworkConfig(): Promise<NetworkConfig> {
    if (process.env.CHAIN_ID === "31337") {
      return await this.getLocalConfig();
    }
    return this.activeNetworkConfig;
  }
}