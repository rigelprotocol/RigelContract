pragma solidity ^0.6.0;

import  '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import  '@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol';
import  '@openzeppelin/contracts/token/ERC20/TokenTimelock.sol';


    
    contract RigelToken is ERC20,ERC20Burnable,TokenTimelock {
    
    constructor(uint256 initialSupply) ERC20("RigelToken", "RGP") public {
        _mint(msg.sender, initialSupply);
    }
}
