import { Match } from './Match';
import { DEFAULTS, R, rx, type t } from './common';
import { Util } from './u';

const singleton = {
  isListening: false,
  state: R.clone<t.KeyboardState>(DEFAULTS.state),
};
const { dispose, dispose$ } = rx.disposable();
const singleton$ = new rx.BehaviorSubject<t.KeyboardState>(singleton.state);

/**
 * Global keyboard monitor.
 */
export const KeyboardMonitor: t.KeyboardMonitor = {
  is: {
    get supported() {
      return typeof document === 'object';
    },
    get listening() {
      return singleton.isListening;
    },
  },

  get $() {
    ensureStarted();
    return singleton$.asObservable();
  },

  get state() {
    ensureStarted();
    return singleton.state;
  },

  subscribe(fn: (e: t.KeyboardState) => void) {
    const disposable = rx.disposable();
    if (KeyboardMonitor.is.supported) {
      const $ = KeyboardMonitor.$.pipe(rx.takeUntil(dispose$), rx.takeUntil(disposable.dispose$));
      $.subscribe(fn);
    }
    return disposable;
  },

  on(...args: any[]) {
    if (typeof args[0] === 'object') {
      const disposable = rx.disposable();
      const { dispose$ } = disposable;
      const patterns = args[0] as t.KeyMatchPatterns;
      Object.entries(patterns).forEach(([pattern, fn]) => on(pattern, fn, { dispose$ }));
      return disposable;
    }

    if (typeof args[0] === 'string' && typeof args[1] === 'function') {
      return on(args[0], args[1]);
    }

    throw new Error('Input paramters for [Keyboard.on] not matched.');
  },

  /**
   * Singleton: start listening to the keyboard events.
   * NOTE: Safe to call multiple times, will only ever attach once
   *       to the global keyboard events.
   */
  start() {
    if (!KeyboardMonitor.is.supported) return KeyboardMonitor;
    if (!singleton.isListening) {
      document.addEventListener('keydown', keypressHandler);
      document.addEventListener('keyup', keypressHandler);
      window.addEventListener('blur', blurHandler);
      singleton.isListening = true;
    }
    return KeyboardMonitor;
  },

  /**
   * Detach event listeners.
   */
  stop() {
    if (!KeyboardMonitor.is.supported) return;
    if (singleton.isListening) {
      document.removeEventListener('keydown', keypressHandler);
      document.removeEventListener('keyup', keypressHandler);
      window.removeEventListener('blur', blurHandler);
      reset({ hard: true });
      dispose();
      singleton.isListening = false;
    }
  },
};

/**
 * Helpers
 */

function ensureStarted() {
  if (!KeyboardMonitor.is.supported) return;
  if (!singleton.isListening) KeyboardMonitor.start();
}

function blurHandler() {
  reset();
}

function keypressHandler(event: KeyboardEvent) {
  if (!singleton.isListening) return;

  const e = Util.toKeypress(event);
  updateModifierKeys(e);
  updatePressedKeys(e);

  change((state) => (state.last = e));
  fireNext(e);
}

function fireNext(e?: t.KeyboardKeypress) {
  if (singleton.isListening) singleton$.next(singleton.state);
}

function change(fn: (state: t.KeyboardState) => void) {
  const next = R.clone(singleton.state);
  fn(next);
  singleton.state = next;
}

function reset(options: { hard?: boolean } = {}) {
  const clone = R.clone(DEFAULTS.state);
  if (options.hard) {
    singleton.state = clone; // NB: A hard reset 💥. Drop all existing state.
  } else {
    const last = singleton.state.last;
    singleton.state = { ...clone, last }; // NB: Retain the "last" event history item.
  }
  fireNext();
}

/**
 * State update modifiers.
 */
function updateModifierKeys(e: t.KeyboardKeypress) {
  const code = e.keypress.code;

  const update = (
    target: t.KeyboardModifierKeys,
    targetField: keyof t.KeyboardModifierKeys,
    match: string,
  ) => {
    if (!(code === `${match}Left` || code === `${match}Right`)) return;

    let values = target[targetField] as string[];
    const isLeft = code.endsWith('Left');
    const isRight = code.endsWith('Right');

    if (e.is.down) {
      if (isLeft) values.push('Left');
      if (isRight) values.push('Right');
    } else {
      if (isLeft) values = values.filter((m) => !m.endsWith('Left'));
      if (isRight) values = values.filter((m) => !m.endsWith('Right'));
    }

    values = R.uniq(values);
    target[targetField] = (values.length === 0 ? [] : values) as t.KeyboardModifierEdges;
  };

  change((state) => {
    const modifiers = state.current.modifierKeys;
    update(modifiers, 'shift', 'Shift');
    update(modifiers, 'ctrl', 'Control');
    update(modifiers, 'alt', 'Alt');
    update(modifiers, 'meta', 'Meta');
    state.current.modified = Object.values(modifiers).some((v) => Boolean(v));
    state.current.modifiers = Util.toModifierFlags(modifiers);
  });
}

function updatePressedKeys(e: t.KeyboardKeypress) {
  const { keypress, is } = e;
  const { code } = keypress;

  if (is.modifier && is.down) return;
  if (is.modifier && is.up) {
    const hasModifiers = Object.values(singleton.state.current.modifiers).some((v) => Boolean(v));
    if (!hasModifiers) {
      // NB: The last modifier-key has been released, clear any down keys.
      //     These pressed keys will not have been reporting their "on keyup" updates while the modifier-keys are in use.
      reset({ hard: true });
    }
    return;
  }

  change((state) => {
    const next = state.current;
    if (is.down) {
      const key = Util.toStateKey(e);
      const index = next.pressed.findIndex((item) => item.code === code);
      if (index < 0) next.pressed.push(key);
      if (index >= 0) next.pressed[index] = key;
    } else {
      next.pressed = next.pressed.filter((k) => k.code !== code);
    }
  });
}

function on(
  pattern: t.KeyPattern,
  fn: t.KeyMatchSubscriberHandler,
  options: { dispose$?: t.Observable<any> } = {},
) {
  const disposable = rx.disposable(options.dispose$);
  if (!KeyboardMonitor.is.supported) return disposable;

  ensureStarted();
  const matcher = Match.pattern(pattern);

  singleton$
    .pipe(
      rx.takeUntil(dispose$),
      rx.takeUntil(disposable.dispose$),
      rx.filter((e) => Boolean(e.last)),
      rx.filter((e) => !Boolean(e.last?.is.handled)),
      rx.filter((e) => e.current.pressed.length > 0),
    )
    .subscribe((e) => {
      const pressed = e.current.pressed.map((e) => e.code);
      const modifiers = e.current.modifiers;

      if (matcher.isMatch(pressed, modifiers)) {
        const event = e.last!;
        fn({
          pattern,
          state: e.current,
          event,
          handled: () => event?.handled(),
        });
      }
    });

  return disposable;
}
