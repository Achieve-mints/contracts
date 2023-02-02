import { ethers, upgrades } from "hardhat";
import { expect } from "./chai-setup";
import { Signer } from "ethers";
import { SoulBoundBaseToken } from "../typechain/SoulBoundBaseToken";
import { ExampleToken } from "../typechain/ExampleToken";

describe("SubToken Unit Tests", () => {
  let signers: Signer[];
  // let deployer: Signer;
  let owner: Signer;
  let user1: Signer;
  let user2: Signer;

  let base: SoulBoundBaseToken;
  let ex1: ExampleToken;

  beforeEach("Deploy and initialize", async () => {
    signers = await ethers.getSigners();
    owner = signers[0];
    user1 = signers[1];
    user2 = signers[2];

    const SoulBoundBaseToken = await ethers.getContractFactory(
      "SoulBoundBaseToken"
    );
    base = (await upgrades.deployProxy(SoulBoundBaseToken, [
      /* no construct params */
    ])) as SoulBoundBaseToken;
    await base.deployed();
    // console.log("SoulBoundBaseToken deployed to:", base.address);
    const ExampleToken = await ethers.getContractFactory(
      "ExampleToken"
    );
    ex1 = await ExampleToken.deploy(base.address)
  });

  describe("set subtoken", () => {
    it("check enabling subtoken works", async () => {
      expect(
        await base
          .connect(owner)
          .setSubToken(ex1.address, true)
      );
      expect(
        await base._subTokensEnabled(ex1.address)
      ).to.equal(true);
    });
    it("check disabling subtoken works", async () => {
      expect(
        await base
          .connect(owner)
          .setSubToken(ex1.address, true)
      );
      expect(
        await base
          .connect(owner)
          .setSubToken(ex1.address, false)
      );
      expect(
        await base._subTokensEnabled(ex1.address)
      ).to.equal(false);
    });
  });

  describe("mint ex1", () => {
    it("perform mint", async () => {
      expect(
        await base
          .connect(owner)
          .setSubToken(ex1.address, true)
      );

      await expect(
        ex1
          .connect(user1)
          .mint("test data here")
      ).to.emit(base, "Mint")
      .withArgs(await user1.getAddress(), ex1.address, 1);
    });

    it("check owner from mint", async () => {
      expect(
        await base
          .connect(owner)
          .setSubToken(ex1.address, true)
      );

      await expect(
        ex1
          .connect(user1)
          .mint("test data here")
      ).to.emit(base, "Mint")
      .withArgs(await user1.getAddress(), ex1.address, 1);

      expect(
        await base.ownerOf(1)
      ).to.equal(await user1.getAddress());
    });

    it("check metadata", async () => {
      expect(
        await base
          .connect(owner)
          .setSubToken(ex1.address, true)
      );

      await expect(
        ex1
          .connect(user1)
          .mint("test data here")
      ).to.emit(base, "Mint")
      .withArgs(await user1.getAddress(), ex1.address, 1);

      const abiCoder = new ethers.utils.AbiCoder();

      const metadata = await base
          .connect(user1)
          .metadata(1)
      const decoded = abiCoder.decode(["string"], metadata);
      expect(decoded[0]).to.equal("test data here");
    });
  });

  describe("transfer nft", () => {
    it("check that we cannot transfer the nft", async () => {
      expect(
        await base
          .connect(owner)
          .setSubToken(ex1.address, true)
      );

      await expect(
        ex1
          .connect(user1)
          .mint("test data here")
      ).to.emit(base, "Mint")
      .withArgs(await user1.getAddress(), ex1.address, 1);

      await expect(base.connect(user1).transferFrom(
        await user1.getAddress(),
        await user2.getAddress(),
        1
      )).to.be.reverted;
    });
  });
});
