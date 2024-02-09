import { COLORS, DEFAULTS, Flip, Spinner, css, type t } from './common';

export const View: React.FC<t.ModuleLoaderProps> = (props) => {
  const { flipped = DEFAULTS.flipped } = props;
  const spinning = wrangle.spinning(props);
  const theme = wrangle.theme(props);
  const is = wrangle.is(props);


  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      color: theme === 'Dark' ? COLORS.WHITE : COLORS.BLACK,
    }),
    front: css({ position: 'relative', display: 'grid' }),
    spinner: css({ Absolute: 0, display: 'grid', placeItems: 'center' }),
  };

  const elSpinner = spinning && (
    <div {...styles.spinner}>
      <Spinner.Bar width={spinning.width} color={spinning.color} />
    </div>
  );

  const elFront = (
    <div {...styles.front}>
      <div>{`🐷 ${DEFAULTS.displayName}`}</div>
      {elSpinner}
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <Flip flipped={flipped} front={elFront} back={props.back?.element} />
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  is(props: t.ModuleLoaderProps) {
    const theme = wrangle.theme(props);
    const is = { dark: theme === 'Dark', light: theme === 'Light' } as const;
    return is;
  },

  theme(props: t.ModuleLoaderProps) {
    const { theme = DEFAULTS.theme } = props;
    return theme;
  },

  spinning(props: t.ModuleLoaderProps): t.ModuleLoaderSpinning | undefined {
    const format = (res: t.ModuleLoaderSpinning) => {
      const theme = wrangle.theme(props);
      const color = res.color ? res.color : theme === 'Dark' ? COLORS.WHITE : COLORS.BLACK;
      return { ...res, color };
    };
    if (props.spinning === true) {
      return format(DEFAULTS.spinning);
    }
    if (typeof props.spinning === 'object') {
      return format({ ...DEFAULTS.spinning, ...props.spinning });
    }
    return undefined;
  },
} as const;
