import { Extension } from '@tiptap/core';

const TextSize = Extension.create({
  name: 'textSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addAttributes() {
    return {
      textSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize.replace('px', ''),
        renderHTML: (attributes) => {
          if (!attributes.textSize) {
            return {};
          }

          return {
            style: `font-size: ${attributes.textSize}px`,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      setTextSize: (size) => ({ chain }) => {
        return chain().setMark('textStyle', { textSize: size }).run();
      },
    };
  },
});

export default TextSize;
