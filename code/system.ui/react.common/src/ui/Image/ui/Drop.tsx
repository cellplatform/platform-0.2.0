import { Util } from '../Util.mjs';
import { COLORS, css, type t } from '../common';
import { DropMessage } from './Drop.Message';

export type DropProps = {
  settings?: t.ImageDropSettings;
  style?: t.CssValue;
};

export const Drop: React.FC<DropProps> = (props) => {
  const { settings } = props;
  const blur = Util.dropOverBlur(settings);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
      backdropFilter: `blur(${blur}px)`,
      pointerEvents: 'none',
      color: COLORS.DARK,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      {settings?.overContent ?? <DropMessage settings={settings} />}
    </div>
  );
};
