pragma solidity >=0.4.24;

import "./PriceOracle.sol";
import "./SafeMath.sol";
import "./StringUtils.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract SimplePriceOracle is Ownable, PriceOracle {
    using SafeMath for *;
    using StringUtils for *;

    // Rent in wei per second
    uint public rentPrice;

    event RentPriceChanged(uint price);

    constructor(uint _rentPrice) public {
        setPrice(_rentPrice);
    }

    function setPrice(uint _rentPrice) public onlyOwner {
        rentPrice = _rentPrice;
        emit RentPriceChanged(_rentPrice);
    }

    /**
     * @dev Returns the price to register or renew a name.
     * @param duration How long the name is being registered or extended for, in seconds.
     * @return The price of this renewal or registration, in wei.
     */
    function price(string calldata name /*name*/, uint /*expires*/, uint duration) external view returns(uint) {
        uint len = name.strlen();
        require(len > 0);
        /*uint priceUSD = rentPrice.mul(duration);
        uint ethPrice = 134695000000000000000;

        // return ethPrice.div(1e18);
        return priceUSD.mul(1e18).div(ethPrice);*/
        return duration.mul(rentPrice);
        // return duration.mul(rentPrice);
    }
}