import { useCallback, useState } from "react";
import { useAppContext } from "../../context";
import axios from "axios";
import {
  AddPhotoAlternateIcon,
  FormatAlignCenterOutlinedIcon,
  FormatAlignLeftOutlinedIcon,
  FormatAlignRightOutlinedIcon,
  FormatBoldIcon,
  FormatColorFillIcon,
  FormatColorTextOutlinedIcon,
  FormatItalicIcon,
  FormatUnderlinedIcon,
  HorizontalRuleIcon,
  LocalParkingOutlinedIcon,
  PlagiarismIcon,
  RedoIcon,
  StrikethroughSIcon,
  SubdirectoryArrowLeftIcon,
  SubscriptOutlinedIcon,
  SuperscriptOutlinedIcon,
  TableViewOutlinedIcon,
  UndoIcon,
} from "../icons";
import { Tooltip } from "antd";
import config from "../../config";
import TableOptions from "./TableOptions/TableOptions";
import Heading from "./ToolBars/Heading";

const ToolBars = () => {
  const { editor, modal, plainText, plag } = useAppContext();
  const [tableOpen, setTableOpen] = useState(false);
  const [textColor, setTextColor] = useState("#000000");
  const [backColor, setBackColor] = useState("#ffffff");
  // heading button in tool options
  const [headingBtnVal, setHeadingBtnVal] = useState(7);
  //   plag
  const [plagLoading, setPlagLoading] = useState(false);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);

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

  return (
    <div className="toolbar">
      {/* ----------------table------------ */}
      <Tooltip
        placement="bottom"
        title="click on the icon to see the table options"
      >
        <div className="button-input-group shadow">
          Table{" "}
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
        <div className="button-input-group shadow">
          Color
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
        <div className="button-input-group shadow">
          Backgroud
          <FormatColorFillIcon
            style={{ color: backColor }}
            onClick={() =>
              editor.chain().focus().toggleHighlight({ color: backColor }).run()
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

      {/* --------------------------- heading ------------------------- */}
      <div>
        <Tooltip
          placement="right"
          title="Click on the button to togle the options menu"
        >
          <div className="button-input-group shadow">
            Heading
            <div
              className="menu-item"
              onMouseEnter={() => setIsFileMenuOpen(true)}
              onMouseLeave={() => setIsFileMenuOpen(false)}
            >
              <button className={` ${headingBtnVal < 7 ? "is-active" : ""}`}>
                H {headingBtnVal}
              </button>
              {isFileMenuOpen && <Heading setHeadingBtnVal={setHeadingBtnVal}/>}
            </div>
          </div>
        </Tooltip>
      </div>
      {/* --------------------------- heading ------------------------- */}

      {/* ------------------------paragraph-------------------------- */}
      <Tooltip placement="bottom" title="Set text to normal">
        <button
          onClick={() => {
            setHeadingBtnVal(7);
            editor.chain().focus().setParagraph().run();
          }}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          <LocalParkingOutlinedIcon />
        </button>
      </Tooltip>
      {/* ------------------------paragraph-------------------------- */}

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
          className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
        >
          <FormatAlignLeftOutlinedIcon />
        </button>
      </Tooltip>
      <Tooltip placement="bottom" title="Text align to the center">
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
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
          className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
        >
          <FormatAlignRightOutlinedIcon />
        </button>
      </Tooltip>
      {/* --------------------------text align ------------------------ */}

      {/* ==================== font selection ======================= */}
      <Tooltip placement="bottom" title="Set a font-style">
        <select
          onChange={(e) => {
            const fontFamily = e.target.value;
            editor.chain().focus().setFontFamily(fontFamily).run();
          }}
        >
          <option value="">Font-style : normal</option>
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

      {/* ----------------plag------------ */}
      <Tooltip placement="bottom" title="click on the icon to check plagiarism">
        <div className="button-input-group shadow">
          {plagLoading ? "Loading" : "Check"} Plagiarism
          <button
            onClick={handlePlagiarism}
            className="plag-btn"
            disabled={plagLoading}
            style={{
              boxShadow: "none",
            }}
          >
            <PlagiarismIcon />
          </button>
        </div>
      </Tooltip>
      {/* ----------------palg------------ */}

      {tableOpen && <TableOptions />}
    </div>
  );

  // Plagiarism
  async function handlePlagiarism() {
    if (!plainText.plainTextContent) {
      modal.handleModel(
        0,
        "",
        <p>Please enter some text to check plagiarism</p>
      );
      return;
    }

    const encodedParams = new URLSearchParams();
    encodedParams.set("content", plainText.plainTextContent);

    const options = {
      method: "POST",
      url: "https://ai-plagiarism-checker.p.rapidapi.com/detector/v1/",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": config.RAPID_API_KEY,
        "X-RapidAPI-Host": config.RAPID_API_HOST,
      },
      data: encodedParams,
    };

    try {
      setPlagLoading(true);
      const response = await axios.request(options);
      console.log(response);

      if (response.status === 200 && !response.data.error) {
        plag.setPlagResult(response.data);
      } else {
        modal.handleModel(
          0,
          "",
          <p>
            {response.data.message ||
              response.data.msg ||
              response.data.error ||
              "Something went wrong"}
          </p>
        );
      }
    } catch (error) {
      console.error(error);
      modal.handleModel(
        0,
        "",
        <p>
          {error?.response?.data?.message ||
            error?.response?.data?.msg ||
            error?.response?.data?.error ||
            "Something went wrong"}
        </p>
      );
    } finally {
      setPlagLoading(false);
    }
  }

  
};

export default ToolBars;
