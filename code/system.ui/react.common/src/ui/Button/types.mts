export type ButtonMouseHandler = (e: ButtonMouseHandlerArgs) => void;
export type ButtonMouseHandlerArgs = {
  isDown: boolean;
  isOver: boolean;
  isEnabled: boolean;
  event: React.MouseEvent;
  action: 'MouseEnter' | 'MouseLeave' | 'MouseDown' | 'MouseUp';
};
