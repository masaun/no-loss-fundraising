var DataBountyPlatform = artifacts.require("DataBountyPlatform");
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

    await deployer.deploy(DataBountyPlatform, 
                          daiAddress,
                          _lendingPool,
                          _lendingPoolCore,
                          _lendingPoolAddressesProvider,
                          _aDai)
                  .then(async function(dataBountyPlatform) {
                      if(ownerAddress && ownerAddress!="") {
                          console.log(`=== Transfering ownership to address ${ownerAddress} ===`)
                          await dataBountyPlatform.transferOwnership(ownerAddress);
                      }
                  }
    );

    //@dev - Transfer 2.1 DAI from deployer's address to contract address in advance
    // const dataBountyPlatform = await DataBountyPlatform.deployed();
    // const iERC20 = await IERC20.at(daiAddress);
    // await iERC20.transfer(dataBountyPlatform.address, depositedAmount);
};
