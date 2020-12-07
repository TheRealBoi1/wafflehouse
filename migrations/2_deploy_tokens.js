const YFLink = artifacts.require("YFLink");
const WrappedOne = artifacts.require("WrappedOne");

module.exports = function(deployer) {
    if (deployer.network === 'development') {
        deployer.deploy(YFLink);
        deployer.deploy(WrappedOne);
    } else if (deployer.network === 'testnet') {
        deployer.deploy(YFLink);
    }
};
