import { describe, it, expect, type t } from '../../test';
import { Model } from './Model';

describe('Connector.Model', () => {
  describe('Self', () => {
    it('init', () => {
      const peerid = 'foo';
      const model = Model.Self.state({ peerid });
      expect(model.current.label).to.eql(peerid);
    });
  });

  describe('Remote', () => {
    it('init', () => {
      const model = Model.Remote.state();
      expect(model.current.placeholder).to.eql('paste remote peer');
    });
  });

  describe('List', () => {
    it('init', () => {
      const model = Model.List.state();
      expect(model.current.count).to.eql(0);
    });
  });
});
