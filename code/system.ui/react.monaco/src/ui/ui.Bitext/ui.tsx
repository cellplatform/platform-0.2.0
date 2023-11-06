import { MonacoEditor } from '../ui.MonacoEditor';
import { COLORS, Color, css, type t } from './common';

const source = `
情報革命↩︎
情報革命↲
情報革命↵
`;

export const View: React.FC<t.BitextProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
    }),
    divider: css({ width: 1, backgroundColor: Color.alpha(COLORS.DARK, 0.3) }),
    edge: css({ display: 'grid' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.edge}>
        <MonacoEditor />
      </div>
      <div {...styles.divider} />
      <div {...styles.edge}>
        <MonacoEditor text={source} />
      </div>
    </div>
  );
};
