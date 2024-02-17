import { COLORS, Color, CommandBar, DEFAULTS, Flip, css, type t } from './common';
import { Wrangle } from './u.Wrangle';

export const View: React.FC<t.ModuleNamespaceProps> = (props) => {
  const { flipped = false } = props;
  const command: t.ModuleNamespaceCommandbarProps = { ...DEFAULTS.command, ...props.commandbar };
  const is = Wrangle.is(props);

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      color: is.dark ? COLORS.WHITE : COLORS.BLACK,
    }),
    body: css({ display: 'grid', gridTemplateRows: '1fr auto' }),
    main: css({ display: 'grid', placeItems: 'center' }),
    commandbar: css({
      display: command.visible ? 'block' : 'none',
      borderTop: `solid 1px ${Color.alpha(COLORS.WHITE, is.dark ? 0.1 : 0)}`,
    }),
  };

  const elBody = (
    <div {...styles.body}>
      <div {...styles.main}>{`🐷 ${DEFAULTS.displayName}`}</div>
      <div {...styles.commandbar}>
        <CommandBar />
      </div>
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <Flip flipped={flipped} front={elBody} />
    </div>
  );
};
