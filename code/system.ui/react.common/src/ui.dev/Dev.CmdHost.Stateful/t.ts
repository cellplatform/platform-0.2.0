import { type t } from './common';

export type CmdHostStatefulProps<T = t.SpecModule> = t.CmdHostProps<T> & { mutateUrl?: boolean };
