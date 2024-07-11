import { Color, css, type t } from './common';
import { ArgsCard } from './ui.Main.ArgsCard';

export const View: React.FC<t.MainProps> = (props) => {
  const fields = wrangle.fields(props);

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      position: 'relative',
      color: theme.fg,
      display: 'grid',
      placeItems: 'center',
    }),
    fn: {
      base: css({ display: 'grid', placeItems: 'center' }),
      label: css({
        fontSize: 100,
        fontWeight: 600,
        MarginY: 30,
        opacity: 0.06,
        userSelect: 'none',
      }),
    },
  };

  const elements = fields.map((field, i) => {
    const key = `${field}.${i}`;

    if (field === 'Module.Args') {
      return <ArgsCard key={key} {...props.argsCard} theme={props.argsCard?.theme ?? theme.name} />;
    }

    if (field === 'Module.Run') {
      return (
        <div key={key} {...styles.fn.base}>
          <div {...styles.fn.label}>{`ƒ(n)`}</div>
          <div>{`🐷 ${field}`}</div>
        </div>
      );
    }

    return null;
  });

  return <div {...css(styles.base, props.style)}>{elements}</div>;
};

/**
 * Helpers
 */
const wrangle = {
  fields(props: t.MainProps) {
    return (props.fields ?? []).filter(Boolean);
  },
} as const;
