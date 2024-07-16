import { Pkg } from '../index.pkg';
const ns = Pkg.name;

export const Typenames = {
  RepoList: {
    List: 'RepoList.List',
    Item: 'RepoList.Item',
  },
} as const;

export const Symbols = {
  kind: Symbol(`${ns}.kind`),
  Lens: Symbol(`${ns}.Lens`),
  Namespace: Symbol(`${ns}.Namespace`),
  Doc: Symbol(`${ns}.Doc`),
  Store: Symbol(`${ns}.Store`),
  StoreIndex: Symbol(`${ns}.StoreIndex`),
  WebStore: Symbol(`${ns}.WebStore`),
} as const;
