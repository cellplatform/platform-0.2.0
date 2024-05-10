import { filter } from 'rxjs/operators';
import { type t } from './common';

type FilesystemId = string;

/**
 * Event controller.
 */
export function BusControllerChange(args: {
  id: FilesystemId;
  bus: t.EventBus<t.FsBusEvent>;
  events: t.FsBusEvents;
}) {
  const { id, events, bus } = args;

  const fire = (op: t.FsBusChange['op'], files: t.FsBusChange['files']) => {
    const change = { op, files } as t.FsBusChange;
    bus.fire({ type: 'sys.fs/changed', payload: { id, change } });
  };

  const write$ = events.io.write.res$.pipe(filter((e) => !e.error));
  const copy$ = events.io.copy.res$.pipe(filter((e) => !e.error));
  const move$ = events.io.move.res$.pipe(filter((e) => !e.error));
  const delete$ = events.io.delete.res$.pipe(filter((e) => !e.error));

  write$.subscribe((e) => fire('write', e.files));
  copy$.subscribe((e) => fire('copy', e.files));
  move$.subscribe((e) => fire('move', e.files));
  delete$.subscribe((e) => fire('delete', e.files));
}
