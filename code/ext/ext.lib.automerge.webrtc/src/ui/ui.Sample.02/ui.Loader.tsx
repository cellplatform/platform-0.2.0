import { COLORS, Color, Spinner, css, type t } from './common';
import { useLoader } from './ui.useLoader';

export type LoaderProps = {
  store: t.Store;
  shared: t.Lens<t.SampleSharedMain>;
  factory: t.LoadFactory<any>;
  style?: t.CssValue;
};

export const Loader: React.FC<LoaderProps> = (props) => {
  const { shared, store, factory } = props;
  const { loading, body } = useLoader({ shared, store, factory });
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
