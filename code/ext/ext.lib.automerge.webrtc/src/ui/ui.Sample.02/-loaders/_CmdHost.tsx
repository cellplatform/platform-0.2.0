import { CmdHost } from 'sys.ui.react.common';
import { COLORS, Pkg, css, type t } from '../common';
import { specs } from './CmdHost.imports';

export type CmdHostLoaderProps = {
  store: t.Store;
  shared: t.Lens<t.SampleSharedMain>;
  factory: t.LoadFactory<any>;
  style?: t.CssValue;
};

export const CmdHostLoader: React.FC<CmdHostLoaderProps> = (props) => {
  const { store, shared } = props;
  const badge = CmdHost.DEFAULTS.badge;

  console.log('CmdHost (loader)', shared.toObject()); // TEMP 🐷

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: COLORS.WHITE,
      display: 'grid',
    }),
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
        commandPlaceholder={'namespace'}
        onItemClick={(e) => {
          console.log('onItemClick', e);
        }}
      />
    </div>
  );
};
