import { Color, css, type t } from './common';
import { MonacoEditor } from 'ext.lib.monaco';

export type SampleProps = {
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  const {} = props;

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      color: theme.fg,
      display: 'grid',
      gridTemplateColumns: `1fr 1fr`,
    }),
    left: css({
      display: 'grid',
      placeItems: 'center',
      fontSize: 120,
    }),
    right: css({
      display: 'grid',
    }),
  };

  const code = '# Social Lean Canvas\n';

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}>{`🐷`}</div>
      <div {...styles.right}>
        <MonacoEditor theme={'Dark'} language={'yaml'} text={code} />
      </div>
    </div>
  );
};
