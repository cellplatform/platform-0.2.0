import { useEffect, useState } from 'react';
import { CmdHost } from 'sys.ui.react.common';
import { Specs } from '../../../test.ui/entry.Specs.mjs';
import { Button, COLORS, Icons, Pkg, R, css, rx, type t } from '../common';

export type CmdHostLoaderProps = {
  store: t.Store;
  shared: t.Lens<t.SampleSharedCmdHost>;
  factory: t.LoadFactory<any>;
  style?: t.CssValue;
};

export const CmdHostLoader: React.FC<CmdHostLoaderProps> = (props) => {
  const { store, shared } = props;
  const badge = CmdHost.DEFAULTS.badge;

  const [command, setCommand] = useState(shared.current.filter ?? '');
  const [elOverlay, setOverlay] = useState<JSX.Element>();

  /**
   * Handlers
   */
  const load = async (address: string) => {
    const importer = Specs[address];
    const res = await importer?.();
    console.log('load', res);
    if (res) {
      const { Dev } = await import('sys.ui.react.common');
      const elHarness = <Dev.Harness spec={res.default} style={styles.overlay} />;
      setOverlay(elHarness);
    }
  };

  const unload = () => {
    setOverlay(undefined);
    shared.change((d) => (d.address = ''));
  };

  /**
   * Lifecycle
   */
  useEffect(() => {
    const events = shared.events();
    const filter$ = events.changed$.pipe(
      rx.map((e) => e.after.filter),
      rx.distinctWhile((prev, next) => R.equals(prev, next)),
    );

    const address$ = events.changed$.pipe(
      rx.map((e) => e.after.address),
      rx.distinctWhile((prev, next) => R.equals(prev, next)),
    );

    filter$.subscribe((value) => setCommand(value ?? ''));
    address$.subscribe((address) => {
      if (address) load(address);
      else unload();
    });
    return events.dispose;
  }, [shared.instance]);

  /**
   * Render
   */
  const styles = {
    base: css({ position: 'relative', backgroundColor: COLORS.WHITE }),
    list: css({ Absolute: 0 }),
    overlay: css({ Absolute: 0, backgroundColor: COLORS.WHITE }),
    closeButton: css({ Absolute: [-30, null, null, 5] }),
  };

  const elList = (
    <CmdHost.Stateful
      style={styles.list}
      pkg={Pkg}
      specs={Specs}
      badge={badge}
      hrDepth={2}
      mutateUrl={false}
      showDevParam={false}
      command={command}
      commandPlaceholder={'namespace'}
      onChanged={(e) => shared.change((d) => (d.filter = e.command))}
      onItemClick={(e) => shared.change((d) => (d.address = e.address))}
    />
  );

  const elCloseButton = elOverlay && (
    <Button style={styles.closeButton} onClick={unload}>
      <Icons.Arrow.Up />
    </Button>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elList}
      {elOverlay}
      {elCloseButton}
    </div>
  );
};
