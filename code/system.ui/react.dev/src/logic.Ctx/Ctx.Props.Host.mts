import { t } from './common';

import type { PropArgs } from './common';

export function CtxPropsHost(props: PropArgs) {
  const api: t.SpecCtxHost = {
    backgroundColor(value) {
      props.current().host.backgroundColor = value;
      props.changed();
      return api;
    },
  };
  return api;
}
