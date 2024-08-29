import { DEFAULTS, PropList, Value, type t } from './common';
import { Data } from './u.data';
import { Diff } from './u.diff';

export { Data, Diff };

type P = t.InfoProps | t.InfoStatefulProps;
const DEF = DEFAULTS.props;

export const Wrangle = {
  Data,
  Diff,

  ctx(props: P): t.InfoCtx {
    const { repos = {}, theme = DEF.theme, enabled = DEF.enabled } = props;
    const fields = PropList.fields(props.fields);
    const handlers = Wrangle.handlers(props);
    return { repos, handlers, fields, theme, enabled };
  },

  handlers(props: P): t.InfoHandlers {
    return Value.Object.pick<t.InfoHandlers>(
      props,
      'onVisibleToggle',
      'onDocToggleClick',
      'onBeforeObjectRender',
    );
  },
} as const;
