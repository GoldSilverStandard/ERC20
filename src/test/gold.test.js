const Token = artifacts.require("Gold");
const helper = require("./helpers/truffleTestHelper");

contract.only("Gold", async (accounts) => {
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

      var balance = await tokenInstance.balanceOf(OWNER);
      assert.equal(balance.valueOf(), 100, "Balance should be 100");

      var actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 100, "Total supply should be 100");

      await tokenInstance.burn("0x99");

      actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 100, "Total supply should be 100");

      balance = await tokenInstance.balanceOf(OWNER);
      assert.equal(balance.valueOf(), 100, "Balance should be 100");
    });

    it("should burn 100 of 100 tokens", async () => {
      await tokenInstance.mint(OWNER, "0x01", 100);

      var balance = await tokenInstance.balanceOf(OWNER);
      assert.equal(balance.valueOf(), 100, "Balance should be 100");

      var actual = await tokenInstance.totalSupply();
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

      var balance = await tokenInstance.balanceOf(OWNER);
      assert.equal(balance.valueOf(), 100, "Balance should be 100");

      var actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 100, "Total supply should be 100");

      await tokenInstance.transfer(BOB, 90);

      var balance = await tokenInstance.balanceOf(BOB);
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

  describe("Fee tests", async () => {
    it("should increase fee by 0.1%", async () => {
      const fee = await tokenInstance.fee();
      await tokenInstance.increaseFee();

      const actual = await tokenInstance.fee();
      const lastUpdated = await tokenInstance.lastUpdated();

      assert.isTrue(actual > fee, "Fee did not increase");
      assert.equal(30, actual, "Incorrect fee set");
      assert.isTrue(lastUpdated > 0, "Last updated not set");
    });

    it("should not allow fee increase within 30 days", async () => {
      try {
        await tokenInstance.increaseFee();
      } catch (error) {
        assert(error);
        assert.equal(
          error.reason,
          "Cannot update fee within 30 days of last change",
          `Incorrect revert reason: ${error.reason}`
        );
      }
    });

    it.skip("should increase fee by 0.1% after 30 days", async () => {
      await helper.advanceTime(31 * 24 * 60 * 60);

      const fee = await tokenInstance.fee();
      await tokenInstance.increaseFee();

      const actual = await tokenInstance.fee();
      const lastUpdated = await tokenInstance.lastUpdated();

      assert.isTrue(actual > fee, "Fee did not increase");
      assert.equal(220, actual, "Incorrect fee set");
      assert.isTrue(lastUpdated > 0, "Last updated not set");
    });

    it("should not allow a negative fee", async () => {
      try {
        await tokenInstance.decreaseFee(-10);
      } catch (error) {
        assert(error);
        assert.equal(
          error.reason,
          "New fee must be less than current fee",
          `Incorrect revert reason: ${error.reason}`
        );
      }
    });

    it("should decrease fee", async () => {
      await tokenInstance.decreaseFee(5);
      const actual = await tokenInstance.fee();
      const lastUpdated = await tokenInstance.lastUpdated();

      assert.equal(5, actual, "Incorrect fee set");
      assert.isTrue(lastUpdated > 0, "Last updated not set");
    });

    it("should decrease fee twice", async () => {
      await tokenInstance.decreaseFee(10);
      let actual = await tokenInstance.fee();
      let lastUpdated = await tokenInstance.lastUpdated();

      assert.equal(10, actual, "Incorrect fee set");
      assert.isTrue(lastUpdated > 0, "Last updated not set");

      await tokenInstance.decreaseFee(5);
      actual = await tokenInstance.fee();
      lastUpdated = await tokenInstance.lastUpdated();

      assert.equal(5, actual, "Incorrect fee set");
      assert.isTrue(lastUpdated > 0, "Last updated not set");
    });

    it("should decrease fee to 10%", async () => {
      await tokenInstance.decreaseFee(10);
      const actual = await tokenInstance.fee();
      const lastUpdated = await tokenInstance.lastUpdated();

      assert.equal(10, actual, "Incorrect fee set");
      assert.isTrue(lastUpdated > 0, "Last updated not set");
    });

    it("should not be able to decrease fee to the same value", async () => {
      try {
        await tokenInstance.decreaseFee(20);
      } catch (error) {
        assert(error);
        assert.equal(
          error.reason,
          "New fee must be less than current fee",
          `Incorrect revert reason: ${error.reason}`
        );
      }
    });
  });

  describe("With 10 grams (100,000 tokens) minted balance", async () => {
    beforeEach(async () => {
      await tokenInstance.mint(OWNER, "0x01", 100000);
      await tokenInstance.updateFeeHolder(FEE_HOLDER);
    });

    it("should transfer 1 gram (10000 tokens) from owner to bob (no fees)", async () => {
      await tokenInstance.transfer(BOB, 10000);
      var actual = await tokenInstance.balanceOf(OWNER);
      assert.equal(Number(actual), 90000, "Owner balance should be 9 grams");

      actual = await tokenInstance.balanceOf(BOB);
      assert.equal(Number(actual), 10000, "Bob balance should be 1 gram");

      actual = await tokenInstance.balanceOf(FEE_HOLDER);
      assert.equal(Number(actual), 0, "Fee holder balance should be 0 gram");
    });

    it("should transfer 10 grams (100,000 tokens) from bob to alice with fee", async () => {
      await tokenInstance.transfer(BOB, 20000);

      var actual = await tokenInstance.balanceOf(OWNER);
      assert.equal(Number(actual), 80000, "Owner balance should be 8 grams");

      actual = await tokenInstance.balanceOf(BOB);
      assert.equal(Number(actual), 20000, "Bob balance should be 2 grams");

      await tokenInstance.transfer(ALICE, 10000, { from: BOB });

      actual = await tokenInstance.balanceOf(ALICE);
      assert.equal(Number(actual), 9980, "Balance should be 9980 tokens");

      actual = await tokenInstance.balanceOf(OWNER);
      assert.equal(Number(actual), 80000, "Balance should be 80000");

      actual = await tokenInstance.balanceOf(FEE_HOLDER);
      assert.equal(Number(actual), 20, "Balance should be 20");
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
          "Insufficient funds",
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

    it("should allow owner to update fee holder", async () => {
      await tokenInstance.updateFeeHolder(ALICE);

      const actual = await tokenInstance.feeHolder();
      assert.equal(actual, ALICE, "Alice is not a fee holder");
    });

    it("should add Alice to white list '0'", async () => {
      const index = 0;
      await tokenInstance.addToWhiteList(index, ALICE);

      const actual = await tokenInstance.inWhiteList(index, ALICE);
      assert.isTrue(actual, "Alice is not the white list");
    });

    it("should add Alice to white list '1'", async () => {
      const index = 1;
      await tokenInstance.addToWhiteList(index, ALICE);

      const actual = await tokenInstance.inWhiteList(index, ALICE);
      assert.isTrue(actual, "Alice is not the white list");
    });

    it("should be in any white list", async () => {
      const index = 1;
      await tokenInstance.addToWhiteList(index, ALICE);

      const actual = await tokenInstance.inAnyWhiteList(ALICE);
      assert.isTrue(actual, "Alice is not the white list");
    });

    it("should be fee exempt if in sender '0' white list", async () => {
      const index = 0;
      await tokenInstance.addToWhiteList(index, ALICE);

      const actual = await tokenInstance.isFeeExempt(index, ALICE);
      assert.isTrue(actual, "Alice is not fee exempt");
    });

    it("should be fee exempt if in sender '1' white list", async () => {
      const index = 1;
      await tokenInstance.addToWhiteList(index, ALICE);

      const actual = await tokenInstance.isFeeExempt(index, ALICE);
      assert.isTrue(actual, "Alice is not fee exempt");
    });

    it("should remove Alice from white list", async () => {
      const index = 0;
      await tokenInstance.addToWhiteList(index, ALICE);

      let actual = await tokenInstance.inWhiteList(index, ALICE);
      assert.isTrue(actual, "Alice is not the white list");

      await tokenInstance.removeFromWhiteList(index, ALICE);

      actual = await tokenInstance.inWhiteList(index, ALICE);
      assert.isFalse(actual, "Alice is the white list");
    });

    it("should pause contract", async () => {
      let actual = await tokenInstance.paused();
      assert.isFalse(actual,"Contract should not be paused");

      await tokenInstance.pauseContract();

      actual = await tokenInstance.paused();
      assert.isTrue(actual,"Contract should be paused");
    });
  });
});
