// const BusSafe = artifacts.require("BusSafe");

// module.exports = function (deployer) {
//   deployer.deploy(BusSafe);
// };

const BusSafe = artifacts.require("NewBusSafe");

module.exports = function (deployer) {
  deployer.deploy(BusSafe);
};
