export type HarnessResizeHandler = (e: HarnessResizeHandlerArgs) => void;
export type HarnessResizeHandlerArgs = { ready: boolean; size: { width: number; height: number } };
