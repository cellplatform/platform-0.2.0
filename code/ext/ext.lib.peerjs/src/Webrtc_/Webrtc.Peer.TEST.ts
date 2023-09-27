import { WebRtc } from '.';
import { DEFAULTS, Test, expect } from '../test.ui';

export default Test.describe('WebRtc.Peer', (e) => {
  e.it('Peer.options (DEFAULTS)', (e) => {
    const res = WebRtc.Peer.options(DEFAULTS.signal);
    expect(res.port).to.eql(443);
    expect(res.secure).to.eql(true);
    expect(res.host).to.eql(DEFAULTS.signal.host);
    expect(res.path).to.eql('/' + DEFAULTS.signal.path);
    expect(res.key).to.eql(DEFAULTS.signal.key);
  });
});
