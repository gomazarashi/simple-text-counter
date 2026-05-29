# Private Text Counter

ブラウザ内だけで文字数を数える、シンプルな静的テキストカウンターです。

## 概要

- 入力内容を外部送信しません
- 入力内容を保存しません

## 使い方

`docs/index.html` をブラウザで開くと利用できます。


```bash
python3 -m http.server 8000
```

その後、次を開きます。

```text
http://localhost:8000/docs/
```

## 公開

GitHub Pages では `docs/` を公開対象に設定します。

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
- 単語らしき要素数

## English summary

This is a static, client-side text counter for GitHub Pages.

It does not send, store, log, or transmit entered text. It uses no analytics, no ads, no external scripts, no CDN, no cookies, no localStorage, no sessionStorage, and no IndexedDB.

## License

MIT
