const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("blocklotto", function () {
  it("it is deployed ", async function () {
    const Lottery = await ethers.getContractFactory("blocklotto");
    const blocklotto = await Lottery.deploy();
    await blocklotto.deployed();

    expect(await blocklotto.constructor()).to.equal(address[0]);
    const players = []
    expect(await blocklotto.enter()).to.equal(players[address])


    // wait until the transaction is mined
  
  });
});
