export type WorkerGlobal = Worker & {
  name: string;
  crypto: Crypto;
  caches: CacheStorage;
  location: Location;
};
