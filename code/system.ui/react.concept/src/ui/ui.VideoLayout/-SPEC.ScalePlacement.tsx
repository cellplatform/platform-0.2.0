import { DEFAULTS, EdgePosition, Slider, css, type t } from './common';

export type ScalePlacementChangeHandler = (e: ScalePlacementChangeHandlerArgs) => void;
export type ScalePlacementChangeHandlerArgs = {
  position: t.EdgePosition;
  percent: t.Percent;
};

export type ScalePlacementProps = {
  percent?: t.Percent;
  position?: t.PositionInput;
  style?: t.CssValue;
  onChange?: ScalePlacementChangeHandler;
};

/**
 * TODO 🐷
 * - extract as primary UI concept.
 */
export const ScalePlacement: React.FC<ScalePlacementProps> = (props) => {
  const width = 100;

  const fireChange = (percent?: t.Percent, position?: t.Position) => {
    props.onChange?.({
      position: position ?? EdgePosition.toPosition(props.position, DEFAULTS.position),
      percent: percent ?? props.percent ?? 0,
    });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      width,
      display: 'grid',
      gridTemplateRows: 'auto auto',
      rowGap: '10px',
    }),
    slider: css({ display: 'grid', placeItems: 'center' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <EdgePosition.Selector
        size={width}
        selected={props.position}
        onChange={(e) => fireChange(props.percent, e.position)}
      />

      <div {...styles.slider}>
        <Slider
          percent={props.percent}
          width={width - 20}
          thumb={{ size: 15 }}
          track={{ height: 15 }}
          onChange={(e) => fireChange(e.percent, undefined)}
        />
      </div>
    </div>
  );
};
