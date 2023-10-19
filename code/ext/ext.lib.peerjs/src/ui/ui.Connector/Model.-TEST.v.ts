import { describe, expect, it, type t } from '../../test';
import { Data } from './Data';
import { Model } from './Model';

describe('Connector.Model', () => {
  const list = Model.List.init();
  const ctx: t.GetConnectorCtx = () => ({ list });

  describe('Self', () => {
    it('state', () => {
      const peerid = 'foo';
      const model = Model.Self.state({ peerid, ctx });
      const data = Data.self(model);
      expect(data.peerid).to.eql(peerid);
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
      const list = Model.List.init();
      expect(list.current.total).to.eql(2);
      expect(list.current.getItem).to.be.a('function');
    });
  });
});
