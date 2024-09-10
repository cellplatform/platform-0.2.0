import { DEFAULTS, PropList, Value, type t } from './common';

type P = t.InfoProps | t.InfoStatefulProps;
const DEF = DEFAULTS.props;

export const Wrangle = {
  ctx(props: P): t.InfoCtx {
    const { theme = DEF.theme, enabled = DEF.enabled, internal } = props;
    const fields = PropList.Wrangle.fields(props.fields, DEF.fields);
    const handlers = Wrangle.handlers(props);
    return { enabled, fields, theme, handlers, internal };
  },

  handlers(props: P): t.InfoPropsHandlers {
    return Value.Object.pick<t.InfoPropsHandlers>(
      props,
      'onVisibleToggle',
      'onDocToggleClick',
      'onBeforeObjectRender',
    );
  },
} as const;
