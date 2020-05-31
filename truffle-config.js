require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');  // @notice - Should use new module.
const mnemonic = process.env.MNEMONIC;


const hdWalletStartIndex = 0
const hdWalletAccounts = 0
const setupWallet = (
    url
) => {
    if (!hdWalletProvider) {
        hdWalletProvider = new HDWalletProvider(
            mnemonic,
            url,
            hdWalletStartIndex,
            hdWalletAccounts)
        hdWalletProvider.engine.addProvider(new NonceTrackerSubprovider())
    }
    return hdWalletProvider
}


module.exports = {
  networks: {
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/v3/' + process.env.INFURA_KEY),
      network_id: '3',
      gas: 4465030,
      gasPrice: 5000000000, // 5 gwei
      skipDryRun: true,     // Skip dry run before migrations? (default: false for public nets)
    },
    kovan: {
      provider: () => new HDWalletProvider(mnemonic, 'https://kovan.infura.io/v3/' + process.env.INFURA_KEY),
      network_id: '42',
      gas: 6465030,
      gasPrice: 5000000000, // 5 gwei
      skipDryRun: true,     // Skip dry run before migrations? (default: false for public nets)
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/" + process.env.INFURA_KEY),
      network_id: 4,
      gas: 6000000,         // 2 times than before
      gasPrice: 5000000000, // 5 gwei,
      skipDryRun: true,     // Skip dry run before migrations? (default: false for public nets)
      //from: process.env.DEPLOYER_ADDRESS
    },
    // main ethereum network(mainnet)
    live: {
      // provider: () => new HDWalletProvider(mnemonic, "https://mainnet.infura.io/v3/" + process.env.INFURA_KEY),
      provider: () => new LedgerWalletProvider({...ledgerOptions, networkId: 1}, 'https://mainnet.infura.io/v3/' + process.env.INFURA_KEY),
      network_id: 1,
      gas: 5500000,
      gasPrice: 2000000000 // 2 gwei
    },
    local: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
      skipDryRun: true,
      gasPrice: 5000000000
    }
  },
  // nile the ocean beta network
  nile: {
    provider: () => setupWallet(
        url || 'https://nile.dev-ocean.com'
    ),
    network_id: 0x2323, // 8995
    gas: 6000000,
    gasPrice: 10000,
    from: '0x90eE7A30339D05E07d9c6e65747132933ff6e624'
  },


  compilers: {
    solc: {
      version: "0.5.6",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
}
