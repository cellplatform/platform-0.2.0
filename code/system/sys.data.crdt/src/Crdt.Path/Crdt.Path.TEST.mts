import { describe, it, expect } from '../test/';
import { CrdtPath } from './';

describe('Crdt.Path', () => {
  describe('format', () => {
    it('default structure', () => {
      const res = CrdtPath.format('  mydir/foo.bar  ');

      expect(res.dir).to.eql('mydir');
      expect(res.filename.base).to.eql('foo.bar');
      expect(res.filename.crdt).to.eql('foo.bar.crdt');
      expect(res.filename.json).to.eql('foo.bar.crdt.json');

      expect(res.toString()).to.eql('mydir/foo.bar.crdt');
      expect(res.toString({ json: false })).to.eql('mydir/foo.bar.crdt');
      expect(res.toString({ json: true })).to.eql('mydir/foo.bar.crdt.json');
    });

    it('no dir', () => {
      const res = CrdtPath.format('  foo.bar  ');
      expect(res.dir).to.eql('');
      expect(res.filename.base).to.eql('foo.bar');
      expect(res.filename.crdt).to.eql('foo.bar.crdt');
      expect(res.filename.json).to.eql('foo.bar.crdt.json');
    });

    it('does not replicate .crdt and .json extensions', () => {
      const res1 = CrdtPath.format('foo/file.crdt');
      const res2 = CrdtPath.format('foo/file.crdt.json');
      expect(res1.toString()).to.eql('foo/file.crdt');
      expect(res2.toString()).to.eql('foo/file.crdt');
    });
  });

  it('trimExtension', () => {
    const test = (input: any) => {
      const res = CrdtPath.trimExtension(input);
      expect(res).to.eql('foo.bar');
    };

    test('foo.bar');
    test('foo.bar.crdt');
    test('foo.bar.crdt.json');
  });
});
