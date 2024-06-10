import { Spinner, COLORS, Color, DEFAULTS, Style, css, type t } from './common';
import { PropListItem, PropListTitle } from './item';
import { Wrangle } from './u';

/**
 * Component
 */
export const View: React.FC<t.PropListProps> = (props) => {
  const { title, loading = false } = props;
  const items = Wrangle.items(props.items);
  const width = Wrangle.sizeProp(props.width);
  const height = Wrangle.sizeProp(props.height);

  const defaults: t.PropListDefaults = {
    clipboard: false,
    ...props.defaults,
  };

  const theme = Color.theme(props.theme ?? DEFAULTS.theme);
  const styles = {
    base: css({
      position: 'relative',
      color: COLORS.DARK,
      width: width?.fixed,
      height: height?.fixed,
      minWidth: width?.min ?? 10,
      minHeight: height?.min ?? 10,
      maxWidth: width?.max,
      maxHeight: height?.max,
      boxSizing: 'border-box',
      ...Style.toPadding(props.padding),
      ...Style.toMargins(props.margin),
    }),
    spinner: css({
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  const elItems = items
    .filter((item) => !!item)
    .filter((item) => item?.visible ?? true)
    .map((item, i) => {
      return (
        <PropListItem
          key={i}
          item={item!}
          is={{ first: i === 0, last: i === items.length - 1 }}
          defaults={defaults}
          theme={theme.name}
        />
      );
    });

  const hasTitle = Wrangle.hasTitle(title);
  const elTitle = hasTitle && (
    <PropListTitle
      //
      total={items.length}
      theme={theme.name}
      defaults={defaults}
      data={title}
    />
  );

  // Exit if empty.
  if (items.length === 0 && !hasTitle) return null;

  const elLoading = loading && (
    <div {...styles.spinner}>
      <Spinner.Bar color={theme.fg} width={60} />
    </div>
  );

  const elBody = !elLoading && (
    <>
      {elTitle}
      {items.length > 0 && <div>{elItems}</div>}
    </>
  );

  return (
    <div
      {...css(styles.base, props.style)}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {elLoading}
      {elBody}
    </div>
  );
};
