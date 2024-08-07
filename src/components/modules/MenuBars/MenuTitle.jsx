import React from "react";
import { useAppContext } from "../../../context";

const MenuTitle = ({ title }) => {
  const { theme } = useAppContext();
  return (
    <p className={`menu-title ${theme.isDark ? "dark" : "light"}`}>
      {title}
    </p>
  );
};

export default MenuTitle;
