import { type t } from './common';
import { Wrangle as PropListWrangle } from '../PropList/u';

/**
 * Helpers
 */
export const Wrangle = {
  title(props: t.CommonInfoProps) {
    const title = PropListWrangle.title(props.title);
    if (!title.margin && props.card) title.margin = [0, 0, 15, 0];
    console.log('title|||||', title);
    return title;
  },
} as const;
