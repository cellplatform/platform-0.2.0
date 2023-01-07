import { filter } from 'rxjs/operators';

import { DEFAULT, t } from './common';
import { CtxPropsComponent } from './Ctx.Props.Component.mjs';
import { CtxPropsDebug } from './Ctx.Props.Debug.mjs';
import { CtxPropsHost } from './Ctx.Props.Host.mjs';

import type { PropArgs } from './common.types';

export async function CtxProps(events: t.DevEvents) {
  let _revision = 0;
  let _current = (await events.info.get()).render.props ?? DEFAULT.props;

  const CHANGED: t.DevInfoChangeMessage[] = ['props:write', 'reset'];
  events.props.changed$.pipe(filter((e) => CHANGED.includes(e.message))).subscribe((e) => {
    _current = e.info.render.props ?? DEFAULT.props;
    _revision = 0;
  });

  const propArgs: PropArgs = {
    events,
    current: () => _current,
    changed: () => {
      _revision++;
      events.props.flush.pending(_revision);
    },
  };

  return {
    get current() {
      return _current;
    },
    get pending() {
      return _revision > 0;
    },
    setters: {
      component: CtxPropsComponent(propArgs),
      host: CtxPropsHost(propArgs),
      debug: CtxPropsDebug(propArgs),
    },
  };
}
