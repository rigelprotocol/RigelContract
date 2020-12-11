const RigelToken = artifacts.require("RigelToken");
const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

const { shouldBehaveLikeERC20Burnable, } = require('./ERC20Burnable.behavior');

contract('RigelToken', function (accounts) {
  const [ initialHolder, recipient, anotherAccount ] = accounts;

  const name = 'RigelToken';
  const symbol = 'RGP';

  const initialSupply = new BN('20000000000000000000000000');

  beforeEach(async function () {
    this.token = await RigelToken.new(initialHolder);
  });

  describe('burn', function () {
    it('rejects a null account', async function () {
      await expectRevert(this.token.burn(ZERO_ADDRESS, new BN(1)),
        'RigelToken: burn from the zero address');
    });

    describe('for a non zero account', function () {
      it('rejects burning more than balance', async function () {
        await expectRevert(this.token.burn(
          initialHolder, initialSupply.addn(1)), 'RigelToken: burn amount exceeds balance',
        );
      });

      const describeBurn = function (description, amount) {
        describe(description, function () {
          beforeEach('burning', async function () {
            const { logs } = await this.token.burn(initialHolder, amount);
            this.logs = logs;
          });

          it('decrements totalSupply', async function () {
            const expectedSupply = initialSupply.sub(amount);
            expect(await this.token.totalSupply()).to.be.bignumber.equal(expectedSupply);
          });

          it('decrements initialHolder balance', async function () {
            const expectedBalance = initialSupply.sub(amount);
            expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(expectedBalance);
          });

          it('emits Transfer event', async function () {
            const event = expectEvent.inLogs(this.logs, 'Transfer', {
              from: initialHolder,
              to: ZERO_ADDRESS,
            });

            expect(event.args.value).to.be.bignumber.equal(amount);
          });
        });
      };

      describeBurn('for entire balance', initialSupply);
      describeBurn('for less amount than balance', initialSupply.subn(1));
    });

    const [ owner, ...otherAccounts ] = accounts;

    shouldBehaveLikeERC20Burnable("RigelToken",owner, initialSupply, otherAccounts);

    describe('burn from non owner account', function() {

      it('reverts', async function () {
        await expectRevert(this.token.burn(owner, initialSupply, { from: anotherAccount }),
          `RigelToken: Only Owner can perform this task`,
        );
      });
    });

  });
});