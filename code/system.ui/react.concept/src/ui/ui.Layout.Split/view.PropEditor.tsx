import { Wrangle } from './Wrangle.mjs';
import { Button, DEFAULTS, Icons, Slider, css, type t } from './common';

export const PropEditor: React.FC<t.SplitLayoutEditorProps> = (props) => {
  const { axis = DEFAULTS.axis, split = DEFAULTS.split, enabled = true, showAxis = true } = props;

  /**
   * Handlers
   */
  const toggleAxis = () => {
    props.onChange?.({
      split,
      axis: axis === 'x' ? 'y' : 'x',
    });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: showAxis ? 'auto 1fr' : '',
      columnGap: '5px',
    }),
    slider: css({ display: 'grid', alignContent: 'center' }),
    button: css({ display: 'grid', alignItems: 'center' }),
    icon: css({ transform: `rotate(${axis === 'x' ? 0 : -90}deg)` }),
  };

  const elAxis = showAxis && (
    <Button onClick={toggleAxis} isEnabled={enabled}>
      <div {...styles.button}>
        <Icons.Align.Center size={20} style={styles.icon} />
      </div>
    </Button>
  );

  const elSlider = (
    <div {...styles.slider}>
      <Slider
        enabled={enabled}
        percent={split}
        thumb={{ size: 16 }}
        track={{ height: 16 }}
        onChange={(e) => {
          const split = Wrangle.percent({ ...props, split: e.percent });
          props.onChange?.({ axis, split });
        }}
      />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elAxis}
      {elSlider}
    </div>
  );
};
