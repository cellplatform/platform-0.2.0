import { t, css, Color } from '../../common';

export type IconProps = { size: number; color?: string };
export type IconComponent = React.FC<IconProps>;

export type IconViewProps = t.IconProps & {
  type: IconComponent;
  tabIndex?: number;
};

export const IconView: React.FC<IconViewProps> = (props) => {
  const { size = 24, opacity, offset } = props;
  const Component = props.type;

  const styles = {
    base: css({
      display: 'inline-block',
      overflow: 'hidden',
      opacity: opacity === undefined ? 1 : opacity,
      Size: size,
      transform: offset ? `translate(${offset[0]}px, ${offset[1]}px)` : undefined,
    }),
  };

  return (
    <div
      {...css(styles.base, props.style)}
      tabIndex={props.tabIndex}
      title={props.tooltip}
      onClick={props.onClick}
      onDoubleClick={props.onDoubleClick}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      <Component size={size} color={formatColor(props)} />
    </div>
  );
};

/**
 * Helpers
 */
function formatColor(props: IconViewProps) {
  return props.color ? Color.format(props.color) : undefined;
}
