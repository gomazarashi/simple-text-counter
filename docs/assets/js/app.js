/*
 * app.js
 * DOM bindings for Private Text Counter.
 */

import { countText } from "./counter.js";

const textInput = document.querySelector("#text-input");
const clearButton = document.querySelector("#clear-button");

const outputMap = {
  graphemeCount: document.querySelector("#grapheme-count"),
  withoutWhitespaceCount: document.querySelector("#without-whitespace-count"),
  codePointCount: document.querySelector("#code-point-count"),
  utf16CodeUnitCount: document.querySelector("#utf16-code-unit-count"),
  utf8ByteCount: document.querySelector("#utf8-byte-count"),
  lineCount: document.querySelector("#line-count"),
  paragraphCount: document.querySelector("#paragraph-count")
};

function formatCount(value) {
  return new Intl.NumberFormat("ja-JP").format(value);
}

function renderCounts(text) {
  const counts = countText(text);

  for (const [key, value] of Object.entries(counts)) {
    outputMap[key].textContent = formatCount(value);
  }
}

textInput.addEventListener("input", () => {
  renderCounts(textInput.value);
});

clearButton.addEventListener("click", () => {
  textInput.value = "";
  renderCounts("");
  textInput.focus();
});

renderCounts("");
