import type { Event } from 'sys.types';
export type { WorkerGlobalScope } from 'sys.types';

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
