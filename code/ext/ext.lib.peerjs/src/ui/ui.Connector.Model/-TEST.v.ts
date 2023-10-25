import { describe, expect, it, type t, Webrtc } from '../../test';
import { Data } from './Data';
import { Model } from './Model';

describe('Connector.Model', () => {
  const peer = Webrtc.peer();
  const { ctx } = Model.List.init({ peer });

  describe('Self', () => {
    it('state', () => {
      const model = Model.Self.state({ ctx });
      const data = Data.self(model);
      expect(data.localid).to.eql(peer.id);
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
