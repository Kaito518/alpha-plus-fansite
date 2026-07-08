/**
 * α+ 公式ファンサイト
 * members.js — メンバーデータ & メンバーページ描画
 *
 * ★ メンバー情報を実際のデータに変えるときはここを編集してください ★
 * ★ memberColor に各メンバーのカラーコードを入れてください ★
 */

/* ================================================
   メンバーデータ
   ※ memberColor: '' は未設定。カラーコード（例: '#f9a8d4'）を入れてください
   ================================================ */
const MEMBERS = [
  /* ── リーダー ── */
  {
    id: 1,
    name: "木野 菓子",
    nameRuby: "きの りこ",
    nickname: "きのりこ、りこちゃむ 🐱",
    from: "京都府",
    height: "162cm",
    blood: "B型",
    mbti: "ESFP",
    hobby:
      "お料理、アニメを見ること、食べること、ボディーメイク、岩盤浴、カフェ探掘、絵を描く",
    skill:
      "眉毛を片方ずつピクピク動かせること！韓国語、K-POPカバーダンス、サッカーとかスポーツ",
    bestSong: "TWICEさん「Be as ONE」「ONE IN A MILLION」",
    ifLeader: "We are family♡ 家族みたいに温かいグループにします♡",
    message: 'みんなの毎日に少しでも"彩り"を届けられますように 🌸',
    isLeader: true,
    illust: "member_riko.jpg",
    memberColor: "#4ade80", // 緑色
    emoji: "🐱",
    sns: { x: "", instagram: "", tiktok: "" },
  },

  /* ── 五十音順 ── */
  {
    id: 2,
    name: "沖 玲萌",
    nameRuby: "おき れもに",
    nickname: "れもにん、れもちゃん、れも🍋",
    from: "神奈川県横浜市",
    height: "152cm",
    blood: "O型（マイペース）",
    mbti: "ENFP-T",
    hobby:
      "アニメを見る、キャンプ（暖）スノーボード（冬）、シベリアンハスキーの動画を見る",
    skill:
      "アドリブのトーク、バンジージャンプ、つなわたり、洋楽早覚え、知らない人に声をかけること、動物に好かれること、部屋をちらかすこと、忘れ物をしてたられること",
    bestSong: "えりあし / aikoさん",
    ifLeader:
      "メンバーの相談に乗ることが99いので、れもに相談所を作ります♡ Love & peace.",
    message:
      "Tack för att ni kom hit idag. Att få träffa er gör mitt liv underbart. Jag älskar er mest av allt i hela världen.",
    isLeader: false,
    memberColor: "#fde047", // 黄色
    illust: "member_remon.jpg",
    emoji: "🍋",
    sns: { x: "", instagram: "", tiktok: "" },
  },
  {
    id: 3,
    name: "桜井 心々奈",
    nameRuby: "さくらい ここな",
    nickname: "ここちゃん、こっちゃん♡",
    from: "香川県",
    height: "164cm",
    blood: "O型",
    mbti: "ENFP",
    hobby: "歌をうたうこと、服を買うこと",
    skill: "反復横とび（20秒で72回）、走り高とび、うた",
    bestSong: "Umbrella / Mrs.GREEN APPLEさん",
    ifLeader: "みんなにうどんを食べさせる、ほめてのばす！",
    message:
      "最年少だけど成長速度はたけのこより速い！みんなに笑顔と元気を届けられるように頑張ります",
    isLeader: false,
    memberColor: "#f1f5f9", // 白色
    illust: "member_kokona.jpg",
    emoji: "🌸",
    sns: { x: "", instagram: "", tiktok: "" },
  },
  {
    id: 4,
    name: "白森 萌美",
    nameRuby: "しらもり めぐみ",
    nickname: "めぐ、めぐみ",
    from: "東京都",
    height: "161cm",
    blood: "AB型",
    mbti: "INFP",
    hobby: "景色や花の写真を撮る、洋館巡り",
    skill: "ダンス（K-POP系）、ヘアアレンジ",
    bestSong: "Girls2さんの曲",
    ifLeader:
      "皆がかわいいのレッスンバッグを買って、メンカラのストラップを付ける（強制）",
    message:
      "わちゃわちゃしてる日も、真剣な日も、全部ひっくるめて家族みたいなα+をこれからも見守ってください！！",
    isLeader: false,
    memberColor: "#d8b4fe", // 薄紫色
    illust: "member_megumi.jpg",
    emoji: "📷",
    sns: { x: "", instagram: "", tiktok: "" },
  },
  {
    id: 5,
    name: "鈴宮 ゆつき",
    nameRuby: "すずみや ゆつき",
    nickname: "ゆっちゃん、ゆっさん",
    from: "静岡県",
    height: "150cm",
    blood: "O型",
    mbti: "INFP",
    hobby: "進撃の巨人を見る、すいみん2度寝、ちいかわ集め",
    skill:
      "辛い食べ物を水を飲まずに食べる、ボカロを原キーで歌う（高いやつ）、特殊メイク",
    bestSong: "美しき残酷な世界 / 日笠陽子",
    ifLeader: "筋トレをいっぱいさせる、メンバーカラーに髪を染めさせる",
    message: "ツインテールと意志は高く、ベビーピンク担当らしくかんばります",
    isLeader: false,
    memberColor: "#fbcfe8", // ベビーピンク
    illust: "member_yutsuki.jpg",
    emoji: "💜",
    sns: { x: "", instagram: "", tiktok: "" },
  },
  {
    id: 6,
    name: "瀬乃 真帆子",
    nameRuby: "せの まほこ",
    nickname: "まっこん♡、まほちゃん♡",
    from: "静岡県",
    height: "154cm",
    blood: "B型",
    mbti: "ESFP-A",
    hobby:
      "歌うこと、表現すること！おどること！ごアイドルぴたり♡、ペットのモーニー🐱とルーシー🐶とたわむれること♡",
    skill:
      "ドラム！叩けます！出来ます！7年間のチアダンスで得た、人を笑顔にするパフォーマンス♡",
    bestSong: "私、アイドル宣言 / monaちゃんTTO♡",
    ifLeader: "怒るときにバーン！擬音語ばかりで伝わらない。バーン！",
    message:
      "まほを推して後悔させない！🩷まっこんにどっこんして〜♡♡♡ 赤色最強天才沼系甘々熱血アイドル推しに♡",
    isLeader: false,
    memberColor: "#f87171", // 赤色
    illust: "member_mahoko.jpg",
    emoji: "❤️",
    sns: { x: "", instagram: "", tiktok: "" },
  },
  {
    id: 7,
    name: "高橋 美羽",
    nameRuby: "たかはし みう",
    nickname: "みう、みうちゃん、みうみう",
    from: "東京都",
    height: "158cm",
    blood: "B型",
    mbti: "ESFP-A",
    hobby: "どくがくで音楽、温泉巡り、旅行",
    skill: "うたをうたうこと、声まね（しんちゃん・スティッチ）",
    bestSong: "安室奈美恵さんの曲！",
    ifLeader: "空間をゆるふわに！みんなかわい〜",
    message: "水色担当のたかはし みうです♡ みんなを笑顔にするね🩵。",
    isLeader: false,
    memberColor: "#7dd3fc", // 水色
    illust: "member_miu.jpg",
    emoji: "🩵",
    sns: { x: "", instagram: "", tiktok: "" },
  },
  {
    id: 8,
    name: "月島 優々乃",
    nameRuby: "つきしま ゆゆの",
    nickname: "ゆゆちゃん、ゆーの",
    from: "大阪府",
    height: "157cm",
    blood: "O型",
    mbti: "ENFJ",
    hobby:
      "ディズニーシーに行く！サウナ・岩盤浴・推しを拝む、YouTube（フーさんとゆっぴさん、さくらちゃん）",
    skill:
      "ストリートダンス！振り付け！好きになったらずっと好きでいられる！推しカメめっちゃ上手だよ（笑）",
    bestSong: "Pixel Ribbonさん「アイセルピクセル」「花束アンコール」",
    ifLeader:
      "話すスピードを5倍速に教育して、全員関西弁に染めてやる〜！加はメンケア1日1時間もらいます（絶対ね？）",
    message:
      "あるぷすちゃんを大好きでいてくれて、ありがとう♡ 一緒にいろんな景色を見に行こうね！ずっとそばにいてみんなの元気の源でいられますように。だいしゅき😍",
    isLeader: false,
    memberColor: "#60a5fa", // 青色
    illust: "member_yuyuno.jpg",
    emoji: "🌙",
    sns: { x: "", instagram: "", tiktok: "" },
  },
  {
    id: 9,
    name: "西野 日菜乃",
    nameRuby: "にしの ひなの",
    nickname: "ひなのん",
    from: "大阪（なにわ）",
    height: "150cm みーとる",
    blood: "おしえなーい！！（知らない）",
    mbti: "ENFP-T（げんき！！）",
    hobby: "おかし作り、モンチッチあつめ、歌うこと、爆食",
    skill:
      "プリクラの落書き、おしゃべり！（声でかい）、これから特技になる予定★ ギター",
    bestSong: "僕のヒロイン",
    ifLeader: "メンバーにマカロンを1コ300円で売りつける！",
    message: "ニコニコな笑顔で元気を届けるよ〜！♡ みんなの太陽になる！！！☀️",
    isLeader: false,
    memberColor: "#fb923c", // オレンジ
    illust: "member_hinano.jpg",
    emoji: "☀️",
    sns: { x: "", instagram: "", tiktok: "" },
  },
  {
    id: 10,
    name: "華咲 ひまり",
    nameRuby: "はなさき ひまり",
    nickname: "ひまちゃん",
    from: "茨城県",
    height: "149cm",
    blood: "A型",
    mbti: "ESFJ",
    hobby: "サーティワンの新作をチェック、デジカメで景色をとる、コスメ集め",
    skill: "ダンス、お絵描き、細かい作業、セルフネイルエ作",
    bestSong: "back numberさん「わたがし」",
    ifLeader:
      "メンバーみんなが見合い、それぞれが成長できる温かいグループをつくれるリーダーになりたい！！★",
    message:
      "いつも応援してくれてありがとね。みんなのことがだいすきだよ♡ これからも一緒に色んな景色みにいくね🌸",
    isLeader: false,
    memberColor: "#a3e635", // 黄緑
    illust: "member_himari.jpg",
    emoji: "🌼",
    sns: { x: "", instagram: "", tiktok: "" },
  },
  {
    id: 11,
    name: "湯本 絵美月",
    nameRuby: "ゆもと えみる",
    nickname: "♡えみるん♡",
    from: "千葉県",
    height: "158cm",
    blood: "AB型",
    mbti: "INFP",
    hobby: "たべること😋",
    skill: "パン作り🍞",
    bestSong: "韓ドラOST",
    ifLeader: "毎日、パンを食べさせる😼",
    message:
      "みんなにかわいいを届けて、だれかを救えるようにがんばります！みんな だいすきだよ〜！♡",
    isLeader: false,
    memberColor: "#f472b6", // ピンク
    illust: "member_emiru.jpg",
    emoji: "🍞",
    sns: { x: "", instagram: "", tiktok: "" },
  },
];

/* ================================================
   メンバーカード描画
   ================================================ */
function renderMembers() {
  const grid = document.getElementById("membersGrid");
  if (!grid) return;

  // リーダーを先頭、残りは登録順（五十音順）
  const sorted = [
    ...MEMBERS.filter((m) => m.isLeader),
    ...MEMBERS.filter((m) => !m.isLeader),
  ];

  sorted.forEach((m) => {
    const bg = m.memberColor || "#fce7f3";
    const card = document.createElement("div");
    card.className = "member-card";
    card.innerHTML = `
      ${m.isLeader ? '<div class="member-badge">LEADER</div>' : ""}
      <div class="member-avatar" style="background:${bg}">
        <img src="images/${m.illust}" alt="${m.name}のイラスト" class="member-illust"
          onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
        <span class="member-illust-fallback" style="display:none;font-size:26px">${m.emoji}</span>
      </div>
      <div class="member-color-dot" style="background:${m.memberColor || "#e5e7eb"}"></div>
      <div class="member-name">${m.name}</div>
      <div class="member-ruby">${m.nameRuby}</div>
      <div class="member-nickname">${m.nickname.split("、")[0]}</div>
    `;
    card.addEventListener("click", () => openMemberModal(m));
    grid.appendChild(card);
  });
}

/* ================================================
   SNS ボタン HTML 生成
   ================================================ */
function buildSnsButtons(sns) {
  if (!sns) return "";
  const btns = [];
  if (sns.x)
    btns.push(
      `<a class="sns-btn sns-x"     href="${sns.x}"         target="_blank" rel="noopener"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.629 5.905-5.629zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> X</a>`,
    );
  if (sns.instagram)
    btns.push(
      `<a class="sns-btn sns-insta" href="${sns.instagram}" target="_blank" rel="noopener"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> Instagram</a>`,
    );
  if (sns.tiktok)
    btns.push(
      `<a class="sns-btn sns-tiktok" href="${sns.tiktok}"  target="_blank" rel="noopener"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z"/></svg> TikTok</a>`,
    );
  if (!btns.length) return "";
  return `<div class="modal-sns">${btns.join("")}</div>`;
}

/* ================================================
   メンバーモーダル
   ================================================ */
function openMemberModal(m) {
  const bg = m.memberColor || "#fce7f3";
  document.getElementById("mAvatar").style.background = bg;
  document.getElementById("mAvatar").innerHTML = `
  <img src="images/${m.illust}" alt="${m.name}のイラスト"
    style="width:100%;height:100%;object-fit:cover;object-position:center top;border-radius:50%"
    onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<span style=\\'font-size:34px\\'>${m.emoji}</span>')">
`;
  document.getElementById("mName").textContent = m.name;
  document.getElementById("mRuby").textContent = m.nameRuby;
  document.getElementById("mCatch").textContent = m.nickname;
  document.getElementById("mBirth").textContent = m.from;
  document.getElementById("mHeight").textContent = m.height;
  document.getElementById("mBlood").textContent = m.blood;
  document.getElementById("mMbti").textContent = m.mbti;
  document.getElementById("mHobby").textContent = m.hobby;
  document.getElementById("mSkill").textContent = m.skill;
  document.getElementById("mSong").textContent = m.bestSong;
  document.getElementById("mLeader").textContent = m.ifLeader;
  document.getElementById("mMessage").textContent = m.message;

  // メンカラバッジ
  const colorBadge = document.getElementById("mColorBadge");
  if (m.memberColor) {
    colorBadge.style.display = "inline-flex";
    colorBadge.style.background = m.memberColor;
    colorBadge.title = "メンバーカラー: " + m.memberColor;
  } else {
    colorBadge.style.display = "none";
  }

  // リーダーバッジ
  const leaderBadge = document.getElementById("mLeaderBadge");
  leaderBadge.style.display = m.isLeader ? "inline-block" : "none";

  const snsArea = document.getElementById("mSns");
  if (snsArea) snsArea.innerHTML = buildSnsButtons(m.sns);

  document.getElementById("modalBg").classList.add("open");
}

function closeMemberModal(e) {
  if (!e || e.target === document.getElementById("modalBg")) {
    document.getElementById("modalBg").classList.remove("open");
  }
}

document.addEventListener("DOMContentLoaded", renderMembers);
