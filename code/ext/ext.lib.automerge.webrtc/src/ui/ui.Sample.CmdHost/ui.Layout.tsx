import { Color, css, type t } from './common';
import { SampleHost } from './ui.Host';

export type SampleLayoutProps = {
  pkg: t.ModuleDef;
  imports?: t.ModuleImports;
  left?: t.Lens;
  right?: t.Lens;
  path?: t.CmdHostPaths;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const SampleLayout: React.FC<SampleLayoutProps> = (props) => {
  const { left, right, theme } = props;

  /**
   * Render
   */
  const color = Color.fromTheme(theme);
  const styles = {
    base: css({ color, display: 'grid', gridTemplateColumns: '1fr auto 1fr' }),
    divider: css({ width: 1, backgroundColor: Color.alpha(color, 0.1) }),
  };

  const renderHost = (doc?: t.Lens, debug?: string) => {
    return (
      <SampleHost
        debug={debug}
        enabled={!!doc}
        pkg={props.pkg}
        imports={props.imports}
        doc={doc}
        path={props.path}
        theme={theme}
      />
    );
  };

  return (
    <div {...css(styles.base, props.style)}>
      {renderHost(left, '🐷')}
      <div {...styles.divider} />
      {renderHost(right, '🌼')}
    </div>
  );
};
