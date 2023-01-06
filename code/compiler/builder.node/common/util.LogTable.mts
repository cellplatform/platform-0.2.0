import CliTable from 'cli-table3';

const DEFAULTS = {
  BORDERLESS: {
    top: '',
    'top-mid': '',
    'top-left': '',
    'top-right': '',
    bottom: '',
    'bottom-mid': '',
    'bottom-left': '',
    'bottom-right': '',
    left: '',
    'left-mid': '',
    mid: '',
    'mid-mid': '',
    right: '',
    'right-mid': '',
    middle: ' ',
  },
};

/**
 * CLI Table wrapper.
 */
export function LogTable(options: { paddingLeft?: number; paddingRight?: number } = {}) {
  const { paddingLeft = 0, paddingRight = 0 } = options;
  return new CliTable({
    chars: DEFAULTS.BORDERLESS,
    style: { 'padding-left': paddingLeft, 'padding-right': paddingRight },
  });
}
