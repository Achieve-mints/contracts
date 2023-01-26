import { ethers, upgrades } from "hardhat";
import { expect } from "./chai-setup";
import { Signer } from "ethers";
import { SoulBoundBaseToken } from "../typechain/SoulBoundBaseToken";

describe("SoulBound Base Unit Tests", () => {
  let signers: Signer[];
  // let deployer: Signer;
  let owner: Signer;
  let user1: Signer;
  let user2: Signer;

  let base: SoulBoundBaseToken;

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
  });

  describe("initialization", () => {
    it("it should be impossible to initialize contract after deploy", async () => {
      await expect(base.initialize()).to.be.reverted;
    });
  });

  describe("base uri", () => {
    it("set base uri [by owner]", async () => {
      await expect(base.connect(owner).setBaseURI("testuri"));
    });
    it("set base uri [by non-owner]", async () => {
      await expect(base.connect(user1).setBaseURI("testuri")).to.be.reverted;
    });
  });

  describe("roles", () => {
    const DEFAULT_ADMIN_ROLE_CODE =
      "0x0000000000000000000000000000000000000000000000000000000000000000";

    it("get DEFAULT_ADMIN_ROLE", async () => {
      expect(await base.DEFAULT_ADMIN_ROLE()).to.equal(DEFAULT_ADMIN_ROLE_CODE);
    });
    it("check owner has DEFAULT_ADMIN_ROLE", async () => {
      expect(
        await base.hasRole(DEFAULT_ADMIN_ROLE_CODE, await owner.getAddress())
      ).to.equal(true);
    });
    it("check user1 does not have DEFAULT_ADMIN_ROLE", async () => {
      expect(
        await base.hasRole(DEFAULT_ADMIN_ROLE_CODE, await user1.getAddress())
      ).to.equal(false);
    });
    it("check granting admin role to user1 works", async () => {
      expect(
        await base
          .connect(owner)
          .grantRole(DEFAULT_ADMIN_ROLE_CODE, await user1.getAddress())
      );
      expect(
        await base.hasRole(DEFAULT_ADMIN_ROLE_CODE, await user1.getAddress())
      ).to.equal(true);
    });
    it("check revoking admin role from user1 works", async () => {
      expect(
        await base
          .connect(owner)
          .grantRole(DEFAULT_ADMIN_ROLE_CODE, await user1.getAddress())
      );
      expect(
        await base.hasRole(DEFAULT_ADMIN_ROLE_CODE, await user1.getAddress())
      ).to.equal(true);
      expect(
        await base
          .connect(owner)
          .revokeRole(DEFAULT_ADMIN_ROLE_CODE, await user1.getAddress())
      );
      expect(
        await base.hasRole(DEFAULT_ADMIN_ROLE_CODE, await user1.getAddress())
      ).to.equal(false);
    });
    it("check revoking admin role from owner works", async () => {
      expect(
        await base.hasRole(DEFAULT_ADMIN_ROLE_CODE, await owner.getAddress())
      ).to.equal(true);
      expect(
        await base
          .connect(owner)
          .grantRole(DEFAULT_ADMIN_ROLE_CODE, await user1.getAddress())
      );
      expect(
        await base.hasRole(DEFAULT_ADMIN_ROLE_CODE, await user1.getAddress())
      ).to.equal(true);
      expect(
        await base
          .connect(user1)
          .revokeRole(DEFAULT_ADMIN_ROLE_CODE, await owner.getAddress())
      );
      expect(
        await base.hasRole(DEFAULT_ADMIN_ROLE_CODE, await owner.getAddress())
      ).to.equal(false);
    });
    it("check renouncing admin role from owner works", async () => {
      expect(
        await base.hasRole(DEFAULT_ADMIN_ROLE_CODE, await owner.getAddress())
      ).to.equal(true);
      expect(
        await base
          .connect(owner)
          .renounceRole(DEFAULT_ADMIN_ROLE_CODE, await owner.getAddress())
      );
      expect(
        await base.hasRole(DEFAULT_ADMIN_ROLE_CODE, await owner.getAddress())
      ).to.equal(false);
    });
  });

  describe("meta", () => {
    it("get name", async () => {
      expect(await base.name()).to.equal("Test");
    });
    it("get symbol", async () => {
      expect(await base.symbol()).to.equal("TST");
    });
  });
});
