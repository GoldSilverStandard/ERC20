const Token = artifacts.require("Silver");

contract("Silver", function(accounts) {
  const OWNER = accounts[0];
  const ALICE = accounts[1];
  const BOB = accounts[2];

  beforeEach(async function () {
      this.token = await Token.new({from: OWNER});
  });

  describe("ERC20 tests", () => {
    it("should test ERC20 public properties", async function () {
      const name = await this.token.name();
      assert.equal(name, "Silver Standard", "Name should be Silver Standard");

      const symbol = await this.token.symbol();
      assert.equal(symbol, "AGS", "Symbol should be AGS");
    });

    it("total supply should be 0", async function () {
      const actual = await this.token.totalSupply();
      assert.equal(actual.valueOf(), 0, "Total supply should be 0");
    });

    it("owner balance should be 0", async function () {
      const actual = await this.token.balanceOf(OWNER);
      assert.equal(actual.valueOf(), 0, "Balance should be 0");
    });

    it("should mint 1337 tokens", async function () {
      await this.token.mint(OWNER, '0x00', '0x01', 1337);

      const balance = await this.token.balanceOf(OWNER);
      assert.equal(balance.valueOf(), 1337, "Balance should be 1337");

      const actual = await this.token.totalSupply();
      assert.equal(actual.valueOf(), 1337, "Total supply should be 1337");
    });

    it("should transfer 10 tokens from owner to bob", async function () {
      await this.token.mint(OWNER, '0x00', '0x01', 100);

      await this.token.transfer(BOB, 10);
      var actual = await this.token.balanceOf(OWNER);
      assert.equal(actual.valueOf(), 90, "Balance should be 90");

      actual = await this.token.balanceOf(BOB);
      assert.equal(actual.valueOf(), 10, "Balance should be 10");
    });

    it("should transfer 10 grams from bob to alice with fee", async function () {
      await this.token.mint(OWNER, '0x00', '0x01', 1000);

      await this.token.transfer(BOB, 200);
      var actual = await this.token.balanceOf(OWNER);
      assert.equal(actual.valueOf(), 800, "Balance should be 800");

      actual = await this.token.balanceOf(BOB);
      assert.equal(actual.valueOf(), 200, "Balance should be 200");

      await this.token.transfer(ALICE, 100, { from: BOB });

      actual = await this.token.balanceOf(ALICE);
      assert.equal(actual.valueOf(), 99, "Balance should be 99");

      actual = await this.token.balanceOf(OWNER);
      assert.equal(actual.valueOf(), 801, "Balance should be 801");
    });

    it("owner should allow alice to transfer 100 tokens to bob from owner", async function () {
      await this.token.mint(OWNER, '0x00', '0x01', 100);
      await this.token.approve(ALICE, 100);

      //account 0 (owner) now transfers from alice to bob
      await this.token.transferFrom(OWNER, BOB, 100, {from: ALICE});
      var actual = await this.token.balanceOf(BOB);
      assert.equal(actual.valueOf(), 100, "Balance should be 100");
    });
  });
});