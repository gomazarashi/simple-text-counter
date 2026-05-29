# Private Text Counter

ブラウザ内だけで文字数を数える、シンプルな静的テキストカウンターです。

## 概要

- 入力内容を外部送信しません
- 入力内容を保存しません

## 使い方

こちらで使用できます。

[https://gomazarashi.com/simple-text-counter/](https://gomazarashi.com/simple-text-counter/)

ローカルで確認する場合は、`docs/index.html` をブラウザで開きます。

```bash
python3 -m http.server 8000
```

その後、次を開きます。

```text
http://localhost:8000/docs/
```

## テスト

Node.js が入っていれば依存関係なしで実行できます。

```bash
npm test
```

## カウント仕様

主表示の「見た目上の文字数」は、可能な場合 `Intl.Segmenter` の `grapheme` 分割で数えます。非対応環境では `Array.from(text).length` を使います。

- Unicodeコードポイント数
- JavaScript length
- UTF-8バイト数
- 空白除外文字数
- 行数
- 段落数

## 追加機能

- 文字数上限をその場で設定できます
- 上限に対する残り文字数、超過文字数を表示します
- 残り20文字以下で警告表示します

文字数上限の判定は、主表示と同じ「見た目上の文字数」を基準に行います。

## English summary

This is a static, client-side text counter for GitHub Pages.

It does not send, store, log, or transmit entered text. It uses no analytics, no ads, no external scripts, no CDN, no cookies, no localStorage, no sessionStorage, and no IndexedDB.

## License

MIT
