// test/TokenERC20.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("TokenERC20", function () {
  let tokenERC20: Contract;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let spender: SignerWithAddress;

  before(async function () {
    [owner, user, spender] = await ethers.getSigners();
  });

  beforeEach(async function () {
    const TokenERC20 = await ethers.getContractFactory("TokenERC20");
    tokenERC20 = await TokenERC20.deploy(user.address);
    await tokenERC20.deployed();
  });

  it("should set the correct owner", async function () {
    expect(await tokenERC20.owner()).to.equal(user.address);
  });

  it("should have correct symbol", async function () {
    expect(await tokenERC20.symbol()).to.equal("TERC20");
  });

  it("should have correct name", async function () {
    expect(await tokenERC20.name()).to.equal("Token ERC20");
  });

  it("should allow owner to mint tokens", async function () {
    await tokenERC20.connect(user).mint(user.address, 100);
    expect(await tokenERC20.balanceOf(user.address)).to.equal(100);
  });

  it("should set correct allowance", async function () {
    await tokenERC20.connect(user).approve(spender.address, 100);
    expect(await tokenERC20.allowance(user.address, spender.address)).to.equal(100);
  });

  it("should not allow spending without allowance", async function () {
    await tokenERC20.connect(user).mint(user.address, 100);
    
    await expect(
      tokenERC20.transferFrom(user.address, spender.address, 100)
    ).to.be.revertedWith("Cannot spend with no allowance");
  });
});