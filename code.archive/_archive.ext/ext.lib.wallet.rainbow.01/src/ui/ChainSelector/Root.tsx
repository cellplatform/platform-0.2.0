import { DEFAULTS, FC, PropList, type t } from './common';

const View: React.FC<t.ChainSelectorProps> = (props) => {
  const {
    title = DEFAULTS.title,
    selected = DEFAULTS.chains.default,
    resettable = DEFAULTS.resettable,
    indexes = DEFAULTS.indexes,
    indent = DEFAULTS.indent,
  } = props;

  const handleChange = (next: t.ChainName[]) => {
    if (props.onChange && next?.join() !== selected?.join()) {
      props.onChange({
        empty: next?.length === 0,
        prev: selected,
        next,
      });
    }
  };

  return (
    <PropList.FieldSelector
      title={title}
      style={props.style}
      all={DEFAULTS.chains.all}
      selected={selected}
      resettable={resettable}
      indexes={indexes}
      indent={indent}
      onClick={(e) => handleChange(e.next as t.ChainName[])}
    />
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const ChainSelector = FC.decorate<t.ChainSelectorProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'ChainSelector' },
);
