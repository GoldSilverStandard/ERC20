const Token = artifacts.require("Gold");
const helper = require("./helpers/truffleTestHelper");

contract("Gold", function(accounts) {
  const OWNER = accounts[0];
  const ALICE = accounts[1];
  const BOB = accounts[2];
  const FEE_HOLDER = accounts[3];
  const FEE_AMOUNT = 20;

  let tokenInstance;

  beforeEach(async function () {
    tokenInstance = await Token.new();
  });

  describe("ERC20 tests", () => {
    it("It should test ERC20 public properties", async function () {
      const name = await tokenInstance.name();
      assert.equal(name, "Gold Standard", "Name should be Gold Standard");

      const symbol = await tokenInstance.symbol();
      assert.equal(symbol, "AUS", "Symbol should be AUS");
    });

    it("Total supply should be 0", async function () {
      const actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 0, "Total supply should be 0");
    });

    it("Owner balance should be 0", async function () {
      const actual = await tokenInstance.balanceOf(OWNER);
      assert.equal(actual.valueOf(), 0, "Balance should be 0");
    });
  });

  describe("Mint and burn tests", () => {
    it("It should mint 1337 tokens", async function () {
      await tokenInstance.mint(ALICE, '0x00', '0x01', 1337);
  
      const balance = await tokenInstance.balanceOf(ALICE);
      assert.equal(balance.valueOf(), 1337, "Balance should be 1337");

      const actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 1337, "Total supply should be 1337");

      const count = await tokenInstance.stockCount();
      assert.equal(count.valueOf(), 1, "Total stock should be 1");
    });

    it("It should not burn with different bar sizes", async function () {
      //Arange
      await tokenInstance.mint(OWNER, '0x00', '0x01', 100);
  
      var balance = await tokenInstance.balanceOf(OWNER);
      assert.equal(balance.valueOf(), 100, "Balance should be 100");

      var actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 100, "Total supply should be 100");

      //Act
      await tokenInstance.burn('0x00', '0x01', 10);

      actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 100, "Total supply should be 100");

      balance = await tokenInstance.balanceOf(OWNER);
      assert.equal(balance.valueOf(), 100, "Balance should be 100");
    });

    it("It should not burn with different locations", async function () {
      await tokenInstance.mint(OWNER, '0x00', '0x01', 100);
  
      var balance = await tokenInstance.balanceOf(OWNER);
      assert.equal(balance.valueOf(), 100, "Balance should be 100");

      var actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 100, "Total supply should be 100");

      await tokenInstance.burn('0x99', '0x01', 100);

      actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 100, "Total supply should be 100");

      balance = await tokenInstance.balanceOf(OWNER);
      assert.equal(balance.valueOf(), 100, "Balance should be 100");
    });

    it("It should not burn with different serial", async function () {
      await tokenInstance.mint(OWNER, '0x00', '0x01', 100);
  
      var balance = await tokenInstance.balanceOf(OWNER);
      assert.equal(balance.valueOf(), 100, "Balance should be 100");

      var actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 100, "Total supply should be 100");

      await tokenInstance.burn('0x00', '0x99', 100);

      actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 100, "Total supply should be 100");

      balance = await tokenInstance.balanceOf(OWNER);
      assert.equal(balance.valueOf(), 100, "Balance should be 100");
    });

    it("It should burn 100 of 100 tokens", async function () {
      await tokenInstance.mint(OWNER, '0x00', '0x01', 100);
  
      var balance = await tokenInstance.balanceOf(OWNER);
      assert.equal(balance.valueOf(), 100, "Balance should be 100");

      var actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 100, "Total supply should be 100");

      await tokenInstance.burn('0x00', '0x01', 100);

      actual = await tokenInstance.totalSupply();
      assert.equal(actual.valueOf(), 0, "Total supply should be 0");

      balance = await tokenInstance.balanceOf(OWNER);
      assert.equal(balance.valueOf(), 0, "Balance should be 0");

      const count = await tokenInstance.stockCount();
      assert.equal(count.valueOf(), 0, "Total stock should be 0");
    });
  });

  describe("Fee tests", () => {
    it("It should increase fee by 0.1%", async () => {
      const fee = await tokenInstance.fee();

      console.log(Number(fee));
      await tokenInstance.increaseFee();

      const actual = await tokenInstance.fee();
      const lastUpdated = await tokenInstance.lastUpdated();

      assert.isTrue(actual > fee, "Fee did not increase");
      assert.equal(30, actual, "Incorrect fee set");
      assert.isTrue(lastUpdated > 0, "Last updated not set");
    });

    it("It should not allow fee increase within 30 days", async () => {
      try {
        await tokenInstance.increaseFee();
      }
      catch(error) {
        assert(error);
        assert.equal(error.reason, "Cannot update fee within 30 days of last change", `Incorrect revert reason: ${error.reason}`);
      }
    });

    it.skip("It should increase fee by 0.1% after 30 days", async () => {
      await helper.advanceTime(31 * 24 * 60 * 60);

      const fee = await tokenInstance.fee();
      await tokenInstance.increaseFee();

      const actual = await tokenInstance.fee();
      const lastUpdated = await tokenInstance.lastUpdated();

      assert.isTrue(actual > fee, "Fee did not increase");
      assert.equal(220, actual, "Incorrect fee set");
      assert.isTrue(lastUpdated > 0, "Last updated not set");
    });

    it("It should not allow a negative fee", async () => {
      try {
        await tokenInstance.decreaseFee(-10);
      }
      catch(error) {
        assert(error);
        assert.equal(error.reason, "New fee must be less than current fee", `Incorrect revert reason: ${error.reason}`);
      }
    });

    it("It should decrease fee", async () => {
      await tokenInstance.decreaseFee(5);
      const actual = await tokenInstance.fee();
      const lastUpdated = await tokenInstance.lastUpdated();

      assert.equal(5, actual, "Incorrect fee set");
      assert.isTrue(lastUpdated > 0, "Last updated not set");
    });
  });

  describe("With 10 grams (100,000 tokens) minted balance", () => {
    beforeEach(async () => {
      await tokenInstance.mint(OWNER, '0x00', '0x01', 100000);
      await tokenInstance.updateFeeHolder(FEE_HOLDER);
    });

    it("It should transfer 1 gram (10000 tokens) from owner to bob (no fees)", async () => {
      await tokenInstance.transfer(BOB, 10000);
      var actual = await tokenInstance.balanceOf(OWNER);
      assert.equal(Number(actual), 90000, "Owner balance should be 9 grams");

      actual = await tokenInstance.balanceOf(BOB);
      assert.equal(Number(actual), 10000, "Bob balance should be 1 gram");

      actual = await tokenInstance.balanceOf(FEE_HOLDER);
      assert.equal(Number(actual), 0, "Fee holder balance should be 0 gram");
    });

    it("It should transfer 10 grams (100,000 tokens) from bob to alice with fee", async () => {
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

    it("Owner should allow alice to transfer 100 tokens to bob from owner", async function () {
      await tokenInstance.approve(ALICE, 100);

      //account 0 (owner) now transfers from alice to bob
      await tokenInstance.transferFrom(OWNER, BOB, 100, {from: ALICE});
      var actual = await tokenInstance.balanceOf(BOB);
      assert.equal(actual.valueOf(), 100, "Balance should be 100");
    });

    it("It should not allow transfer to zero address", async () => {
      try {
        await tokenInstance.transfer(0, 10);
      }
      catch(error) {
        assert(error);
        assert.equal(error.reason, "Invalid address", `Incorrect revert reason: ${error.reason}`);
      }
    });

    it("It should not allow sending by user with insuffient funds", async () => {
      await tokenInstance.transfer(BOB, 500);
      try {
        await tokenInstance.transfer(ALICE, 600, { from: BOB });
      }
      catch(error) {
        assert(error);
        assert.equal(error.reason, "Insufficient funds", `Incorrect revert reason: ${error.reason}`);
      }
    });
  });

  describe("Roles and permissions tests", () => {
    beforeEach(async () => {
      await tokenInstance.mint(OWNER, '0x00', '0x01', 100000);
    });

    it("Should allow owner to update burner", async function () {
      await tokenInstance.updateBurner(ALICE);

      let actual = await tokenInstance.burner();
      assert.equal(actual, ALICE, "Alice is not a burner");
    });

    it("Should allow owner to update minter", async function () {
      await tokenInstance.updateMinter(ALICE);
      
      let actual = await tokenInstance.minter();
      assert.equal(actual, ALICE, "Alice is not a minter");
    });

    it("Should allow owner to update fee holder", async function () {
      await tokenInstance.updateFeeHolder(ALICE);

      let actual = await tokenInstance.feeHolder();
      assert.equal(actual, ALICE, "Alice is not a fee holder");
    });

    it("Should add Alice to white list '0'", async function () {
      const list = 0;
      await tokenInstance.addToWhiteList(list, ALICE);

      let actual = await tokenInstance.inWhiteList(list, ALICE);
      assert.isTrue(actual, "Alice is not the white list");
    });

    it("Should add Alice to white list '1'", async function () {
      const list = 1;
      await tokenInstance.addToWhiteList(list, ALICE);

      let actual = await tokenInstance.inWhiteList(list, ALICE);
      assert.isTrue(actual, "Alice is not the white list");
    });

    it("Should be in any white list", async function () {
      const list = 1;
      await tokenInstance.addToWhiteList(list, ALICE);

      let actual = await tokenInstance.inAnyWhiteList(ALICE);
      assert.isTrue(actual, "Alice is not the white list");
    });

    it("Should be fee exempt if in sender '0' white list", async function () {
      const list = 0;
      await tokenInstance.addToWhiteList(list, ALICE);

      let actual = await tokenInstance.isFeeExempt(list, ALICE);
      assert.isTrue(actual, "Alice is not fee exempt");
    });

    it("Should be fee exempt if in sender '1' white list", async function () {
      const list = 1;
      await tokenInstance.addToWhiteList(list, ALICE);

      let actual = await tokenInstance.isFeeExempt(list, ALICE);
      assert.isTrue(actual, "Alice is not fee exempt");
    });
  });
});