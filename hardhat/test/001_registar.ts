import hre from "hardhat";
const { ethers } = hre;
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("🚩 Testing: 🥩 Registar", async function () {
  this.timeout(45000);

  let apiKey: any;
  let msgSender: any;
  let registarContract: any;

  it("Should set env vars", async function () {
    await hre.network.provider.send("hardhat_reset");
    const [owner, acc1] = await ethers.getSigners();
    msgSender = owner.address;
    apiKey = acc1.address;
  });

  it("Should deploy Registar", async function () {
    // const [owner, acc1] = await ethers.getSigners();
    const registar = await ethers.getContractFactory("Registar");
    registarContract = await registar.deploy(apiKey, 45454);
    console.log("Registar contract: ", registarContract.address);
  });

  it("Should register user in registar", async function () {
    const [owner, acc1, acc2] = await ethers.getSigners();
    console.log("\t", " ⏳ Registering user...");
    const rgResult = await registarContract.connect(acc1).register(
      msgSender,
      apiKey,
      99999 // pinCode
    );
    console.log("\t", " ⏳ Waiting for confirmation from register function...");
    const txResult = await rgResult.wait();
    expect(txResult.status).to.equal(1);
  });
  it("Should check if user is in registar", async function () {
    // const [owner, acc1, acc2] = await ethers.getSigners();
    console.log("\t", " ⏳ Getting user...");
    const txResult = await registarContract.get(
      msgSender, // address
      apiKey
    );
    console.log("\t", " ⏳ Waiting for confirmation from get function...");
    //   console.log("\t", txResult);
    expect(txResult).to.equal(true);
  });
  it("Should validate user pincode", async function () {
    const [owner, acc1] = await ethers.getSigners();
    console.log("\t", " ⏳ Getting user...");
    const txResult = await registarContract.connect(acc1).validatePin(
      99999, // pin code
      apiKey
    );
    console.log("\t", " ⏳ Waiting for confirmation from get function...");

    console.log("\t", txResult);
    expect(txResult).to.equal(true);
  });
  it("Should getRef in registar", async function () {
    const [owner, acc1] = await ethers.getSigners();
    console.log("\t", " ⏳ Getting user ref code...");
    const txResult = await registarContract.getRef(
      acc1.address, // address
      ethers.utils.keccak256(apiKey)
    );
    console.log("\t", " ⏳ Waiting for confirmation from getRef function...");
    console.log("\t", txResult);
    expect(txResult).to.equal(msgSender);
  });

  it("Should register another user in registar", async function () {
    const [owner, acc1, acc2] = await ethers.getSigners();
    console.log("\t", " ⏳ Registering user...");
    const rgResult = await registarContract
      .connect(acc2)
      .register(msgSender, apiKey, 56789);
    console.log("\t", " ⏳ Waiting for confirmation from register function...");
    const txResult = await rgResult.wait();
    expect(txResult.status).to.equal(1);
  });
  it("Should validate user2 pincode", async function () {
    const [owner, acc1, acc2] = await ethers.getSigners();
    console.log("\t", " ⏳ Validating user2 pin...");
    const txResult = await registarContract.connect(acc2).validatePin(
      56789, // pin code
      apiKey
    );
    console.log("\t", " ⏳ Waiting for confirmation from get function...");

    console.log("\t", txResult);
    expect(txResult).to.equal(true);
  });
  it("Should getRef in registar 2", async function () {
    const [owner, acc1, acc2] = await ethers.getSigners();
    console.log("\t", " ⏳ Getting user ref code...");
    const txResult = await registarContract.getRef(
      acc2.address, // address
      ethers.utils.keccak256(apiKey)
    );
    console.log("\t", " ⏳ Waiting for confirmation from getRef function...");
    console.log("\t", txResult);
    expect(txResult).to.equal(msgSender);
  });
  it("Should retrieve users array from contract", async function () {
    const [owner, acc1, acc2] = await ethers.getSigners();
    console.log("\t", " ⏳ Retrieving token listings...");
    const txResult = await registarContract.getUsers(
      apiKey // right apiKey
    );
    console.log(
      "\t",
      " ⏳ Waiting for confirmation from getListings function..."
    );

    // console.log(txResult);
    expect(txResult.length).to.equal(2);
    expect(txResult[0].user.toLowerCase()).to.equal(acc1.address.toLowerCase());
    expect(txResult[0].ref.toLowerCase()).to.equal(msgSender.toLowerCase());
  });

  it("Should getRef in registar for acc2", async function () {
    const [owner, acc1, acc2] = await ethers.getSigners();
    console.log("\t", " ⏳ Getting user ref code...");
    const txResult = await registarContract.getRef(
      acc2.address, // address
      ethers.utils.keccak256(apiKey)
    );
    console.log("\t", " ⏳ Waiting for confirmation from getRef function...");
    console.log("\t", txResult);
    expect(txResult.toLowerCase()).to.equal(msgSender.toLowerCase());
  });
  it("Should retrieve Refferals array from contract", async function () {
    const [owner, acc1, acc2] = await ethers.getSigners();
    console.log("acc1  address", acc1.address);
    console.log("\t", " ⏳ Retrieving token listings...");
    const txResult = await registarContract.getRefferals(
      msgSender,
      apiKey // right apiKey
    );
    console.log(
      "\t",
      " ⏳ Waiting for confirmation from getListings function..."
    );

    // console.log(txResult);
    expect(txResult.length).to.equal(2);
    expect(txResult[0].toLowerCase()).to.equal(acc1.address.toLowerCase());
  });
  it("Should retrieve User object by address", async function () {
    const [owner, acc1, acc2] = await ethers.getSigners();
    console.log("acc1  address", acc1.address);
    console.log("\t", " ⏳ Retrieving token listings...");
    const txResult = await registarContract.getUser(
      acc1.address,
      apiKey // right apiKey
    );
    console.log(
      "\t",
      " ⏳ Waiting for confirmation from getListings function..."
    );

    // console.log(txResult);
    expect(txResult.ref.toLowerCase()).to.equal(msgSender.toLowerCase());
  });
  // it("Should send money to wallet", async function () {
  //   const [owner] = await ethers.getSigners();
  //   const transactionHash = await owner.sendTransaction({
  //     to: "your metamask burner address",
  //     value: ethers.utils.parseEther("10.0"), // Sends exactly 1.0 ether
  //   });
  //   console.log("\t", transactionHash.hash);
  //   const transactionHash2 = await owner.sendTransaction({
  //     to: "your metamask burner address2",
  //     value: ethers.utils.parseEther("10.0"), // Sends exactly 1.0 ether
  //   });
  //   console.log("\t", transactionHash2.hash);
  // });
});
