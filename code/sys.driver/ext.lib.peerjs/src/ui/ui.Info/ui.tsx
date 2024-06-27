import { DEFAULTS, PropList, type t } from './common';
import { Field } from './field';
import { useRedraw } from './use.Redraw';

/**
 * Component
 */
export const View: React.FC<t.InfoProps> = (props) => {
  const { theme, data = {} } = props;
  const fields = PropList.fields(props.fields, DEFAULTS.fields.default);

  useRedraw(data);

  const items = PropList.builder<t.InfoField>()
    .field('Module', () => Field.module(theme))
    .field('Module.Verify', () => Field.moduleVerify(theme))
    .field('Component', () => Field.component(data.component, theme))
    .field('Peer', () => Field.peer(data.peer, fields, theme))
    .items(fields);

  return (
    <PropList
      title={PropList.Info.title(props)}
      items={items}
      width={PropList.Info.width(props)}
      margin={props.margin}
      theme={theme}
      style={props.style}
    />
  );
};
