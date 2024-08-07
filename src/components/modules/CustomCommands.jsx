import { Extension } from '@tiptap/core';

const CustomCommands = Extension.create({
  name: 'customCommands',

  addCommands() {
    return {
      cut: () => ({ tr, state }) => {
        const { selection } = state;
        const { $from, $to } = selection;
        const content = state.doc.textBetween($from.pos, $to.pos, '\n');
        tr.delete($from.pos, $to.pos);
        return content;
      },
      copy: () => ({ state }) => {
        const { selection } = state;
        const { $from, $to } = selection;
        const content = state.doc.textBetween($from.pos, $to.pos, '\n');
        return content;
      },
      paste: () => ({ tr, state }) => {
        const { $from } = state.selection;
        const content = window.electron.paste();

        tr.insertText(content, $from.pos);
        return true;
      },
      getSelectedText: () => ({ state }) => {
        const { selection } = state;
        const { $from, $to } = selection;
        return state.doc.textBetween($from.pos, $to.pos, '\n');
      },
      insert: (content) => ({ tr, state }) => {
        const { $from } = state.selection;
        tr.insertText(content, $from.pos);
        return true;
      },
    };
  },
});

export default CustomCommands;
