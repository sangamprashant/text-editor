import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Editor.css";
import { modules } from "./EditorModels";

const Editor = () => {
  const [content, setContent] = useState<string>("");
  const [plainTextContent, setPlainTextContent] = useState<string>("");
  const [wordFrequencies, setWordFrequencies] = useState<
    { word: string; count: number }[]
  >([]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    const tempElement = document.createElement("div");
    tempElement.innerHTML = newContent;
    const textContent = tempElement.textContent || tempElement.innerText || "";
    setPlainTextContent(textContent);
  };

  useEffect(() => {
    const words = plainTextContent.toLowerCase().match(/\b\w+\b/g);
    if (words) {
      const frequencyMap: { [key: string]: number } = {};
      words.forEach((word) => {
        frequencyMap[word] = (frequencyMap[word] || 0) + 1;
      });
      const sortedWordFrequencies = Object.entries(frequencyMap)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count);
      setWordFrequencies(sortedWordFrequencies);
    } else {
      setWordFrequencies([]);
    }
  }, [plainTextContent]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.ctrlKey) {
      switch (event.key) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "0":
          const index = parseInt(event.key) - 1;
          if (index < wordFrequencies.length) {
            const selectedWord = wordFrequencies[index].word;
            // Add a space before appending the selected word
            const newContent = content.endsWith(" ")
              ? `${content}${selectedWord}`
              : `${content} ${selectedWord}`;
            setContent(newContent);
            handleContentChange(newContent);
          }
          event.preventDefault();
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="main-container" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="writer-container">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={handleContentChange}
          modules={modules}
          className="quill-editor"
        />
      </div>

      <div className="word-frequency-container">
        <h3>Word Frequencies</h3>
        <ul className="word-list">
          {wordFrequencies.slice(0, 10).map((data, index) => (
            <li key={index}>
              <span className="index">{index + 1}</span>:{" "}
              <span className="word">{data.word}</span>{" "}
              <span className="count">({data.count})</span>
            </li>
          ))}
        </ul>
        <div>{content}</div>
      </div>
    </div>
  );
};

export default Editor;
