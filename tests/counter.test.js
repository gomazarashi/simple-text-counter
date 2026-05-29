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
  evaluateCharacterLimit,
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
    paragraphCount: 0
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

test("treats an empty limit as unlimited", () => {
  assert.deepEqual(evaluateCharacterLimit(10, ""), {
    state: "unlimited",
    limit: null,
    remaining: null,
    exceeded: 0
  });
});

test("counts remaining characters at the limit boundary", () => {
  assert.deepEqual(evaluateCharacterLimit(5, 5), {
    state: "warning",
    limit: 5,
    remaining: 0,
    exceeded: 0
  });
});

test("counts exceeded characters beyond the limit", () => {
  assert.deepEqual(evaluateCharacterLimit(6, 5), {
    state: "exceeded",
    limit: 5,
    remaining: -1,
    exceeded: 1
  });
});

test("uses warning state when remaining characters are 20 or fewer", () => {
  assert.equal(evaluateCharacterLimit(1, 20).state, "warning");
  assert.equal(evaluateCharacterLimit(80, 100).state, "warning");
});

test("uses normal state when remaining characters are above the warning threshold", () => {
  assert.deepEqual(evaluateCharacterLimit(79, 100), {
    state: "normal",
    limit: 100,
    remaining: 21,
    exceeded: 0
  });
});

test("treats zero as a valid limit", () => {
  assert.equal(evaluateCharacterLimit(0, 0).state, "warning");
  assert.equal(evaluateCharacterLimit(1, 0).state, "exceeded");
});

test("supports grapheme-based limit checks for emoji", () => {
  const graphemeCount = countGraphemes("👍🏽");
  assert.equal(graphemeCount, 1);
  assert.deepEqual(evaluateCharacterLimit(graphemeCount, 1), {
    state: "warning",
    limit: 1,
    remaining: 0,
    exceeded: 0
  });
});
