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
  const title = PropList.Wrangle.title(props.title);

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
      title={title}
      items={items}
      width={props.width ?? { min: 230 }}
      defaults={{ clipboard: false }}
      theme={theme}
      margin={props.margin}
      style={props.style}
    />
  );
};
