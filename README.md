# α+ 公式ファンサイト

## フォルダ構成

```
alpha_plus/
├── index.html          ← メインページ（HTMLのみ）
├── css/
│   └── style.css       ← デザイン・レイアウト
├── js/
│   ├── app.js          ← ナビ・スパークルなど共通処理
│   ├── members.js      ← メンバーデータ & メンバーページ
│   └── events.js       ← イベントデータ & イベントページ
├── images/
│   └── group.jpeg      ← グループ写真（ここに画像を置く）
└── README.md           ← このファイル
```

## 使い方

1. このフォルダをまるごとダウンロード
2. `images/` フォルダにグループ写真を入れる（ファイル名: `group.jpeg`）
3. `index.html` をブラウザで開く

## データの編集方法

### メンバー情報を変えたい
→ `js/members.js` の `MEMBERS` 配列を編集

```js
{
  id: 1,
  name: '名前',         // ← ここを変える
  birth: '2003年5月3日', // ← 誕生日
  from: '東京都',        // ← 出身地
  role: 'センター',      // ← 担当
  hobby: '歌うこと',     // ← 趣味
  catch: '笑顔でつながる♡', // ← キャッチフレーズ
  ...
}
```

### イベント情報を変えたい
→ `js/events.js` の `EVENTS` 配列を編集

```js
{
  id: 1,
  name: 'ライブ名',      // ← イベント名
  type: 'live',          // ← live / event / release / fc
  date: '2026-05-03',    // ← 日付（YYYY-MM-DD形式）
  place: '○○ホール',    // ← 場所
}
```

### デザインを変えたい
→ `css/style.css` の `:root` にある色変数を編集

```css
:root {
  --pink:    #f472b6;  ← メインカラー
  --pink-l:  #fce7f3;  ← 薄いピンク
  --blue:    #7dd3fc;  ← ブルー
}
```
