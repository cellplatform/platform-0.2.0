export type WorkerGlobalScope = Worker & {
  name: string;
  crypto: Crypto;
  caches: CacheStorage;
  location: Location;
};
