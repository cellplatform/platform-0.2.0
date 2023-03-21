import { Color, COLORS, css, t } from '../common';

export type CmdBarPlaceholderProps = {
  style?: t.CssValue;
};

export const CmdBarPlaceholder: React.FC<CmdBarPlaceholderProps> = (props) => {
  const styles = {
    base: css({
      fontFamily: 'sans-serif',
      color: COLORS.WHITE,
      fontSize: 14,
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      columnGap: 10,
      userSelect: 'none',
    }),
    label: css({
      display: 'grid',
      alignContent: 'center',
      opacity: 0.2,
    }),
    key: css({
      position: 'relative',
      fontSize: 11,
      border: `solid 1px ${Color.format(0.1)}`,
      backgroundColor: Color.format(0.06),
      borderRadius: 4,
      fontStyle: 'normal',
      fontWeight: 600,
      display: 'grid',
      placeItems: 'center',
      PaddingX: 5,
    }),
  };

  return (
    <div {...css(styles.base, props.style)} className={'Placholder'}>
      <div {...styles.label}>{'Command'}</div>
      <div />
      <div {...styles.key}>{'⌘K'}</div>
    </div>
  );
};
