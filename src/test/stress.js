const { uuid } = require("uuidv4");
const Token = artifacts.require("Silver");

contract.only("Silver", (accounts) => {
  const OWNER = accounts[0];

  beforeEach(async () => {
    this.token = await Token.new({ from: OWNER });
  });

  //Good tool https://blockchangers.github.io/solidity-converter-online/
  describe.only("Stress tests", async () => {
    it("should add 100,000 bars", async () => {
      for (i = 0; i < 100; i++) {
        let serial = uuid();
        const location1 = "0x6c6f636174696f6e310000000000000000000000000000000000000000000000";
        await this.token.mint(OWNER, location1, serial, 1);
      }
    });
  });
});
