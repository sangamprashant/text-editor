import { Progress } from "antd";
import React from "react";
import { useAppContext } from "../../context";

function getColor(percentage) {
  if (percentage < 10) {
    return "green";
  } else if (percentage < 20) {
    return "lightgreen";
  } else if (percentage < 30) {
    return "yellow";
  } else if (percentage < 40) {
    return "gold";
  } else if (percentage < 50) {
    return "orange";
  } else if (percentage < 60) {
    return "darkorange";
  } else if (percentage < 70) {
    return "orangered";
  } else if (percentage < 80) {
    return "red";
  } else if (percentage < 90) {
    return "darkred";
  } else {
    return "maroon";
  }
}

const PlagiarismWindow = () => {
  const { plag } = useAppContext();
  return (
    <>
      <p>
        <b>Plagiarism Report:</b>{" "}
        <span style={{ color: getColor(plag.plagResult.average_score) }}>
          {Math.min(plag.plagResult.average_score, 100).toFixed(2)}%
        </span>
      </p>
      <p>
        <b>AI Report:</b>{" "}
        <span style={{ color: getColor(plag.plagResult.ai_percentage) }}>
          {Math.min(plag.plagResult.ai_percentage, 100).toFixed(2)}%
        </span>
      </p>
      <p>
        <strong>Content Label:</strong>{" "}
        <span style={{ color: "green" }}>{plag.plagResult.content_label}</span>
      </p>
      <p>
        <b>GPT detection:</b>{" "}
        <span style={{ color: "green" }}>
          {plag.plagResult.gptzero_me_label}
        </span>
      </p>
      <hr />
      <h5>Plagiarism report on each sentence</h5>
      <div className="plag-report">
        {plag.plagResult.sentence_scores.map((data, index) => {
          const score = Math.min(data[1], 100).toFixed(2);
          return (
            <React.Fragment key={index}>
              <p>{data[0]}</p>
              <Progress
                percent={score}
                showInfo={false}
                strokeColor={getColor(score)}
              />
              <span style={{  color: getColor(score) }}>
                {score}%
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default PlagiarismWindow;
