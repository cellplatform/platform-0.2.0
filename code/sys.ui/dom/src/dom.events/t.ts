export type UIEventBase = {
  readonly bubbles: boolean;
  readonly cancelable: boolean;
  readonly eventPhase: number;
  readonly timeStamp: number;
  readonly isTrusted: boolean;
};

export type UIModifierKeys = {
  readonly altKey: boolean;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly shiftKey: boolean;
};
