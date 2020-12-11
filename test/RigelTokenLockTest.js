const RigelToken = artifacts.require("RigelToken");
const { BN, constants, expectEvent, expectRevert,time } = require('@openzeppelin/test-helpers');
const { inTransaction } = require('@openzeppelin/test-helpers/src/expectEvent');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

const { shouldBehaveLikeERC20 } = require('./ERC20.behavior');

contract('RigelToken', function (accounts) {
  
  const [ initialHolder, recipient, anotherAccount, approvedAccount ] = accounts;

  const initialSupply = new BN('20000000000000000000000000');

  beforeEach(async function () {
    this.token = await RigelToken.new(initialHolder);
  });

  describe('Token Locking', function () {
    
    describe('when non owner tries to distribute tokens', function () {
      it('reverts', async function () {
        const lockingPeriod = 0;
        const amount = new BN('20');
        await expectRevert(this.token.distributeTokens(
          recipient, amount, lockingPeriod, { from: anotherAccount }), `RigelToken: Only Owner can perform this task`,
        );
      });      
    });
    
    describe('when locking period is zero', function () {
      const lockingPeriod = 0;

      describe('when the token owner is not the zero address', function () {
        const tokenOwner = initialHolder;

        describe('when the second Account is not the zero address', function () {
          const secondAccount = recipient;

          describe('when the third account is not the zero address', function () {
            const thirdAccount = anotherAccount;
        
            describe('when the token owner and second account has enough balance', function () {
              const amount = initialSupply.subn(2);
              
              it('secondAccount tries to transfers the requested amount to third account', async function () {
                //first tokenowner distributes token to secondAccount
                let response = await this.token.distributeTokens(secondAccount, amount, lockingPeriod, { from: tokenOwner });
              
                expect(await this.token.balanceOf(tokenOwner)).to.be.bignumber.equal('2');
                expect(await this.token.unLockedBalanceOf(tokenOwner)).to.be.bignumber.equal('2');
              
                expect(await this.token.balanceOf(secondAccount)).to.be.bignumber.equal(amount);
                expect(await this.token.unLockedBalanceOf(secondAccount)).to.be.bignumber.equal(amount);
                
                expect(await this.token.balanceOf(thirdAccount)).to.be.bignumber.equal('0');
                expect(await this.token.unLockedBalanceOf(thirdAccount)).to.be.bignumber.equal('0');
              
                expectEvent.inLogs(response.logs, 'Transfer', {
                  from: tokenOwner,
                  to: secondAccount,
                  value: amount,
                });
              
                const newAmount = amount.subn(2);
              
                // now secondAccount transfers to third account
                response = await this.token.transfer(thirdAccount, newAmount, { from: secondAccount });
              
                expect(await this.token.balanceOf(tokenOwner)).to.be.bignumber.equal('2');
                expect(await this.token.unLockedBalanceOf(tokenOwner)).to.be.bignumber.equal('2');
              
                expect(await this.token.balanceOf(secondAccount)).to.be.bignumber.equal('2');
                expect(await this.token.unLockedBalanceOf(secondAccount)).to.be.bignumber.equal('2');
              
                expect(await this.token.balanceOf(thirdAccount)).to.be.bignumber.equal(newAmount);
                expect(await this.token.unLockedBalanceOf(thirdAccount)).to.be.bignumber.equal(newAmount);
              
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

    describe('when locking period is not zero', function () {
      describe('when the token owner is not the zero address', function () {
        const tokenOwner = initialHolder;
        
        describe('when the second Account is not the zero address', function () {
          const secondAccount = recipient;
          const amount = initialSupply.subn(2);
                      
          it('token owner shall be able to distribute tokens', async function () {
            const currentTime = await time.latest();
            const lockingPeriod = currentTime.addn(100);

            let response = await this.token.distributeTokens(secondAccount, amount, lockingPeriod, { from: tokenOwner });
                
            expect(await this.token.balanceOf(tokenOwner)).to.be.bignumber.equal('2');
            expect(await this.token.unLockedBalanceOf(tokenOwner)).to.be.bignumber.equal('2');
                
            expect(await this.token.balanceOf(secondAccount)).to.be.bignumber.equal(amount);
            expect(await this.token.unLockedBalanceOf(secondAccount)).to.be.bignumber.equal('0');
                                   
            expectEvent.inLogs(response.logs, 'Transfer', {
              from: tokenOwner,
              to: secondAccount,
              value: amount,
            });       
          });
          
          describe('when the third account is not the zero address', function () {
            const thirdAccount = anotherAccount;
            
            describe('when the token owner and second account has enough balance', function () {
              const amount = initialSupply.subn(2);
              describe('when secondAccount tries transfering the locked token before locking time', function () {

                it('reverts', async function () {
                  const currentTime = await time.latest();
                  const lockingPeriod = currentTime.addn(100);

                  //first tokenowner distributes token to secondAccount
                  let response = await this.token.distributeTokens(secondAccount, amount, lockingPeriod, { from: tokenOwner });
                  
                  expect(await this.token.balanceOf(tokenOwner)).to.be.bignumber.equal('2');
                  expect(await this.token.unLockedBalanceOf(tokenOwner)).to.be.bignumber.equal('2');
                  
                  expect(await this.token.balanceOf(secondAccount)).to.be.bignumber.equal(amount);
                  expect(await this.token.unLockedBalanceOf(secondAccount)).to.be.bignumber.equal('0');
                  
                  expect(await this.token.balanceOf(thirdAccount)).to.be.bignumber.equal('0');
                  expect(await this.token.unLockedBalanceOf(thirdAccount)).to.be.bignumber.equal('0');
                  
                  expectEvent.inLogs(response.logs, 'Transfer', {
                    from: tokenOwner,
                    to: secondAccount,
                    value: amount,
                  });
                
                  const newAmount = amount.subn(2);
                
                  // now secondAccount transfers to third account
                  await expectRevert( this.token.transfer(
                    thirdAccount, newAmount, { from: secondAccount }),'RigelToken: Insufficient unlocked tokens');
        
                });
              });

              describe('when secondAccount tries transfering the locked token after locking time', function () {

                it('reverts', async function () {
                  const currentTime = await time.latest();
                  const lockingPeriod = currentTime.addn(100);

                  //first tokenowner distributes token to secondAccount
                  let response = await this.token.distributeTokens(secondAccount, amount, lockingPeriod, { from: tokenOwner });
                  
                  expect(await this.token.balanceOf(tokenOwner)).to.be.bignumber.equal('2');
                  expect(await this.token.unLockedBalanceOf(tokenOwner)).to.be.bignumber.equal('2');
                  
                  expect(await this.token.balanceOf(secondAccount)).to.be.bignumber.equal(amount);
                  expect(await this.token.unLockedBalanceOf(secondAccount)).to.be.bignumber.equal('0');
                  
                  expect(await this.token.balanceOf(thirdAccount)).to.be.bignumber.equal('0');
                  expect(await this.token.unLockedBalanceOf(thirdAccount)).to.be.bignumber.equal('0');
                  
                  expectEvent.inLogs(response.logs, 'Transfer', {
                    from: tokenOwner,
                    to: secondAccount,
                    value: amount,
                  });

                  // increase time to locking period
                  await time.increaseTo(lockingPeriod.addn(1));

                  // now secondAccount transfers to third account
                  const newAmount = amount.subn(2);
                  response = await this.token.transfer(thirdAccount, newAmount, { from: secondAccount });
                
                  expect(await this.token.balanceOf(tokenOwner)).to.be.bignumber.equal('2');
                  expect(await this.token.unLockedBalanceOf(tokenOwner)).to.be.bignumber.equal('2');
                
                  expect(await this.token.balanceOf(secondAccount)).to.be.bignumber.equal('2');
                  expect(await this.token.unLockedBalanceOf(secondAccount)).to.be.bignumber.equal('2');
                
                  expect(await this.token.balanceOf(thirdAccount)).to.be.bignumber.equal(newAmount);
                  expect(await this.token.unLockedBalanceOf(thirdAccount)).to.be.bignumber.equal(newAmount);
                
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

    describe('when multiple locking periods', function () {
      describe('when the token owner is not the zero address', function () {
        const tokenOwner = initialHolder;
        
        describe('when the second Account is not the zero address', function () {
          const secondAccount = recipient;
          
          describe('when the third account is not the zero address', function () {
            const thirdAccount = anotherAccount;
            
            describe('when the token owner and second account has enough balance', function () {
              
              describe('when secondAccount tries multiple unlock before locking period', function () {

                it('reverts', async function () {
                  const currentTime = await time.latest();
                  const lockingPeriod_1 = currentTime.addn(100);
                  const lockingPeriod_2 = currentTime.addn(200);
                  const lockingPeriod_3 = currentTime.addn(300);

                  const amount_1 = new BN('100');
                  const amount_2 = new BN('100');
                  const amount_3 = new BN('100');
                  const amountToTransfer = new BN('250');

                  //first tokenowner distributes token to secondAccount
                  let response = await this.token.distributeTokens(secondAccount, amount_1, lockingPeriod_1, { from: tokenOwner });
                                  
                  expect(await this.token.balanceOf(secondAccount)).to.be.bignumber.equal(amount_1);
                  expect(await this.token.unLockedBalanceOf(secondAccount)).to.be.bignumber.equal('0');

                  expectEvent.inLogs(response.logs, 'Transfer', {
                    from: tokenOwner,
                    to: secondAccount,
                    value: amount_1,
                  });                  
                
                  // now secondAccount transfers to third account
                  await expectRevert( this.token.transfer(
                    thirdAccount, amountToTransfer, { from: secondAccount }),'RigelToken: Insufficient Balance');

                  await time.increaseTo(lockingPeriod_1);

                  response = await this.token.distributeTokens(secondAccount, amount_2, lockingPeriod_2, { from: tokenOwner });
                                  
                  expect(await this.token.balanceOf(secondAccount)).to.be.bignumber.equal('200');
                  expect(await this.token.unLockedBalanceOf(secondAccount)).to.be.bignumber.equal('0');

                  expectEvent.inLogs(response.logs, 'Transfer', {
                    from: tokenOwner,
                    to: secondAccount,
                    value: amount_2,
                  });
                  
                  // now secondAccount transfers to third account
                  await expectRevert( this.token.transfer(
                    thirdAccount, amountToTransfer, { from: secondAccount }),'RigelToken: Insufficient Balance');
                  
                  expect(await this.token.balanceOf(secondAccount)).to.be.bignumber.equal('200');
                  expect(await this.token.unLockedBalanceOf(secondAccount)).to.be.bignumber.equal('0');

                  await time.increaseTo(lockingPeriod_2);

                  response = await this.token.distributeTokens(secondAccount, amount_3, lockingPeriod_3, { from: tokenOwner });
                                  
                  expect(await this.token.balanceOf(secondAccount)).to.be.bignumber.equal('300');
                  expect(await this.token.unLockedBalanceOf(secondAccount)).to.be.bignumber.equal('0');

                  expectEvent.inLogs(response.logs, 'Transfer', {
                    from: tokenOwner,
                    to: secondAccount,
                    value: amount_3,
                  });
                  
                  // now secondAccount transfers to third account
                  await expectRevert( this.token.transfer(
                    thirdAccount, amountToTransfer, { from: secondAccount }),'RigelToken: Insufficient unlocked tokens');
                  
                  expect(await this.token.balanceOf(secondAccount)).to.be.bignumber.equal('300');
                  expect(await this.token.unLockedBalanceOf(secondAccount)).to.be.bignumber.equal('0');

                  await time.increaseTo(lockingPeriod_3.addn(1));

                  response = await this.token.transfer(thirdAccount, amountToTransfer, { from: secondAccount });
                
                  expect(await this.token.balanceOf(tokenOwner)).to.be.bignumber.equal(initialSupply.subn(300));
                  expect(await this.token.unLockedBalanceOf(tokenOwner)).to.be.bignumber.equal(initialSupply.subn(300));
                
                  expect(await this.token.balanceOf(secondAccount)).to.be.bignumber.equal('50');
                  expect(await this.token.unLockedBalanceOf(secondAccount)).to.be.bignumber.equal('50');
                
                  expect(await this.token.balanceOf(thirdAccount)).to.be.bignumber.equal(amountToTransfer);
                  expect(await this.token.unLockedBalanceOf(thirdAccount)).to.be.bignumber.equal(amountToTransfer);
                
                  expectEvent.inLogs(response.logs, 'Transfer', {
                    from: secondAccount,
                    to: thirdAccount,
                    value: amountToTransfer,
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