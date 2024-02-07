import { useEffect, useState } from 'react';

import { CmdHost } from 'sys.ui.react.common';
import { COLORS, Pkg, R, css, rx, type t } from '../common';
import { specs } from './CmdHost.imports';

export type CmdHostLoaderProps = {
  store: t.Store;
  shared: t.Lens<t.SampleSharedCmdHost>;
  factory: t.LoadFactory<any>;
  style?: t.CssValue;
};

export const CmdHostLoader: React.FC<CmdHostLoaderProps> = (props) => {
  const { store, shared } = props;
  const badge = CmdHost.DEFAULTS.badge;

  const [command, setCommand] = useState('');

  /**
   * Lifecycle
   */
  useEffect(() => {
    const events = shared.events();
    const filter$ = events.changed$.pipe(
      rx.map((e) => e.after.filter),
      rx.distinctWhile((prev, next) => R.equals(prev, next)),
    );
    filter$.subscribe((filter) => setCommand(filter ?? ''));
    return events.dispose;
  }, [shared.instance]);

  /**
   * Render
   */
  const styles = {
    base: css({ position: 'relative', backgroundColor: COLORS.WHITE }),
    list: css({ Absolute: 0 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <CmdHost.Stateful
        style={styles.list}
        pkg={Pkg}
        specs={specs}
        badge={badge}
        mutateUrl={false}
        showDevParam={false}
        command={command}
        commandPlaceholder={'namespace'}
        onChanged={(e) => {
          shared.change((d) => (d.filter = e.command));
        }}
        onItemClick={(e) => {
          console.log('onItemClick', e);
        }}
      />
    </div>
  );
};
