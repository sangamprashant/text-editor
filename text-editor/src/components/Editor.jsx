import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import FormatColorTextOutlinedIcon from "@mui/icons-material/FormatColorTextOutlined";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import RedoIcon from "@mui/icons-material/Redo";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import UndoIcon from "@mui/icons-material/Undo";
import BulletList from "@tiptap/extension-bullet-list";
import Color from "@tiptap/extension-color";
import Dropcursor from "@tiptap/extension-dropcursor";
import Focus from "@tiptap/extension-focus";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import ListItem from "@tiptap/extension-list-item";
import ListKeymap from "@tiptap/extension-list-keymap";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useCallback, useEffect, useState } from "react";
import "./Editor.css";
import CustomCommands from "./EditorModels";
import Blockquote from "@tiptap/extension-blockquote";
import SubdirectoryArrowLeftIcon from "@mui/icons-material/SubdirectoryArrowLeft";
import HardBreak from "@tiptap/extension-hard-break";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import Image from "@tiptap/extension-image";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Code from "@tiptap/extension-code";
import CodeIcon from "@mui/icons-material/Code";

const Editor = () => {
  const [plainTextContent, setPlainTextContent] = useState("");
  const [wordFrequencies, setWordFrequencies] = useState([]);
  const [textColor, setTextColor] = useState("#000000");
  const [backColor, setBackColor] = useState("#000000");

  const editor = useEditor({
    extensions: [
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
      BulletList,
      ListItem,
      ListKeymap,
      TextStyle,
      Placeholder.configure({
        placeholder: "Write something …",
      }),
      Underline,
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
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setPlainTextContent(editor.getText());
      handleContentChange(html);
    },
  });

  const handleContentChange = useCallback((newContent) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = newContent;
    const textContent = tempElement.textContent || tempElement.innerText || "";
    setPlainTextContent(textContent);
  }, []);

  useEffect(() => {
    const words = plainTextContent.toLowerCase().match(/\b\w+\b/g);
    if (words) {
      const frequencyMap = {};
      words.forEach((word) => {
        frequencyMap[word] = (frequencyMap[word] || 0) + 1;
      });
      const sortedWordFrequencies = Object.entries(frequencyMap)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count);
      setWordFrequencies(sortedWordFrequencies);
    } else {
      setWordFrequencies([]);
    }
  }, [plainTextContent]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.ctrlKey && event.key >= "1" && event.key <= "9") {
        const index = parseInt(event.key) - 1;
        if (index < wordFrequencies.length && editor) {
          const selectedWord = wordFrequencies[index].word;
          editor?.commands?.insert(selectedWord + " "); // Use the custom insert command
          handleContentChange(editor.getHTML());
        }
        event.preventDefault();
      }
    },
    [editor, wordFrequencies, handleContentChange]
  );

  const handleSetColor = (color) => {
    setTextColor(color);
    editor?.chain().focus().setColor(color).run();
  };

  const handleSetColorBackGround = (color) => {
    setBackColor(color);
    editor?.chain().focus().toggleHighlight({ color }).run();
  };
  const addImage = useCallback(() => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target.result;
        editor.chain().focus().setImage({ src: imageDataUrl }).run();
      };
      reader.readAsDataURL(file);
    };
    fileInput.click();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="main-container">
      {editor && (
        <div className="editor-container">
          <div className="toolbar">
            <div className="button-input-group">
              <FormatColorTextOutlinedIcon style={{ color: textColor }} />
              <input
                type="color"
                value={textColor}
                onChange={(e) => handleSetColor(e.target.value)}
              />
            </div>
            <div className="button-input-group">
              <FormatColorFillIcon
                style={{ color: backColor }}
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: backColor })
                    .run()
                }
              />

              <input
                type="color"
                onChange={(e) => handleSetColorBackGround(e.target.value)}
                value={backColor}
              />
            </div>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().toggleBold()}
              className={editor.isActive("bold") ? "is-active" : ""}
            >
              <FormatBoldIcon />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().toggleItalic()}
              className={editor.isActive("italic") ? "is-active" : ""}
            >
              <FormatItalicIcon />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().toggleStrike()}
              className={editor.isActive("strike") ? "is-active" : ""}
            >
              <StrikethroughSIcon />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().toggleUnderline()}
              className={editor.isActive("underline") ? "is-active" : ""}
            >
              <FormatUnderlinedIcon />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "is-active" : ""}
            >
              <FormatListBulletedIcon />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "is-active" : ""}
            >
              <FormatListNumberedIcon />
            </button>
            <select
              onChange={(e) => {
                const fontFamily = e.target.value;
                editor.chain().focus().setFontFamily(fontFamily).run();
              }}
            >
              <option value="">Font : normal</option>
              <option value="Inter">Inter</option>
              <option value="Comic Sans MS, Comic Sans">Comic Sans</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
              <option value="cursive">Cursive</option>
              <option value='"Comic Sans MS", "Comic Sans"'>
                Comic Sans quoted
              </option>
            </select>
            <select
    value={editor.fontSize}
    onChange={(e) => {
      const fontSize = e.target.value;
      editor.chain().focus().setTextSize(fontSize).run();
    }}
  >
    {Array.from({ length: 63 }, (_, i) => i + 10).map((size) => (
      <option key={size} value={size}>
        {size}px
      </option>
    ))}
  </select>
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <UndoIcon />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <RedoIcon />
            </button>

            <button onClick={() => editor.chain().focus().setHardBreak().run()}>
              <SubdirectoryArrowLeftIcon />
            </button>
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              {/* Set horizontal rule */}
              <HorizontalRuleIcon />
            </button>
            <button onClick={addImage}>
              <AddPhotoAlternateIcon />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={editor.isActive("code") ? "is-active" : ""}
            >
              <CodeIcon />
            </button>
          </div>
          <EditorContent
            editor={editor}
            className="custom-editor"
            onKeyDown={handleKeyDown}
            tabIndex={0}
          />
        </div>
      )}

      <div className="word-frequency-container">
        <h3>Word Frequencies</h3>
        <ul className="word-list">
          {wordFrequencies.slice(0, 10).map((data, index) => (
            <li key={index}>
              <span className="index">{index + 1}</span>:{" "}
              <span className="word">{data.word}</span>{" "}
              <span className="count">({data.count})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Editor;
