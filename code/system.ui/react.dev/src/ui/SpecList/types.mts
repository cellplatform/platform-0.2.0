import type { t } from '../../common.t';

type Url = string;

export type SpecListBadge = {
  image: Url;
  href: Url;
};

export type SpecListProps = {
  title?: string;
  version?: string;
  imports?: t.SpecImports;
  filter?: string;
  href?: string;
  hrDepth?: number;
  badge?: t.SpecListBadge;
  style?: t.CssValue;
};
