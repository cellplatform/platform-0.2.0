declare type DeleteResponse = {
    name: string;
    version: number;
    error?: string;
};
/**
 * A promise based wrapper into the IndexedDB API.
 *
 *    https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 *    https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
 *    https://gist.github.com/JamesMessinger/a0d6389a5d0e3a24814b
 *
 */
export declare const IndexedDb: {
    /**
     * Create a promised base interface into an IndexedDb
     */
    create<T>(args: {
        name: string;
        version?: number | undefined;
        schema?: ((req: IDBOpenDBRequest, e: IDBVersionChangeEvent) => void) | undefined;
        store: (db: IDBDatabase) => T;
    }): Promise<T>;
    /**
     * List databases.
     */
    list(): Promise<IDBDatabaseInfo[]>;
    /**
     * Delete the named database.
     */
    delete(name: string): Promise<DeleteResponse>;
    /**
     * Convert a [IDBRequest] to a <Typed> promise.
     */
    asPromise<T_1>(req: IDBRequest<any>): Promise<T_1>;
    /**
     * Operations on DB record objects.
     */
    record: {
        /**
         * Retrieves the value of the first record matching the
         * given key or key range in query.
         */
        get<T_2>(store: IDBObjectStore | IDBIndex, query: IDBValidKey | IDBKeyRange): Promise<T_2 | undefined>;
        getAll<T_3>(store: IDBObjectStore | IDBIndex, query?: IDBValidKey | IDBKeyRange): Promise<T_3[]>;
        /**
         * Add or update an object in the given store.
         */
        put<T_4>(store: IDBObjectStore, value: T_4, key?: IDBValidKey): Promise<T_4>;
        /**
         * Delete an object.
         */
        delete<T_5>(store: IDBObjectStore, key: IDBValidKey | IDBKeyRange): Promise<T_5>;
    };
};
export {};
