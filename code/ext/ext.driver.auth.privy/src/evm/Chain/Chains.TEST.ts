import { expect, Test, type t } from '../../test.ui';
import { Chains } from '.';

export default Test.describe('Chains', (e) => {
  e.describe('get', (e) => {
    const test = (name: t.EvmChainName, id: number) => {
      e.it(`${name}`, (e) => {
        const res = Chains.get(name);
        expect(res.id).to.eql(id);
      });
    };

    test('Eth:main', 1);
    test('Eth:test:goerli', 5);
    test('Eth:test:sepolia', 11155111);
    test('Op:main', 10);
    test('Op:test:goerli', 420);
    test('Base:main', 8453);
    test('Base:test:goerli', 84531);
    test('Zora:main', 7777777);
    test('Zora:test', 999);
  });

  e.it('isTestnet', (e) => {
    const test = (name: t.EvmChainName, expected: boolean) => {
      expect(Chains.isTestnet(name)).to.eql(expected);
    };

    test('Eth:main', false);
    test('Eth:test:goerli', true);
    test('Eth:test:sepolia', true);
    test('Op:main', false);
    test('Op:test:goerli', true);
    test('Base:main', false);
    test('Base:test:goerli', true);
    test('Zora:main', false);
    test('Zora:test', true);
  });
});
