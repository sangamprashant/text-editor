import React from "react";
import { useAppContext } from "../../context";

const WordFrequencies = ({ wordFrequencie }) => {
  const { theme } = useAppContext();
  return (
    <div className={`${theme.isDark ? "text-white" : "text-dark"}`}>
      <h3>Word Frequencies</h3>
      <code>
        <i>Top 5 repeted words</i>
      </code>
      <h5>shortcut is Ctrl + (pos)</h5>
      <ul className="word-list">
        <ul className="word-list">
          {wordFrequencie.slice(0, 5).map((data, index) => (
            <li
              key={index}
              className={`shadow ${theme.isDark ? "bg-black" : "bg-white"}`}
            >
              <span className={`index index-${index + 1}`}>{index + 1}</span>
              <div className="word-list-word-count">
                <div className="word-container">
                  <span className="word">{data.word}</span>
                </div>
              </div>
              <div className="count">
                <span className=" ">{data.count}</span>
              </div>
            </li>
          ))}
        </ul>

        {wordFrequencie.length === 0 && (
          <div className="text-center">
            <img
              src={`nodata-${theme.isDark ? "night" : "day"}.png`}
              alt=""
              width="100%"
              style={{
                margin:"40px 0 0 0",
                maxWidth:"100px"
              }}
            />
            <h5 className="">
              <b>There are no items here!</b>
            </h5>
            <p>Start typing your content</p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default WordFrequencies;
