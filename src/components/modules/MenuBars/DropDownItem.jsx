import React from "react";
import { useAppContext } from "../../../context";

const DropDownItem = ({ title, onClick }) => {
  const { theme } = useAppContext();
  return (
    <p
      className={`dropdown-item ${
        theme.isDark ? "dropdown-item-dark" : "dropdown-item-light"
      }`}
      onClick={onClick}
    >
      {title}
    </p>
  );
};

export default DropDownItem;
