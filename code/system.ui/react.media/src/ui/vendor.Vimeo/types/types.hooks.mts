import { type t } from '../common';

/**
 * Hook: Icon Controller
 */
export type UseVimeoIconController = (args: UseVimeoIconControllerArgs) => VimeoIconController;
export type UseVimeoIconControllerArgs = {
  instance: t.VimeoInstance;
  isEnabled?: boolean;
};

export type VimeoIconController = {
  isEnabled: boolean;
  current?: t.VimeoIconFlag;
};
