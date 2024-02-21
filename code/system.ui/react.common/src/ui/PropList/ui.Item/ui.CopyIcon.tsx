import { COLORS, css, Icons } from './common';

/**
 * Copy icon.
 */
export const CopyIcon: React.FC = () => {
  const styles = {
    base: css({ Absolute: [0, -16, 0, null], display: 'grid', placeItems: 'center' }),
    icon: css({ opacity: 0.8 }),
  };
  return (
    <div {...styles.base}>
      <Icons.Copy style={styles.icon} color={COLORS.BLUE} size={14} />
    </div>
  );
};
