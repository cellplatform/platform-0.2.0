import { css, DevBase, t } from './common';
import { CmdBar } from './ui.CmdBar';

export type CmdHostProps = {
  pkg: { name: string; version: string };
  imports?: t.SpecImports;
  filter?: string;
  style?: t.CssValue;
  hrDepth?: number;
  badge?: t.SpecListBadge;
  onFilterChanged?: (e: { filter: string }) => void;
};

export const CmdHost: React.FC<CmdHostProps> = (props) => {
  const { pkg } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      gridTemplateRows: '1fr auto',
    }),
    body: css({
      position: 'relative',
      display: 'grid',
      Scroll: true,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <DevBase.SpecList
          title={pkg.name}
          version={pkg.version}
          imports={props.imports}
          filter={props.filter}
          badge={props.badge}
        />
      </div>
      <CmdBar text={props.filter} onChanged={(e) => props.onFilterChanged?.({ filter: e.to })} />
    </div>
  );
};
