import { Color, Pkg, css, type t } from './common';

import { CmdHost } from 'sys.ui.react.common';
import { Specs } from '../test.ui/entry.Specs';

export type LoadListProps = {
  modules?: t.ModuleImports;
  filter?: string;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onSelect?: (e: { uri: string }) => void;
};

export const LoadList: React.FC<LoadListProps> = (props) => {
  const {} = props;

  /**
   * Render
   */
  const theme = Color.theme(props.theme ?? 'Dark');
  const styles = {
    base: css({
      color: theme.fg,
      Absolute: 0,
      backgroundColor: theme.bg,
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.base}>
        <CmdHost
          pkg={Pkg}
          imports={Specs}
          filter={() => CmdHost.Filter.imports(props.modules, props.filter)}
          theme={theme.name}
          style={styles.base}
          showParamDev={false}
          showCommandbar={false}
          onItemInvoke={(e) => {
            const uri = e.uri;
            if (uri) props.onSelect?.({ uri });
          }}
        />
      </div>
    </div>
  );
};
