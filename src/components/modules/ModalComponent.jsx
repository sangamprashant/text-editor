import React from "react";
import { useAppContext } from "../../context";

import PrintIcon from "@mui/icons-material/Print";
import html2pdf from "html2pdf.js";

const CustomModal = () => {
  const { modal, theme } = useAppContext();

  if (!modal.isModalOpen) return null;

  const handlePrint = () => {
    const content = document.getElementById("plag-window-print-data").innerHTML;

    if (window.electron) {
      // In Electron environment
      window.electron.saveAsPDF(content);
    } else {
      // In web environment
      const element = document.getElementById("plag-window-print-data");
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
          maxHeight: "80vh",
          overflowY: "auto",
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
          {modal.ctr === "print" && (
            <button className="print" onClick={handlePrint}>
              Print
            </button>
          )}

          <button onClick={() => modal.setIsModelOpen(false)}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
