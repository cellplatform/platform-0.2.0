import { Webrtc, describe, expect, it } from '../../test';
import { Model } from './Model';
import { Data } from './u.Data';

describe('Connector.Model', () => {
  const peer = Webrtc.peer();
  const { ctx } = Model.List.init({ peer });

  describe('Self', () => {
    it('state', () => {
      const model = Model.Self.state({ ctx });
      const data = Data.self(model);
      expect(data.peerid).to.eql(peer.id);
    });
  });

  describe('Remote', () => {
    it('state', () => {
      const model = Model.Remote.state({ ctx });
      expect(model.current.placeholder).to.eql('paste remote peer');
    });
  });

  describe('List', () => {
    it('state', () => {
      const { list } = Model.List.init({ peer });
      expect(list.current.total).to.eql(2);
      expect(list.current.getItem).to.be.a('function');
    });
  });
});
