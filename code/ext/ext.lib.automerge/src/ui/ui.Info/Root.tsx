import { DEFAULTS, FC, PropList, type t } from './common';
import { InfoField } from './field';

/**
 * Component
 */
const View: React.FC<t.InfoProps> = (props) => {
  const { fields = DEFAULTS.fields.default, data = {} } = props;

  const items = PropList.builder<t.InfoField>()
    .field('Module', () => InfoField.module())
    .field('Module.Verify', () => InfoField.moduleVerify())
    .field('Repo', () => InfoField.repo(data.repo))
    .field('Component', () => InfoField.component(data.component))
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
  Field: typeof InfoField;
};
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS, Field: InfoField },
  { displayName: 'Info' },
);
