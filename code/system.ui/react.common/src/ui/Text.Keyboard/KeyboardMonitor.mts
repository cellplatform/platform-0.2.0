import { BehaviorSubject } from 'rxjs';

import { DEFAULT, R, t } from './common';
import { Util } from './util.mjs';

type Subscriber = (e: t.KeyboardState) => void;

let _isListening = false;
let _current: t.KeyboardState = R.clone(DEFAULT.STATE);
const $ = new BehaviorSubject<t.KeyboardState>(_current);

/**
 * Global keyboard monitor.
 */
export const KeyboardMonitor = {
  get isSupported() {
    return typeof document === 'object';
  },

  get $() {
    if (!_isListening) KeyboardMonitor.start();
    return $.asObservable();
  },

  get state() {
    if (!_isListening) KeyboardMonitor.start();
    return _current;
  },

  subscribe(fn: Subscriber) {
    KeyboardMonitor.$.subscribe(fn);
  },

  /**
   * Singleton: start listening to the keyboard events.
   * NOTE: Safe to call multiple times, will only ever attach once
   *       to the global keyboard events.
   */
  start() {
    if (!KeyboardMonitor.isSupported) return;
    if (!_isListening) {
      document.addEventListener('keydown', keypressHandler);
      document.addEventListener('keyup', keypressHandler);
      window.addEventListener('blur', blurHandler);
      _isListening = true;
    }
  },

  /**
   * Detach event listeners.
   */
  stop() {
    if (!KeyboardMonitor.isSupported) return;
    if (_isListening) {
      document.removeEventListener('keydown', keypressHandler);
      document.removeEventListener('keyup', keypressHandler);
      window.removeEventListener('blur', blurHandler);
      reset({ hard: true });
      _isListening = false;
    }
  },
};

/**
 * Helpers
 */
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
  if (_isListening) $.next(_current);
}

function change(fn: (state: t.KeyboardState) => void) {
  const state = R.clone(_current);
  fn(state);
  _current = state;
}

function reset(options: { hard?: boolean } = {}) {
  const clone = R.clone(DEFAULT.STATE);
  if (options.hard) {
    _current = clone; // NB: A hard reset 💥. Drop all existing state.
  } else {
    const last = _current.last;
    _current = { ...clone, last }; // NB: Retain the "last" event history item.
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
  if (is.modifier) return;

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
