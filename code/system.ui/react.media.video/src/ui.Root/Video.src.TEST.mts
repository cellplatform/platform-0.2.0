import { Video } from '.';
import { Test, expect, type t } from '../test.ui';

export default Test.describe('Video.src', (e) => {
  const unknown: t.VideoSrcUnknown = { kind: 'Unknown', src: '' };

  e.it('unknown (empty input)', (e) => {
    expect(Video.src()).to.eql(unknown);
    expect(Video.src('')).to.eql(unknown);
    expect(Video.src('  ')).to.eql(unknown);
  });

  e.it('input is already { src } object', (e) => {
    const unknown: t.VideoSrcUnknown = { kind: 'Unknown', src: '' };
    const video: t.VideoSrcVideo = { kind: 'Video', src: '/media/video.mp4' };
    const vimeo: t.VideoSrcVimeo = { kind: 'Vimeo', src: '123' };
    const youtube: t.VideoSrcYoutube = { kind: 'YouTube', src: '123' };

    expect(Video.src(unknown)).to.eql(unknown);
    expect(Video.src(video)).to.eql(video);
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

  e.it('(plain) string → { youtube }', (e) => {
    const res = Video.src('  abc123  ');
    expect(res.kind).to.eql('YouTube');
    expect(res.src).to.eql('abc123');
  });

  e.it('(https) string → { video }', (e) => {
    const url = 'https://foo.com/video.mp4';
    const res = Video.src(` ${url} `);
    expect(res.kind).to.eql('Video');
    expect(res.src).to.eql(url);
  });

  e.it('(http) string → <error>', (e) => {
    const url = 'http://foo.com/video.mp4';
    const fn = () => Video.src(` ${url} `);
    expect(fn).to.throw(/Only https supported/);
  });
});
