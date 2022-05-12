import hre from "hardhat";
const { use } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("🚩 Running: 🥩 EVM Fast Forward", async function () {
  this.timeout(45000);

  it("Should set env vars", async function () {
    console.log("\t", " ⌛️ Fast forward EVM time...");
    await hre.network.provider.send("evm_increaseTime", [72000000]);
    await hre.network.provider.send("evm_mine");
  });
});
