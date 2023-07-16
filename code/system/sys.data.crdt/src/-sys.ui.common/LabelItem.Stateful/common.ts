import { type t } from '../common';
export * from '../common';

const props: t.LabelItemProps = {
  label: '',
};

export const DEFAULTS = {
  useEditController: true,
  props,
  get data(): t.LabelItemData {
    return {};
  },
} as const;
