import { rx } from '../common';

/**
 * In-memory bus connection.
 */
export function ConnectionMock() {
  const a = { bus: rx.bus() };
  const b = { bus: rx.bus() };
  const conn = rx.bus.connect([a.bus, b.bus]);
  const dispose = () => conn.dispose();
  return { a, b, dispose };
}
