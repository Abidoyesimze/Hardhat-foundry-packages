// draw-lucky-draw.ts
import { ethers } from "hardhat";
import { Contract } from "ethers";

async function main() {
  const ORAKL_PREPAYMENT_ADDRESS = "0x8d3A1663d10eEb0bC9C9e537e1BBeA69383194e7";
  
  // Get deployed contract addresses from your deployment history
  // You'll need to implement your own way to track deployed addresses
  const LUCKY_DRAW_ADDRESS = process.env.LUCKY_DRAW_ADDRESS;
  const TOKEN_ERC20_ADDRESS = process.env.TOKEN_ERC20_ADDRESS;

  if (!LUCKY_DRAW_ADDRESS || !TOKEN_ERC20_ADDRESS) {
    throw new Error("Missing contract addresses in environment variables");
  }

  const prepayment = await ethers.getContractAt("IPrepayment", ORAKL_PREPAYMENT_ADDRESS);
  const luckyDraw = await ethers.getContractAt("LuckyDraw", LUCKY_DRAW_ADDRESS);

  // Add consumer
  await prepayment.addConsumer(777, LUCKY_DRAW_ADDRESS);
  console.log("Added consumer");

  // Set ERC20 token
  await luckyDraw.setERC20Token(TOKEN_ERC20_ADDRESS);
  console.log("Set ERC20 Token");

  // Request random words
  await luckyDraw.requestRandomWords();
  console.log("Drawn LuckyDraw");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });