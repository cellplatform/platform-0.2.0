import { DEFAULTS, FC, FIELDS, Pkg, PropList, type t } from './common';
import { FieldModuleVerify } from './fields/Module.Verify';

/**
 * Component
 */
const View: React.FC<t.InfoProps> = (props) => {
  const { data = {} } = props;
  const fields = PropList.Wrangle.fields(props.fields, DEFAULTS.fields);

  const items = PropList.builder<t.InfoField>()
    .field('Module', { label: 'Module', value: `${Pkg.name}@${Pkg.version}` })
    .field('Module.Verify', () => FieldModuleVerify(data))
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
  title(props: t.InfoProps) {
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
  FIELDS: typeof FIELDS;
};
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS, FIELDS },
  { displayName: 'Concept.Info' },
);
