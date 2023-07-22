import { type t } from './common';

export type ContainerQueryProps = {
  displayName?: string; // NB: Optional name added as an attribute on the <style> element for debugging.
  style?: t.CssValue;
};
