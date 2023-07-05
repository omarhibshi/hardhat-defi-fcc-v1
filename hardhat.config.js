require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")

const MAINNET_RPC_URL =
    process.env.MAINNET_RPC_URL || process.env.ALCHEMY_MAINNET_RPC_URL || ""
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://eth-sepolia"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Key"
const LOCALHOST_RPC_URL = process.env.LOCALHOST_RPC_URL || "https://eth-sepolia"
const OINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key"

const SANAA_PRIVATE_KEY = process.env.SANAA_PRIVATE_KEY
const MUSCAT_PRIVATE_KEY = process.env.MUSCAT_PRIVATE_KEY
const PARIS_PRIVATE_KEY = process.env.PARIS_PRIVATE_KEY
const ARAFAT_PRIVATE_KEY = process.env.ARAFAT_PRIVATE_KEY
const SHOUAIB_PRIVATE_KEY = process.env.SHOUAIB_PRIVATE_KEY
const REPORT_GAS = process.env.REPORT_GAS || false

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.8",
            },
            {
                version: "0.6.12",
            },
            {
                version: "0.4.19",
            },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            forking: {
                url: MAINNET_RPC_URL,
            },
        },
        localhost: {
            chainId: 31337,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [SANAA_PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6,
        },
    },

    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
}
