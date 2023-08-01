type Dimension = 'width' | 'height';

/**
 * Helpers for calculating "width:height" aspect ratios.
 */
export const AspectRatio = {
  /**
   * Derive the aspect ratio from width x height dimensions.
   */
  fromSize(width: number, height: number) {
    const divisor = gcd(width, height);
    const x = width / divisor;
    const y = height / divisor;
    const ratio = `${x}:${y}`;
    return {
      x,
      y,
      ratio,
      toString: () => ratio,
    } as const;
  },

  fromWidth(ratio: string, width: number) {
    return AspectRatio.fromDimension('width', ratio, width);
  },

  fromHeight(ratio: string, width: number) {
    return AspectRatio.fromDimension('height', ratio, width);
  },

  /**
   * Derive the width or height from the other dimension and the aspect ratio.
   */
  fromDimension(dimension: Dimension, ratio: string, value: number) {
    const throwInvalid = () => {
      throw new Error(`Invalid aspect ratio: ${ratio}`);
    };
    const parts = typeof ratio === 'string' ? ratio.split(':') : [];
    if (parts.length !== 2) throwInvalid();

    const widthRatio = parseFloat(parts[0]);
    const heightRatio = parseFloat(parts[1]);
    if (isNaN(widthRatio) || isNaN(heightRatio)) throwInvalid();

    if (dimension === 'width') return (value * heightRatio) / widthRatio;
    if (dimension === 'height') return (value * widthRatio) / heightRatio;
    return throwInvalid();
  },
} as const;

/**
 * Helpers
 */
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
