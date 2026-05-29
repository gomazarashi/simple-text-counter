/*
 * counter.js
 * Pure counting functions for Private Text Counter.
 */

const whitespacePattern = /\s/gu;

const lineBreakPattern = /\r\n|\r|\n/g;

const paragraphSeparatorPattern = /(?:\r\n|\r|\n)(?:[\t \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\f\v]*(?:\r\n|\r|\n))+/;

let graphemeSegmenter = null;

function getGraphemeSegmenter() {
  if (graphemeSegmenter !== null) {
    return graphemeSegmenter;
  }

  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    graphemeSegmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
    return graphemeSegmenter;
  }

  graphemeSegmenter = undefined;
  return graphemeSegmenter;
}

export function countGraphemes(text) {
  const segmenter = getGraphemeSegmenter();

  if (segmenter === undefined) {
    return Array.from(text).length;
  }

  return Array.from(segmenter.segment(text)).length;
}

export function countGraphemesWithoutWhitespace(text) {
  const textWithoutWhitespace = text.replace(whitespacePattern, "");
  return countGraphemes(textWithoutWhitespace);
}

export function countCodePoints(text) {
  return Array.from(text).length;
}

export function countUtf16CodeUnits(text) {
  return text.length;
}

export function countUtf8Bytes(text) {
  return new TextEncoder().encode(text).length;
}

export function countLines(text) {
  if (text.length === 0) {
    return 0;
  }

  return text.split(lineBreakPattern).length;
}

export function countParagraphs(text) {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return 0;
  }

  return trimmed
    .split(paragraphSeparatorPattern)
    .filter((paragraph) => paragraph.trim().length > 0)
    .length;
}

export function countText(text) {
  return {
    graphemeCount: countGraphemes(text),
    withoutWhitespaceCount: countGraphemesWithoutWhitespace(text),
    codePointCount: countCodePoints(text),
    utf16CodeUnitCount: countUtf16CodeUnits(text),
    utf8ByteCount: countUtf8Bytes(text),
    lineCount: countLines(text),
    paragraphCount: countParagraphs(text)
  };
}
