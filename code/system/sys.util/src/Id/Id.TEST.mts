import { expect } from 'chai';

import { Id, slug, cuid } from './index.mjs';
import { R } from '../common/index.mjs';

describe('Id', () => {
  it('display', () => {
    console.log(`slug: ${slug()}`);
    console.log(`cuid: ${cuid()}`);
  });

  describe('cuid', () => {
    it('creates a new long id', () => {
      const result = Id.cuid();
      expect(result.length).to.be.greaterThan(24);
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
      const result = Id.slug();
      expect(result.length).to.be.greaterThan(5);
      expect(result.length).to.be.lessThan(10);
    });

    it('ids are unique (1000)', () => {
      const ids = Array.from({ length: 1000 }).map(() => Id.slug());
      expect(ids.length).to.eql(R.uniq(ids).length);
    });

    it('ids are unique (1000)', () => {
      const ids = Array.from({ length: 1000 }).map(() => Id.slug());
      expect(ids.length).to.eql(R.uniq(ids).length);
    });

    it.skip('slug (alias)', () => {
      const result = Id.slug();
      expect(result.length).to.be.greaterThan(5);
    });

    it('function export', () => {
      expect(Id.slug).to.equal(slug);
    });
  });
});
