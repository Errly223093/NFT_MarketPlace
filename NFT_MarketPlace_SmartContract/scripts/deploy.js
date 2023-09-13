// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const LOCK = await hre.ethers.getContractFactory("mintNFT");
  const lock = await LOCK.deploy(
    "https://teal-individual-peafowl-274.mypinata.cloud/ipfs/QmRQPZqPTtixq2549xMeMC6DLYv9ut6yNKpdfZpLWS31as"
  );
  console.log("LOCK deployed to : ", lock);
  console.log("LOCK deployed to : ", lock.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
