const RigelToken = artifacts.require("RigelToken");
const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

const { shouldBehaveLikeERC20 } = require('./ERC20.behavior');

contract('RigelToken', function (accounts) {
  const [ initialHolder, recipient, anotherAccount, approvedAccount ] = accounts;

  const name = 'RigelToken';
  const symbol = 'RGP';

  const initialSupply = new BN('20000000000000000000000000');

  beforeEach(async function () {
    this.token = await RigelToken.new(initialHolder);
  });

  it('has a name', async function () {
    expect(await this.token.name()).to.equal(name);
  });

  it('has a symbol', async function () {
    expect(await this.token.symbol()).to.equal(symbol);
  });

  it('has 18 decimals', async function () {
    expect(await this.token.decimals()).to.be.bignumber.equal('18');
  });

  shouldBehaveLikeERC20('RigelToken', initialSupply, initialHolder, recipient, anotherAccount);

  describe('Transfer: second to third account', function (){
    
    describe('when the token owner is not the zero address', function () {
      const tokenOwner = initialHolder;
      describe('when the second Account is not the zero address', function () {
        const secondAccount = recipient;
        describe('when the third account is not the zero address', function () {
          const thirdAccount = anotherAccount;
          
          describe('when the token owner has enough balance', function () {
            describe('when the secondAccount has enough balance', function () {
              const amount = initialSupply.subn(2);
              
              it('secondAccount transfers the requested amount to third account', async function () {
                //first tokenowner transfer to secondAccount
                let { logs } = await this.token.transfer(secondAccount, amount, { from: tokenOwner });
                
                expect(await this.token.balanceOf(tokenOwner)).to.be.bignumber.equal('2');
                
                expect(await this.token.balanceOf(secondAccount)).to.be.bignumber.equal(amount);
                
                expect(await this.token.balanceOf(thirdAccount)).to.be.bignumber.equal('0');
                
                expectEvent.inLogs(logs, 'Transfer', {
                  from: tokenOwner,
                  to: secondAccount,
                  value: amount,
                });
                
                const newAmount = amount.subn(2);
                
                // now secondAccount transfers to third account
                let response = await this.token.transfer(thirdAccount, newAmount, { from: secondAccount });
                
                expect(await this.token.balanceOf(tokenOwner)).to.be.bignumber.equal('2');
                
                expect(await this.token.balanceOf(secondAccount)).to.be.bignumber.equal('2');
                
                expect(await this.token.balanceOf(thirdAccount)).to.be.bignumber.equal(newAmount);
                
                expectEvent.inLogs(response.logs, 'Transfer', {
                  from: secondAccount,
                  to: thirdAccount,
                  value: newAmount,
                });
              });
            });
          });
        });
      });
    });

    describe('when using transfer from', function (){
      
      describe('when the token owner is not the zero address', function () {
        const tokenOwner = initialHolder;
        describe('when the second Account is not the zero address', function () {
          const secondAccount = recipient;
          describe('when the third account is not the zero address', function () {
            const thirdAccount = anotherAccount;
            describe('when the token owner has enough balance', function () {
              describe('when the secondAccount has enough balance', function () {
                describe('when all approvals set to approvedAccount', function(){
                  
                  const amount = initialSupply.subn(2);
                  
                  it('secondAccount transfers the requested amount to third account', async function () {
                    await this.token.approve(approvedAccount, initialSupply, { from: tokenOwner });
                    await this.token.approve(approvedAccount, initialSupply, { from: secondAccount });  
                    
                    //first tokenowner transfer to secondAccount
                    let response = await this.token.transferFrom(tokenOwner, secondAccount, amount, { from: approvedAccount });
                    
                    expect(await this.token.balanceOf(tokenOwner)).to.be.bignumber.equal('2');
                    
                    expect(await this.token.balanceOf(secondAccount)).to.be.bignumber.equal(amount);
                    
                    expect(await this.token.balanceOf(thirdAccount)).to.be.bignumber.equal('0');
                    
                    expectEvent.inLogs(response.logs, 'Transfer', {
                      from: tokenOwner,
                      to: secondAccount,
                      value: amount,
                    });
                    
                    const newAmount = amount.subn(2);
                    
                    // now secondAccount transfers to third account
                    response = await this.token.transferFrom(secondAccount, thirdAccount, newAmount, { from: approvedAccount });
                    
                    expect(await this.token.balanceOf(tokenOwner)).to.be.bignumber.equal('2');
                    
                    expect(await this.token.balanceOf(secondAccount)).to.be.bignumber.equal('2');
                    
                    expect(await this.token.balanceOf(thirdAccount)).to.be.bignumber.equal(newAmount);
                    
                    expectEvent.inLogs(response.logs, 'Transfer', {
                      from: secondAccount,
                      to: thirdAccount,
                      value: newAmount,
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});