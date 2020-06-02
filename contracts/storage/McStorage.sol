pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./McObjects.sol";
import "./McEvents.sol";


// shared storage
contract McStorage is McObjects, McEvents {

    ///////////////////////////////////
    // @dev - Define as memory
    ///////////////////////////////////
    uint totalDepositedDai;
    uint companyProfileId;

    
    //////////////////////////////////
    // @dev - Define as storage
    ///////////////////////////////////
    mapping (address => uint) depositedDai;

    mapping(uint256 => address) public companyProfileOwner;
    mapping(uint256 => string) public companyProfileDetails;
    mapping(uint256 => CompanyProfileState) public companyProfileState; // Company profile Id to current state


}
