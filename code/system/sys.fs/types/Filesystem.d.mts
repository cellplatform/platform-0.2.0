export declare const Filesystem: {
    Filesize: (bytes: number, options?: import("./Filesize/types.mjs").FilesizeOptions) => string;
    Path: {
        join(...segments: string[]): string;
        trim: (input: any) => string;
        trimSlashesStart(input: string): string;
        trimSlashesEnd(input: string): string;
        trimSlashes(input: string): string;
        ensureSlashEnd(input: string): string;
        trimHttp(input: string): string;
        trimWildcardEnd(input: string): string;
        parts(input: string): {
            dir: string;
            filename: string;
            name: string;
            ext: string;
            path: string;
        };
    };
};
