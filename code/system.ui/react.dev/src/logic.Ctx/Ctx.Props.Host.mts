import { t } from './common';

import type { PropArgs } from './common.types';

export function CtxPropsHost(props: PropArgs) {
  const api: t.DevCtxHost = {
    backgroundColor(value) {
      props.current().host.backgroundColor = value;
      props.changed();
      return api;
    },
  };
  return api;
}
