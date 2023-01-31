// import { expect } from 'chai';
// import { Test } from 'sys.ui.dev';
import { Dev, expect } from '../../../test.ui';

import { PeerStrategy } from '.';
import { PeerNetbus, cuid, rx, t } from '../common';

export default Dev.describe('PeerStrategy', (e) => {
  const self = cuid();
  const bus = rx.bus<t.PeerEvent>();
  const netbus = PeerNetbus({ self, bus });

  e.it('dispose', () => {
    const strategy = PeerStrategy({ bus, netbus });

    const fire = { root: 0, connection: 0 };
    strategy.dispose$.subscribe(() => fire.root++);
    strategy.connection.dispose$.subscribe(() => fire.connection++);

    strategy.dispose();
    strategy.dispose();
    strategy.dispose();

    expect(fire.root).to.eql(1);

    // NB: Disposes deeply.
    expect(fire.connection).to.eql(1);
  });

  e.describe('Connection', (e) => {
    e.it('default:true - autoPurgeOnClose', () => {
      const connection = PeerStrategy({ bus, netbus }).connection;
      expect(connection.autoPurgeOnClose).to.eql(true);
    });

    e.it('default:true - ensureClosed', () => {
      const connection = PeerStrategy({ bus, netbus }).connection;
      expect(connection.ensureClosed).to.eql(true);
    });
  });
});
