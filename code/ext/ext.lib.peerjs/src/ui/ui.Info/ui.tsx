import { DEFAULTS, PropList, type t } from './common';
import { Field } from './field';
import { useRedraw } from './use.Redraw';

/**
 * Component
 */
export const View: React.FC<t.InfoProps> = (props) => {
  const { theme, data = {} } = props;
  const fields = PropList.Wrangle.fields(props.fields, DEFAULTS.fields.default);

  useRedraw(data);

  const items = PropList.builder<t.InfoField>()
    .field('Module', () => Field.module(theme))
    .field('Module.Verify', () => Field.moduleVerify(theme))
    .field('Component', () => Field.component(data.component, theme))
    .field('Peer', () => Field.peer(data.peer, fields, theme))
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
      theme={theme}
      style={props.style}
    />
  );
};

/**
 * Helpers
 */
const Wrangle = {
  title(props: t.InfoProps) {
    const title = PropList.Wrangle.title(props.title);
    if (!title.margin && props.card) title.margin = [0, 0, 15, 0];
    return title;
  },
};
