var NoLossFundraising = artifacts.require("NoLossFundraising");
var IERC20 = artifacts.require("IERC20");
var ILendingPool = artifacts.require("ILendingPool");
var ILendingPoolCore = artifacts.require("ILendingPoolCore");
var ILendingPoolAddressesProvider = artifacts.require("ILendingPoolAddressesProvider");

//@dev - Import from exported file
var contractAddressList = require('./contractAddress/contractAddress.js');
var tokenAddressList = require('./tokenAddress/tokenAddress.js');
var walletAddressList = require('./walletAddress/walletAddress.js');

const daiAddress = tokenAddressList["Kovan"]["DAIaave"];     // DAI address on Kovan
const _lendingPool = contractAddressList["Kovan"]["Aave"]["LendingPool"];
const _lendingPoolCore = contractAddressList["Kovan"]["Aave"]["LendingPoolCore"];
const _lendingPoolAddressesProvider = contractAddressList["Kovan"]["Aave"]["LendingPoolAddressesProvider"];
const _aDai = tokenAddressList["Kovan"]["aDAI"]; /// aDAI address on Kovan

const depositedAmount = web3.utils.toWei("0.15");    // 0.15 DAI which is deposited in deployed contract. 

module.exports = async function(deployer, network, accounts) {
    // Initialize owner address if you want to transfer ownership of contract to some other address
    let ownerAddress = walletAddressList["WalletAddress1"];

    await deployer.deploy(NoLossFundraising, 
                          daiAddress,
                          _lendingPool,
                          _lendingPoolCore,
                          _lendingPoolAddressesProvider,
                          _aDai)
                  .then(async function(noLossFundraising) {
                      if(ownerAddress && ownerAddress!="") {
                          console.log(`=== Transfering ownership to address ${ownerAddress} ===`)
                          await noLossFundraising.transferOwnership(ownerAddress);
                      }
                  }
    );

    //@dev - Transfer 2.1 DAI from deployer's address to contract address in advance
    // const noLossFundraising = await NoLossFundraising.deployed();
    // const iERC20 = await IERC20.at(daiAddress);
    // await iERC20.transfer(noLossFundraising.address, depositedAmount);
};
