import { DEFAULTS, FC, PropList, type t } from './common';
import { Field } from './field';
import { useStateController } from './use.StateController';

/**
 * Component
 */
const View: React.FC<t.InfoProps> = (props) => {
  const { fields = DEFAULTS.fields.default, stateful = DEFAULTS.stateful } = props;
  const { data } = useStateController({
    enabled: stateful,
    data: props.data,
    onStateChange: props.onStateChange,
  });

  const items = PropList.builder<t.InfoField>()
    .field('Module', () => Field.module())
    .field('Module.Verify', () => Field.moduleVerify())
    .field('Projects.List', () => Field.listProjects(data, fields))
    .field('Auth.AccessToken', () => Field.auth.accessToken(data, fields))
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
type Fields = { DEFAULTS: typeof DEFAULTS };
export const Info = FC.decorate<t.InfoProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: DEFAULTS.displayName },
);
