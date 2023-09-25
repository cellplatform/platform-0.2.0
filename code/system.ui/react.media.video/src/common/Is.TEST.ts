import { Test, expect, type t } from '../test.ui';
import { Is } from './Is';

export default Test.describe('Is (flags)', (e) => {
  e.it('Is.srcObject', (e) => {
    const unknown: t.VideoSrcUnknown = { kind: 'Unknown', ref: '' };
    const video: t.VideoSrcFile = {
      kind: 'Video',
      ref: './media/video.mp4',
      mimetype: 'video/mp4',
    };
    const vimeo: t.VideoSrcVimeo = { kind: 'Vimeo', ref: '123' };
    const youtube: t.VideoSrcYoutube = { kind: 'YouTube', ref: '123' };

    expect(Is.srcObject(unknown)).to.eql(true);
    expect(Is.srcObject(video)).to.eql(true);
    expect(Is.srcObject(vimeo)).to.eql(true);
    expect(Is.srcObject(youtube)).to.eql(true);
  });

  e.it('Is.srcObject (not)', (e) => {
    [
      //
      null,
      undefined,
      '',
      true,
      [],
      {},
      { kind: 'Vimeo' },
      { kind: 'foo', src: '123' },
    ].forEach((input) => expect(Is.srcObject(input)).to.eql(false, `${input}`));
  });

  e.it('Is.numeric', (e) => {
    expect(Is.numeric('0')).to.eql(true);
    expect(Is.numeric('123')).to.eql(true);
    expect(Is.numeric('-0.1')).to.eql(true);
    expect(Is.numeric('hello')).to.eql(false);
  });
});
