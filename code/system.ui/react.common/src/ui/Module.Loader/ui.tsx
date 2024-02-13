import { COLORS, DEFAULTS, Flip, css, type t } from './common';
import { Wrangle } from './u.Wrangle';
import { Body } from './ui.Body';

type RenderOutput = JSX.Element | null | false;

export const View: React.FC<t.ModuleLoaderProps> = (props) => {
  const { flipped = DEFAULTS.flipped } = props;
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

  const face = (el?: RenderOutput) => {
    return <Body spinning={is.spinning} spinner={props.spinner} theme={props.theme} element={el} />;
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Flip
        //
        flipped={flipped}
        front={face(props.front?.element)}
        back={face(props.back?.element)}
      />
    </div>
  );
};
