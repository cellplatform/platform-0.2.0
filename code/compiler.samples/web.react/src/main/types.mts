import type { Event, EventBus } from 'sys.types';

export { Event, EventBus };
export type { WorkerGlobal } from 'sys.types';

type Id = string;

export type NetworkMessageEvent = {
  type: 'Network/message';
  payload: NetworkMessage;
};
export type NetworkMessage = {
  tx: Id;
  sender: Id;
  target?: Id;
  event: Event;
};
