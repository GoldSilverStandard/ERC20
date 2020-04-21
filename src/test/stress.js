const Token = artifacts.require("Silver");
const web3 = require("web3");

contract("Silver", (accounts) => {
  const OWNER = accounts[0];

  beforeEach(async () => {
    this.token = await Token.new({ from: OWNER });
  });

  //Good tool https://blockchangers.github.io/solidity-converter-online/
  describe("Stress tests", async () => {
    it("should add 1,000 bars", async () => {
      for (i = 0; i < 1000; i++) {
        const location = web3.utils.randomHex(32);
        const serial = web3.utils.randomHex(32);
        await this.token.mint(OWNER, location, serial, 1);
      }
    });
  });
});
