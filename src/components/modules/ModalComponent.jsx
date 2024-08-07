import React from "react";
import { useAppContext } from "../../context";

const CustomModal = () => {
  const { modal, theme } = useAppContext();

  if (!modal.isModalOpen) return null;

  return (
    <div
      className="custom-modal-overlay"
      onClick={() => modal.setIsModelOpen(false)}
    >
      <div
        className={`custom-modal ${theme.isDark ? "dark-theme" : ""}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: `${modal.modalWidth != 0 ? modal.modalWidth : 500}px`,
        }}
      >
        <div className="custom-modal-header">
          <div className="custom-modal-title">{modal.modalTitle}</div>
          <div
            className="custom-modal-close"
            onClick={() => modal.setIsModelOpen(false)}
          >
            &times;
          </div>
        </div>
        <div className="custom-modal-content">{modal.modalContent}</div>
        <div className="custom-modal-footer">
          <button onClick={() => modal.setIsModelOpen(false)}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
