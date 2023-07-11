/**
 * Common RXJS
 */
export {
  Observable,
  Subject,
  BehaviorSubject,
  of,

  // ref:  https://rxjs.dev/deprecations/to-promise
  firstValueFrom,
  lastValueFrom,
  interval,
  observeOn,
  animationFrameScheduler,
} from 'rxjs';

export {
  debounceTime,
  throttleTime,
  delay,
  distinctUntilChanged,
  filter,
  map,
  take,
  timeout,
  catchError,
  tap,
} from 'rxjs/operators';

/**
 * 💦💦
 *
 *    NOTE: The take-until RXJS operator is exported here
 *    to avoid an error occuring when the module is bundled.
 *
 * 💦
 *
 * Error Condition:
 *
 *    const { dispose$ } from rx.disposable()
 *    takeUtil(dispose$)
 *
 * Will throw (as of Sep 2022):
 *
 *    ERROR: "TypeError: You provided an invalid object where a stream was expected."
 *
 * This is realted to the use of Symbols getting munged somehow during bundling within
 * the check RXJS makes of the observable that is passed into the [takeUtil] function.
 *
 */
export { merge } from 'rxjs';
export { takeUntil } from 'rxjs/operators';
