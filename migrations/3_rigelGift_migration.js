// const RigelToken = artifacts.require("RigelToken");
const RigelGift = artifacts.require("RigelGift");

module.exports = async function (deployer, network, accounts) {

  // const fee = web3.utils.toWei('10','ether');
  // let token = await RigelToken.deployed();
  // await deployer.deploy(RigelGift, fee, token.address );
  await deployer.deploy(RigelGift);
  
};
