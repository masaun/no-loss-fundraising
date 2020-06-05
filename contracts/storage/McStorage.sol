pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./McObjects.sol";
import "./McEvents.sol";


// shared storage
contract McStorage is McObjects, McEvents {

    ///////////////////////////////////
    // @dev - This is only variable which value are assigned in "constructor"
    ///////////////////////////////////
    uint votingInterval;
    uint companyProfileDeadline;

    
    //////////////////////////////////
    // @dev - Define as mapping
    ///////////////////////////////////
    mapping (address => uint) depositedDai;

    mapping(uint256 => address) public companyProfileOwner;
    mapping(uint256 => string) public companyProfileDetails;
    mapping(uint256 => CompanyProfileState) public companyProfileState; // Company profile Id to current state

    mapping(uint256 => mapping(address => uint256)) public usersNominatedProject; // Means user can only have one project.
    mapping(uint256 => mapping(uint256 => uint256)) public companyProfileVotes;
    mapping(uint256 => uint256) public topProject;

    mapping(uint256 => mapping(uint256 => uint256)) public companyProfileVoteCount;  // For counting vote of each companyProfileId
}
