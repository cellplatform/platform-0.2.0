import { Test } from '../index.mjs';
import { describe, expect, it } from '../test';
import { Loader } from './Loader.mjs';

describe('Loader', () => {
  it('exposed from root API', () => {
    expect(Test.import).to.equal(Loader.import);
  });

  describe('Loader.import', () => {
    it('nothing [<empty>]', async () => {
      const res1 = await Loader.import([undefined as any, null as any]);
      const res2 = await Loader.import(undefined as any);
      const res3 = await Loader.import(import('../test/samples/NoExport.TEST'));
      const res4 = await Loader.import((() => ({})) as any);

      expect(res1).to.eql([]);
      expect(res2).to.eql([]);
      expect(res3).to.eql([]);
      expect(res4).to.eql([]);
    });

    it('TestSuite: resolved {objects}', async () => {
      const root1 = Test.describe('1', (e) => e.it('1.1'));
      const root2 = Test.describe('2', (e) => e.it('2.1'));

      const res = await Loader.import([root1, undefined as any, root2, null, {}]);
      expect(res.length).to.eql(2);

      expect(res[0].suite).to.equal(root1);
      expect(res[1].suite).to.equal(root2);

      expect(res[0].suite.ready).to.eql(false);
      expect(res[1].suite.ready).to.eql(false);
    });

    it('dynamic import("...")', async () => {
      const import1 = import('../test/samples/One.TEST');
      const import2 = import('../test/samples/Two.TEST');

      const res1 = await Loader.import([import1, import2]);
      const res2 = await Loader.import(import1);
      const res3 = await Loader.import([import2]);
      expect(res1.length).to.eql(3);
      expect(res2.length).to.eql(2);
      expect(res3.length).to.eql(1);

      const root1 = (await import1).default;
      const root1a = (await import1).MySpec;
      const root2 = (await import2).default;

      expect(res1[0].suite).to.equal(root1);
      expect(res1[1].suite).to.equal(root1a);
      expect(res1[2].suite).to.equal(root2);
      expect(res1[0].isDefault).to.equal(true);
      expect(res1[1].isDefault).to.equal(false);
      expect(res1[2].isDefault).to.equal(true);

      expect(res2[0].suite).to.equal(root1);
      expect(res2[1].suite).to.equal(root1a);
      expect(res2[0].isDefault).to.equal(true);
      expect(res2[1].isDefault).to.equal(false);

      expect(res3[0].suite).to.equal(root2);
      expect(res3[0].isDefault).to.equal(true);
    });

    it('{init} option', async () => {
      const import1 = import('../test/samples/One.TEST');
      const import2 = import('../test/samples/Two.TEST');

      const res1 = await Loader.import([import1], { init: true });
      const res2 = await Loader.import(import2);
      const res3 = await Loader.import(import('../test/samples/One.TEST'));

      expect(res1.length).to.eql(2);
      expect(res2.length).to.eql(1);
      expect(res3.length).to.eql(2);

      expect(res1[0].suite.ready).to.eql(true);
      expect(res1[1].suite.ready).to.eql(true);

      expect(res2[0].suite.ready).to.eql(false);

      expect(res3[0].suite.ready).to.eql(true);
      expect(res3[1].suite.ready).to.eql(true);
    });
  });
});
