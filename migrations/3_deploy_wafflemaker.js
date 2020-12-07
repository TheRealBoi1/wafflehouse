const WaffleMaker = artifacts.require("WaffleMaker");
const YFLink = artifacts.require("YFLink");
const WrappedOne = artifacts.require("WrappedOne");

module.exports = async function(deployer) {
  if (deployer.network === 'development') {
    const yflInstance = await YFLink.deployed();
    const woneInstance = await WrappedOne.deployed();
    deployer.deploy(WaffleMaker, yflInstance.address, woneInstance.address);
  } else if (deployer.network === 'testnet') {
    const yflInstance = await YFLink.deployed();
    deployer.deploy(WaffleMaker, yflInstance.address, process.env.TESTNET_WONE_ADDRESS);
  } else if (deployer.network === 'mainnet') {
    deployer.deploy(WaffleMaker, process.env.MAINNET_YFL_ADDRESS, process.env.MAINNET_WONE_ADDRESS);
  }
};
