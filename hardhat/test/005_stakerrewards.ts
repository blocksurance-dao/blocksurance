import hre from "hardhat";
const { ethers } = hre;
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("🚩 Testing: 🥩  StakerRewards!", function () {
  this.timeout(45000);

  let msgSender: any;
  let coinContract: any;
  let vendorContract: any;
  let stakerContract: any;
  let registarContract: any;
  const tokensPerEth = 70000;

  it("Should set env vars", async function () {
    const [owner, acc1] = await ethers.getSigners();
    msgSender = owner.address;
  });
  it("Should deploy Registar", async function () {
    await hre.network.provider.send("hardhat_reset");
    const [owner] = await ethers.getSigners();
    msgSender = owner.address;

    const registar = await ethers.getContractFactory("Registar");
    registarContract = await registar.deploy();
    console.log("Registar contract: ", registarContract.address);
  });

  it("Should deploy ERC20Coin", async function () {
    const Coin = await ethers.getContractFactory("ERC20Coin");
    coinContract = await Coin.deploy(
      "BLOCKSURANCE",
      "4SURE",
      500000000,
      msgSender
    );
  });
  it("Should deploy Vendor", async function () {
    const vendor = await ethers.getContractFactory("Vendor");
    vendorContract = await vendor.deploy(
      coinContract.address,
      registarContract.address
    );
  });
  it("Should deploy StakerRewards", async function () {
    const staker = await ethers.getContractFactory("StakerRewards");
    stakerContract = await staker.deploy(
      coinContract.address,
      registarContract.address
    );
  });

  describe("Coin", function () {
    it("You should be able to mint tokens()", async function () {
      console.log("\t", " ⏳ Minting 250M tokens...");
      const oneBalance = await coinContract.balanceOf(stakerContract.address);
      const mintResult = await coinContract.mint(
        vendorContract.address,
        ethers.utils.parseEther("250000000")
      );
      console.log("\t", " ⏳ Waiting for confirmation from mint function...");
      const txResult = await mintResult.wait();
      expect(txResult.status).to.equal(1);
      const twoBalance = await coinContract.balanceOf(vendorContract.address);
      expect(twoBalance).to.equal(
        oneBalance.add(ethers.utils.parseEther("250000000")) // 250M
      );
      const supply = await vendorContract.checkSupply();
      expect(ethers.utils.formatEther(supply)).to.equal(
        ethers.utils.formatEther(twoBalance)
      );
    });
    it("should fail if you try to mint an amount greater than the hard cap", async () => {
      await expect(
        coinContract.mint(
          stakerContract.address,
          ethers.utils.parseEther("500000001") // 500M
        )
      ).to.be.revertedWith("Not enough tokens left!");
    });
    it("You should be able to airdrop tokens()", async function () {
      console.log("\t", " ⏳ Airdropping some tokens...");
      const [owner, acc1] = await ethers.getSigners();
      const airResult = await coinContract.airdrop(
        [owner.address, acc1.address, stakerContract.address],
        ethers.utils.parseEther("50000")
      );
      console.log(
        "\t",
        " ⏳ Waiting for confirmation from airdrop function..."
      );
      const txResult = await airResult.wait();
      expect(txResult.status).to.equal(1);
    });
  });

  describe("Staker", function () {
    // ################**STAKER**################ //

    it("Should be able to set minimalStake variable", async () => {
      expect(await stakerContract.getMinStake()).to.equal(
        ethers.utils.parseEther("20000")
      );
      await stakerContract.setMinStake(ethers.utils.parseEther("30000"));
      expect(await stakerContract.getMinStake()).to.equal(
        ethers.utils.parseEther("30000")
      );
      await stakerContract.setMinStake(ethers.utils.parseEther("20000"));
      expect(await stakerContract.getMinStake()).to.equal(
        ethers.utils.parseEther("20000")
      );
    });
    it("Should be able to set MaxStakingPeriod variable", async () => {
      expect(await stakerContract.maxStakingPeriod()).to.equal(450);
      await stakerContract.setMaxStakingPeriod(390);
      expect(await stakerContract.maxStakingPeriod()).to.equal(390);
      await stakerContract.setMaxStakingPeriod(450);
      expect(await stakerContract.maxStakingPeriod()).to.equal(450);
    });
    it("Should be able to set minimalBuy variable", async () => {
      expect(await vendorContract.getMinBuy()).to.equal(
        ethers.utils.parseEther("5000000") // 5M
      );
      await vendorContract.setMinBuy(ethers.utils.parseEther("4000000"));
      expect(await vendorContract.getMinBuy()).to.equal(
        ethers.utils.parseEther("4000000") // 4M
      );
      await vendorContract.setMinBuy(ethers.utils.parseEther("5000000"));
      expect(await vendorContract.getMinBuy()).to.equal(
        ethers.utils.parseEther("5000000") // 5M
      );
    });
    it("Should be able to set rates variable", async () => {
      expect((await stakerContract.getRates())[0]).to.equal(21);
      await stakerContract.setRates(22, 34, 55);
      expect((await stakerContract.getRates())[2]).to.equal(55);
      await stakerContract.setRates(21, 33, 45);
      expect((await stakerContract.getRates())[0]).to.equal(21);
    });
    it("Staker should be able to airdrop tokens()", async function () {
      const [owner, acc1] = await ethers.getSigners();
      const mintResult = await coinContract.mint(
        stakerContract.address,
        ethers.utils.parseEther("2500000")
      );
      console.log("\t", " ⏳ Waiting for confirmation from mint function...");
      const mxResult = await mintResult.wait();
      expect(mxResult.status).to.equal(1);

      const contractBalance = await coinContract.balanceOf(
        stakerContract.address
      );

      console.log(
        "\t",
        "Contract balance: ",
        ethers.utils.formatEther(contractBalance)
      );
      console.log("\t", " ⏳ Airdropping some tokens...");

      const startingBalance = await coinContract.balanceOf(acc1.address);
      const airResult = await stakerContract.airdrop(
        [acc1.address, owner.address],
        ethers.utils.parseEther("1000")
      );
      console.log(
        "\t",
        " ⏳ Waiting for confirmation from airdrop function..."
      );
      const txResult = await airResult.wait();
      expect(txResult.status).to.equal(1);
      const endingBalance = await coinContract.balanceOf(acc1.address);
      expect(endingBalance).to.equal(
        startingBalance.add(ethers.utils.parseEther("1000"))
      );

      const newcontractBalance = await coinContract.balanceOf(
        stakerContract.address
      );
      expect(newcontractBalance).to.equal(
        contractBalance.sub(ethers.utils.parseEther("2000"))
      );
    });
    it("Balance should go up when you buyTokens()", async function () {
      console.log("\t", " 🧑‍🏫 Tester Address: ", msgSender);

      const startingBalance = await coinContract.balanceOf(msgSender);
      console.log(
        "\t",
        " ⚖️ Starting balance: ",
        ethers.utils.formatEther(startingBalance)
      );

      console.log("\t", " 🔨 Buying...");
      const buyResult = await vendorContract.buyTokens({
        value: ethers.utils.parseEther("80"),
      });
      console.log("\t", " 🏷  buyResult: ", buyResult.hash);

      console.log("\t", " ⏳ Waiting for confirmation...");
      const txResult = await buyResult.wait();
      expect(txResult.status).to.equal(1);

      const newBalance = await coinContract.balanceOf(msgSender);
      console.log(
        "\t",
        " 🔎 New balance: ",
        ethers.utils.formatEther(newBalance)
      );

      expect(newBalance).to.equal(
        startingBalance.add(
          ethers.utils.parseEther((80 * tokensPerEth).toString())
        )
      );

      const contractBalance = await coinContract.balanceOf(
        vendorContract.address
      );

      console.log(
        "\t",
        "Contract balance: ",
        ethers.utils.formatEther(contractBalance)
      );
    });
    it("Staking should fail after it's paused", async function () {
      console.log("\t", " 🔨 Request CoinContract to approve stake...");
      await coinContract.approve(
        stakerContract.address,
        ethers.utils.parseEther("20000")
      );

      console.log("\t", " 🔨 Pause Staking...");
      await stakerContract.stakingEnabled(false);

      await expect(
        stakerContract.stakeTokens(ethers.utils.parseEther("20000"), 90)
      ).to.be.revertedWith("Staking is temporarily halted!");

      console.log("\t", " 🔨 UnPause Staking...");
      await stakerContract.stakingEnabled(true);
    });
    it("Stake should go up when you stake()", async function () {
      console.log("\t", " 🧑‍🏫 Tester Address: ", msgSender);
      const [owner, acc1] = await ethers.getSigners();

      const rgResult = await registarContract
        .connect(acc1)
        .register(owner.address);
      console.log(
        "\t",
        " ⏳ Waiting for confirmation from register function..."
      );
      const rtxResult = await rgResult.wait();
      expect(rtxResult.status).to.equal(1);

      console.log("\t", " 🔨 Request CoinContract to approve stake...");
      await coinContract
        .connect(acc1)
        .approve(stakerContract.address, ethers.utils.parseEther("20000"));

      const startingStake = await stakerContract.getUserStake(acc1.address);
      console.log(
        "\t",
        " ⚖️ Starting stake: ",
        startingStake?.amount?.toNumber()
      );

      const refBalance1 = await coinContract.balanceOf(msgSender);

      console.log("\t", " 🔨 Staking...");
      const stakeResult = await stakerContract
        .connect(acc1)
        .stakeTokens(ethers.utils.parseEther("20000"), 90);
      console.log("\t", " 🏷  stakeResult: ", stakeResult.hash);

      console.log("\t", " ⏳ Waiting for confirmation...");
      const txResult = await stakeResult.wait();
      expect(txResult.status).to.equal(1);

      const endingStake = await stakerContract.getUserStake(acc1.address);
      console.log(
        "\t",
        " ⚖️ Ending stake: ",
        ethers.utils.formatEther(endingStake.amount)
      );
      expect(endingStake.amount).to.equal(
        startingStake.amount.add(ethers.utils.parseEther("20000"))
      );

      // Check that refferal address balance went up, refferal payout 4%
      const refBalance2 = await coinContract.balanceOf(msgSender);
      expect(refBalance2).to.equal(
        refBalance1.add(ethers.utils.parseEther("800"))
      );
    });

    it("Should retrieve token listing from contract", async function () {
      console.log("\t", " ⏳ Retrieving token listings...");
      const txResult = await stakerContract.getActiveStakes();
      console.log(
        "\t",
        " ⏳ Waiting for confirmation from getListings function..."
      );
      expect(txResult.length).to.equal(1);
    });

    it("After stake lockup expires, you should be able to burn stake", async function () {
      const Coin = await ethers.getContractFactory("ERC20Coin");
      coinContract = await Coin.deploy("iLAUNCH", "LAU", 100000000, msgSender);

      const vendor = await ethers.getContractFactory("Vendor");
      vendorContract = await vendor.deploy(
        coinContract.address,
        registarContract.address
      );
      const staker = await ethers.getContractFactory("StakerRewards");
      stakerContract = await staker.deploy(
        coinContract.address,
        registarContract.address
      );

      console.log("\t", " ⏳ Minting 8M tokens...");
      const mintResult = await coinContract.mint(
        vendorContract.address,
        ethers.utils.parseEther("8000000")
      );
      console.log("\t", " ⏳ Waiting for confirmation from mint function...");
      const txResult2 = await mintResult.wait();
      expect(txResult2.status).to.equal(1);
      await coinContract.mint(
        stakerContract.address,
        ethers.utils.parseEther("1000000")
      );
      console.log("\t", " 🔨 Toast!");

      console.log("\t", " 🔨 Buying...");
      const buyResult = await vendorContract.buyTokens({
        value: ethers.utils.parseEther("80"),
      });
      console.log("\t", " 🏷  buyResult: ", buyResult.hash);

      console.log("\t", " ⏳ Waiting for confirmation...");
      const txResult3 = await buyResult.wait();
      expect(txResult3.status).to.equal(1);

      console.log("\t", " 🔨 Request CoinContract to approve stake...");
      const approveResult = await coinContract.approve(
        stakerContract.address,
        ethers.utils.parseEther("20000")
      );
      console.log("\t", " ⏳ Waiting for confirmation...");
      const txResult4 = await approveResult.wait();
      expect(txResult4.status).to.equal(1);

      console.log("\t", " ⏳ Staking...");
      const stakeResult = await stakerContract.stakeTokens(
        ethers.utils.parseEther("20000"),
        270
      );
      console.log("\t", " 🏷  stakeResult: ", stakeResult.hash);

      console.log("\t", " ⏳ Waiting for confirmation...");
      const txResult5 = await stakeResult.wait();
      expect(txResult5.status).to.equal(1);

      const startingStake = await stakerContract.getUserStake(msgSender);

      console.log(
        "\t",
        " ⚖️ Starting stake: ",
        ethers.utils.formatEther(startingStake.amount)
      );
      expect(startingStake.amount).to.equal(ethers.utils.parseEther("20000"));

      console.log("\t", " ⌛️ fast forward time...");
      await hre.network.provider.send("evm_increaseTime", [72000000]);
      await hre.network.provider.send("evm_mine");

      console.log("\t", " ⏳ Burning Stake...");
      const burnResult1 = await stakerContract.burnStake(msgSender);
      console.log("\t", " 🏷  burnResult: ", burnResult1.hash);

      console.log("\t", " ⏳ Waiting for confirmation...");
      const txResult6 = await burnResult1.wait();
      expect(txResult6.status).to.equal(1);

      const endingStake = await stakerContract.getUserStake(msgSender);
      console.log(
        "\t",
        " ⚖️ Ending stake: ",
        ethers.utils.formatEther(endingStake.amount)
      );
      expect(endingStake.amount).to.equal(0);
    });

    it("Should retrieve token listing from contract", async function () {
      console.log("\t", " ⏳ Retrieving token listings...");
      const txResult = await stakerContract.getActiveStakes();
      console.log(
        "\t",
        " ⏳ Waiting for confirmation from getListings function..."
      );
      expect(txResult.length).to.equal(0);
    });

    it("Staker should be able to transfer tokens out()", async function () {
      console.log("\t", " ⏳ Transfering some tokens...");
      const contractBalance = await coinContract.balanceOf(
        stakerContract.address
      );
      console.log(
        "\t",
        "Contract token balance: ",
        ethers.utils.formatEther(contractBalance)
      );
      const startingBalance = await coinContract.balanceOf(msgSender);
      const ttransfer = await stakerContract.transferTokens(
        msgSender,
        ethers.utils.parseEther("10000")
      );
      console.log(
        "\t",
        " ⏳ Waiting for confirmation from transferTokens function..."
      );
      const txResult = await ttransfer.wait();
      expect(txResult.status).to.equal(1);
      const endingBalance = await coinContract.balanceOf(msgSender);
      expect(endingBalance).to.equal(
        startingBalance.add(ethers.utils.parseEther("10000"))
      );
    });

    it("Owner should be able to set min Stake amount", async function () {
      console.log("\t", " 💵 calling withdraw");
      const setResult = await stakerContract.setMinStake(
        ethers.utils.parseEther("50000")
      );
      console.log("\t", " 🏷  setResult: ", setResult.hash);
      const getResult = await stakerContract.getMinStake();
      expect(getResult).to.equal(ethers.utils.parseEther("50000"));

      // ################**RESET**################ //
      await hre.network.provider.send("hardhat_reset");
    });
  });
});
