import { Video } from '.';
import { Test, expect, type t, Path } from '../test.ui';

export default Test.describe('Video.src', (e) => {
  const unknown: t.VideoSrcUnknown = { kind: 'Unknown', ref: '' };

  e.it('unknown (empty input)', (e) => {
    expect(Video.src()).to.eql(unknown);
    expect(Video.src('')).to.eql(unknown);
    expect(Video.src('  ')).to.eql(unknown);
  });

  e.it('input is already { src } object', (e) => {
    const unknown: t.VideoSrcUnknown = { kind: 'Unknown', ref: '' };
    const video: t.VideoSrcFile = {
      kind: 'Video',
      ref: '/media/video.mp4',
      mimetype: 'video/mp4',
    };
    const vimeo: t.VideoSrcVimeo = { kind: 'Vimeo', ref: '123' };
    const youtube: t.VideoSrcYoutube = { kind: 'YouTube', ref: '123' };

    expect(Video.src(unknown)).to.eql(unknown);
    expect(Video.src(video)).to.eql(video);
    expect(Video.src(vimeo)).to.eql(vimeo);
    expect(Video.src(youtube)).to.eql(youtube);
  });

  e.it('number → { vimeo }', (e) => {
    const res = Video.src(123);
    expect(res.kind).to.eql('Vimeo');
    expect(res.ref).to.eql('123');
  });

  e.it('string "number" → { vimeo }', (e) => {
    const res = Video.src('  123  ');
    expect(res.kind).to.eql('Vimeo');
    expect(res.ref).to.eql('123');
  });

  e.it('(plain) string → { youtube }', (e) => {
    const res = Video.src('  abc123  ');
    expect(res.kind).to.eql('YouTube');
    expect(res.ref).to.eql('abc123');
  });

  e.it('(https) string → { video }', (e) => {
    const url = 'https://foo.com/video.mp4';
    const res = Video.src(` ${url} `);
    expect(res.kind).to.eql('Video');
    expect(res.ref).to.eql(url);
  });

  e.it('(http) string → <error>', (e) => {
    const url = 'http://foo.com/video.mp4';
    const fn = () => Video.src(` ${url} `);
    expect(fn).to.throw(/Only https supported/);
  });

  e.describe('type: Video', (e) => {
    const test = (input: string, expected: t.VideoMimeType) => {
      const src = Video.src(input);
      expect(src.kind).to.eql('Video');
      if (src.kind === 'Video') expect(src.mimetype).to.eql(expected);
    };

    e.it('mimetype: video/mp4', (e) => {
      test('https://foo.com/video.mp4', 'video/mp4');
      test('https://foo.com/video.MP4', 'video/mp4');
    });

    e.it('mimetype: video/webm', (e) => {
      test('https://foo.com/video.webm', 'video/webm');
      test('https://foo.com/video.WEBM', 'video/webm');
    });

    e.it('mimetype: unknown (default video/mp4)', (e) => {
      test('https://ipfs.foo.com/abcd', 'video/mp4');
    });
  });
});
