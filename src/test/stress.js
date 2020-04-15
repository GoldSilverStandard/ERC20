const { uuid } = require("uuidv4");

const Token = artifacts.require("Silver");

contract.only("Silver", (accounts) => {
  const OWNER = accounts[0];

  beforeEach(async () => {
    this.token = await Token.new({ from: OWNER });
  });

  describe("Stress tests", async () => {
    it("should add 100,000 bars", async () => {
      for (i = 0; i < 100000; i++) {
        let serial = uuidv4();
        this.token.mint(OWNER, "testlocation", serial, 1);
      }
    });
  });
});
