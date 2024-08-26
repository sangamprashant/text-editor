import Code from "@tiptap/extension-code";
import Color from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Focus from "@tiptap/extension-focus";
import FontFamily from "@tiptap/extension-font-family";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { createContext, useContext, useState } from "react";
import CustomCommands from "../components/modules/CustomCommands";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  // modal
  const [isModalOpen, setIsModelOpen] = useState(false);
  const [modalContent, setModelContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalWidth, setModalWidth] = useState(0);
  const [ctr, setCtr] = useState("");
  const [plagResult, setPlagResult] = useState(null);
  const [plainTextContent, setPlainTextContent] = useState("");
  const [isDark, setIsDark] = useState(false);

  const editor = useEditor({
    extensions: [
      Document,
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CustomCommands,
      FontFamily.configure({
        types: ["textStyle"],
      }),
      Color.configure({
        types: ["textStyle"],
      }),
      Dropcursor.configure({
        color: "#ff0000",
        width: 2,
        class: "my-custom-class",
      }),
      Focus.configure({
        className: "has-focus",
        mode: "all",
      }),
      TextStyle,
      Placeholder.configure({
        placeholder: "Write something …",
      }),
      Underline,
      Subscript,
      Superscript,
      Highlight.configure({ multicolor: true }),
      HardBreak.configure({
        keepMarks: false,
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: "",
        },
      }),
      Image,
      Code.configure({
        HTMLAttributes: {
          class: "code-class",
        },
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Text,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: " ",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // setPlainTextContent(editor.getText());
      // handleContentChange(html);
    },
  });

  return (
    <AppContext.Provider
      value={{
        editor,
        modal: {
          handleModel,
          modalContent,
          isModalOpen,
          modalTitle,
          modalWidth,
          setIsModelOpen,
          ctr,
        },
        plag: {
          plagResult,
          setPlagResult,
        },
        plainText: {
          plainTextContent,
          setPlainTextContent,
        },
        theme: {
          isDark,
          setIsDark,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );

  async function handleModel(width, title, data, ctr) {
    if (width === 0) {
      setModalWidth(500);
    } else {
      setModalWidth(width);
    }

    if (!title) {
      setModalTitle("Text editor says!");
    } else {
      setModalTitle(title);
    }
    if (ctr) {
      setCtr(ctr);
    } else {
      setCtr("");
    }
    setModelContent(data);
    setIsModelOpen(true);
  }
};

// Create a custom hook to use the context
const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useAppContext };
