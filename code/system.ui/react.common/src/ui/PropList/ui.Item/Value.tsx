import { useRef, useState } from 'react';
import { format } from '../util.format.mjs';
import { SimpleValue } from './Value.Simple';
import { SwitchValue } from './Value.Switch';
import { DEFAULTS, Time, css, useMouseState, type t } from './common';

export type PropListValueProps = {
  item: t.PropListItem;
  isFirst?: boolean;
  isLast?: boolean;
  defaults: t.PropListDefaults;
  theme?: t.PropListTheme;
  style?: t.CssValue;
};

export const PropListValue: React.FC<PropListValueProps> = (props) => {
  const item = format(props.item);
  const value = item.value;
  const isCopyable = item.isCopyable(props.defaults);
  const cursor = item.value.onClick ? 'pointer' : undefined;

  const mouse = useMouseState();
  const [message, setMessage] = useState<JSX.Element | string>();
  const messageDelay = useRef<t.TimeDelayPromise>();

  const showMessage = (message: JSX.Element | string, delay?: number) => {
    messageDelay.current?.cancel();
    setMessage(message);
    const msecs = delay ?? DEFAULTS.messageDelay;
    messageDelay.current = Time.delay(msecs, () => setMessage(undefined));
  };

  const handleClick = async () => {
    const { clipboard, value } = item;
    let message: JSX.Element | string | undefined;
    let delay: number | undefined;

    value.onClick?.({
      item,
      value,
      message(text, msecs) {
        message = text;
        delay = msecs;
      },
    });

    if (clipboard && isCopyable) {
      const value = typeof clipboard === 'function' ? clipboard() : clipboard;
      await navigator.clipboard.writeText(value ?? '');
      if (!message) {
        const text = (value || '').toString().trim();
        const isHttp = text.startsWith('http://') || text.startsWith('https://');
        message = isHttp ? 'copied url' : 'copied';
      }
    }

    if (message) showMessage(message, delay);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      position: 'relative',
      Flex: 'center-end',
      userSelect: 'none',
      fontWeight: item.value.bold ? 'bold' : undefined,
    }),
  };

  const renderKind = () => {
    const kind = (value as t.PropListValueKinds).kind;

    if (kind === 'Switch') {
      return <SwitchValue value={value} onClick={handleClick} />;
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
          onClick={handleClick}
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
