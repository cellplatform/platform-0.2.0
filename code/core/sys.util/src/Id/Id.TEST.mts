import { expect } from 'chai';

import { Id } from '.';
import { R } from '../common';

describe('Id', () => {
  describe('cuid', () => {
    it('creates a new CUID', () => {
      const result = Id.cuid();
      expect(result.length).to.be.greaterThan(24);
    });

    it('ids are unique', () => {
      const ids = Array.from({ length: 1000 }).map(() => Id.cuid());
      expect(ids.length).to.eql(R.uniq(ids).length);
    });
  });

  describe('slug (short id)', () => {
    it('creates a new short id', () => {
      const result = Id.slug();
      expect(result.length).to.be.greaterThan(5);
    });

    it('ids are unique', () => {
      const ids = Array.from({ length: 1000 }).map(() => Id.slug());
      expect(ids.length).to.eql(R.uniq(ids).length);
    });

    it('slug (alias)', () => {
      const result = Id.slug();
      expect(result.length).to.be.greaterThan(5);
    });
  });
});
