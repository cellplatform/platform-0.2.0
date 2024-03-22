import { useStateController } from '../ui.Info.State';
import { DEFAULTS, PropList, type t } from './common';
import { Field } from './field';

/**
 * Component
 */
export const View: React.FC<t.InfoProps> = (props) => {
  const { theme, stateful = DEFAULTS.stateful } = props;
  const fields = PropList.Wrangle.fields(props.fields, DEFAULTS.fields.default);
  const { data } = useStateController({
    enabled: stateful,
    data: props.data,
    onStateChange: props.onStateChange,
  });

  const items = PropList.builder<t.InfoField>()
    .field('Module', () => Field.module(theme))
    .field('Module.Verify', () => Field.moduleVerify(theme))
    .field('Projects.List', () => Field.listProjects(data, theme))
    .field('Auth.AccessToken', () => Field.auth.accessToken(data, theme))
    .items(fields);

  return (
    <PropList
      title={wrangle.title(props)}
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
const wrangle = {
  title(props: t.InfoProps) {
    const title = PropList.Wrangle.title(props.title);
    if (!title.margin && props.card) title.margin = [0, 0, 15, 0];
    return title;
  },
};
