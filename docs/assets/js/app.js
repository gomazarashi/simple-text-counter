/*
 * app.js
 * DOM bindings for Private Text Counter.
 */

import { countText, evaluateCharacterLimit } from "./counter.js";

function formatCount(value) {
  return new Intl.NumberFormat("ja-JP").format(value);
}

function getLimitMessage(limitEvaluation) {
  switch (limitEvaluation.state) {
    case "warning":
      return "上限に近づいています。残り文字数を確認してください。";
    case "exceeded":
      return "上限を超えています。必要に応じて入力内容を調整してください。";
    default:
      return "";
  }
}

function renderCounts(text, rawLimit, elements) {
  const {
    textInput,
    limitStatusLabel,
    limitStatusValue,
    limitMessage,
    limitPanel,
    outputMap
  } = elements;
  const counts = countText(text);
  const limitEvaluation = evaluateCharacterLimit(counts.graphemeCount, rawLimit);

  for (const [key, value] of Object.entries(counts)) {
    outputMap[key].textContent = formatCount(value);
  }

  limitPanel.dataset.limitState = limitEvaluation.state;
  textInput.dataset.limitState = limitEvaluation.state;
  limitMessage.dataset.limitState = limitEvaluation.state;

  if (limitEvaluation.state === "unlimited") {
    limitStatusLabel.textContent = "文字数上限";
    limitStatusValue.textContent = "未設定";
    limitMessage.hidden = true;
    limitMessage.textContent = "";
    return;
  }

  if (limitEvaluation.state === "exceeded") {
    limitStatusLabel.textContent = "超過文字数";
    limitStatusValue.textContent = formatCount(limitEvaluation.exceeded);
  } else {
    limitStatusLabel.textContent = "残り文字数";
    limitStatusValue.textContent = formatCount(limitEvaluation.remaining);
  }

  const message = getLimitMessage(limitEvaluation);
  limitMessage.hidden = message.length === 0;
  limitMessage.textContent = message;
}

function getRequiredElement(selector) {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`Required element not found: ${selector}`);
  }

  return element;
}

function initApp() {
  const textInput = getRequiredElement("#text-input");
  const clearButton = getRequiredElement("#clear-button");
  const limitInput = getRequiredElement("#character-limit");
  const limitStatusLabel = getRequiredElement("#limit-status-label");
  const limitStatusValue = getRequiredElement("#limit-status-value");
  const limitMessage = getRequiredElement("#limit-message");
  const limitPanel = getRequiredElement("#limit-panel");

  const outputMap = {
    graphemeCount: getRequiredElement("#grapheme-count"),
    withoutWhitespaceCount: getRequiredElement("#without-whitespace-count"),
    codePointCount: getRequiredElement("#code-point-count"),
    utf16CodeUnitCount: getRequiredElement("#utf16-code-unit-count"),
    utf8ByteCount: getRequiredElement("#utf8-byte-count"),
    lineCount: getRequiredElement("#line-count"),
    paragraphCount: getRequiredElement("#paragraph-count")
  };

  const elements = {
    textInput,
    limitStatusLabel,
    limitStatusValue,
    limitMessage,
    limitPanel,
    outputMap
  };

  textInput.addEventListener("input", () => {
    renderCounts(textInput.value, limitInput.value, elements);
  });

  limitInput.addEventListener("input", () => {
    renderCounts(textInput.value, limitInput.value, elements);
  });

  clearButton.addEventListener("click", () => {
    textInput.value = "";
    renderCounts("", limitInput.value, elements);
    textInput.focus();
  });

  renderCounts("", limitInput.value, elements);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp, { once: true });
} else {
  initApp();
}
