import { DEFAULTS, FC, PropList, type t } from './common';
import { Field } from './field';
import { useRedraw } from './use.Redraw';

export type InfoProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: t.InfoField[];
  data?: t.InfoData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  flipped?: boolean;
  style?: t.CssValue;
};

/**
 * Component
 */
const View: React.FC<InfoProps> = (props) => {
  const { fields = DEFAULTS.fields.default, data = {} } = props;

  useRedraw(data);

  const items = PropList.builder<t.InfoField>()
    .field('Module', () => Field.module())
    .field('Module.Verify', () => Field.moduleVerify())
    .field('Component', () => Field.component(data.component))
    .field('Peer', () => Field.peer(data.peer, fields))
    .items(fields);

  return (
    <PropList
      title={Wrangle.title(props)}
      items={items}
      width={props.width ?? { min: 230 }}
      defaults={{ clipboard: false }}
      card={props.card}
      flipped={props.flipped}
      padding={props.card ? [20, 25, 30, 25] : undefined}
      margin={props.margin}
      style={props.style}
    />
  );
};

/**
 * Helpers
 */
const Wrangle = {
  title(props: InfoProps) {
    const title = PropList.Wrangle.title(props.title);
    if (!title.margin && props.card) title.margin = [0, 0, 15, 0];
    return title;
  },
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Field: typeof Field;
};
export const Info = FC.decorate<InfoProps, Fields>(
  View,
  { DEFAULTS, Field },
  { displayName: 'Info' },
);
