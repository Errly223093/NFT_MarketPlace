require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const pvkey = process.env.pvkey;
const infuraApikey = process.env.infuraApiKey;
const etherscanApikey = process.env.etherscanApikey;

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.18",
  etherscan: {
    apiKey: etherscanApikey,
  },
  networks: {
    goerli: {
      url: infuraApikey,
      accounts: [pvkey],
    },
  },
};
