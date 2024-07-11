import { Extension } from "@tiptap/core";

const CustomCommands = Extension.create({
  name: 'customCommands',

  addCommands() {
    return {
      delete: () => ({ tr }) => {
        const { $from, $to } = tr.selection;

        // Use tr.mapping.map to map the position between transaction steps
        const from = tr.mapping.map($from.pos);
        const to = tr.mapping.map($to.pos);

        tr.delete(from, to);

        return true;
      },
      insert: (content) => ({ tr }) => {
        const { $from } = tr.selection;

        // Use tr.mapping.map to map the position between transaction steps
        const pos = tr.mapping.map($from.pos);

        tr.insertText(content, pos);

        return true;
      },
    };
  },
});

export default CustomCommands;
