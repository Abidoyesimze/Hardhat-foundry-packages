// deploy.ts
import { ethers } from "hardhat";
import { DeployHelper } from "./deploy-helper";

async function main() {
  const deployHelper = new DeployHelper();
  const networkConfig = await deployHelper.getActiveNetworkConfig();

  // Deploy LuckyDraw
  const LuckyDraw = await ethers.getContractFactory("LuckyDraw");
  const luckyDraw = await LuckyDraw.deploy(
    networkConfig.dataFeed,
    networkConfig.coordinator,
    networkConfig.keyHash,
    networkConfig.accountId
  );
  await luckyDraw.getAddress();
  console.log("LuckyDraw deployed to:", luckyDraw.getAddress);

  // Deploy TokenERC20
  const TokenERC20 = await ethers.getContractFactory("TokenERC20");
  const tokenERC20 = await TokenERC20.deploy(luckyDraw.getAddress);
  await tokenERC20.getAddress();
  console.log("TokenERC20 deployed to:", tokenERC20.getAddress);

  return { luckyDraw, tokenERC20, deployHelper };
}