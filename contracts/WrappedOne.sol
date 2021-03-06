pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// For development purposes only
contract WrappedOne is ERC20 {
    uint public INITIAL_SUPPLY = 10000000000000000000000;

    constructor() public ERC20("Wrapped ONE", "WONE") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
