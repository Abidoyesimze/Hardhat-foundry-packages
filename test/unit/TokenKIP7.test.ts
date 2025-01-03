// test/TokenKIP7.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("TokenKIP7", function () {
  let tokenKIP7: Contract;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let spender: SignerWithAddress;

  before(async function () {
    [owner, user, spender] = await ethers.getSigners();
  });

  beforeEach(async function () {
    const TokenKIP7 = await ethers.getContractFactory("TokenKIP7");
    tokenKIP7 = await TokenKIP7.connect(user).deploy();
    await tokenKIP7.deployed();
  });

  it("should set the correct owner", async function () {
    expect(await tokenKIP7.owner()).to.equal(user.address);
  });

  it("should have correct symbol", async function () {
    expect(await tokenKIP7.symbol()).to.equal("TKIP7");
  });

  it("should have correct name", async function () {
    expect(await tokenKIP7.name()).to.equal("Token KIP7");
  });

  it("should allow owner to mint tokens", async function () {
    await tokenKIP7.connect(user).mint(user.address, 100);
    expect(await tokenKIP7.balanceOf(user.address)).to.equal(100);
  });

  it("should set correct allowance", async function () {
    await tokenKIP7.connect(user).approve(spender.address, 100);
    expect(await tokenKIP7.allowance(user.address, spender.address)).to.equal(100);
  });

  it("should not allow spending without allowance", async function () {
    await tokenKIP7.connect(user).mint(user.address, 100);
    
    await expect(
      tokenKIP7.transferFrom(user.address, spender.address, 100)
    ).to.be.revertedWith("Cannot spend with no allowance");
  });
});