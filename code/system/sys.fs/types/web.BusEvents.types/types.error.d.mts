declare type FilePath = string;
export declare type SysFsError = {
    code: SysFsErrorCode;
    message: string;
    path?: FilePath;
};
export declare type SysFsErrorCode = 'client/timeout' | 'info' | 'read' | 'read/404' | 'write' | 'delete' | 'copy' | 'move' | 'manifest' | 'cell/push' | 'cell/pull' | 'unknown';
export {};
