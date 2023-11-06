import { expect, describe, it } from '../test';
import { File } from '.';

describe('File', () => {
  describe('toBlob', () => {
    it('with mimetype', () => {
      const data = new Uint8Array([1, 2, 3]);
      const blob = File.toBlob(data, 'text/plain');
      expect(blob.type).to.eql('text/plain');
      expect(blob.size).to.eql(3);
    });

    it('without mimetype (default: "application/octet-stream")', () => {
      const data = new Uint8Array([1, 2, 3]);
      const blob = File.toBlob(data);
      expect(blob.type).to.eql(File.DEFAULTS.mimetype);
      expect(blob.size).to.eql(3);
    });
  });

  describe('toUint8Array', () => {
    it('from blob', async () => {
      const data = new Uint8Array([1, 2, 3]);
      const blob = File.toBlob(data);
      const res = await File.toUint8Array(blob);
      expect(res).to.eql(data);
    });
  });
});
