import { RemoteModel } from './Model.Remote';
import { SelfModel } from './Model.Self';

export const Model = {
  Self: SelfModel,
  Remote: RemoteModel,
} as const;
