import { Is } from '../Is';

export async function maybeWait<T>(value: T | Promise<T>) {
  if (Is.promise(value)) await value;
  return value;
}

export const Promise = {
  maybeWait,
  isPromise: Is.promise,
};
