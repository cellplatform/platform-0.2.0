import { View as CmdBar } from '../CmdBar/ui';
import { Color, DEFAULTS, css, type t } from './common';

export const View: React.FC<t.CmdBarStatefulProps> = (props) => {
  console.log(DEFAULTS.displayName, props); // TEMP 🐷

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      color: theme.fg,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 ${DEFAULTS.name}`}</div>
      <CmdBar />
    </div>
  );
};
