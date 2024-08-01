import { Monaco } from '../..';
import { describe, expect, it } from '../../test';
import { SyncerIdentity, SyncerPath } from '../u.Syncer/u';
import { Syncer, DEFAULTS, type t } from './common';

describe('Monaco.Crdt.syncer', () => {
  it('api reference', () => {
    expect(Syncer).to.equal(Monaco.Crdt.Syncer);
  });

  describe('Identity', () => {
    it('Identity.format', () => {
      expect(SyncerIdentity.format('foo')).to.eql('foo');
    });

    it('Identity.format: <undefined>', () => {
      const res = SyncerIdentity.format();
      expect(res.startsWith('UNKNOWN.')).to.eql(true);
      expect(SyncerIdentity.Is.unknown(res)).to.eql(true);
    });

    describe('Identity.Is', () => {
      it('Is.unknown', () => {
        const test = (value: string, expected: boolean) => {
          const res = SyncerIdentity.Is.unknown(value);
          expect(res).to.eql(expected);
        };
        test('UNKNOWN.foo', true);
        test('', true);
        test('  ', true);
        test('UNKNOWN.', false);
        test('foobar', false);
      });
    });
  });

  describe('SyncerPaths', () => {
    describe('wrangle', () => {
      it('undefined (default)', () => {
        expect(SyncerPath.wrangle()).to.eql(DEFAULTS.paths);
        expect(SyncerPath.wrangle(undefined)).to.eql(DEFAULTS.paths);
      });

      it('{paths}', () => {
        const paths: t.EditorPaths = { text: ['foo'], identity: ['.bar'] };
        expect(SyncerPath.wrangle(paths)).to.eql(paths);
      });

      it('array (prefix)', () => {
        const prefix = ['foo', 'bar'];
        expect(SyncerPath.wrangle(prefix)).to.eql({
          text: ['foo', 'bar', 'text'],
          identity: ['foo', 'bar', '.identity'],
        });
      });
    });

    describe('identity', () => {
      it('root', () => {
        const id = 'foobar';
        const res = SyncerPath.identity(id);
        expect(res.root).to.eql(['.identity', id]);
      });
    });
  });
});
