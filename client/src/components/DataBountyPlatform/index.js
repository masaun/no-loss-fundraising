import React, { Component } from "react";
import getWeb3, { getGanacheWeb3, Web3 } from "../../utils/getWeb3";

import App from "../../App.js";

import { Grid } from '@material-ui/core';
import { Loader, Button, Card, Input, Field, Heading, Table, Form, Flex, Box, Image, EthAddress } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../../../config/webpack';

import styles from '../../App.module.scss';
//import './App.css';

import { walletAddressList } from '../../data/walletAddress/walletAddress.js'
import { contractAddressList } from '../../data/contractAddress/contractAddress.js'
import { tokenAddressList } from '../../data/tokenAddress/tokenAddress.js'


export default class DataBountyPlatform extends Component {
    constructor(props) {    
        super(props);

        this.state = {
            /////// Default state
            storageValue: 0,
            web3: null,
            accounts: null,
            route: window.location.pathname.replace("/", "")
        };

        /////// AAVE related functions
        this.joinPool = this.joinPool.bind(this);        
        this.createCompanyProfile = this.createCompanyProfile.bind(this);
        this.voteForCompanyProfile = this.voteForCompanyProfile.bind(this);
        this.distributeFunds = this.distributeFunds.bind(this);

        /////// Getter Functions of others
        this._balanceOfContract = this._balanceOfContract.bind(this);

        /////// Test Functions
        this.getAaveRelatedFunction = this.getAaveRelatedFunction.bind(this);
        this.timestampFromDate = this.timestampFromDate.bind(this);

        /////// Handler
        this.handleJoinPoolDepositAmount = this.handleJoinPoolDepositAmount.bind(this);
        this.handleCreateCompanyProfileName = this.handleCreateCompanyProfileName.bind(this);
    }

    handleJoinPoolDepositAmount(event) {
        this.setState({ valueJoinPoolDepositAmount: event.target.value });
    }

    handleCreateCompanyProfileName(event) {
        this.setState({ valueCreateCompanyProfileName: event.target.value });
    }


    /***
     * @notice - AAVE related functions
     **/
    joinPool = async () => {
        const { accounts, web3, dai, data_bounty_platform, DAI_ADDRESS, DATA_BOUNTY_PLATFORM_ADDRESS, valueJoinPoolDepositAmount } = this.state;

        const _reserve = DAI_ADDRESS;  /// DAI(aave) on Kovan
        const _amount = web3.utils.toWei(valueJoinPoolDepositAmount, 'ether');
        const _referralCode = 0;

        let res1 = await dai.methods.approve(DATA_BOUNTY_PLATFORM_ADDRESS, _amount).send({ from: accounts[0] });
        let res2 = await data_bounty_platform.methods.joinPool(_reserve, _amount, _referralCode).send({ from: accounts[0] });
        console.log('=== joinPool() ===\n', res2);

        this.setState({ valueJoinPoolDepositAmount: '' });
    }

    /***
     * @notice - Create CompanyProfile and list them.
     **/
    createCompanyProfile = async () => {
        const { accounts, web3, dai, data_bounty_platform, valueCreateCompanyProfileName } = this.state;

        const companyProfileName = valueCreateCompanyProfileName;
        const _companyProfileHash = web3.utils.toHex(companyProfileName);

        let res = await data_bounty_platform.methods.createCompanyProfile(_companyProfileHash).send({ from: accounts[0] });
        console.log('=== createCompanyProfile() ===\n', res);

        var companyProfileHash = await res.events.CreateCompanyProfile.returnValues.companyProfileHash;
        var companyProfileOwner = await res.events.CreateCompanyProfile.returnValues.companyProfileOwner;
        var companyProfileState = await res.events.CreateCompanyProfile.returnValues.companyProfileState;
        var newCompanyProfileId = await res.events.CreateCompanyProfile.returnValues.newCompanyProfileId;

        var companyProfileDetail = [];
        companyProfileDetail.push(companyProfileHash);
        companyProfileDetail.push(companyProfileOwner);
        companyProfileDetail.push(companyProfileState);
        companyProfileDetail.push(newCompanyProfileId);

        var companyProfileList = [];
        companyProfileList.push(companyProfileDetail);

        this.setState({ valueCreateCompanyProfileName: '',
                        companyProfileList: companyProfileList });
    }

    /***
     * @notice - Vote for a favorite CompanyProfile of voter (voter is only user who deposited before)
     **/
    voteForCompanyProfile = async () => {
        const { accounts, web3, dai, data_bounty_platform } = this.state;

        const _companyProfileIdToVoteFor = 1;

        let res = await data_bounty_platform.methods.voteForCompanyProfile(_companyProfileIdToVoteFor).send({ from: accounts[0] });
        console.log('=== voteForCompanyProfile() ===\n', res);           
    }

    /***
     * @notice - Distribute fund into selected CompanyProfile by voting)
     **/
    distributeFunds = async () => {
        const { accounts, web3, dai, data_bounty_platform, DAI_ADDRESS } = this.state;

        const _reserve = DAI_ADDRESS;  /// DAI(aave) on Kovan
        const _referralCode = 0;

        let res = await data_bounty_platform.methods.distributeFunds(_reserve, _referralCode).send({ from: accounts[0] });
        console.log('=== distributeFunds() ===\n', res);         
    }


    /***
     * @notice - Getter Functions
     **/
    _balanceOfContract = async () => {
        const { accounts, web3, dai, data_bounty_platform } = this.state;

        let res1 = await data_bounty_platform.methods.balanceOfContract().call();
        console.log('=== balanceOfContract() ===\n', res1);
    }

    /***
     * @notice - Test Functions
     **/    
    getAaveRelatedFunction = async () => {
        const { accounts, web3, dai, data_bounty_platform } = this.state;

        const aaveRelatedResult = await data_bounty_platform.methods.getAaveRelatedFunction().call();
        console.log('=== getAaveRelatedFunction ===', aaveRelatedResult);
    }

    timestampFromDate = async () => {
        const { accounts, web3, bokkypoobahs_datetime_contract } = this.state;

        const dateToTimestamp = await bokkypoobahs_datetime_contract.methods.timestampFromDate(2020, 5, 4).call();
        console.log('=== dateToTimestamp ===', dateToTimestamp);
    }


    //////////////////////////////////// 
    ///// Refresh Values
    ////////////////////////////////////
    refreshValues = (instanceDataBountyPlatform) => {
        if (instanceDataBountyPlatform) {
          //console.log('refreshValues of instanceDataBountyPlatform');
        }
    }


    //////////////////////////////////// 
    ///// Ganache
    ////////////////////////////////////
    getGanacheAddresses = async () => {
        if (!this.ganacheProvider) {
            this.ganacheProvider = getGanacheWeb3();
        }
        if (this.ganacheProvider) {
            return await this.ganacheProvider.eth.getAccounts();
        }
        return [];
    }

    componentDidMount = async () => {
        const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
     
        let DataBountyPlatform = {};
        let Erc20 = {};
        let BokkyPooBahsDateTimeContract = {};
        try {
          DataBountyPlatform = require("../../../../build/contracts/DataBountyPlatform.json");
          Erc20 = require("../../../../build/contracts/IERC20.json");
          BokkyPooBahsDateTimeContract = require("../../../../build/contracts/BokkyPooBahsDateTimeContract.json");   //@dev - BokkyPooBahsDateTimeContract.sol (for calculate timestamp)
        } catch (e) {
          console.log(e);
        }

        try {
          const isProd = process.env.NODE_ENV === 'production';
          if (!isProd) {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
            let ganacheAccounts = [];

            try {
              ganacheAccounts = await this.getGanacheAddresses();
            } catch (e) {
              console.log('Ganache is not running');
            }

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const networkType = await web3.eth.net.getNetworkType();
            const isMetaMask = web3.currentProvider.isMetaMask;
            let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
            balance = web3.utils.fromWei(balance, 'ether');

            // Create instance of contracts
            let instanceDataBountyPlatform = null;
            let deployedNetwork = null;
            let DATA_BOUNTY_PLATFORM_ADDRESS = DataBountyPlatform.networks[networkId.toString()].address;
            if (DataBountyPlatform.networks) {
              deployedNetwork = DataBountyPlatform.networks[networkId.toString()];
              if (deployedNetwork) {
                instanceDataBountyPlatform = new web3.eth.Contract(
                  DataBountyPlatform.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                console.log('=== instanceDataBountyPlatform ===', instanceDataBountyPlatform);
              }
            }


            //@dev - Create instance of DAI-contract
            let instanceDai = null;
            let DAI_ADDRESS = tokenAddressList["Kovan"]["DAIaave"]; //@dev - DAI（on Kovan）
            instanceDai = new web3.eth.Contract(
              Erc20.abi,
              DAI_ADDRESS,
            );
            console.log('=== instanceDai ===', instanceDai);

            //@dev - Create instance of BokkyPooBahsDateTimeContract.sol
            let instanceBokkyPooBahsDateTimeContract = null;
            let BOKKYPOOBAHS_DATETIME_CONTRACT_ADDRESS = contractAddressList["Kovan"]["BokkyPooBahsDateTimeLibrary"]["BokkyPooBahsDateTimeContract"];
            instanceBokkyPooBahsDateTimeContract = new web3.eth.Contract(
              BokkyPooBahsDateTimeContract.abi,
              BOKKYPOOBAHS_DATETIME_CONTRACT_ADDRESS,
            );
            console.log('=== instanceBokkyPooBahsDateTimeContract ===', instanceBokkyPooBahsDateTimeContract);


            if (DataBountyPlatform || Erc20 || BokkyPooBahsDateTimeContract) {
              // Set web3, accounts, and contract to the state, and then proceed with an
              // example of interacting with the contract's methods.
              this.setState({ 
                web3, 
                ganacheAccounts, 
                accounts, 
                balance, 
                networkId, 
                networkType, 
                hotLoaderDisabled,
                isMetaMask, 
                data_bounty_platform: instanceDataBountyPlatform,
                dai: instanceDai,
                bokkypoobahs_datetime_contract: instanceBokkyPooBahsDateTimeContract,
                DATA_BOUNTY_PLATFORM_ADDRESS : DATA_BOUNTY_PLATFORM_ADDRESS,
                DAI_ADDRESS: DAI_ADDRESS,
              }, () => {
                this.refreshValues(
                  instanceDataBountyPlatform
                );
                setInterval(() => {
                  this.refreshValues(instanceDataBountyPlatform);
                }, 5000);
              });
            }
            else {
              this.setState({ web3, ganacheAccounts, accounts, balance, networkId, networkType, hotLoaderDisabled, isMetaMask });
            }
          }
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
    }


    render() {
        const { accounts, poolTogether_nybw } = this.state;

        return (
            <div className={styles.widgets}>
                <Grid container style={{ marginTop: 20 }}>
                    <Field label="Deposit DAI Amount">
                        <Input
                            type="text"
                            width={1}
                            value={this.state.valueJoinPoolDepositAmount} 
                            onChange={this.handleJoinPoolDepositAmount}
                        />

                        <Button type="submit" onClick={this.joinPool} width={1}>
                          Join Pool
                        </Button>
                    </Field>
                </Grid>

                <Grid container style={{ marginTop: 20 }}>
                    <Field label="Company Profile Name">
                        <Input
                            type="text"
                            width={1}
                            value={this.state.valueCreateCompanyProfileName} 
                            onChange={this.handleCreateCompanyProfileName}
                        />

                        <Button type="submit" onClick={this.createCompanyProfile} width={1}>
                          Create Company Profile
                        </Button>
                    </Field>
                </Grid>

                <hr />






                <hr />

                <Grid container style={{ marginTop: 20 }}>
                    <Grid item xs={12}>
                        <Card width={"auto"} 
                              maxWidth={"420px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>No Loss Fundraising</h4> <br />
                            <Button size={'small'} mt={3} mb={2} onClick={this.joinPool}> Join Pool </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.createCompanyProfile}> Create Company Profile </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.voteForCompanyProfile}> Vote For Company Profile </Button> <br />

                            <Button size={'small'} mt={3} mb={2} onClick={this.distributeFunds}> Distribute Funds </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this._balanceOfContract}> Balance of contract </Button> <br />
                        </Card>

                        <Card width={"auto"} 
                              maxWidth={"420px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h4>Test Functions</h4> <br />
                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.getAaveRelatedFunction}> Get Aave Related Function </Button> <br />

                            <Button mainColor="DarkCyan" size={'small'} mt={3} mb={2} onClick={this.timestampFromDate}> Timestamp From Date </Button> <br />
                        </Card>
                    </Grid>

                    <Grid item xs={4}>
                    </Grid>

                    <Grid item xs={4}>
                    </Grid>
                </Grid>
            </div>
        );
    }

}
