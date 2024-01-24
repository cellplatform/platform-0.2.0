import { DEFAULTS, Model, type t } from './common';

export const Is = {
  list(input: any): input is t.ConnectorListState {
    return Model.Is.type(input, DEFAULTS.typename.list);
  },

  self(input: any): input is t.ConnectorItemState {
    return Model.Is.type(input, DEFAULTS.typename.self);
  },

  remote(input: any): input is t.ConnectorItemState {
    return Model.Is.type(input, DEFAULTS.typename.remote);
  },
} as const;
