import { expect, expectError, t, Json, describe, beforeEach, it } from '../test';
import { NodeFs } from '../index.mjs';

import { NodeStream } from './NodeStream.mjs';

describe('NodeStream', () => {
  beforeEach(async () => await NodeFs.remove(PATH.TMP));

  const PATH = {
    TMP: NodeFs.resolve('tmp/Stream'),
    TREE: NodeFs.resolve('assets/test/tree.png'),
    JSON: NodeFs.resolve('assets/test/foo.json'),
  };

  it('isReadableStream', async () => {
    const test = (input: any, expected: boolean) => {
      const res = NodeStream.isReadableStream(input);
      expect(res).to.eql(expected);
    };

    test(undefined, false);
    test(null, false);
    test(1234, false);
    test({}, false);
    test([], false);
    test(true, false);
    test('', false);

    // Node.
    await NodeFs.ensureDir(PATH.TMP);
    test(NodeFs.createReadStream(PATH.TREE), true);
    test(NodeFs.createWriteStream(NodeFs.join(PATH.TMP, 'test.isReadableStream')), false);
  });

  it('encode/decode (Uint8Array)', async () => {
    const text = 'Hello';
    const encoded = NodeStream.encode(text);
    const decoded = NodeStream.decode(encoded);
    expect(decoded).to.eql(text);
  });

  describe('toUint8Array', () => {
    it('binary', async () => {
      const path = PATH.TREE;
      const stream = NodeFs.createReadStream(path) as unknown as ReadableStream;
      const res = await NodeStream.toUint8Array(stream);
      const file = Uint8Array.from(await NodeFs.readFile(path));
      expect(res).to.eql(file);
    });

    it('Uint8Array (no change)', async () => {
      const file = await NodeFs.readFile(PATH.TREE);
      expect(await NodeStream.toUint8Array(file)).to.equal(file);
    });

    it('json: {object}', async () => {
      const json = { foo: 123 };
      const res = await NodeStream.toUint8Array(json);
      expect(NodeStream.decode(res)).to.eql(Json.stringify(json));
    });

    it('json: [array]', async () => {
      const json = [1, 2, 3];
      const res = await NodeStream.toUint8Array(json);
      expect(NodeStream.decode(res)).to.eql(Json.stringify(json));
    });

    it('string', async () => {
      const value = 'hello';
      const res = await NodeStream.toUint8Array(value);
      expect(NodeStream.decode(res)).to.eql(value);
    });

    it('number', async () => {
      const value = 1234;
      const res = await NodeStream.toUint8Array(value);
      expect(NodeStream.decode(res)).to.eql(value.toString());
    });

    it('boolean', async () => {
      const res1 = await NodeStream.toUint8Array(true);
      const res2 = await NodeStream.toUint8Array(false);
      expect(NodeStream.decode(res1)).to.eql('true');
      expect(NodeStream.decode(res2)).to.eql('false');
    });

    it('null', async () => {
      const value = null;
      const res = await NodeStream.toUint8Array(value);
      expect(NodeStream.decode(res)).to.eql('null');
    });

    it('undefined', async () => {
      const value = undefined;
      const res = await NodeStream.toUint8Array(value);
      expect(NodeStream.decode(res)).to.eql('undefined');
    });
  });

  describe('save', () => {
    const testJson = async (input: t.Json) => {
      const path = NodeFs.join(PATH.TMP, 'save.json');
      await NodeStream.save(path, input);

      const json = await NodeFs.readJson(path);
      expect(json).to.eql(input);
    };

    it('binary', async () => {
      const path = {
        source: PATH.TREE,
        target: NodeFs.join(PATH.TMP, 'save.png'),
      };
      const stream = NodeFs.createReadStream(path.source) as unknown as ReadableStream;

      await NodeStream.save(path.target, stream);

      const file = {
        source: await NodeFs.readFile(path.source),
        target: await NodeFs.readFile(path.target),
      };

      expect(file.source.buffer).to.eql(file.target.buffer);
    });

    it('json: object', async () => {
      await testJson({});
      await testJson({ foo: 123 });
    });

    it('json: array', async () => {
      await testJson([]);
      await testJson([1, 2, 3]);
      await testJson({ msg: 'hello' });
    });

    it('json: string', async () => {
      await testJson('');
      await testJson('hello!');
    });

    it('json: number', async () => {
      await testJson(1234);
    });

    it('json: boolean', async () => {
      await testJson(true);
      await testJson(false);
    });

    it('json: null', async () => {
      await testJson(null);
    });

    it('throw: undefined', async () => {
      await expectError(() => testJson(undefined as any), 'No data');
    });
  });
});
