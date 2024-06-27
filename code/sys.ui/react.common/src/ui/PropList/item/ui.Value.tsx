import { DEFAULTS, css, format, useMouse, type t } from './common';
import { SimpleValue } from './ui.Value.Simple';
import { SwitchValue } from './ui.Value.Switch';
import { useHandler } from './use.Handler';

export type PropListValueProps = {
  item: t.PropListItem;
  hasLabel?: boolean;
  message?: string | JSX.Element;
  defaults: t.PropListDefaults;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  cursor?: t.CSSProperties['cursor'];
};

export const PropListValue: React.FC<PropListValueProps> = (props) => {
  const { hasLabel = true, theme = DEFAULTS.theme } = props;
  const item = format(props.item);
  const value = item.value;

  const mouse = useMouse();
  const handler = useHandler(props.item, item.value.onClick, theme);
  const cursor = props.cursor ?? handler.cursor;

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
      return <SwitchValue value={value} theme={theme} onClick={handler.onClick} />;
    }

    if (message || item.isSimple || item.isComponent) {
      return (
        <SimpleValue
          value={value}
          message={message}
          isOver={mouse.is.over}
          cursor={cursor}
          defaults={props.defaults}
          theme={theme}
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
