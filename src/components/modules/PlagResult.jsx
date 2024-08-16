import React from "react";
import PlagiarismWindow from "./PlagiarismWindow";
import { useAppContext } from "../../context";

const PlagResult = () => {
  const { modal, plag, theme } = useAppContext();

  if (!plag.plagResult) {
    return null;
  }
  return (
    <div className="plag-main">
      <hr />
      <div className="plag-container">
        <h4
          style={{
            fontWeight: "bold",
            color: theme.isDark ? "white" : "#333",
          }}
        >
          Plagiarism Report:{" "}
          <span style={{ color: "green" }}>
            {Math.min(plag.plagResult.average_score, 100).toFixed(2)}%
          </span>
        </h4>
        <button onClick={showPlag}>See Result</button>
      </div>
    </div>
  );

  async function showPlag() {
    modal.handleModel(
      1000,
      "Text editor says! - Plagiarism Report",
      <PlagiarismWindow />,
      "print"
    );
  }
};

export default PlagResult;
