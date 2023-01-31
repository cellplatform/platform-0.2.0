import { DEFAULTS, R, rx, t } from './common';
import { Match } from './Match.mjs';
import { Util } from './util.mjs';

export type KeyMatchSubscriberHandler = (e: KeyMatchSubscriberHandlerArgs) => void;
export type KeyMatchSubscriberHandlerArgs = {
  state: t.KeyboardStateCurrent;
  event: t.KeyboardKeypress;
  cancel(): void;
};

let _isListening = false;
let _state: t.KeyboardState = R.clone(DEFAULTS.state);
const { dispose, dispose$ } = rx.disposable();
const $ = new rx.BehaviorSubject<t.KeyboardState>(_state);

/**
 * Global keyboard monitor.
 */
export const KeyboardMonitor = {
  get isSupported() {
    return typeof window === 'object';
  },

  get isListening() {
    return _isListening;
  },

  get $() {
    ensureStarted();
    return $.asObservable();
  },

  get state() {
    ensureStarted();
    return _state;
  },

  subscribe(fn: (e: t.KeyboardState) => void) {
    if (KeyboardMonitor.isSupported) return;
    ensureStarted();
    const disposable = rx.disposable();
    $.pipe(rx.takeUntil(dispose$), rx.takeUntil(disposable.dispose$)).subscribe(fn);
    return {
      dispose: disposable.dispose,
    };
  },

  on(pattern: t.KeyPattern, fn: KeyMatchSubscriberHandler) {
    const disposable = rx.disposable();
    const res = {
      pattern,
      dispose$: disposable.dispose$,
      dispose: disposable.dispose,
    };

    if (KeyboardMonitor.isSupported) return res;

    ensureStarted();
    const matcher = Match.pattern(pattern);

    $.pipe(
      rx.takeUntil(dispose$),
      rx.takeUntil(disposable.dispose$),
      rx.filter((e) => Boolean(e.last)),
      rx.filter((e) => e.current.pressed.length > 0),
    ).subscribe((e) => {
      const pressed = e.current.pressed.map(({ key }) => key);
      const modifiers = e.current.modifiers;

      if (matcher.isMatch(pressed, modifiers)) {
        fn({
          state: e.current,
          event: e.last!,
          cancel: () => e.last!.cancel(),
        });
      }
    });

    return res;
  },

  /**
   * Singleton: start listening to the keyboard events.
   * NOTE: Safe to call multiple times, will only ever attach once
   *       to the global keyboard events.
   */
  start() {
    if (KeyboardMonitor.isSupported) return;
    if (!_isListening) {
      window.addEventListener('keydown', keypressHandler);
      window.addEventListener('keyup', keypressHandler);
      window.addEventListener('blur', blurHandler);
      _isListening = true;
    }
  },

  /**
   * Detach event listeners.
   */
  stop() {
    if (KeyboardMonitor.isSupported) return;
    if (_isListening) {
      window.removeEventListener('keydown', keypressHandler);
      window.removeEventListener('keyup', keypressHandler);
      window.removeEventListener('blur', blurHandler);
      reset({ hard: true });
      dispose();
      _isListening = false;
    }
  },
};

/**
 * Helpers
 */

function ensureStarted() {
  if (KeyboardMonitor.isSupported) return;
  if (!_isListening) KeyboardMonitor.start();
}

function blurHandler() {
  reset();
}

function keypressHandler(event: KeyboardEvent) {
  if (!_isListening) return;

  const e = Util.toKeypress(event);
  updateModifierKeys(e);
  updatePressedKeys(e);

  change((state) => (state.last = e));
  fireNext();
}

function fireNext() {
  if (_isListening) $.next(_state);
}

function change(fn: (state: t.KeyboardState) => void) {
  const state = R.clone(_state);
  fn(state);
  _state = state;
}

function reset(options: { hard?: boolean } = {}) {
  const clone = R.clone(DEFAULTS.state);
  if (options.hard) {
    _state = clone; // NB: A hard reset 💥. Drop all existing state.
  } else {
    const last = _state.last;
    _state = { ...clone, last }; // NB: Retain the "last" event history item.
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
    const hasModifiers = Object.values(_state.current.modifiers).some((v) => Boolean(v));
    if (!hasModifiers) {
      // NB: The last modifier-key has been released, clear any down keys.
      //     These pressed keys will not have been reporting their "on keyup" updates while the modifier-keys are in use.
      reset();
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
