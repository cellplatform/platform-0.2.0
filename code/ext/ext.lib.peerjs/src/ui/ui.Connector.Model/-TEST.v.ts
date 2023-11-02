import { Webrtc, describe, expect, it } from '../../test';
import { Model } from './Model';
import { Data } from './u.Data';
import { DEFAULTS } from './common';

describe('Connector.Model', () => {
  const peer = Webrtc.peer();
  const { ctx } = Model.List.init(peer);

  describe('Self', () => {
    it('state', () => {
      const model = Model.Self.state({ ctx });
      expect(model.type).to.eql(DEFAULTS.type.self);

      const data = Data.self(model);
      expect(data.peerid).to.eql(peer.id);

      expect(Model.Is.self(model)).to.eql(true);
      expect(Model.Is.remote(model)).to.eql(false);
      expect(Model.Is.list(model)).to.eql(false);
    });
  });

  describe('Remote', () => {
    it('state', () => {
      const model = Model.Remote.state({ ctx });
      expect(model.type).to.eql(DEFAULTS.type.remote);

      expect(Model.Is.self(model)).to.eql(false);
      expect(Model.Is.remote(model)).to.eql(true);
      expect(Model.Is.list(model)).to.eql(false);
    });
  });

  describe('List', () => {
    it('state', () => {
      const { list } = Model.List.init(peer);
      expect(list.type).to.eql(DEFAULTS.type.list);
      expect(list.current.total).to.eql(2);
      expect(list.current.getItem).to.be.a('function');

      expect(Model.Is.self(list)).to.eql(false);
      expect(Model.Is.remote(list)).to.eql(false);
      expect(Model.Is.list(list)).to.eql(true);
    });
  });
});
