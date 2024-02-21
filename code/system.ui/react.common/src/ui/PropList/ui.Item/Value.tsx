import { format } from '../u.format';
import { SimpleValue } from './Value.Simple';
import { SwitchValue } from './Value.Switch';
import { css, useMouse, type t } from './common';
import { useHandler } from './use.Handler';

export type PropListValueProps = {
  item: t.PropListItem;
  hasLabel?: boolean;
  message?: string | JSX.Element;
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
  const handler = useHandler(props, item.value.onClick);

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
    const message = props.message ?? handler.message;

    if (kind === 'Switch') {
      return <SwitchValue value={value} onClick={handler.onClick} />;
    }

    if (message || item.isSimple || item.isComponent) {
      return (
        <SimpleValue
          value={value}
          message={message}
          isOver={mouse.is.over}
          isCopyable={isCopyable}
          cursor={cursor}
          defaults={props.defaults}
          theme={props.theme}
          onClick={handler.onClick}
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
