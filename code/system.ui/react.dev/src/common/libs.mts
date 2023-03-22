export { ErrorBoundary } from 'react-error-boundary';
import { mergeDeepRight, clone, equals } from 'ramda';
export const R = { mergeDeepRight, clone, equals };

/**
 * @system
 */
export { rx, Time, slug, Path, asArray, maybeWait } from 'sys.util';
export { FC, useMouseState } from 'sys.ui.react.util';
export { css, Color } from 'sys.ui.react.css';
export { Test } from 'sys.test.spec';
export { Keyboard } from 'sys.ui.dom';
export { Fuzzy } from 'sys.text';
