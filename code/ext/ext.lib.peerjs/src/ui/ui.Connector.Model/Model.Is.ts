import { DEFAULTS, Model, type t } from './common';

export const Is = {
  list(input: any): input is t.ConnectorListState {
    return Model.Is.type(input, DEFAULTS.type.list);
  },

  self(input: any): input is t.ConnectorItemState {
    return Model.Is.type(input, DEFAULTS.type.self);
  },

  remote(input: any): input is t.ConnectorItemState {
    return Model.Is.type(input, DEFAULTS.type.remote);
  },
} as const;
