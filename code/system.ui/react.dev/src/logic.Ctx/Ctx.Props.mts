import { filter } from 'rxjs/operators';

import { DEFAULT, t } from './common';
import { CtxComponent } from './Ctx.Props.Component.mjs';

import type { PropArgs } from './common';

export async function CtxProps(events: t.DevEvents) {
  let _revision = 0;
  let _current = (await events.info.get()).render.props ?? DEFAULT.props();

  events.props.changed$.pipe(filter((e) => e.message === 'props:write')).subscribe((e) => {
    _current = e.info.render.props ?? DEFAULT.props();
    _revision = 0;
  });

  const props: PropArgs = {
    current: () => _current,
    changed: () => _revision++,
  };

  const component = CtxComponent(props);

  return {
    get current() {
      return _current;
    },
    get pending() {
      return _revision > 0;
    },
    setters: {
      component,
    },
  };
}
