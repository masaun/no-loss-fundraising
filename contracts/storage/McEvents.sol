pragma solidity ^0.5.16;

import "./McObjects.sol";


contract McEvents {

    event JoinPool(
        address indexed userWhoDeposited, 
        address depositedToken, 
        uint depositedAmount,
        uint totalDepositedDai
    );

    event CreateCompanyProfile(
        uint indexed newCompanyProfileId, 
        address companyProfileOwner,
        McObjects.CompanyProfileState companyProfileState,
        string companyProfileHash
    );

    event DistributeFunds(
        uint redeemedAmount, 
        uint principalBalance, 
        uint currentInterestIncome
    );

}
