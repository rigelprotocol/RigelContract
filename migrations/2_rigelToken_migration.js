const RigelToken = artifacts.require("RigelToken");

module.exports = async function (deployer, network, accounts) {

  await deployer.deploy(RigelToken, accounts[0]);
};
