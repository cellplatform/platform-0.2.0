import { expect, Test, type t } from '../../test.ui';
import { Wallet } from '.';

export default Test.describe('EVM: Wallet', (e) => {
  e.it('embedded', (e) => {
    const ctx = e.ctx as t.TestCtx;
    const embedded = Wallet.embedded(ctx.wallets);
    expect(embedded?.walletClientType).to.eql('privy');
    expect(Wallet.is.embedded(embedded)).to.eql(true);
    expect(Wallet.is.embedded()).to.eql(false);
  });
});
