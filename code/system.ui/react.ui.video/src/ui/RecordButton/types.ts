export type RecordButtonClickEvent = { current: RecordButtonState; action?: RecordButtonAction };
export type RecordButtonClickEventHandler = (e: RecordButtonClickEvent) => void;

export type RecordButtonState = 'default' | 'recording' | 'paused' | 'dialog';
export type RecordButtonAction = 'resume' | 'finish';

// export type RecordButtonDialogHandler = (e: RecordButtonDialogHandlerArgs) => void;
// export type RecordButtonDialogHandlerArgs = {
//   element(view: JSX.Element | undefined): RecordButtonDialogHandlerArgs;
// };

export type RecordButtonDialog = {
  element?: JSX.Element | (() => JSX.Element | undefined);
};
