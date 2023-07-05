const { ethers, getNamedAccounts, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")

const AMOUNT = ethers.utils.parseEther("0.2")

async function getWeth() {
    // Get the WETH contract using ethers.getContractAt()
    // W>e need: Contract address and ABI
    const { deployer } = await getNamedAccounts()
    const signer = await ethers.getSigner(deployer)
    const iWeth = await ethers.getContractAt(
        "IWeth",
        networkConfig[network.config.chainId].wethToken,
        signer
    )
    const txResponse = await iWeth.deposit({
        value: AMOUNT,
    })
    await txResponse.wait(1)
    const wethBalance = await iWeth.balanceOf(deployer)
    console.log(`Got ${wethBalance.toString()} WETH`)
}

module.exports = { getWeth, AMOUNT }
