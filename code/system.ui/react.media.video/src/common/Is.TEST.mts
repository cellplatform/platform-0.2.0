import { Test, expect, type t } from '../test.ui';
import { Is } from './Is.mjs';

export default Test.describe('Is (flags)', (e) => {
  e.it('Is.srcObject', (e) => {
    const unknown: t.VideoSrcUnknown = { kind: 'Unknown', src: '' };
    const vimeo: t.VideoSrcVimeo = { kind: 'Vimeo', src: '123' };
    const youtube: t.VideoSrcYoutube = { kind: 'YouTube', src: '123' };

    expect(Is.srcObject(unknown)).to.eql(true);
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
      { kind: 'foo', id: '123' },
    ].forEach((input) => expect(Is.srcObject(input)).to.eql(false, `${input}`));
  });
});
