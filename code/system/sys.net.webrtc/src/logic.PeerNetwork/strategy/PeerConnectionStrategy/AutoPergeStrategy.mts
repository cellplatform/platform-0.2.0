import { debounceTime, filter } from 'rxjs/operators';

import { t } from '../common';

/**
 * Strategy for auto-purging connections when closed.
 */
export function AutoPergeStrategy(args: {
  netbus: t.PeerNetbus<any>;
  events: t.PeerEvents;
  isEnabled: () => boolean;
}) {
  const { events } = args;
  const netbus = args.netbus as t.PeerNetbus<t.GroupEvent>;
  const self = netbus.self;
  const connections = events.connections(self);

  connections.disconnect.res$
    .pipe(
      filter((e) => e.self === self),
      filter(() => args.isEnabled()),
      debounceTime(10),
    )
    .subscribe((e) => events.purge(self).fire());
}
