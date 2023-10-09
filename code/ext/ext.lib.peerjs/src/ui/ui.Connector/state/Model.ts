import { SelfModel, type SelfModelOptions } from './Model.Self';
import { RemoteModel, type RemoteModelOptions } from './Model.Remote';

export const Model = {
  self(options?: SelfModelOptions) {
    return SelfModel.state(options);
  },

  remote(options?: RemoteModelOptions) {
    return RemoteModel.state(options);
  },
} as const;
