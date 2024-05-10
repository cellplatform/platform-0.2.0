import type * as t from './-SPEC.t';

import { PropList } from '../PropList';
import { Field } from './-SPEC.field';

const fields = {
  get all(): t.InfoField[] {
    return ['Module', 'Module.Verify', 'Component'];
  },
  get default(): t.InfoField[] {
    return ['Module', 'Module.Verify'];
  },
};
export const DEFAULTS = {
  displayName: 'Info',
  query: { dev: 'dev' },
  fields,
} as const;

/**
 * Component
 */
export const Info: React.FC<t.InfoProps> = (props) => {
  const { theme, data = {} } = props;
  const fields = PropList.Wrangle.fields(props.fields, DEFAULTS.fields.default);

  const items = PropList.builder<t.InfoField>()
    .field('Module', () => Field.module(theme))
    .field('Module.Verify', () => Field.moduleVerify(theme))
    .field('Component', () => Field.component(data.component, theme))
    .items(fields);

  /**
   * Render
   */
  return (
    <PropList
      title={Wrangle.title(props)}
      items={items}
      width={props.width ?? { min: 230 }}
      defaults={{ clipboard: false }}
      theme={theme}
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
