import { useEffect, useState } from 'react';
import { Path, COLORS, Color, Is, Text, css, type t, Delete } from './common';

export type YamlTextAreaFocusHandler = (e: YamlTextAreaFocusHandlerArgs) => void;
export type YamlTextAreaFocusHandlerArgs = { focused: boolean };

export type YamlTextAreaEnterHandler = (e: YamlTextAreaEnterHandlerArgs) => void;
export type YamlTextAreaEnterHandlerArgs = { images: t.SlugImage[] };

export type YamlTextAreaProps = {
  title?: string;
  images?: t.SlugImage[];
  style?: t.CssValue;
  onFocus?: YamlTextAreaFocusHandler;
  onEnter?: YamlTextAreaEnterHandler;
};

export const YamlTextArea: React.FC<YamlTextAreaProps> = (props) => {
  const { title = 'image timestamps' } = props;
  const [yaml, setYaml] = useState('');

  useEffect(() => {
    const yaml = Wrangle.images.stringify(props.images ?? []);
    setYaml(yaml);
  }, [props.images]);

  /**
   * Handlers
   */
  const focusHandler = (focused: boolean) => {
    return () => props.onFocus?.({ focused });
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setYaml(e.target.value);
  };

  const onKeypress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      const images = Wrangle.images.parse(yaml);
      console.info('edited images:', images);
      props.onEnter?.({ images });
    }
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      display: 'grid',
      overflow: 'hidden',
    }),
    title: css({ fontSize: 12, marginBottom: 5, opacity: 0.6 }),
    textarea: css({
      fontSize: 12,
      fontWeight: 600,
      height: 200,
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      outline: 'none',
      padding: 4,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.title}>{title}</div>
      <textarea
        {...styles.textarea}
        value={yaml}
        onChange={onChange}
        onFocus={focusHandler(true)}
        onBlur={focusHandler(false)}
        onKeyDown={onKeypress}
      />
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  ensureDefaults(input: t.SlugImage) {
    const { start = 0, end, src, sizing, scale = 1 } = input;
    // NB: Best order for display in YAML textbox.
    //    (the long URL that will wrap at the end of the props)
    return Delete.undefined({ start, end, scale, sizing, src });
  },

  isHttpUrl(text: string) {
    return ['https://', 'http://'].some((prefix) => text.startsWith(prefix));
  },

  images: {
    parse(yaml: string): t.SlugImage[] {
      try {
        const res = yaml.split('\n\n').map((text) => {
          if (Wrangle.isHttpUrl(text)) text = `src: ${text}`;
          return Text.Yaml.parse(text);
        });
        return res
          .filter(Boolean)
          .filter((obj) => Is.slugImage(obj))
          .map((image) => image as t.SlugImage)
          .map(Wrangle.ensureDefaults);
      } catch (error) {
        return [];
      }
    },

    stringify(images: t.SlugImage[]): string {
      return images.map((image) => Text.Yaml.stringify(image)).join('\n');
    },
  },
} as const;
