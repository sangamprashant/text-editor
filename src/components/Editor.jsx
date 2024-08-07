import { EditorContent } from "@tiptap/react";
import nlp from "compromise";
import "compromise-sentences";
import React, { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../context";
import "./Editor.css";
import MenuBar from "./modules/MenuBar";
import ModalComponent from "./modules/ModalComponent";
import PlagResult from "./modules/PlagResult";
import ToolBars from "./modules/ToolBars";
import WordFrequencies from "./modules/WordFrequencies";
import { stopWords } from "./stopWords";

const Editor = () => {
  const { editor, plainText, theme } = useAppContext();
  const [wordFrequencies, setWordFrequencies] = useState([]);

  useEffect(() => {
    if (!editor || !editor.state || !editor.state.doc) {
      return;
    }

    const words = [];
    editor.state.doc.descendants((node) => {
      if (node.isText) {
        const textContent = node.text;
        const textWords = textContent.split(/\s+/);
        words.push(...textWords);
      } else if (node.type.name === "tableCell") {
        const cellContent = node.textContent;
        const cellWords = cellContent.split(/\s+/);
        words.push(...cellWords);
      }
      return true;
    });

    const frequencyMap = {};
    words.forEach((word) => {
      const trimmedWord = word.trim();
      const lowercaseWord = trimmedWord.toLowerCase();
      if (lowercaseWord && !stopWords.has(lowercaseWord)) {
        frequencyMap[lowercaseWord] = (frequencyMap[lowercaseWord] || 0) + 1;
      }
    });

    const sortedWordFrequencies = Object.entries(frequencyMap)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count);

    setWordFrequencies(sortedWordFrequencies);
    handleContentChange(words);
  }, [editor?.state?.doc]);

  const handleContentChange = useCallback((newContent) => {
    // Join the words to form a complete text
    const text = newContent.join(" ");

    // Process the text with compromise to identify sentences
    const doc = nlp(text);
    const sentences = doc.sentences().out("array");

    // Filter out sentences with fewer than three words
    const filteredSentences = sentences.filter((sentence) => {
      const wordCount = sentence.split(/\s+/).length;
      return wordCount >= 3;
    });

    // Split the filtered sentences back into words
    const filteredWords = filteredSentences.join(" ").split(/\s+/);

    // Update the plain text content
    const newPlainTextContent = filteredWords.join(" ");
    plainText.setPlainTextContent(newPlainTextContent);
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.ctrlKey && event.key >= "1" && event.key <= "9") {
        const index = parseInt(event.key) - 1;
        if (index < wordFrequencies.length && editor) {
          const selectedWord = wordFrequencies[index].word;
          editor?.commands?.insert(" " + selectedWord);
        }
        event.preventDefault();
      }
    },
    [editor, wordFrequencies]
  );

  const handleEnterPress = useCallback(
    (event) => {
      if (event.key === "Enter" && editor) {
        handleEnterSpace(event);
      }
    },
    [editor]
  );

  if (!editor) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <ModalComponent />
      <MenuBar />
      <div className="main-container">
        <div className="editor-container">
          <ToolBars />
          <EditorContent
            id="editor-container"
            editor={editor}
            className={`custom-editor shadow-editor custom-editor-${
              theme.isDark ? "night" : "day"
            }`}
            onKeyDown={(e) => {
              handleKeyDown(e);
              handleEnterPress(e);
            }}
            tabIndex={0}
          />
        </div>
        <div className="word-frequency-container">
          <WordFrequencies wordFrequencie={wordFrequencies} />
          <PlagResult />
        </div>
      </div>
    </>
  );

  function handleEnterSpace(event) {
    editor?.commands?.insert(" ");
    event.preventDefault();
  }
};

export default Editor;
