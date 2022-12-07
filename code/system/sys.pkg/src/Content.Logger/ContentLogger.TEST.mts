import { describe, it, expect, t } from '../test';
import { ContentLogger } from '.';

describe('ContentLog', () => {
  describe('Filename', () => {
    const Filename = ContentLogger.Filename;

    it('extension', () => {
      expect(Filename.ext).to.eql('.log.json');
    });

    it('create', () => {
      const res1 = Filename.create();
      const res2 = Filename.create('1.2.3');

      expect(res1.endsWith(Filename.ext)).to.eql(true);
      expect(res2.endsWith(Filename.ext)).to.eql(true);

      expect(res1).to.include('0.0.0');
      expect(res2).to.include('1.2.3');
    });
  });
});
