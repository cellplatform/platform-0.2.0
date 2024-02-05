import { useLoader } from './ui.useLoader';
import { COLORS, Color, Spinner, css, type t } from './common';

export type LoaderProps = {
  store: t.Store;
  lens: t.Lens<t.SampleSharedOverlay>;
  factory: t.LoadFactory;
  style?: t.CssValue;
};

export const Loader: React.FC<LoaderProps> = (props) => {
  const { lens, store, factory } = props;
  const { loading, body } = useLoader({ lens, store, factory });
  if (!(loading || body)) return null;

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      pointerEvents: 'auto',
      backgroundColor: Color.format(0.8),
      display: 'grid',
    }),
    spinner: css({ Absolute: 0, display: 'grid', placeItems: 'center' }),
  };

  const elSpinner = loading && (
    <div {...styles.spinner}>
      <Spinner.Bar color={COLORS.DARK} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {body}
      {elSpinner}
    </div>
  );
};
