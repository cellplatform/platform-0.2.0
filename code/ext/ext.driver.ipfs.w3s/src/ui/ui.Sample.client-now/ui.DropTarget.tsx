import { COLORS, Color, Spinner, css, type t } from './common';
import { useDropFile } from './use.DropFile';

export type DropTargetProps = {
  apiKey?: string;
  style?: t.CssValue;
  onDropPut?: t.SampleDropPutHandler;
};

export const DropTarget: React.FC<DropTargetProps> = (props) => {
  const { apiKey, onDropPut } = props;
  const drop = useDropFile({ apiKey, onDropPut });
  const { is } = drop;

  /**
   * [Render]
   */
  const borderColor = is.over ? COLORS.MAGENTA : Color.alpha(COLORS.DARK, 0.1);

  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: Color.alpha(COLORS.DARK, 0.02),
      Padding: [20, 8],
      borderRadius: 6,
      border: `dashed 1px ${borderColor}`,
      fontSize: 14,
      userSelect: 'none',
      boxShadow: is.over ? `0 0 10px 0 ${Color.format(-0.06)}` : undefined,

      display: 'grid',
      placeItems: 'center',
    }),
    label: css({
      pointerEvents: 'none',
      opacity: is.spinning ? 0 : 1,
      transition: `opacity 0.1s`,
    }),
    spinner: css({
      Absolute: 0,
      pointerEvents: 'none',
      display: 'grid',
      placeItems: 'center',
    }),
  };

  const elSpinner = is.spinning && (
    <div {...styles.spinner}>
      <Spinner.Bar width={30} />
    </div>
  );

  const elLabel = <div {...styles.label}>{drop.label}</div>;

  return (
    <div ref={drop.ref} {...css(styles.base, props.style)}>
      {elLabel}
      {elSpinner}
    </div>
  );
};
