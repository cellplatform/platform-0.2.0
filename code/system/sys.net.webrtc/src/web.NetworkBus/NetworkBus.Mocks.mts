import type { t } from '../common.t';
import { NetworkBusMock } from './NetworkBus.Mock.mjs';

/**
 * A mock network mesh of event buses.
 */
export function NetworkBusMocks<E extends t.Event = t.Event>(
  length: number,
  options: { memorylog?: boolean } = {},
) {
  const mocks = Array.from({ length }).map((v, i) => {
    const { memorylog } = options;
    const local = `peer:${i + 1}`;
    return NetworkBusMock<E>({ local, memorylog });
  });

  mocks.forEach((netbus) => {
    mocks
      .filter(({ mock }) => mock.local !== netbus.mock.local)
      .forEach((remote) => netbus.mock.remote(remote.mock.local, remote));
  });

  return mocks;
}
