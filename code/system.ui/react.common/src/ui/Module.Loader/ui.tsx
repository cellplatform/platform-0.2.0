import { COLORS, DEFAULTS, Flip, css, type t } from './common';
import { Wrangle } from './u.Wrangle';
import { Body } from './ui.Body';

export const View: React.FC<t.ModuleLoaderProps> = (props) => {
  const { front, back, flipped = DEFAULTS.flipped } = props;
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
  };

  const face = (el?: t.RenderOutput) => {
    return (
      <Body
        spinning={is.spinning}
        spinner={props.spinner}
        theme={props.theme}
        element={el}
        onError={props.onError}
        onErrorCleared={props.onErrorCleared}
      />
    );
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Flip
        //
        flipped={flipped}
        front={face(front?.element)}
        back={face(back?.element)}
      />
    </div>
  );
};
