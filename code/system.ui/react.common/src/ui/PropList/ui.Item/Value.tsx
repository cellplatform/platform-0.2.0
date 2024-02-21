import { format } from '../u.format';
import { useClickHandler as useHandlers } from './Item.useHandlers';
import { SimpleValue } from './Value.Simple';
import { SwitchValue } from './Value.Switch';
import { css, useMouse, type t } from './common';

export type PropListValueProps = {
  item: t.PropListItem;
  hasLabel?: boolean;
  defaults: t.PropListDefaults;
  theme?: t.PropListTheme;
  style?: t.CssValue;
};

export const PropListValue: React.FC<PropListValueProps> = (props) => {
  const { hasLabel = true } = props;
  const item = format(props.item);
  const value = item.value;
  const isCopyable = item.isCopyable(props.defaults);
  const cursor = item.value.onClick ? 'pointer' : undefined;

  const mouse = useMouse();
  const handlers = useHandlers(props);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      userSelect: 'none',
      fontWeight: item.value.bold ? 'bold' : undefined,
      display: 'grid',
      alignContent: 'center',
      justifyContent: hasLabel ? 'end' : undefined,
    }),
  };

  const renderKind = () => {
    const kind = (value as t.PropListValueKinds).kind;

    if (kind === 'Switch') {
      return <SwitchValue value={value} onClick={handlers.onClick} />;
    }

    if (handlers.message || item.isSimple || item.isComponent) {
      return (
        <SimpleValue
          value={value}
          message={handlers.message}
          isOver={mouse.is.over}
          isCopyable={isCopyable}
          cursor={cursor}
          defaults={props.defaults}
          theme={props.theme}
          onClick={handlers.onClick}
        />
      );
    }

    return null;
  };

  return (
    <div {...styles.base} title={item.tooltip} {...mouse.handlers}>
      {renderKind()}
    </div>
  );
};
