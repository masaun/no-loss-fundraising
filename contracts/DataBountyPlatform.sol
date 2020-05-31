pragma solidity ^0.5.6;
pragma experimental ABIEncoderV2;

import "openzeppelin-eth/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-eth/contracts/math/SafeMath.sol";

// Use original Ownable.sol
import "./lib/OwnableOriginal.sol";

// Storage
import "./storage/McStorage.sol";
import "./storage/McConstants.sol";


/***
 * @notice - This contract is that ...
 **/
contract DataBountyPlatform is OwnableOriginal(msg.sender), McStorage, McConstants {
    using SafeMath for uint;

    IERC20 public dai;

    constructor(address daiAddress) public {
        dai = IERC20(daiAddress);
    }

    /***
     * @notice - Get balance
     **/
    function balanceOfContract() public view returns (uint balanceOfContract_DAI, uint balanceOfContract_ETH) {
        return (dai.balanceOf(address(this)), address(this).balance);
    }

}
