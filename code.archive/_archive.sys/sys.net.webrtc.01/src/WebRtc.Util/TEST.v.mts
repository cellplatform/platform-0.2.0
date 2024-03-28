import { describe, it, expect, type t } from '../test';
import { WebRtcUtils } from '.';

describe('WebRtc.Util', () => {
  it('randomPeerId', (e) => {
    const id1 = WebRtcUtils.randomPeerId();
    const id2 = WebRtcUtils.randomPeerId();
    expect(id1).to.not.eql(id2);
    expect(id1[0]).to.eql('p');
  });

  it('cleanId', () => {
    const test = (input: string, expected: string) => {
      const res = WebRtcUtils.asId(input);
      expect(res).to.eql(expected);
    };

    test('myid', 'myid');
    test('  myid  ', 'myid');
    test('  peer:myid  ', 'myid');
    test('  peer: myid  ', 'myid');
    test('peer:myid', 'myid');
    test('peer:', '');
    test('peer', 'peer');
  });

  it('asUri', () => {
    const test = (input: string, expected: string) => {
      const res = WebRtcUtils.asUri(input);
      expect(res).to.eql(expected);
    };

    test('myid', 'peer:myid');
    test('  myid  ', 'peer:myid');
    test('  peer:myid  ', 'peer:myid');
    test('peer: myid', 'peer:myid');
  });

  describe('isType', () => {
    it('isType.PeerDataPayload', () => {
      const test = (expected: boolean, input: any) => {
        const res = WebRtcUtils.isType.PeerDataPayload(input);
        expect(res).to.eql(expected);
      };

      const e: t.PeerDataPayload = {
        source: { peer: '<id>', connection: '<id>' },
        event: { type: 'foo', payload: { count: 1234 } },
      };

      test(true, e);
      [true, 123, '', {}, []].forEach((value) => test(false, value));
    });
  });
});
