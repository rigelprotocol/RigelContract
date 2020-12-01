pragma solidity ^0.6.0;

import  'github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol';
import  'github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20Burnable.sol';
import  'github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol';



 contract RigelToken is ERC20Burnable, Ownable {
    
    
    constructor() ERC20("RigelToken", "RGP") public {
        uint256 totalSupply = 2000000 * (10**18);
        _mint(msg.sender, totalSupply);
    }
    
    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `recipient` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    
     function transfer(address recipient, uint256 amount) public onlyOwner virtual override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }
    
     /**
     * @dev Destroys `amount` tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
     
     function burn(uint256 amount) public onlyOwner virtual override{
        _burn(_msgSender(), amount);
    }
    
     
}

