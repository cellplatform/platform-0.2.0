import { DEFAULTS, FC, PropList, type t } from './common';
import { Field } from './field';

/**
 * Component
 */
const View: React.FC<t.InfoProps> = (props) => {
  const { theme, data = {} } = props;
  const fields = PropList.fields(props.fields, DEFAULTS.fields.default);

  const items = PropList.builder<t.InfoField>()
    .field('Module', () => Field.module(theme))
    .field('Module.Verify', () => Field.moduleVerify(theme))
    .field('Component', () => Field.component(data.component, theme))
    .items(fields);

  return (
    <PropList
      title={PropList.Info.title(props)}
      items={items}
      width={PropList.Info.width(props)}
      theme={theme}
      margin={props.margin}
      style={props.style}
    />
  );
};

/**
 * Export
 */
type Fields = { DEFAULTS: typeof DEFAULTS };
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: DEFAULTS.displayName },
);
