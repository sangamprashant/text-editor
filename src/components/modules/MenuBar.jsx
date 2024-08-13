import React, { useState } from "react";
import { useAppContext } from "../../context";
import DayNight from "./DayNight";
import DropDownItem from "./MenuBars/DropDownItem";
import MenuTitle from "./MenuBars/MenuTitle";
import html2pdf from "html2pdf.js";
import Confirm from "./MenuBars/Confirm";

const MenuBar = () => {
  const { editor, plainText, theme, modal } = useAppContext();
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isNextMenuOpen, setIsNextMenuOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);

  const saveFile = async () => {
    if (!plainText.plainTextContent) {
      modal.handleModel(0, "", <p>No content to save, or only two words.</p>);
      return;
    }

    if (window.electron) {
      const filePath = await window.electron.saveFile(
        plainText.plainTextContent
      );
      if (filePath) {
        modal.handleModel(0, "", <p>File saved at: ${filePath}</p>);
      } else {
        modal.handleModel(0, "", <p>File save was canceled.</p>);
      }
    } else {
      modal.handleModel(
        0,
        "",
        <p>This feature is only available in the Electron environment.</p>
      );
    }
  };

  const handleNew = async () => {
    await saveFile();
    clearEditor();
    setIsConfirm(false);
  };

  const handleOpenAFile = async () => {
    if (window.electron) {
      const content = await window.electron.openFile();
      if (content !== null) {
        editor.commands.setContent(content);
      } else {
        modal.handleModel(0, "", <p>File open was canceled or failed.</p>);
      }
    } else {
      modal.handleModel(
        0,
        "",
        <p>This feature is only available in the Electron environment.</p>
      );
    }
  };

  const clearEditor = () => {
    editor.commands.clearContent();
    setIsConfirm(false);
  };

  const handlePrint = () => {
    const content = document.getElementById("editor-container").innerHTML;
    if (window.electron) {
      // In Electron environment
      window.electron.saveAsPDF(content);
    } else {
      // In web environment
      const element = document.getElementById("editor-container");
      const opt = {
        margin: 1,
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      // New Promise-based usage:
      html2pdf().from(element).set(opt).save();
    }
  };

  const handleCut = async () => {
    const selectedText = editor.commands.cut();
    if (window.electron) {
      await window.electron.cut(selectedText);
    } else {
      document.execCommand("cut");
    }
  };

  const handleCopy = async () => {
    const selectedText = editor.commands.copy();
    if (window.electron) {
      await window.electron.copy(selectedText);
    } else {
      document.execCommand("copy");
    }
  };

  const handlePaste = async () => {
    if (window.electron) {
      const clipboardText = await window.electron.paste();
      editor.commands.insert(clipboardText); // Implement this method to insert text
    } else {
      document.execCommand("paste");
    }
  };

  const handleConfirmNew = () => {
    setIsConfirm(true);
  };

  return (
    <>
      {isConfirm && (
        <Confirm
          content="Do you want to save?"
          onCancel={clearEditor}
          onOk={handleNew}
        />
      )}
      <div
        className={`menu-bar shadow ${
          theme.isDark ? "bg-black text-white" : "bg-white"
        }`}
      >
        <div className="menu">
          <div
            className="menu-item"
            onMouseEnter={() => setIsFileMenuOpen(true)}
            onMouseLeave={() => setIsFileMenuOpen(false)}
          >
            <MenuTitle title="File" />
            {isFileMenuOpen && (
              <div
                className={`dropdown-menu ${
                  theme.isDark ? "dropdown-menu-dark" : "dropdown-menu-light"
                }`}
              >
                <DropDownItem onClick={handleConfirmNew} title="New" />
                <DropDownItem onClick={handleOpenAFile} title="Open" />
                <DropDownItem onClick={saveFile} title="Save" />
              </div>
            )}
          </div>
          <div
            className="menu-item"
            onMouseEnter={() => setIsNextMenuOpen(true)}
            onMouseLeave={() => setIsNextMenuOpen(false)}
          >
            <MenuTitle title="Edit" />
            {isNextMenuOpen && (
              <div
                className={`dropdown-menu ${
                  theme.isDark ? "dropdown-menu-dark" : "dropdown-menu-light"
                }`}
              >
                <DropDownItem onClick={handleCut} title="Cut" />
                <DropDownItem onClick={handleCopy} title="Copy" />
                <DropDownItem onClick={handlePaste} title="Paste" />
                <DropDownItem onClick={clearEditor} title="Clear" />
                <DropDownItem onClick={handlePrint} title="Print" />
              </div>
            )}
          </div>
        </div>
        <DayNight />
      </div>
    </>
  );
};

export default MenuBar;
