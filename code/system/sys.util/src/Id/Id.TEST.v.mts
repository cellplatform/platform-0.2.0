import { expect, describe, it } from '../test';

import { Id, slug, cuid } from '.';
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
  });
});
