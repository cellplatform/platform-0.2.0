import { Wrangle } from './Wrangle.mjs';
import { Button, DEFAULTS, Icons, Slider, css, type t } from './common';

export const PropEditor: React.FC<t.SplitLayoutEditorProps> = (props) => {
  const {
    axis = DEFAULTS.axis,
    split = DEFAULTS.split,
    splitMin,
    splitMax,
    enabled = true,
    showAxis = true,
    title,
  } = props;

  const clampPercent = (value?: t.Percent) => Wrangle.percent(value, splitMin, splitMax);

  /**
   * Handlers
   */
  const toggleAxis = () => {
    props.onChange?.({
      split,
      axis: axis === 'x' ? 'y' : 'x', // ← toggle.
    });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      userSelect: 'none',
    }),
    body: css({
      display: 'grid',
      gridTemplateColumns: showAxis ? '1fr auto' : '',
      columnGap: '5px',
    }),
    slider: css({ display: 'grid', alignContent: 'center' }),
    button: css({ display: 'grid', alignItems: 'center' }),
    icon: css({ transform: `rotate(${axis === 'x' ? 0 : -90}deg)` }),
    title: css({ fontSize: 12, marginBottom: 10 }),
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
        percent={clampPercent(props.split)}
        enabled={enabled}
        thumb={{ size: 15 }}
        track={{ height: 10 }}
        ticks={{ items: [splitMin, splitMax].filter(Boolean) }}
        onChange={(e) => props.onChange?.({ axis, split: clampPercent(e.percent) })}
      />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {title && <div {...styles.title}>{title}</div>}
      <div {...styles.body}>
        {elSlider}
        {elAxis}
      </div>
    </div>
  );
};
