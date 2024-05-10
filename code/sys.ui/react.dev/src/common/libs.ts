export { ErrorBoundary } from 'react-error-boundary';
import { mergeDeepRight, clone, equals, prop, sortBy } from 'ramda';
export const R = { mergeDeepRight, clone, equals, prop, sortBy } as const;

/**
 * @system
 */
export { rx, Time, slug, Path, asArray, maybeWait } from 'sys.util';
export { FC, useMouse } from 'sys.ui.react.util';
export { css, Color } from 'sys.ui.react.css';
export { Test } from 'sys.test.spec';
export { Keyboard } from 'sys.ui.dom';
export { Fuzzy } from 'sys.data.text';
