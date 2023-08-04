import { Video } from '.';
import { Test, expect, type t } from '../test.ui';

export default Test.describe('Video', (e) => {
  e.describe('toSource', (e) => {
    const unknown: t.VideoSrcUnknown = { kind: 'Unknown', id: '' };

    e.it('unknown (empty input)', (e) => {
      expect(Video.toSrc()).to.eql(unknown);
      expect(Video.toSrc('')).to.eql(unknown);
      expect(Video.toSrc('  ')).to.eql(unknown);
    });

    e.it('input is already { src } object', (e) => {
      const unknown: t.VideoSrcUnknown = { kind: 'Unknown', id: '' };
      const vimeo: t.VideoSrcVimeo = { kind: 'Vimeo', id: '123' };
      const youtube: t.VideoSrcYoutube = { kind: 'YouTube', id: '123' };

      expect(Video.toSrc(unknown)).to.eql(unknown);
      expect(Video.toSrc(vimeo)).to.eql(vimeo);
      expect(Video.toSrc(youtube)).to.eql(youtube);
    });

    e.it('number → { vimeo }', (e) => {
      const res = Video.toSrc(123);
      expect(res.kind).to.eql('Vimeo');
      expect(res.id).to.eql('123');
    });

    e.it('string "number" → { vimeo }', (e) => {
      const res = Video.toSrc('  123  ');
      expect(res.kind).to.eql('Vimeo');
      expect(res.id).to.eql('123');
    });

    e.it('string → { youtube }', (e) => {
      const res = Video.toSrc('  abc123  ');
      expect(res.kind).to.eql('YouTube');
      expect(res.id).to.eql('abc123');
    });
  });
});
