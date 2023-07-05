const { getWeth, AMOUNT } = require("./getWeth")
const { ethers, getNamedAccounts, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")

async function main() {
    const { deployer } = await getNamedAccounts()
    const signer = await ethers.getSigner(deployer)

    // Deposite WETH to WETH contract
    await getWeth(deployer, signer)

    // Get the Aave LendingPoolAddressProvider contract using ethers.getContractAt()
    // We need: Contract address (0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5) and ABI
    const lendingPool = await getLendingPool(signer)
    console.log(`LendingPool contract ${lendingPool.address}`)

    // Get the WETH contract
    const wethTokenAddress = networkConfig[network.config.chainId].wethToken

    // approve WETH allowance spending to the LendingPool contract
    await approveERC2(wethTokenAddress, lendingPool.address, AMOUNT, signer)

    // deposite WETH to the LendingPool contract
    console.log("Depositing WETH...")
    const depoisttx = await lendingPool.deposit(
        wethTokenAddress,
        AMOUNT,
        deployer,
        0
    )
    await depoisttx.wait(1)
    console.log(`Deposited with tx ${depoisttx.hash}`)

    // Check pool data
    let { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
        await getBorrowUserData(lendingPool, deployer)

    // check available borrow amount in ETH and convert it to DAI
    const daiPrice = await getDaiPrice()
    const amountDaiToBorrow =
        availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber())
    console.log(`Amount of DAI to borrow: ${amountDaiToBorrow} DAI`)
    const amountDaiToBorrowWei = ethers.utils.parseEther(
        amountDaiToBorrow.toString()
    )

    // Borrow DAI from the LendingPool contract
    const daiTokenAddress = networkConfig[network.config.chainId].daiToken
    await borrowDai(
        daiTokenAddress,
        lendingPool,
        amountDaiToBorrowWei,
        deployer
    )

    // Check pool data
    await getBorrowUserData(lendingPool, deployer)
    await repay(
        daiTokenAddress,
        amountDaiToBorrowWei,
        lendingPool,
        deployer,
        signer
    )
    await getBorrowUserData(lendingPool, deployer)
}

async function getLendingPool(account) {
    const lendingPoolAddressProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        networkConfig[network.config.chainId].lendingPoolAddressesProvider,
        account
    )
    const lendingPoolAddress = await lendingPoolAddressProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt(
        "ILendingPool",
        lendingPoolAddress,
        account
    )

    return lendingPool
}

async function approveERC2(
    erc20Address,
    spenderAddress,
    amountToSpend,
    account
) {
    /**
     * @_approveERC20 is used to invoke the approve() function on any ERC20 contract.
     * @_erc20Address is the address of the ERC20 contract (of which the approve() function will be invoked), here will be the @_WETH contract address
     * since we will deposit WETH to bowrow against it .
     * @_spenderAddress is the address of the spender, here will be the @_LendingPool contract address. the LendingPool contract will use the @_WETH function
     * transforFrom() to move some WETH from the signer wallet to itself (or any of its associated addresses). TransferFrom() is not concerned with the
     * destination of the amount being transfered, it only cares about the source and the amount.
     * @_amountToSpend is the allawnce limit granted to the spender
     * */
    const contractIERC20 = await ethers.getContractAt(
        "IERC20",
        erc20Address,
        account
    )
    const tx = await contractIERC20.approve(spenderAddress, amountToSpend)
    await tx.wait(1)
    console.log(`Approved ${amountToSpend} tokens for ${spenderAddress}`)
}

async function getDaiPrice() {
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        networkConfig[network.config.chainId].daiEthPriceFeed
    )
    const price = (await daiEthPriceFeed.latestRoundData()).answer
    console.log(`DAI/ETH price is ${price / 1e8}`)
    return price
}

async function getBorrowUserData(lendingPool, account) {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
        await lendingPool.getUserAccountData(account)
    console.log(`You have ${totalCollateralETH} worth of ETH deposited`)
    console.log(`You have ${totalDebtETH} worth of ETH borrowed`)
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH`)
    return { totalCollateralETH, totalDebtETH, availableBorrowsETH }
}

async function borrowDai(
    daiTokenAddress,
    lendingPool,
    amountDaiToBorrowWei,
    account
) {
    const borrowTx = await lendingPool.borrow(
        daiTokenAddress,
        amountDaiToBorrowWei,
        1,
        0,
        account
    )
    await borrowTx.wait()
    console.log("You have borrowed DAI")
}

async function repay(daiTokenAddress, amount, lendingPool, deployer, account) {
    await approveERC2(daiTokenAddress, lendingPool.address, amount, account)
    const repayTx = await lendingPool.repay(
        daiTokenAddress,
        amount,
        1,
        deployer
    )
    await repayTx.wait(1)
    console.log("Repaid DAI")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
