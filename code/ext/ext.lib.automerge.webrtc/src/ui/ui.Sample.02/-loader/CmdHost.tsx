import { CmdHost } from 'sys.ui.react.common';
import { COLORS, Pkg, css, type t } from '../common';
import { specs } from './CmdHost.imports';

export type CmdHostLoaderProps = {
  store: t.Store;
  shared: t.Lens<t.SampleSharedMain>;
  style?: t.CssValue;
};

export const CmdHostLoader: React.FC<CmdHostLoaderProps> = (props) => {
  const { store, shared } = props;
  const badge = CmdHost.DEFAULTS.badge;

  console.log('CmdHost (loader)', shared); // TEMP 🐷

  /**
   * Render
   */
  const styles = {
    base: css({ backgroundColor: COLORS.WHITE, display: 'grid' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <CmdHost.Stateful pkg={Pkg} badge={badge} mutateUrl={false} specs={specs} />
    </div>
  );
};
