export { ErrorBoundary } from 'react-error-boundary';
import { clone, equals, mergeDeepRight, prop, sortBy } from 'ramda';
export const R = { mergeDeepRight, clone, equals, prop, sortBy } as const;

/**
 * @system
 */
export { Fuzzy } from 'sys.data.text';
export { Test } from 'sys.test.spec';
export { Keyboard } from 'sys.ui.dom';
export { Color, css } from 'sys.ui.react.css';
export { FC, useMouse } from 'sys.ui.react.util';
export { Path, Time, asArray, maybeWait, rx, slug } from 'sys.util';
