import { Button, COLORS, Color, DEFAULTS, Icons, css, type t } from './common';

export type ConfigButtonProps = {
  config?: Partial<t.PeerInputConfigButton>;
  style?: t.CssValue;
  onClick?: t.PeerInputConfigClickHandler;
};

export const ConfigButton: React.FC<ConfigButtonProps> = (props) => {
  const config = { ...DEFAULTS.config, ...props.config };
  if (!config.visible) return null;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      PaddingX: 4,
      display: 'grid',
      placeItems: 'center',
    }),
    inner: css({
      PaddingX: 4,
      PaddingY: 1,
      borderRadius: 4,
      backgroundColor: Color.alpha(COLORS.DARK, config.selected ? 0.08 : 0),
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Button onClick={() => props.onClick?.({ config })}>
        <div {...styles.inner}>
          <Icons.Config size={18} offset={[0, 1]} />
        </div>
      </Button>
    </div>
  );
};
