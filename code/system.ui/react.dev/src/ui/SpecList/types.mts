type Url = string;
type Percent = number; // 0..1

export type SpecListBadge = {
  image: Url;
  href: Url;
};

export type SpecListScrollTarget = {
  index: number;
};

export type SpecListChildVisibilityHandler = (e: SpecListChildVisibilityHandlerArgs) => void;
export type SpecListChildVisibilityHandlerArgs = { items: SpecListChildVisibility[] };
export type SpecListChildVisibility = {
  index: number;
  isOnScreen: boolean;
  threshold: Percent | [Percent, Percent, Percent, Percent];
};
