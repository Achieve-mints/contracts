import { ethers, upgrades } from "hardhat";
import { expect } from "./chai-setup";
import { Signer } from "ethers";
import { SoulBoundBaseToken } from "../typechain/SoulBoundBaseToken";
import { ChiknMerchToken } from "../typechain/ChiknMerchToken";

describe("ChiknMerch Unit Tests", () => {
  let signers: Signer[];
  let deployer: Signer;
  let owner: Signer;
  let user1: Signer;
  let user2: Signer;

  let base: SoulBoundBaseToken;
  let chiknMerchToken: ChiknMerchToken;

  beforeEach("Deploy and initialize", async () => {
    signers = await ethers.getSigners();
    deployer = signers[0];
    owner = signers[1];
    user1 = signers[2];
    user2 = signers[3];

    const SoulBoundBaseToken = await ethers.getContractFactory(
      "SoulBoundBaseToken"
    );
    base = (await upgrades.deployProxy(SoulBoundBaseToken, [
      /* no construct params */
    ])) as SoulBoundBaseToken;
    await base.deployed();
    // console.log("SoulBoundBaseToken deployed to:", base.address);
    const ChiknMerchToken = await ethers.getContractFactory(
      "ChiknMerchToken"
    );
    chiknMerchToken = await ChiknMerchToken.deploy(base.address)

    await (await base
      .connect(deployer)
      .setSubToken(chiknMerchToken.address, true)
    ).wait();

    await (await chiknMerchToken
      .connect(deployer)
      .transferOwnership(await owner.getAddress())
    ).wait();
  });

  describe("mint chiknmerch", () => {
    it("perform mint", async () => {
      await expect(chiknMerchToken
        .connect(owner)
        .mint(await user1.getAddress(), '12345')
      ).to.emit(base, "Mint")
      .withArgs(await user1.getAddress(), chiknMerchToken.address, 1);
    });

    it("check owner from mint", async () => {
      await expect(chiknMerchToken
        .connect(owner)
        .mint(await user1.getAddress(), '12345')
      ).to.emit(base, "Mint")
      .withArgs(await user1.getAddress(), chiknMerchToken.address, 1);

      expect(
        await base.ownerOf(1)
      ).to.equal(await user1.getAddress());
    });

    it("same account cannot receive twice", async () => {
      await expect(chiknMerchToken
        .connect(owner)
        .mint(await user1.getAddress(), '12345')
      ).to.emit(base, "Mint")
      .withArgs(await user1.getAddress(), chiknMerchToken.address, 1);

      await expect(chiknMerchToken
        .connect(owner)
        .mint(await user1.getAddress(), '54321')
      ).to.be.revertedWith('already claimed');
    });

    it("same code cannot be used twice", async () => {
      await expect(chiknMerchToken
        .connect(owner)
        .mint(await user1.getAddress(), '12345')
      ).to.emit(base, "Mint")
      .withArgs(await user1.getAddress(), chiknMerchToken.address, 1);

      await expect(chiknMerchToken
        .connect(owner)
        .mint(await user2.getAddress(), '12345')
      ).to.be.revertedWith('code already claimed');
    });

    it("check metadata", async () => {
      await expect(chiknMerchToken
        .connect(owner)
        .mint(await user1.getAddress(), '12345')
      ).to.emit(base, "Mint")
      .withArgs(await user1.getAddress(), chiknMerchToken.address, 1);

      const abiCoder = new ethers.utils.AbiCoder();

      const metadata = await base.metadata(1)
      const decoded = abiCoder.decode(["string"], metadata);
      expect(decoded[0]).to.equal("12345");
    });
  });
});
