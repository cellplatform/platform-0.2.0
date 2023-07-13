import { type t } from '../common';
export * from '../common';

const props: t.LabelItemProps = {
  text: '',
};

export const DEFAULTS = {
  props,
  useController: true,
} as const;
