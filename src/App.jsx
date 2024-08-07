import React from "react";
import Editor from "./components/Editor";
import { useAppContext } from "./context";
import "./css/App.css";
import "./css/MenuBar.css";
import "./css/Modal.css"

const App = () => {
  const { theme } = useAppContext();
  return (
    <div className={`app theme-${theme.isDark ? "dark" : "light"}`}>
      <Editor />
    </div>
  );
};

export default App;
