import React from "react";
import { useAppContext } from "../../../context";

const Confirm = ({ content, onCancel, onOk }) => {
  const { theme } = useAppContext();

  return (
    <div className="custom-modal-overlay">
      <div
        className={`custom-modal ${theme.isDark ? "dark-theme" : ""}`}
        style={{
          maxWidth: `500px`,
        }}
      >
        <div className="custom-modal-header">
          <div className="custom-modal-title">Text editor says!</div>
        </div>
        <div className="custom-modal-content">{content}</div>
        <div className="custom-modal-footer">
          <button onClick={onOk}>OK</button>

          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
