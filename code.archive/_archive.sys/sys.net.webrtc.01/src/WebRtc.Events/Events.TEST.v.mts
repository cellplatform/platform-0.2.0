import { WebRtcEvents } from '.';
import { describe, expect, it } from '../test';

/**
 * NOTE:
 *    Most of the tests for the Events API wrapper occur
 *    within the [WebRTC.Controller] test suites.
 */
describe('WebRtcEvents', () => {
  describe('is', () => {
    const is = WebRtcEvents.is;

    it('is.base', () => {
      const test = (type: string, expected: boolean) => {
        expect(is.base({ type, payload: {} })).to.eql(expected);
      };
      test('foo', false);
      test('sys.net.webrtc/', true);
    });

    it('is.instance', () => {
      const type = 'sys.net.webrtc/';
      expect(is.instance({ type, payload: { instance: 'abc' } }, 'abc')).to.eql(true);
      expect(is.instance({ type, payload: { instance: 'abc' } }, '123')).to.eql(false);
      expect(is.instance({ type: 'foo', payload: { instance: 'abc' } }, 'abc')).to.eql(false);
    });
  });
});
