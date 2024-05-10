import { animationFrameScheduler, throttleTime, type Observable } from 'rxjs';

/**
 * Throttles emissions from the source Observable
 * based on the browser's animation frame.
 */
export function throttleAnimationFrame<T>(): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>) => {
    // Throttle based on the time it typically takes for [requestAnimationFrame]
    // to complete one cycle (1000ms / 60fps = 16.67ms).
    return source.pipe(
      throttleTime(16, animationFrameScheduler, {
        leading: true,
        trailing: true,
      }),
    );
  };
}
