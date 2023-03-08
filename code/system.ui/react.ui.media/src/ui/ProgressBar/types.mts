type Seconds = number;
type Percentage = number; // 0..1

export type ProgressBarClickHandler = (e: ProgressBarClickHandlerArgs) => void;
export type ProgressBarClickHandlerArgs = { percent: Percentage };

export type TimeWindow = {
  label?: string;
  start?: Seconds | null;
  end?: Seconds | null;
};
