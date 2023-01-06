import { DEFAULT, t } from './common';

import type { PropArgs } from './common.types';

export function CtxPropsHost(props: PropArgs) {
  const HOST = DEFAULT.props.host;

  const api: t.DevCtxHost = {
    backgroundColor(value) {
      if (value === null) value = HOST.backgroundColor!;
      props.current().host.backgroundColor = value;
      props.changed();
      return api;
    },
  };
  return api;
}
