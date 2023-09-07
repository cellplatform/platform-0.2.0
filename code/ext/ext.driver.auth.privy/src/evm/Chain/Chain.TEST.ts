import { Chain } from '.';
import { Wallet } from '..';
import { Test, expect, type t } from '../../test.ui';

export default Test.describe('EVM: Chain', (e) => {
  e.it('Chain.identifier', (e) => {
    const res1 = Chain.identifier('Eth:Main');
    const res2 = Chain.identifier('Op:Main');

    expect(res1.id).to.eql(1);
    expect(res1.hex).to.eql('0x1');

    expect(res2.id).to.eql(10);
    expect(res2.hex).to.eql('0xa');
  });

  e.describe('Chain.get', (e) => {
    const test = (name: t.EvmChainName, id: number) => {
      e.it(`${name}`, (e) => {
        const chain = Chain.get(name);
        expect(chain.id).to.eql(id);
      });
    };

    test('Eth:Main', 1);
    test('Eth:Test:Goerli', 5);
    test('Eth:Test:Sepolia', 11155111);
    test('Op:Main', 10);
    test('Op:Test:Goerli', 420);
    test('Base:Main', 8453);
    test('Base:Test:Goerli', 84531);
  });

  e.describe('Chain.is', (e) => {
    e.it('testnet', (e) => {
      const test = (name: t.EvmChainName, expected: boolean) => {
        expect(Chain.is.testnet(name)).to.eql(expected);
      };

      test('Eth:Main', false);
      test('Eth:Test:Goerli', true);
      test('Eth:Test:Sepolia', true);
      test('Op:Main', false);
      test('Op:Test:Goerli', true);
      test('Base:Main', false);
      test('Base:Test:Goerli', true);
    });
  });

  e.describe('Chain.provider', (e) => {
    e.it('Chain.provider', async (e) => {
      const ctx = e.ctx as t.TestCtx;
      const wallet = Wallet.embedded(ctx.wallets);
      if (!wallet) throw new Error('Wallet not found');

      const provider = await Chain.provider(wallet, 'Op:Main');
      expect(provider.name).to.eql('Op:Main');
      expect((provider.eip1193 as any).chainId).to.eql(10);
      expect(typeof provider.transport).to.eql('function');
    });
  });
});
