/*
 * counter.test.js
 * Tests for Private Text Counter pure counting functions.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  countCodePoints,
  countGraphemes,
  countGraphemesWithoutWhitespace,
  countLines,
  countParagraphs,
  countText,
  countWords,
  countUtf16CodeUnits,
  countUtf8Bytes
} from "../docs/assets/js/counter.js";

test("counts empty text", () => {
  assert.deepEqual(countText(""), {
    graphemeCount: 0,
    withoutWhitespaceCount: 0,
    codePointCount: 0,
    utf16CodeUnitCount: 0,
    utf8ByteCount: 0,
    lineCount: 0,
    paragraphCount: 0,
    wordCount: 0
  });
});

test("counts basic Japanese text", () => {
  const text = "こんにちは";
  assert.equal(countGraphemes(text), 5);
  assert.equal(countCodePoints(text), 5);
  assert.equal(countUtf16CodeUnits(text), 5);
});

test("counts whitespace-excluded graphemes", () => {
  assert.equal(countGraphemesWithoutWhitespace("a b\n c"), 3);
});

test("counts lines", () => {
  assert.equal(countLines("a"), 1);
  assert.equal(countLines("a\nb"), 2);
  assert.equal(countLines("a\r\nb"), 2);
  assert.equal(countLines("a\n"), 2);
});

test("counts paragraphs", () => {
  assert.equal(countParagraphs("a\n\nb"), 2);
  assert.equal(countParagraphs(" a \n\n\n b "), 2);
  assert.equal(countParagraphs("a\n \nb"), 2);
  assert.equal(countParagraphs("a\n\t\nb"), 2);
});

test("distinguishes code points and UTF-16 code units for emoji", () => {
  const text = "😀";
  assert.equal(countCodePoints(text), 1);
  assert.equal(countUtf16CodeUnits(text), 2);
});

test("counts UTF-8 bytes", () => {
  assert.equal(countUtf8Bytes("a"), 1);
  assert.equal(countUtf8Bytes("あ"), 3);
});

test("counts word-like segments", () => {
  assert.equal(countWords("こんにちは 世界"), 2);
  assert.equal(countWords("hello world"), 2);
  assert.equal(countWords("!!!"), 0);
});
