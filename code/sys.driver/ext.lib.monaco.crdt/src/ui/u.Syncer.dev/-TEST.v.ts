import { Monaco } from '../..';
import { describe, expect, it } from '../../test';
import { CmdUtil, Util } from '../u.Syncer/u';
import { Cmd, DEFAULTS, Immutable, ObjectPath, Syncer, type t } from './common';

describe('Monaco.Crdt.syncer', () => {
  it('api reference', () => {
    expect(Syncer).to.equal(Monaco.Crdt.Syncer);
  });

  describe('Identity', () => {
    it('Identity.format', () => {
      expect(Util.Identity.format('foo')).to.eql('foo');
    });

    it('Identity.format: <undefined>', () => {
      const res = Util.Identity.format();
      expect(res.startsWith('UNKNOWN.')).to.eql(true);
      expect(Util.Identity.Is.unknown(res)).to.eql(true);
    });

    describe('Identity.Is', () => {
      it('Is.unknown', () => {
        const test = (value: string, expected: boolean) => {
          const res = Util.Identity.Is.unknown(value);
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

  describe('Path', () => {
    describe('wrangle', () => {
      it('<undefined> (default)', () => {
        expect(Util.Path.wrangle()).to.eql(DEFAULTS.paths);
        expect(Util.Path.wrangle(undefined)).to.eql(DEFAULTS.paths);
      });

      it('{paths}', () => {
        const paths: t.EditorPaths = {
          text: ['foo'],
          identity: ['bar'],
          cmd: ['baz'],
        };
        expect(Util.Path.wrangle(paths)).to.eql(paths);
      });

      it('array (prefix)', () => {
        const prefix = ['foo', 'bar'];
        expect(Util.Path.wrangle(prefix)).to.eql({
          text: ['foo', 'bar', 'text'],
          cmd: ['foo', 'bar', '.tmp', 'cmd'],
          identity: ['foo', 'bar', '.tmp', 'identity'],
        });
      });
    });

    describe('identity', () => {
      it('identity.self', () => {
        const identity = 'bob';
        const res = Util.Path.identity(identity);
        expect(res.self).to.eql(['.tmp', 'identity', identity]);
        expect(res.identity).to.eql(identity);
      });

      it('identity.selections', () => {
        const identity = 'bob';
        const res = Util.Path.identity(identity);
        expect(res.selections).to.eql(['.tmp', 'identity', identity, 'selections']);
      });
    });
  });

  describe('Cmd', () => {
    it('create (defaults)', () => {
      const transport = Immutable.clonerRef({});
      Util.Cmd.create(transport);
      const obj = ObjectPath.resolve(transport.current, DEFAULTS.paths.cmd);
      expect(Cmd.Is.state.cmd(obj)).to.eql(true);
    });

    it('create: with custom paths (prepended)', () => {
      const transport = Immutable.clonerRef({});
      Util.Cmd.create(transport, { paths: ['foo'] });
      const obj = ObjectPath.resolve(transport.current, ['foo', ...DEFAULTS.paths.cmd]);
      expect(Cmd.Is.state.cmd(obj)).to.eql(true);
    });

    it('toCmd', () => {
      const transport = Immutable.clonerRef({});
      const methods = Util.Cmd.create(transport);
      const cmd = CmdUtil.toCmd(methods);
      expect(Cmd.Is.cmd(cmd)).to.eql(true);
    });
  });
});
