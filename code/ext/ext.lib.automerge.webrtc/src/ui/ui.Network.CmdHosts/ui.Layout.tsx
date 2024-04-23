import { Color, NetworkCmdHost, css, type t } from './common';

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
  const isDark = theme === 'Dark';

  /**
   * Render
   */
  const color = Color.fromTheme(theme);
  const styles = {
    base: css({ color, display: 'grid', gridTemplateColumns: '1fr auto 1fr' }),
    div: {
      base: css({
        width: 1,
        backgroundColor: Color.alpha(color, 0.1),
        display: 'grid',
        alignContent: 'end',
      }),
      footer: css({ height: 35, backgroundColor: Color.lighten(Color.DARK, 10) }),
    },
    host: {
      base: css({
        position: 'relative',
        display: 'grid',
        backgroundColor: Color.format(isDark ? 0.01 : 0),
      }),
      debug: css({
        Absolute: [-12, null, null, -12],
        fontSize: 22,
        display: 'grid',
        placeItems: 'center',
      }),
    },
  };

  const renderCmdHost = (doc?: t.Lens, debug?: string) => {
    return (
      <div {...styles.host.base}>
        <NetworkCmdHost
          debug={debug}
          enabled={!!doc}
          pkg={props.pkg}
          imports={props.imports}
          doc={doc}
          path={props.path}
          theme={theme}
        />
        <div {...styles.host.debug}>{debug}</div>
      </div>
    );
  };

  return (
    <div {...css(styles.base, props.style)}>
      {renderCmdHost(left, '🐷')}
      <div {...styles.div.base}>
        <div {...styles.div.footer} />
      </div>
      {renderCmdHost(right, '🌼')}
    </div>
  );
};
