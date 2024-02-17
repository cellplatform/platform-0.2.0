import { COLORS, css, type t } from './common';
import { Wrangle } from './u.Wrangle';
import { Body } from './ui.Body';

export const View: React.FC<t.ModuleLoaderProps> = (props) => {
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

  return (
    <div {...css(styles.base, props.style)}>
      <Body
        spinning={is.spinning}
        spinner={props.spinner}
        theme={props.theme}
        element={props.element}
        onError={props.onError}
        onErrorCleared={props.onErrorCleared}
      />
    </div>
  );
};
