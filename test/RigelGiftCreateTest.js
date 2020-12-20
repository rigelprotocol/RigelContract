const RigelToken = artifacts.require("RigelToken");
const RigelGift = artifacts.require("RigelGift");
const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

contract('RigelGift', function (accounts) {
    const [ initialHolder, project1, project2, hacker ] = accounts;
  
    const project1Supply = new BN('10000000000000000000000000');
    const project2Supply = new BN('10000000000000000000000000');
    const subscriptionFee = new BN('10000000000000000000');
  
    beforeEach(async function () {
        
        // Create RGP token
        this.token = await RigelToken.new(initialHolder);

        // Create another instance
        this.token2 = await RigelToken.new(initialHolder);
      
        //Give some supply
        // this.token.transfer(project1, project1Supply, {from: initialHolder});
        // this.token.transfer(project2, project2Supply, {from: initialHolder});

        //Create GIFT Contract
        // this.rigelGift = await RigelGift.new( subscriptionFee, this.token.address);
        this.rigelGift = await RigelGift.new();
    });

    describe('Gift Conract Creation', function () {
        // it('Check subscription fee', async function(){
        //     expect(await this.rigelGift._subscriptionFee()).to.be.bignumber.equal(subscriptionFee);
        // });
        
        describe('when project1 creates a reward programme with one token', function (){
        // describe('when project1 has enough subscription fee and tries to create a reward programme with one token', function (){
            it('is a successful', async function(){

                let reward1 = web3.eth.abi.encodeParameters(['address','uint256'], [this.token.address, web3.utils.toWei('20','ether')]);
                
                let ticker1 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('0.5','ether'),50,100,'']);
                let ticker2 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1','ether'),40,100,'']);
                let ticker3 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1.5','ether'),30,100,'']);
                let ticker4 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1','ether'),20,100,'']);
                let ticker5 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [ZERO_ADDRESS,0,0,0,'try again']);
                let ticker6 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('0.5','ether'),10,100,'']);
                let ticker7 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('2','ether'),8,100,'']);
                let ticker8 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('2','ether'),7,100,'']);
                let ticker9 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('2','ether'),6,100,'']);
                let ticker10 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('2.5','ether'),5,100,'']);
                let ticker11 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('3','ether'),2,100,'']);
                let ticker12 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('4','ether'),1,100,'']);

                let response = await this.rigelGift.createRewardProject([reward1],"abcd",[ticker1,ticker2,ticker3,ticker4,ticker5,ticker6,ticker7,ticker8,ticker9,ticker10,ticker11,ticker12],{from: project1});

                // test for event
                expectEvent.inLogs(response.logs, 'RewardProjectCreate', {
                    sender: project1,
                    projectIndex: new BN('1'),
                  });

                // test for reward token and balance
                expect((await this.rigelGift.rewardTokens(1,0)).token).to.be.equal(this.token.address);
                expect((await this.rigelGift.rewardTokens(1,0)).balance).to.be.bignumber.equal(web3.utils.toWei('20','ether'));

                // test for ticker information
                expect((await this.rigelGift.rewardTickers(1,0)).token).to.be.equal(this.token.address);
                expect((await this.rigelGift.rewardTickers(1,0)).text).to.be.equal("");
                expect((await this.rigelGift.rewardTickers(1,0)).rewardAmount).to.be.bignumber.equal(web3.utils.toWei('0.5','ether'));
            });

        });

        describe('when project1 creates a reward programme with two token', function (){
        // describe('when project1 has enough subscription fee and tries to create a reward programme with one token', function (){
            it('is a successful', async function(){
    
                let reward1 = web3.eth.abi.encodeParameters(['address','uint256'], [this.token.address, web3.utils.toWei('20','ether')]);
                let reward2 = web3.eth.abi.encodeParameters(['address','uint256'], [this.token2.address, web3.utils.toWei('40','ether')]);
                
                let ticker1 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('0.5','ether'),50,100,'']);
                let ticker2 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1','ether'),40,100,'']);
                let ticker3 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1.5','ether'),30,100,'']);
                let ticker4 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1','ether'),20,100,'']);
                let ticker5 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [ZERO_ADDRESS,0,0,0,'try again']);
                let ticker6 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('0.5','ether'),10,100,'']);
                let ticker7 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('2','ether'),8,100,'']);
                let ticker8 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('2','ether'),7,100,'']);
                let ticker9 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('2','ether'),6,100,'']);
                let ticker10 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token2.address,web3.utils.toWei('2.5','ether'),5,100,'']);
                let ticker11 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token2.address,web3.utils.toWei('3','ether'),2,100,'']);
                let ticker12 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token2.address,web3.utils.toWei('4','ether'),1,100,'']);
    
                let response = await this.rigelGift.createRewardProject([reward1,reward2],"abcd",[ticker1,ticker2,ticker3,ticker4,ticker5,ticker6,ticker7,ticker8,ticker9,ticker10,ticker11,ticker12],{from: project2});
    
                // test for event
                expectEvent.inLogs(response.logs, 'RewardProjectCreate', {
                    sender: project2,
                    projectIndex: new BN('1'),
                });
    
                // test for reward token and balance
                expect((await this.rigelGift.rewardTokens(1,0)).token).to.be.equal(this.token.address);
                expect((await this.rigelGift.rewardTokens(1,0)).balance).to.be.bignumber.equal(web3.utils.toWei('20','ether'));

                expect((await this.rigelGift.rewardTokens(1,1)).token).to.be.equal(this.token2.address);
                expect((await this.rigelGift.rewardTokens(1,1)).balance).to.be.bignumber.equal(web3.utils.toWei('40','ether'));
    
                // test for ticker1 information
                expect((await this.rigelGift.rewardTickers(1,0)).token).to.be.equal(this.token.address);
                expect((await this.rigelGift.rewardTickers(1,0)).text).to.be.equal("");
                expect((await this.rigelGift.rewardTickers(1,0)).rewardAmount).to.be.bignumber.equal(web3.utils.toWei('0.5','ether'));

                // test for ticker9 information
                expect((await this.rigelGift.rewardTickers(1,9)).token).to.be.equal(this.token2.address);
                expect((await this.rigelGift.rewardTickers(1,9)).text).to.be.equal("");
                expect((await this.rigelGift.rewardTickers(1,9)).rewardAmount).to.be.bignumber.equal(web3.utils.toWei('2.5','ether'));
            });
        });

        describe('when project2 creates a reward programme with one token', function (){
            describe('when one of the difficulty numerator is set to zero', function(){
                it('it reverts', async function(){
                    let reward1 = web3.eth.abi.encodeParameters(['address','uint256'], [this.token.address, web3.utils.toWei('20','ether')]);
                    
                    let ticker1 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('0.5','ether'),0,100,'']);
        
                    await expectRevert(  this.rigelGift.createRewardProject([reward1],"abcd",[ticker1],{from: project2}),'RigelGift: Incorrect difficulty for non zero address');
                });
            });

            describe('when one of the difficulty denominator is set to zero', function(){
                it('it reverts', async function(){
                    let reward1 = web3.eth.abi.encodeParameters(['address','uint256'], [this.token.address, web3.utils.toWei('20','ether')]);
                    
                    let ticker1 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('0.5','ether'),10,0,'']);
        
                    await expectRevert(  this.rigelGift.createRewardProject([reward1],"abcd",[ticker1],{from: project2}),'RigelGift: Incorrect difficulty for non zero address');
                });
            });

            describe('when one of the reward token is a zero address', function(){
                it('it reverts', async function(){
                    let reward1 = web3.eth.abi.encodeParameters(['address','uint256'], [ZERO_ADDRESS, web3.utils.toWei('20','ether')]);
                    
                    let ticker1 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('0.5','ether'),10,10000,'']);
        
                    await expectRevert(  this.rigelGift.createRewardProject([reward1],"abcd",[ticker1],{from: project2}),'RigelGift: Zero address token');
                });
            });

            describe('when project2 tries to edit the reward programme', function (){
                it('is a successful', async function(){
        
                    let reward1 = web3.eth.abi.encodeParameters(['address','uint256'], [this.token.address, web3.utils.toWei('20','ether')]);
                    
                    let ticker1 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('0.5','ether'),50,100,'']);
                    let ticker2 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1','ether'),40,100,'']);
                    let ticker3 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1.5','ether'),30,100,'']);
                    let ticker4 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1','ether'),20,100,'']);
                    let ticker5 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [ZERO_ADDRESS,0,0,0,'try again']);
        
                    let response = await this.rigelGift.createRewardProject([reward1],"abcd",[ticker1,ticker2,ticker3,ticker4,ticker5],{from: project2});

                    ticker1 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('0.5','ether'),50,100,'']);
                    ticker2 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1','ether'),40,100,'']);
                    ticker3 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1.5','ether'),30,100,'']);
                    ticker4 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('2','ether'),20,100,'']);
                    ticker5 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [ZERO_ADDRESS,0,0,0,'try again later']);

                    response = await this.rigelGift.editRewardProject( 1 ,[ticker1,ticker2,ticker3,ticker4,ticker5],{from: project2});
        
                    // test for event
                    expectEvent.inLogs(response.logs, 'RewardProjectEdit', {
                        sender: project2,
                        projectIndex: new BN('1'),
                    });
        
                    // test for reward token and balance
                    expect((await this.rigelGift.rewardTokens(1,0)).token).to.be.equal(this.token.address);
                    expect((await this.rigelGift.rewardTokens(1,0)).balance).to.be.bignumber.equal(web3.utils.toWei('20','ether'));
         
                    // test for ticker4 information
                    expect((await this.rigelGift.rewardTickers(1,3)).token).to.be.equal(this.token.address);
                    expect((await this.rigelGift.rewardTickers(1,3)).text).to.be.equal("");
                    expect((await this.rigelGift.rewardTickers(1,3)).rewardAmount).to.be.bignumber.equal(web3.utils.toWei('2','ether'));

                    // test for ticker5 information
                    expect((await this.rigelGift.rewardTickers(1,4)).token).to.be.equal(ZERO_ADDRESS);
                    expect((await this.rigelGift.rewardTickers(1,4)).text).to.be.equal("try again later");
                    expect((await this.rigelGift.rewardTickers(1,4)).rewardAmount).to.be.bignumber.equal('0');
                });
            });

            describe('when project1 tries to edit the reward programme', function (){
                it('it reverts', async function(){
        
                    let reward1 = web3.eth.abi.encodeParameters(['address','uint256'], [this.token.address, web3.utils.toWei('20','ether')]);
                    
                    let ticker1 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('0.5','ether'),50,100,'']);
                    let ticker2 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1','ether'),40,100,'']);
                    let ticker3 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1.5','ether'),30,100,'']);
                    let ticker4 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1','ether'),20,100,'']);
                    let ticker5 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [ZERO_ADDRESS,0,0,0,'try again']);
        
                    let response = await this.rigelGift.createRewardProject([reward1],"abcd",[ticker1,ticker2,ticker3,ticker4,ticker5],{from: project2});

                    ticker1 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('0.5','ether'),50,100,'']);
                    ticker2 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1','ether'),40,100,'']);
                    ticker3 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1.5','ether'),30,100,'']);
                    ticker4 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('2','ether'),20,100,'']);
                    ticker5 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [ZERO_ADDRESS,0,0,0,'try again later']);

                    await expectRevert( this.rigelGift.editRewardProject( 1,[ticker1,ticker2,ticker3,ticker4,ticker5],{from: hacker}),'RigelGift: No Reward Project exists');
                });
            });

            describe('when project2 tries to another reward programme', function (){
                it('is a successful', async function(){
        
                    let reward1 = web3.eth.abi.encodeParameters(['address','uint256'], [this.token.address, web3.utils.toWei('20','ether')]);
                    
                    let ticker1 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('0.5','ether'),50,100,'']);
                    let ticker2 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1','ether'),40,100,'']);
                    let ticker3 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1.5','ether'),30,100,'']);
                    let ticker4 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1','ether'),20,100,'']);
                    let ticker5 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [ZERO_ADDRESS,0,0,0,'try again']);
        
                    let response = await this.rigelGift.createRewardProject([reward1],"abcd",[ticker1,ticker2,ticker3,ticker4,ticker5],{from: project2});

                    ticker1 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('0.5','ether'),50,100,'']);
                    ticker2 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1','ether'),40,100,'']);
                    ticker3 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('1.5','ether'),30,100,'']);
                    ticker4 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [this.token.address,web3.utils.toWei('2','ether'),20,100,'']);
                    ticker5 = web3.eth.abi.encodeParameters(['address','uint256','uint256','uint256','string'], [ZERO_ADDRESS,0,0,0,'try again later']);

                    let response1 = await this.rigelGift.createRewardProject([reward1],"abcd",[ticker1,ticker2,ticker3,ticker4,ticker5],{from: project2});
        
                    // test for event
                    expectEvent.inLogs(response1.logs, 'RewardProjectCreate', {
                        sender: project2,
                        projectIndex: new BN('2'),
                    });
        
                    // test for reward token and balance
                    expect((await this.rigelGift.rewardTokens(2,0)).token).to.be.equal(this.token.address);
                    expect((await this.rigelGift.rewardTokens(2,0)).balance).to.be.bignumber.equal(web3.utils.toWei('20','ether'));
         
                    // test for ticker4 information
                    expect((await this.rigelGift.rewardTickers(2,3)).token).to.be.equal(this.token.address);
                    expect((await this.rigelGift.rewardTickers(2,3)).text).to.be.equal("");
                    expect((await this.rigelGift.rewardTickers(2,3)).rewardAmount).to.be.bignumber.equal(web3.utils.toWei('2','ether'));

                    // test for ticker5 information
                    expect((await this.rigelGift.rewardTickers(2,4)).token).to.be.equal(ZERO_ADDRESS);
                    expect((await this.rigelGift.rewardTickers(2,4)).text).to.be.equal("try again later");
                    expect((await this.rigelGift.rewardTickers(2,4)).rewardAmount).to.be.bignumber.equal('0');
                });
            });
        });
    });
});

