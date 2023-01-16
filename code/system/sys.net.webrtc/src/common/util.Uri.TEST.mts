import { expect, describe, it } from '../test';
import { UriUtil } from '.';

describe('PeerNetworkUri', () => {
  describe('is', (e) => {
    it('is.peer', () => {
      const test = (input: any, expected: boolean) => {
        expect(UriUtil.is.peer(input)).to.eql(expected);
      };

      test('', false);
      test(' ', false);
      test(123, false);
      test({}, false);
      test('peer', false);
      test('conn:data:foo.bar', false);

      test('peer:foo', true);
      test('  peer:foo  ', true);
    });

    it('is.connection', () => {
      const test = (input: any, expected: boolean) => {
        expect(UriUtil.is.connection(input)).to.eql(expected);
      };

      test('', false);
      test(' ', false);
      test(123, false);
      test({}, false);
      test('conn', false);
      test('peer:foo', false);

      test('conn:data:foo.bar', true);
      test('  conn:data:foo.bar  ', true);
    });
  });

  describe('peer', (e) => {
    it('create', () => {
      const res = UriUtil.peer.create('  foo  ');
      expect(res).to.eql('peer:foo');
    });

    it('trimPrefix', () => {
      const test = (input: any, expected: string) => {
        const res = UriUtil.peer.trimPrefix(input);
        expect(res).to.eql(expected);
      };

      test(undefined, '');
      test(null, '');
      test({}, '');
      test(123, '');

      test('abc', 'abc');
      test('  abc  ', 'abc');
      test('peer:abc', 'abc');
      test('   peer:abc   ', 'abc');
    });

    describe('parse', (e) => {
      it('success', () => {
        const res = UriUtil.peer.parse('peer:foo');

        expect(res?.ok).to.eql(true);
        expect(res?.type).to.eql('peer');
        expect(res?.peer).to.eql('foo');
        expect(res?.errors).to.eql([]);
      });

      it('fail: no match (undefined)', () => {
        const test = (input: any) => {
          expect(UriUtil.peer.parse(input)).to.eql(undefined);
        };
        test('');
        test('foobar');
        test('cell:ns:A1');
        test(undefined);
        test(null);
        test({ foo: 123 });
        test([1, 2, 3]);
      });

      it('error: identifiers', () => {
        const res = UriUtil.peer.parse('peer:');
        expect(res?.ok).to.eql(false);
        expect(res?.errors.length).to.eql(1);
        expect(res?.errors[0]).to.include('No peer identifier');
      });

      it('error: throw (param)', () => {
        const test = (input: any) => {
          const fn = () => UriUtil.peer.parse(input, { throw: true });
          expect(fn).to.throw(/Peer URI could not be parsed/);
        };

        test('');
        test('peer:');
        test('conn:data:foo.bar');
        test('foobar');
      });
    });
  });

  describe('connection', (e) => {
    it('create: data', () => {
      const res = UriUtil.connection.create('data', '  foo  ', '  bar  ');
      expect(res).to.eql('conn:data:foo.bar');
    });

    it('create: media/screen', () => {
      const res = UriUtil.connection.create('media/screen', 'foo', 'bar');
      expect(res).to.eql('conn:media.screen:foo.bar');
    });

    it('create: media/video', () => {
      const res = UriUtil.connection.create('media/video', 'foo', 'bar');
      expect(res).to.eql('conn:media.video:foo.bar');
    });

    describe('parse', (e) => {
      it('success', () => {
        const res1 = UriUtil.connection.parse('conn:data:foo.bar');
        const res2 = UriUtil.connection.parse('conn:media.screen:foo.bar');
        const res3 = UriUtil.connection.parse('conn:media.video:foo.bar');

        expect(res1?.ok).to.eql(true);
        expect(res1?.type).to.eql('connection');
        expect(res1?.kind).to.eql('data');
        expect(res1?.peer).to.eql('foo');
        expect(res1?.connection).to.eql('bar');
        expect(res1?.errors).to.eql([]);

        expect(res2?.kind).to.eql('media/screen');
        expect(res3?.kind).to.eql('media/video');
      });

      it('fail: no match (undefined)', () => {
        const test = (input: any) => {
          expect(UriUtil.connection.parse(input)).to.eql(undefined);
        };
        test('');
        test('foobar');
        test('cell:ns:A1');
        test(undefined);
        test(null);
        test({ foo: 123 });
        test([1, 2, 3]);
      });

      it('error: kind', () => {
        const test = (input: any) => {
          const res = UriUtil.connection.parse(input);
          expect(res?.ok).to.eql(false);
          expect(res?.errors.length).to.eql(1);
          expect(res?.errors[0]).to.include('Connection kind not supported');
        };

        test('conn:ERR:foo.bar');
        test('conn::foo.bar');
        test('conn:  :foo.bar');
      });

      it('error: identifiers', () => {
        const res1 = UriUtil.connection.parse('conn:data:');
        const res2 = UriUtil.connection.parse('conn:data:foo.');
        const res3 = UriUtil.connection.parse('conn:data:.bar');

        expect(res1?.ok).to.eql(false);
        expect(res1?.errors.length).to.eql(2);
        expect(res1?.errors[0]).to.include('No peer identifier');
        expect(res1?.errors[1]).to.include('No connection identifier');

        expect(res2?.ok).to.eql(false);
        expect(res2?.errors.length).to.eql(1);
        expect(res2?.errors[0]).to.include('No connection identifier');

        expect(res3?.ok).to.eql(false);
        expect(res3?.errors.length).to.eql(1);
        expect(res3?.errors[0]).to.include('No peer identifier');
      });

      it('error: throw (param)', () => {
        const test = (input: any) => {
          const fn = () => UriUtil.connection.parse(input, { throw: true });
          expect(fn).to.throw(/Connection URI could not be parsed/);
        };

        test('conn:data');
        test('conn:data:');
        test('conn:data:foo.');
        test('conn:data:.bar');
        test('conn:BOO:foo.bar');
        test('peer:foo');
        test('');
      });
    });
  });
});
