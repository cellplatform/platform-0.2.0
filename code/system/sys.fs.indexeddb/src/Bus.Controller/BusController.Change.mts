import { filter } from 'rxjs/operators';
import { t } from './common.mjs';

type FilesystemId = string;

/**
 * Event controller.
 */
export function BusControllerChange(args: {
  id: FilesystemId;
  fs: t.FsDriverLocal;
  bus: t.EventBus<t.SysFsEvent>;
  events: t.SysFsEvents;
}) {
  const { id, events, bus } = args;

  const fire = (op: t.SysFsChange['op'], files: t.SysFsChange['files']) => {
    const change = { op, files } as t.SysFsChange;
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
