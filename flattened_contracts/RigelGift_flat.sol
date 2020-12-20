// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

// File: @openzeppelin/contracts/math/SafeMath.sol

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

// File: @openzeppelin/contracts/GSN/Context.sol

/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with GSN meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

// File: contracts/RigelGift.sol

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";


// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

pragma experimental ABIEncoderV2;

/// @title RigelGift is responsible for managing crypto rewards and airdrops
contract RigelGift is Context {
// contract RigelGift is Ownable{
    
    using SafeMath for uint256;
    
    uint256 public _rewardProjectCounter = 1;

    // uint256 public _subscriptionFee;

    // IERC20 _rgpToken;

    // constructor(uint256 subscriptionFee, address rgpToken) public {
    //     _subscriptionFee = subscriptionFee;
    //     _rgpToken = IERC20(rgpToken);
    // }

    // Defining a ticker reward
    struct TickerInfo {
        address token;
        uint256 rewardAmount;
        uint256 difficulty_numerator;
        uint256 difficulty_denominator;
        string text;
    }
    
    struct TokenInfo{
        address token;
        uint256 balance;
    }
    
    // Defining a Project Reward 
    struct RewardProject {
        bool status;
        uint256 rewardProjectID;
        uint256 claimedCount;
        string description;
    }
    
    // All tickers for a given Project Reward
    mapping (uint256 => TickerInfo[]) public rewardTickers;
    
    // All rewards for a given Rewards Project
    mapping (uint256 => TokenInfo[]) public rewardTokens;
    
    // All Project Rewards managed by the project (address)
    mapping (address => mapping (uint256 => RewardProject)) public rewardProjMapping;

    mapping (address => uint[]) public rewardProjects;

    event RewardProjectCreate(address indexed sender, uint256 indexed projectIndex);

    event RewardProjectEdit(address indexed sender, uint256 indexed projectIndex);

    //remove
    // function setSubscriptionFee(uint256 fee) public onlyOwner {
    //     _subscriptionFee = fee;
    // }
    
    //create the reward project
    function createRewardProject(bytes[] calldata rewards, string calldata description, bytes[] calldata tickerInfo ) external returns (bool ) {

        // require(_rgpToken.balanceOf(_msgSender()) >= _subscriptionFee,"RigelGift: Insufficient Rigel Token Balance");

        bool status = _setRewards(_rewardProjectCounter, rewards);
        require( status == true,"RigelGift: Set Reward Tokens failed");

        status = _setTickers(_rewardProjectCounter, tickerInfo);
        require( status == true,"RigelGift: Set Reward Ticker failed");
        
        RewardProject memory rewardProj = RewardProject(true,_rewardProjectCounter, 0, description);
        rewardProjMapping[_msgSender()][_rewardProjectCounter] = rewardProj;
        rewardProjects[_msgSender()].push(_rewardProjectCounter);

        emit RewardProjectCreate(_msgSender(),_rewardProjectCounter);
        
        _rewardProjectCounter = _rewardProjectCounter.add(1);

        return true;
    }

    function _setRewards( uint256 projectCounter, bytes[] calldata rewards) private returns (bool status) {

        for(uint8 i = 0 ; i < rewards.length; i++) {
            (address token, uint256 balance) = abi.decode(rewards[i], (address, uint256));
            require( token != address(0),"RigelGift: Zero address token" );
            // check for token balances ?
            TokenInfo memory t = TokenInfo(token, balance);
            rewardTokens[projectCounter].push(t);
        }

        return true;
    }

    function _setTickers(uint256 projectCounter, bytes[] calldata tickerInfo) private returns (bool status) {

        // uint256 length = tickerInfo.length;

        // if(length != 8 || length != 12){
        //     revert("RigelGift: Inadequate ticker length");
        // }

        for(uint8 i = 0 ; i < tickerInfo.length ; i++) {
            (address token, uint256 amount, uint256 numerator, uint256 denominator, string memory message) = abi.decode(tickerInfo[i], (address, uint256, uint256, uint256, string));

            if( token != address(0) ){
                if( numerator == 0 || denominator == 0 ){
                    revert("RigelGift: Incorrect difficulty for non zero address");
                }
            }
            
            TickerInfo memory ticker = TickerInfo(token, amount, numerator, denominator, message);
            rewardTickers[projectCounter].push(ticker);
        }
        return true;
    }

    //edit rewards
    function editRewardProject(uint256 projectCounter, bytes[] calldata tickerInfo ) external returns (bool ) {

        RewardProject memory proj = rewardProjMapping[_msgSender()][projectCounter];

        // require(_rgpToken.balanceOf(_msgSender()) >= _subscriptionFee,"RigelGift: Insufficient Rigel Token Balance");
        require(proj.rewardProjectID == projectCounter ,"RigelGift: No Reward Project exists");
        require(proj.status == true ,"RigelGift: Reward Project inactive");

        delete rewardTickers[projectCounter];
        
        bool status = _setTickers(projectCounter, tickerInfo);
        require( status == true,"RigelGift: Set Reward Ticker failed");
        
        emit RewardProjectEdit(_msgSender(), projectCounter);
        
        return true;
    }
    
    //claim rewards
    
    //withdraw amounts
    
}
