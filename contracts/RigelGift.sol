// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/GSN/Context.sol";
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