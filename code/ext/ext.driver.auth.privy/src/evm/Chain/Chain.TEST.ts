import { Chain } from '.';
import { Test, expect, type t } from '../../test.ui';

export default Test.describe('Chains', (e) => {
  e.describe('get', (e) => {
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
    test('Zora:Main', 7777777);
    test('Zora:Test', 999);
  });

  e.it('isTestnet', (e) => {
    const test = (name: t.EvmChainName, expected: boolean) => {
      expect(Chain.isTestnet(name)).to.eql(expected);
    };

    test('Eth:Main', false);
    test('Eth:Test:Goerli', true);
    test('Eth:Test:Sepolia', true);
    test('Op:Main', false);
    test('Op:Test:Goerli', true);
    test('Base:Main', false);
    test('Base:Test:Goerli', true);
    test('Zora:Main', false);
    test('Zora:Test', true);
  });
});
