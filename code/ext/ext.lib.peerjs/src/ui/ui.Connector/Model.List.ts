import { State, type t, PatchState } from './common';

type ConnectorList = {
  count: number;
};

export const List = {
  state() {
    const initial: ConnectorList = { count: 0 };
    const model = PatchState.init<ConnectorList>({ initial });
    return model;
  },
} as const;
