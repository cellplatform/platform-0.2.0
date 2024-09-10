import { DEFAULTS, PropList, type t } from './common';

type P = t.InfoProps;
const DEF = DEFAULTS.props;

export const Wrangle = {
  ctx(props: P): t.InfoCtx {
    const { theme = DEF.theme, enabled = DEF.enabled } = props;
    const fields = PropList.fields(props.fields);
    return { fields, theme, enabled };
  },
} as const;
