const Token = artifacts.require("Gold");
const helper = require("./helpers/truffleTestHelper");

contract("Gold", async (accounts) => {
  const OWNER = accounts[0];
  const ALICE = accounts[1];
  const BOB = accounts[2];
  const FEE_HOLDER = accounts[3];

  beforeEach(async () => {
    tokenInstance = await Token.new();
  });

  describe("ERC20 tests", async () => {
    it("should test ERC20 public properties", async () => {
      const name = await tokenInstance.name();
      assert.equal(name, "Gold Standard", "Name should be Gold Standard");

      const symbol = await tokenInstance.symbol();
      assert.equal(symbol, "AUS", "Symbol should be AUS");
    });

    it("Total supply should be 0", async () => {
      const actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 0, "Total supply should be 0");
    });

    it("Owner balance should be 0", async () => {
      const actual = await tokenInstance.balanceOf(OWNER);
      assert.equal(actual.valueOf(), 0, "Balance should be 0");
    });
  });

  describe("Mint and burn tests", async () => {
    it("should not mint to invalid location", async () => {
      try {
        await tokenInstance.mint(OWNER, "0x00", 1337);
      } catch (error) {
        assert(error);
        assert.equal(
          error.reason,
          "Invalid location or serial",
          `Incorrect revert reason: ${error.reason}`
        );
      }
    });

    it("should not mint with an invalid serial", async () => {
      try {
        await tokenInstance.mint(OWNER, "0x00", 1337);
      } catch (error) {
        assert(error);
        assert.equal(
          error.reason,
          "Invalid location or serial",
          `Incorrect revert reason: ${error.reason}`
        );
      }
    });

    it("should mint 1337 tokens", async () => {
      await tokenInstance.mint(ALICE, "0x01", 1337);

      const balance = await tokenInstance.balanceOf(ALICE);
      assert.equal(balance.valueOf(), 1337, "Balance should be 1337");

      const actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 1337, "Total supply should be 1337");

      const count = await tokenInstance.stockCount();
      assert.equal(count.valueOf(), 1, "Total stock should be 1");
    });

    it("should not burn with different serial", async () => {
      await tokenInstance.mint(OWNER, "0x01", 100);

      let balance = await tokenInstance.balanceOf(OWNER);
      assert.equal(balance.valueOf(), 100, "Balance should be 100");

      let actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 100, "Total supply should be 100");

      try {
        await tokenInstance.burn("0x99");
      } catch (error) {
        assert(error);
        assert.equal(
          error.reason,
          "Invalid stock",
          `Incorrect revert reason: ${error.reason}`
        );
      }

      actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 100, "Total supply should be 100");

      balance = await tokenInstance.balanceOf(OWNER);
      assert.equal(balance.valueOf(), 100, "Balance should be 100");
    });

    it("should burn 100 of 100 tokens", async () => {
      await tokenInstance.mint(OWNER, "0x01", 100);

      let balance = await tokenInstance.balanceOf(OWNER);
      assert.equal(balance.valueOf(), 100, "Balance should be 100");

      let actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 100, "Total supply should be 100");

      await tokenInstance.burn("0x01");

      actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 0, "Total supply should be 0");

      balance = await tokenInstance.balanceOf(OWNER);
      assert.equal(balance.valueOf(), 0, "Balance should be 0");

      const count = await tokenInstance.stockCount();
      assert.equal(count.valueOf(), 0, "Total stock should be 0");
    });

    it("should not burn more than owners holdings", async () => {
      await tokenInstance.mint(OWNER, "0x01", 100);

      let balance = await tokenInstance.balanceOf(OWNER);
      assert.equal(balance.valueOf(), 100, "Balance should be 100");

      let actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 100, "Total supply should be 100");

      await tokenInstance.transfer(BOB, 90);

      let balance = await tokenInstance.balanceOf(BOB);
      assert.equal(balance.valueOf(), 90, "Balance should be 90");

      try {
        await tokenInstance.burn("0x01");
      } catch (error) {
        assert(error);
        assert.equal(
          error.reason,
          "Cannot burn more than you own",
          `Incorrect revert reason: ${error.reason}`
        );
      }
    });
  });

  describe("With 10 grams (100,000 tokens) minted balance", async () => {
    beforeEach(async () => {
      await tokenInstance.mint(OWNER, "0x01", 100000);
    });

    it("should transfer 1 gram (10000 tokens) from owner to bob (no fees)", async () => {
      await tokenInstance.transfer(BOB, 10000);
      let actual = await tokenInstance.balanceOf(OWNER);
      assert.equal(Number(actual), 90000, "Owner balance should be 9 grams");

      actual = await tokenInstance.balanceOf(BOB);
      assert.equal(Number(actual), 10000, "Bob balance should be 1 gram");

      actual = await tokenInstance.balanceOf(FEE_HOLDER);
      assert.equal(Number(actual), 0, "Fee holder balance should be 0 gram");
    });

    it("Owner should allow alice to transfer 100 tokens to bob from owner", async () => {
      await tokenInstance.approve(ALICE, 100);

      //account 0 (owner) now transfers from alice to bob
      await tokenInstance.transferFrom(OWNER, BOB, 100, { from: ALICE });
      const actual = await tokenInstance.balanceOf(BOB);
      assert.equal(actual.valueOf(), 100, "Balance should be 100");
    });

    it("should not allow transfer to zero address", async () => {
      try {
        await tokenInstance.transfer(0, 10);
      } catch (error) {
        assert(error);
        assert.equal(
          error.reason,
          "invalid address",
          `Incorrect revert reason: ${error.reason}`
        );
      }
    });

    it("should not allow sending by user with insuffient funds", async () => {
      await tokenInstance.transfer(BOB, 500);
      try {
        await tokenInstance.transfer(ALICE, 600, { from: BOB });
      } catch (error) {
        assert(error);
        assert.equal(
          error.reason,
          "SafeMath: subtraction overflow",
          `Incorrect revert reason: ${error.reason}`
        );
      }
    });
  });

  describe("Roles and permissions tests", async () => {
    beforeEach(async () => {
      await tokenInstance.mint(OWNER, "0x01", 100000);
    });

    it("should allow owner to update burner", async () => {
      await tokenInstance.updateBurner(ALICE);

      const actual = await tokenInstance.burner();
      assert.equal(actual, ALICE, "Alice is not a burner");
    });

    it("should allow owner to update minter", async () => {
      await tokenInstance.updateMinter(ALICE);

      const actual = await tokenInstance.minter();
      assert.equal(actual, ALICE, "Alice is not a minter");
    });
  });
});
