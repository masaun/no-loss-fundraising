pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

// Use original Ownable.sol
import "./lib/OwnableOriginal.sol";

// Storage
import "./storage/McStorage.sol";
import "./storage/McConstants.sol";

// AAVE
import "./aave/contracts/interfaces/ILendingPool.sol";
import "./aave/contracts/interfaces/ILendingPoolCore.sol";
import "./aave/contracts/interfaces/ILendingPoolAddressesProvider.sol";


/***
 * @notice - This contract is that ...
 **/
contract DataBountyPlatform is OwnableOriginal(msg.sender), McStorage, McConstants {
    using SafeMath for uint;

    IERC20 public dai;
    ILendingPool public lendingPool;
    ILendingPoolCore public lendingPoolCore;
    ILendingPoolAddressesProvider public lendingPoolAddressesProvider;

    constructor(address daiAddress, address _lendingPool, address _lendingPoolCore, address _lendingPoolAddressesProvider) public {
        dai = IERC20(daiAddress);
        lendingPool = ILendingPool(_lendingPool);
        lendingPoolCore = ILendingPoolCore(_lendingPoolCore);
        lendingPoolAddressesProvider = ILendingPoolAddressesProvider(_lendingPoolAddressesProvider);
    }

    /***
     * @notice - Join Pool (Deposit DAI into idle-contracts-v3) for getting right of voting
     **/
    function joinPool(address _reserve, uint256 _amount, uint16 _referralCode) public returns (bool) {
        /// Transfer from wallet address
        //dai.transferFrom(msg.sender, address(this), _amount);

        /// Approve LendingPool contract to move your DAI
        dai.approve(lendingPoolAddressesProvider.getLendingPoolCore(), _amount);

        /// Deposit DAI
        lendingPool.deposit(_reserve, _amount, _referralCode);

        /// Save deposited amount each user
        depositedDai[msg.sender] = _amount;
        totalDepositedDai.add(_amount);
        emit JoinPool(msg.sender, _reserve, _amount, totalDepositedDai);
    }

    /***
     * @notice - Create a profile of company which request investment and list them.
     * @return - New company profile id
     **/
    function createCompanyProfile(string memory companyProfileHash) public returns (uint newCompanyProfileId) {
        // The first company profile will have an ID of 1
        newCompanyProfileId = companyProfileId.add(1);

        companyProfileOwner[newCompanyProfileId] = msg.sender;
        companyProfileState[newCompanyProfileId] = CompanyProfileState.Active;
        companyProfileDetails[newCompanyProfileId] = companyProfileHash;

        emit CreateCompanyProfile(newCompanyProfileId, 
                           companyProfileOwner[newCompanyProfileId], 
                           companyProfileState[newCompanyProfileId], 
                           companyProfileDetails[newCompanyProfileId]);
    }

    /***
     * @notice - Vote for a favorite CompanyProfile of voter (voter is only user who deposited before)
     **/
    function voteForCompanyProfile(uint256 companyProfileIdToVoteFor) public {
        // Can only vote if they joined a previous iteration round...
        // Check if the msg.sender has given approval rights to our steward to vote on their behalf
        uint currentCompanyProfile = usersNominatedProject[companyProfileIteration][msg.sender];
        if (currentCompanyProfile != 0) {
            companyProfileVotes[companyProfileIteration][currentCompanyProfile] = companyProfileVotes[companyProfileIteration][currentCompanyProfile].sub(depositedDai[msg.sender]);
        }

        companyProfileVotes[companyProfileIteration][companyProfileIdToVoteFor] = companyProfileVotes[companyProfileIteration][companyProfileIdToVoteFor].add(depositedDai[msg.sender]);

        usersNominatedProject[companyProfileIteration][msg.sender] = companyProfileIdToVoteFor;

        uint topProjectVotes = companyProfileVotes[companyProfileIteration][topProject[companyProfileIteration]];

        // TODO:: if they are equal there is a problem (we must handle this!!)
        if (companyProfileVotes[companyProfileIteration][companyProfileId] > topProjectVotes) {
            topProject[companyProfileIteration] = companyProfileId;
        }
    }



    /***
     * @notice - Get balance
     **/
    function balanceOfContract() public view returns (uint balanceOfContract_DAI, uint balanceOfContract_ETH) {
        return (dai.balanceOf(address(this)), address(this).balance);
    }

}
