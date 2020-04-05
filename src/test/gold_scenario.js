const Token = artifacts.require("Gold");

contract("Gold", (accounts) => {
  const OWNER = accounts[0];
  const bob = accounts[1];
  const alice = accounts[2];

  before(async () => {
    this.token = await Token.new({from: OWNER});
  });

  it("should transfer 10 tokens from owner to bob", async () => {
    await this.token.transfer(accounts[2], 10, {from: OWNER});
    var actual = await this.token.balanceOf(OWNER);
    assert.equal(actual.valueOf(), 1327, "Balance should be 1327");

    actual = await this.token.balanceOf(accounts[2]);
    assert.equal(actual.valueOf(), 10, "Balance should be 10");
  });

  it("Owner should allow alice to transfer 100 tokens to bob from owner", async () => {
    //account 0 (owner) approves alice
    await this.token.approve(alice, 100);

    //account 0 (owner) now transfers from alice to bob
    await this.token.transferFrom(OWNER, bob, 100, {from: alice});

    var balance = await this.token.balanceOf(bob);
    assert.equal(balance.valueOf(), 100, "Balance should be 100");

    var totalSupply = await this.token.totalSupply();
    assert.equal(totalSupply.valueOf(), 1337, "Total supply should be 1337");

    await this.token.burn(1000);

    balance = await this.token.balanceOf(OWNER);
    assert.equal(balance.valueOf(), 227, "Balance should be 227");

    totalSupply = await this.token.totalSupply();
    assert.equal(actual.valueOf(), 227, "Total supply should be 227");
  });
});