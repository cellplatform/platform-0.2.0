import { css, FC, type t } from './common';
import { PropList } from '../PropList';

export type EventPropsProps = {
  event?: t.KeyboardKeypress;
  style?: t.CssValue;
};

const View: React.FC<EventPropsProps> = (props) => {
  if (!props.event) return null;

  const { event } = props;
  const { keypress, is } = event;

  /**
   * [Render]
   */
  const styles = {
    base: css({ minWidth: EventProps.minWidth }),
    object: css({ marginTop: 30 }),
  };

  const title = 'Last Keypress';
  const items: t.PropListItem[] = [];

  type K = keyof t.KeyboardKeypressProps;
  const addFromKey = (key: K) => {
    const value = keypress[key];
    items.push({ label: key, value: { data: value } });
  };

  const add = (label: string, value: t.PropListItem['value']) => {
    items.push({ label, value });
  };

  const SHOW: K[] = ['key', 'code', 'repeat'];
  SHOW.forEach(addFromKey);
  add('lifecycle', is.down ? 'down' : 'down ➔ up');

  return (
    <div {...css(styles.base, props.style)}>
      <PropList title={title} items={items} />
    </div>
  );
};

/**
 * Export
 */
type Fields = { minWidth: number };
export const EventProps = FC.decorate<EventPropsProps, Fields>(
  View,
  { minWidth: 150 },
  { displayName: 'EventProps' },
);

export default EventProps;
