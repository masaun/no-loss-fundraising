pragma solidity ^0.5.16;

import "./McObjects.sol";


contract McEvents {

    event _PairCreated(
        address indexed token0, 
        address indexed token1, 
        address pair
    );

    event MintUniToken(
        address pair,
        address to, 
        uint liquidity
    );

    event _AddLiquidity(
        address tokenA,
        address tokenB,
        uint amountA, 
        uint amountB,
        uint liquidity
    );

    event SyndicatedAddLiquidity(
        address userA,
        address userB,
        address tokenA,
        address tokenB,
        uint amountA, 
        uint amountB,
        uint liquidity
    );





    /***
     * @dev - Example
     **/
    event Example(
        uint256 indexed Id, 
        uint256 exchangeRateCurrent,
        address msgSender,
        uint256 approvedValue    
    );

}
