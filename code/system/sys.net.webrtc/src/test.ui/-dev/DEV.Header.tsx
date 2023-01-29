import { RecordButton, Color, COLORS, css, Icons, t } from '../common';

export type DevHeaderProps = {
  bus: t.EventBus;
  recordButton?: {
    state?: t.RecordButtonState;
    enabled?: boolean;
  };
  style?: t.CssValue;
};

export const DevHeader: React.FC<DevHeaderProps> = (props) => {
  const { bus, recordButton } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      Padding: [18, 25],
    }),
    body: css({
      display: 'grid',
      gridTemplateRows: 'auto auto',
      gap: '10px',
    }),
    screen: css({
      backgroundColor: Color.alpha(COLORS.DARK, 0.03),
      height: 200,
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      borderRadius: 12,
      display: 'grid',
      placeItems: 'center',
    }),
    recordButton: css({ display: 'grid', placeItems: 'center' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <div {...styles.screen}>
          <Icons.Cube size={80} color={Color.alpha(COLORS.DARK, 0.06)} />
        </div>
        {recordButton && (
          <div {...styles.recordButton}>
            <RecordButton
              bus={bus}
              isEnabled={recordButton.enabled ?? false}
              state={recordButton?.state}
            />
          </div>
        )}{' '}
      </div>
    </div>
  );
};
