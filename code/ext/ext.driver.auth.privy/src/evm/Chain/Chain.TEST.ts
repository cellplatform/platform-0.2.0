import { Chain } from '.';
import { Test, expect, type t } from '../../test.ui';

export default Test.describe('EVM: Chain', (e) => {
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

  e.it('Chain.is.testnet', (e) => {
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

  e.it('Chain.identifier', (e) => {
    const res1 = Chain.identifier('Eth:Main');
    const res2 = Chain.identifier('Op:Main');

    expect(res1.id).to.eql(1);
    expect(res1.hex).to.eql('0x1');

    expect(res2.id).to.eql(10);
    expect(res2.hex).to.eql('0xa');
  });
});
