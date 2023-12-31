import { DEFAULTS, PropList, type t } from './common';

export const Config: React.FC<t.CanvasConfigProps> = (props) => {
  const { title = 'Configuration' } = props;
  return (
    <PropList.FieldSelector
      style={props.style}
      title={title}
      all={DEFAULTS.behaviors.all}
      defaults={DEFAULTS.behaviors.default}
      selected={props.selected}
      indent={20}
      indexes={false}
      resettable={true}
      onClick={(e) => {
        const { previous, next } = e.as<t.CanvasBehavior>();
        props.onChange?.({ previous, next });
        props.onClick?.(e);
      }}
    />
  );
};
