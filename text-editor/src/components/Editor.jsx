import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
// import CodeIcon from "@mui/icons-material/Code";
import FormatAlignCenterOutlinedIcon from "@mui/icons-material/FormatAlignCenterOutlined";
import FormatAlignLeftOutlinedIcon from "@mui/icons-material/FormatAlignLeftOutlined";
import FormatAlignRightOutlinedIcon from "@mui/icons-material/FormatAlignRightOutlined";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import FormatColorTextOutlinedIcon from "@mui/icons-material/FormatColorTextOutlined";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import LocalParkingOutlinedIcon from "@mui/icons-material/LocalParkingOutlined";
import RedoIcon from "@mui/icons-material/Redo";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import SubdirectoryArrowLeftIcon from "@mui/icons-material/SubdirectoryArrowLeft";
import SubscriptOutlinedIcon from "@mui/icons-material/SubscriptOutlined";
import SuperscriptOutlinedIcon from "@mui/icons-material/SuperscriptOutlined";
import TableViewOutlinedIcon from "@mui/icons-material/TableViewOutlined";
import UndoIcon from "@mui/icons-material/Undo";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import Color from "@tiptap/extension-color";
import Dropcursor from "@tiptap/extension-dropcursor";
import Focus from "@tiptap/extension-focus";
import FontFamily from "@tiptap/extension-font-family";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import ListKeymap from "@tiptap/extension-list-keymap";
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
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Tooltip } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import "./Editor.css";
import CustomCommands from "./EditorModels";

const Editor = () => {
  const [plainTextContent, setPlainTextContent] = useState("");
  const [wordFrequencies, setWordFrequencies] = useState([]);
  const [textColor, setTextColor] = useState("#000000");
  const [backColor, setBackColor] = useState("#ffffff");
  const [headingVal, setHeadingVal] = useState(7);
  const [tableOpen, setTableOpen] = useState(false);

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
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
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
      setPlainTextContent(editor.getText());
      handleContentChange(html);
    },
  });

  const handleContentChange = useCallback((newContent) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = newContent;
    const textContent = tempElement.textContent || tempElement.innerText || "";
    const plainText = textContent.replace(/\n/g, " ");
    setPlainTextContent(plainText);
  }, []);

  useEffect(() => {
    if (!editor || !editor.state || !editor.state.doc) {
      return;
    }

    const words = [];
    editor.state.doc.descendants((node) => {
      if (node.isText) {
        // For plain text nodes
        const textContent = node.text;
        const textWords = textContent.split(/\s+/);
        words.push(...textWords);
      } else if (node.type.name === "tableCell") {
        // For table cell nodes
        const cellContent = node.textContent;
        const cellWords = cellContent.split(/\s+/);
        words.push(...cellWords);
      }
      return true; // Continue traversing through descendants
    });

    const frequencyMap = {};
    words.forEach((word) => {
      const lowercaseWord = word.toLowerCase();
      frequencyMap[lowercaseWord] = (frequencyMap[lowercaseWord] || 0) + 1;
    });

    const sortedWordFrequencies = Object.entries(frequencyMap)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count);

    setWordFrequencies(sortedWordFrequencies);
  }, [editor?.state?.doc, plainTextContent]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.ctrlKey && event.key >= "1" && event.key <= "9") {
        const index = parseInt(event.key) - 1;
        if (index < wordFrequencies.length && editor) {
          const selectedWord = wordFrequencies[index].word;
          editor?.commands?.insert(" " + selectedWord);
          handleContentChange(editor.getHTML());
        }
        event.preventDefault();
      }
    },
    [editor, wordFrequencies, handleContentChange]
  );

  const handleEnterPress = useCallback(
    (event) => {
      if (event.key === "Enter" && editor) {
        handleEnterSpace(event);
      }
    },
    [editor]
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
      <div className="editor-container">
        <div className="toolbar">
          {/* ----------------table------------ */}
          <Tooltip placement="bottom" title="click on the icon to see the table options">
            <div className="button-input-group">
              table{" "}
              <TableViewOutlinedIcon
                onClick={() => {
                  setTableOpen((prev) => !prev);
                }}
              />
            </div>
          </Tooltip>
          {/* ----------------table------------ */}

          {/*------------------- text color------------------- */}
          <Tooltip placement="bottom" title="set the text color">
            <div className="button-input-group">
              color
              <FormatColorTextOutlinedIcon style={{ color: textColor }} />
              <input
                type="color"
                value={textColor}
                onChange={(e) => handleSetColor(e.target.value)}
              />
            </div>
          </Tooltip>
          {/*------------------- text color------------------- */}

          {/*------------------- background color------------------- */}
          <Tooltip
            placement="bottom"
            title="set background color of the text/ click on icon to toggle"
          >
            <div className="button-input-group">
              backgroud
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
          </Tooltip>
          {/*------------------- background color------------------- */}

          {/* ------------------------paragraph-------------------------- */}
          <Tooltip placement="bottom" title="Set text to normal">
            <button
              onClick={() => {
                setHeadingVal(7);
                editor.chain().focus().setParagraph().run();
              }}
              className={editor.isActive("paragraph") ? "is-active" : ""}
            >
              <LocalParkingOutlinedIcon />
            </button>
          </Tooltip>
          {/* ------------------------paragraph-------------------------- */}

          {/* --------------------------- heading ------------------------- */}
          <Tooltip placement="bottom" title="Set a heading type">
            <select
              onChange={(e) => {
                const val = e.target.value;
                setHeadingVal(val);
                if (val === "7") {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor
                    .chain()
                    .focus()
                    .setHeading({ level: parseInt(val) })
                    .run();
                }
              }}
              value={headingVal}
            >
              {Array.from({ length: 7 }, (_, i) => i + 1).map((size) => (
                <option key={size} value={size}>
                  Heading {size}
                </option>
              ))}
            </select>
          </Tooltip>
          {/* --------------------------- heading ------------------------- */}

          {/* -------------------text-bold ------------------------ */}
          <Tooltip placement="bottom" title="Text bold">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().toggleBold()}
              className={editor.isActive("bold") ? "is-active" : ""}
            >
              <FormatBoldIcon />
            </button>
          </Tooltip>
          {/* -------------------text-bold ------------------------ */}

          {/* -------------------text-italic ------------------------ */}
          <Tooltip placement="bottom" title="Text italic">
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().toggleItalic()}
              className={editor.isActive("italic") ? "is-active" : ""}
            >
              <FormatItalicIcon />
            </button>
          </Tooltip>
          {/* -------------------text-italic ------------------------ */}

          {/* ---------------------- text -strike thtough------------------- */}
          <Tooltip placement="bottom" title="Text strike-through">
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().toggleStrike()}
              className={editor.isActive("strike") ? "is-active" : ""}
            >
              <StrikethroughSIcon />
            </button>
          </Tooltip>
          {/* ---------------------- text -strike thtough------------------- */}

          {/* ----------------------underline------------------- */}
          <Tooltip placement="bottom" title="Text underlined">
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().toggleUnderline()}
              className={editor.isActive("underline") ? "is-active" : ""}
            >
              <FormatUnderlinedIcon />
            </button>
          </Tooltip>
          {/* ----------------------underline------------------- */}

          {/* -------------------text sub/sup------------------- */}
          <Tooltip placement="bottom" title="Text sub script">
            <button
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={editor.isActive("subscript") ? "is-active" : ""}
            >
              <SubscriptOutlinedIcon />
            </button>
          </Tooltip>
          <Tooltip placement="bottom" title="Text super script">
            <button
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={editor.isActive("superscript") ? "is-active" : ""}
            >
              <SuperscriptOutlinedIcon />
            </button>
          </Tooltip>
          {/* -------------------text sub/sup------------------- */}

          {/* --------------------------text align ------------------------ */}
          <Tooltip placement="bottom" title="Text align to the left/start">
            <button
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={
                editor.isActive({ textAlign: "left" }) ? "is-active" : ""
              }
            >
              <FormatAlignLeftOutlinedIcon />
            </button>
          </Tooltip>
          <Tooltip placement="bottom" title="Text align to the center">
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={
                editor.isActive({ textAlign: "center" }) ? "is-active" : ""
              }
            >
              <FormatAlignCenterOutlinedIcon />
            </button>
          </Tooltip>
          <Tooltip placement="bottom" title="Text align to the right">
            <button
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={
                editor.isActive({ textAlign: "right" }) ? "is-active" : ""
              }
            >
              <FormatAlignRightOutlinedIcon />
            </button>
          </Tooltip>
          {/* --------------------------text align ------------------------ */}

          {/* -----------------------unordered list---------------------- */}
          <Tooltip placement="bottom" title="Unordered list">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "is-active" : ""}
            >
              <FormatListBulletedIcon />
            </button>
          </Tooltip>
          {/* -----------------------unordered list---------------------- */}

          {/* -----------------------ordered list---------------------- */}
          <Tooltip placement="bottom" title="Ordered list">
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "is-active" : ""}
            >
              <FormatListNumberedIcon />
            </button>
          </Tooltip>
          {/* -----------------------ordered list---------------------- */}

          {/* ==================== font selection ======================= */}
          <Tooltip placement="bottom" title="Set a font-style">
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
          </Tooltip>
          {/* ==================== font selection ======================= */}

          {/* =================== new line =================== */}
          <Tooltip placement="bottom" title="Go to new line">
            <button
              onClick={(e) => {
                handleEnterSpace(e);
                editor.chain().focus().setHardBreak().run();
              }}
            >
              <SubdirectoryArrowLeftIcon />
            </button>
          </Tooltip>
          {/* =================== new line =================== */}

          {/* =================== Horizontal rule ================== */}
          <Tooltip placement="bottom" title="Set a horizontal rule">
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              <HorizontalRuleIcon />
            </button>
          </Tooltip>
          {/* =================== Horizontal rule ================== */}

          {/* =================== Add Photo ================== */}
          <Tooltip placement="bottom" title="Add an image">
            <button onClick={addImage}>
              <AddPhotoAlternateIcon />
            </button>
          </Tooltip>
          {/* ===================== Add Photo ================ */}

          {/* =================== Redo =======================  */}
          <Tooltip placement="bottom" title="Undo the action">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <UndoIcon />
            </button>
          </Tooltip>
          {/* =================== Redo =======================  */}

          {/* =================== Undo =======================  */}
          <Tooltip placement="bottom" title="Redo the action">
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <RedoIcon />
            </button>
          </Tooltip>
          {/* =================== Undo =======================  */}
          {tableOpen && (
            <div className=" relative flex gap-1 flex-wrap">
              <button
                onClick={() => {
                  const numRows = prompt("Enter number of rows:");
                  const numCols = prompt("Enter number of columns:");
                  editor
                    .chain()
                    .focus()
                    .insertTable({
                      rows: numRows,
                      cols: numCols,
                      withHeaderRow: true,
                    })
                    .run();
                }}
              >
                Insert table
              </button>
              <button
                onClick={() => editor.chain().focus().addColumnBefore().run()}
              >
                Add column before
              </button>
              <button
                onClick={() => editor.chain().focus().addColumnAfter().run()}
              >
                Add column after
              </button>
              <button
                onClick={() => editor.chain().focus().deleteColumn().run()}
              >
                Delete column
              </button>
              <button
                onClick={() => editor.chain().focus().addRowBefore().run()}
              >
                Add row before
              </button>
              <button
                onClick={() => editor.chain().focus().addRowAfter().run()}
              >
                Add row after
              </button>
              <button onClick={() => editor.chain().focus().deleteRow().run()}>
                Delete row
              </button>
              <button
                onClick={() => editor.chain().focus().deleteTable().run()}
              >
                Delete table
              </button>
              <button onClick={() => editor.chain().focus().mergeCells().run()}>
                Merge cells
              </button>
              <button onClick={() => editor.chain().focus().splitCell().run()}>
                Split cell
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeaderColumn().run()
                }
              >
                Toggle header column
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              >
                Toggle header row
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeaderCell().run()}
              >
                Toggle header cell
              </button>
              <button
                onClick={() => editor.chain().focus().mergeOrSplit().run()}
              >
                Merge or split
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().setCellAttribute("colspan", 2).run()
                }
              >
                Set cell attribute
              </button>
              <button onClick={() => editor.chain().focus().fixTables().run()}>
                Fix tables
              </button>
              <button
                onClick={() => editor.chain().focus().goToNextCell().run()}
              >
                Go to next cell
              </button>
              <button
                onClick={() => editor.chain().focus().goToPreviousCell().run()}
              >
                Go to previous cell
              </button>
            </div>
          )}
        </div>
        <EditorContent
          editor={editor}
          className="custom-editor"
          onKeyDown={(e) => {
            handleKeyDown(e);
            handleEnterPress(e);
          }}
          tabIndex={0}
        />
      </div>
      <div className="word-frequency-container">
        <h3>Word Frequencies</h3>
        <code>
          <i>Top 5 repeted words</i>
        </code>
        <h5>shortcut is Ctrl + (pos)</h5>
        <ul className="word-list">
          {wordFrequencies.slice(0, 5).map((data, index) => (
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
  function handleEnterSpace(event) {
    editor?.commands?.insert(" ");
    event.preventDefault();
  }
};

export default Editor;
