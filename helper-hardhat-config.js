const networkConfig = {
    31337: {
        name: "localhost",
        wethToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        lendingPoolAddressesProvider:
            "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        daiEthPriceFeed: "0x773616E4d11A78F511299002da57A0a94577F1f4",
        daiToken: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    // Due to the changing testnets, this testnet might not work as shown in the video
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        wethToken: "0xD0dF82dE051244f04BfF3A8bB1f62E1cD39eED92",
        daiEthPriceFeed: "0x42585eD362B3f1BCa95c640FdFf35Ef899212734",
        daiToken: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}
