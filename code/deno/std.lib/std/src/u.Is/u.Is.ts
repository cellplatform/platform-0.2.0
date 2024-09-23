import type { t } from '../common.ts';
import { Is as RxIs } from '../Observable/rx.Is.ts';

const { observable, subject } = RxIs;

/**
 * Common flag evaluators.
 */
export const Is: t.CommonIsLib = {
  observable,
  subject,
};
