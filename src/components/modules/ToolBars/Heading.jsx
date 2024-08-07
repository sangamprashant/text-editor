import React from "react";
import { useAppContext } from "../../../context";

const Heading = ({ setHeadingBtnVal }) => {
  const { editor, theme } = useAppContext();
  return (
    <div
      className={`dropdown-menu dropdown-menu-heading ${
        theme.isDark ? "dropdown-menu-dark" : "dropdown-menu-light"
      }`}
    >
      <h1
        className={`dropdown-item dropdown-item-${
          theme.isDark ? "dark" : "light"
        }`}
        onClick={() => {
          handleHEadingChange(1);
        }}
      >
        H 1
      </h1>
      <h2
        className={`dropdown-item dropdown-item-${
          theme.isDark ? "dark" : "light"
        }`}
        onClick={() => {
          handleHEadingChange(2);
        }}
      >
        H 2
      </h2>
      <h3
        className={`dropdown-item dropdown-item-${
          theme.isDark ? "dark" : "light"
        }`}
        onClick={() => {
          handleHEadingChange(3);
        }}
      >
        H 3
      </h3>
      <h4
        className={`dropdown-item dropdown-item-${
          theme.isDark ? "dark" : "light"
        }`}
        onClick={() => {
          handleHEadingChange(4);
        }}
      >
        H 4
      </h4>
      <h5
        className={`dropdown-item dropdown-item-${
          theme.isDark ? "dark" : "light"
        }`}
        onClick={() => {
          handleHEadingChange(5);
        }}
      >
        H 5
      </h5>
      <h6
        className={`dropdown-item dropdown-item-${
          theme.isDark ? "dark" : "light"
        }`}
        onClick={() => {
          handleHEadingChange(6);
        }}
      >
        H 6
      </h6>
      <p
        className={`dropdown-item dropdown-item-${
          theme.isDark ? "dark" : "light"
        }`}
        onClick={() => {
          handleHEadingChange(7);
        }}
      >
        Normal
      </p>
    </div>
  );
  async function handleHEadingChange(val) {
    setHeadingBtnVal(val);
    if (val === 7) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor
        .chain()
        .focus()
        .setHeading({ level: parseInt(val) })
        .run();
    }
  }
};

export default Heading;
