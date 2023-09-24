import { Video } from '.';
import { Test, expect, type t } from '../test.ui';

export default Test.describe('Video', (e) => {
  e.describe('toSource', (e) => {
    const unknown: t.VideoSrcUnknown = { kind: 'Unknown', src: '' };

    e.it('unknown (empty input)', (e) => {
      expect(Video.src()).to.eql(unknown);
      expect(Video.src('')).to.eql(unknown);
      expect(Video.src('  ')).to.eql(unknown);
    });

    e.it('input is already { src } object', (e) => {
      const unknown: t.VideoSrcUnknown = { kind: 'Unknown', src: '' };
      const vimeo: t.VideoSrcVimeo = { kind: 'Vimeo', src: '123' };
      const youtube: t.VideoSrcYoutube = { kind: 'YouTube', src: '123' };

      expect(Video.src(unknown)).to.eql(unknown);
      expect(Video.src(vimeo)).to.eql(vimeo);
      expect(Video.src(youtube)).to.eql(youtube);
    });

    e.it('number → { vimeo }', (e) => {
      const res = Video.src(123);
      expect(res.kind).to.eql('Vimeo');
      expect(res.src).to.eql('123');
    });

    e.it('string "number" → { vimeo }', (e) => {
      const res = Video.src('  123  ');
      expect(res.kind).to.eql('Vimeo');
      expect(res.src).to.eql('123');
    });

    e.it('string → { youtube }', (e) => {
      const res = Video.src('  abc123  ');
      expect(res.kind).to.eql('YouTube');
      expect(res.src).to.eql('abc123');
    });
  });
});
