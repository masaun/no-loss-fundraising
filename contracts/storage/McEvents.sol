pragma solidity ^0.5.16;

import "./McObjects.sol";


contract McEvents {

    event JoinPool(
        address indexed userWhoDeposited, 
        address depositedToken, 
        uint depositedAmount,
        uint totalDepositedDai
    );

}
