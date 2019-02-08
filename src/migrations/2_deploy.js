const Gold = artifacts.require('Gold');
const Silver = artifacts.require('Silver');

module.exports = async (deployer) => {
    await deployer.deploy(Gold);
    await deployer.deploy(Silver);
};