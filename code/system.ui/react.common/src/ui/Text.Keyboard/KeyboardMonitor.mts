import { BehaviorSubject } from 'rxjs';

import { DEFAULT, R, t } from './common';
import { Util } from './util.mjs';

let _isListening = false;
let _current: t.KeyboardState = R.clone(DEFAULT.STATE);
const $ = new BehaviorSubject<t.KeyboardState>(_current);

/**
 * Global keyboard monitor.
 */
export const KeyboardMonitor = {
  get $() {
    if (!_isListening) KeyboardMonitor.start();
    return $.asObservable();
  },

  get current() {
    if (!_isListening) KeyboardMonitor.start();
    return _current;
  },

  subscribe(fn: (e: t.KeyboardState) => void) {
    KeyboardMonitor.$.subscribe(fn);
  },

  /**
   * Singleton: start listening to the keyboard events.
   * NOTE: Safe to call multiple times, will only ever attach once
   *       to the global keyboard events.
   */
  start() {
    if (typeof document !== 'object') return;
    if (!_isListening) {
      document.addEventListener('keydown', keyHandler);
      document.addEventListener('keyup', keyHandler);
      window.addEventListener('blur', blurHandler);
      _isListening = true;
    }
  },

  /**
   * Detach event listeners.
   */
  stop() {
    if (typeof document !== 'object') return;
    if (_isListening) {
      document.removeEventListener('keydown', keyHandler);
      document.removeEventListener('keyup', keyHandler);
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

function keyHandler(event: KeyboardEvent) {
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
    // NB: Hard reset, drop everything.
    _current = clone;
  } else {
    // NB: Retain the "last" event history item.
    _current = { ...clone, last: _current.last };
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
