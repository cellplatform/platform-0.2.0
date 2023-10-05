export type FocusHandler = (e: FocusHandlerArgs) => void;
export type FocusHandlerArgs = { action: 'focus' | 'blur'; focus: boolean; blur: boolean };
export type ActiveElementChangedHandler = (e: FocusHandlerArgs) => void;
