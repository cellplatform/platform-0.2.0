type Url = string;

export type SpecListBadge = {
  image: Url;
  href: Url;
};

export type SpecListChildVisibilityHandler = (e: SpecListChildVisibilityHandlerArgs) => void;
export type SpecListChildVisibilityHandlerArgs = { items: SpecListChildVisibility[] };
export type SpecListChildVisibility = {
  index: number;
  isIntersecting: boolean;
};
