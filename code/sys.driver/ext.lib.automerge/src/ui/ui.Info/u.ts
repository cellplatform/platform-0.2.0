import { DEFAULTS, PropList, type t } from './common';
import { Data } from './u.data';
import { Diff } from './u.diff';

export { Data, Diff };

const DEF = DEFAULTS.props;

export const Wrangle = {
  Data,
  Diff,

  ctx(props: t.InfoProps | t.InfoStatefulProps): t.InfoFieldCtx {
    const { repos = {}, theme = DEF.theme, enabled = DEF.enabled } = props;
    const fields = PropList.fields(props.fields);
    const handlers = Wrangle.handlers(props);
    return { repos, handlers, fields, theme, enabled };
  },

  handlers(props: t.InfoProps | t.InfoStatefulProps): t.InfoHandlers {
    const { onVisibleToggle, onDocToggleClick, onBeforeObjectRender } = props;
    return { onVisibleToggle, onDocToggleClick, onBeforeObjectRender };
  },
} as const;
