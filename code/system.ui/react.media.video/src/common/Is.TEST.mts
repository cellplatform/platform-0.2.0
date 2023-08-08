import { Test, expect, type t } from '../test.ui';
import { Is } from './Is.mjs';

export default Test.describe('Is (flags)', (e) => {
  e.it('Is.srcObject', (e) => {
    [null, undefined, '', true, [], {}, { kind: 'Vimeo' }, { kind: 'foo', id: '123' }].forEach(
      (input) => expect(Is.srcObject(input)).to.eql(false, `${input}`),
    );

    const unknown: t.VideoSrcUnknown = { kind: 'Unknown', id: '' };
    const vimeo: t.VideoSrcVimeo = { kind: 'Vimeo', id: '123' };
    const youtube: t.VideoSrcYoutube = { kind: 'YouTube', id: '123' };

    expect(Is.srcObject(unknown)).to.eql(true);
    expect(Is.srcObject(vimeo)).to.eql(true);
    expect(Is.srcObject(youtube)).to.eql(true);
  });
});
