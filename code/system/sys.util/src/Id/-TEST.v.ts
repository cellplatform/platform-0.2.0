import { describe, expect, it } from '../test';

import { Id, cuid, slug } from '.';
import { R } from '../common';

describe('Id', () => {
  it('display', () => {
    console.log(`slug: ${slug()}`);
    console.log(`cuid: ${cuid()}`);
  });

  describe('cuid', () => {
    it('creates a new long id', () => {
      const res = Id.cuid();
      expect(res.length).to.be.greaterThan(24);
    });

    it('ids are unique', () => {
      const ids = Array.from({ length: 1000 }).map(() => Id.cuid());
      expect(ids.length).to.eql(R.uniq(ids).length);
    });

    it('function export', () => {
      expect(Id.cuid).to.equal(cuid);
    });

    it('Id.is.cuid( )', () => {
      ['', true, 123, [], {}, null, undefined].forEach((v) => expect(Id.is.cuid(v)).to.eql(false));
      Array.from({ length: 50 }).forEach(() => {
        const cuid = Id.cuid();
        const slug = Id.slug();
        expect(Id.is.cuid(cuid)).to.eql(true);
        expect(Id.is.cuid(slug)).to.eql(false);
      });
    });
  });

  describe('slug (short id)', () => {
    it('creates a new short id', () => {
      const res = Id.slug();
      expect(res.length).to.be.greaterThan(5);
      expect(res.length).to.be.lessThan(10);
    });

    it('ids are unique (1000)', () => {
      const ids = Array.from({ length: 1000 }).map(() => Id.slug());
      expect(ids.length).to.eql(R.uniq(ids).length);
    });

    it('ids are unique (1000)', () => {
      const ids = Array.from({ length: 1000 }).map(() => Id.slug());
      expect(ids.length).to.eql(R.uniq(ids).length);
    });

    it('slug (alias)', () => {
      const result = Id.slug();
      expect(result.length).to.be.greaterThan(5);
    });

    it('function export', () => {
      expect(Id.slug).to.equal(slug);
    });

    it('Id.is.slug( )', () => {
      ['', true, 123, [], {}, null, undefined].forEach((v) => expect(Id.is.cuid(v)).to.eql(false));
      Array.from({ length: 50 }).forEach(() => {
        const cuid = Id.cuid();
        const slug = Id.slug();
        expect(Id.is.slug(cuid)).to.eql(false);
        expect(Id.is.slug(slug)).to.eql(true);
      });
    });
  });
});
