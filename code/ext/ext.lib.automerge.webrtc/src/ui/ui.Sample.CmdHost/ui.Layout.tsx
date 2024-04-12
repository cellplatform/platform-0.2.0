import { Color, css, type t } from './common';
import { Sample } from './ui.Sample';

export type SampleLayoutProps = {
  pkg: t.ModuleDef;
  left?: t.Lens;
  right?: t.Lens;
  path?: t.ObjectPath;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const SampleLayout: React.FC<SampleLayoutProps> = (props) => {
  const { pkg, left, right, path, theme } = props;

  /**
   * Render
   */
  const color = Color.fromTheme(theme);
  const styles = {
    base: css({ color, display: 'grid', gridTemplateColumns: '1fr auto 1fr' }),
    divider: css({ width: 1, backgroundColor: Color.alpha(color, 0.1) }),
  };

  const renderHost = (doc?: t.Lens, debug?: string) => {
    const enabled = !!doc;
    return <Sample pkg={pkg} debug={debug} doc={doc} path={path} theme={theme} enabled={enabled} />;
  };

  return (
    <div {...css(styles.base, props.style)}>
      {renderHost(left, '🐷')}
      <div {...styles.divider} />
      {renderHost(right, '🌼')}
    </div>
  );
};
