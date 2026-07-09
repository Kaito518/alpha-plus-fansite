/**
 * α+ 公式ファンサイト
 * fanboard.js — ファン動画掲示板（Firebase Firestore使用）
 */

/* ================================================
   Firebase 設定
   ================================================ */
const firebaseConfig = {
  apiKey: "AIzaSyC6EOSVVvWGVFmyfXl-O5YqFimdiHpgxgk",
  authDomain: "alpha-plus-fansite.firebaseapp.com",
  projectId: "alpha-plus-fansite",
  storageBucket: "alpha-plus-fansite.firebasestorage.app",
  messagingSenderId: "600887077998",
  appId: "1:600887077998:web:1d53d0346bf3e5d57eca7f",
  measurementId: "G-3X6PH4EJFS",
};

/* ================================================
   EmailJS 設定
   ================================================ */
const EMAILJS_SERVICE_ID = "service_z7fno1s";
const EMAILJS_TEMPLATE_ID = "template_cugwsaw";
const EMAILJS_PUBLIC_KEY = "39IoDN5W9NAanvtHA";

/* ================================================
   状態管理
   ================================================ */
let db = null;
let fbConfigured = false;
let postType = "all"; // 'all'（全体）| 'member'（個人）
let selectedMember = null; // 個人選択時のメンバー名
let filterMember = "すべて"; // 閲覧フィルター
let unsubscribe = null; // Firestoreリスナー解除用

/* ================================================
   Firebase 初期化
   ================================================ */
function initFirebase() {
  if (firebaseConfig.apiKey === "YOUR_API_KEY") {
    renderFanboardDemo();
    return;
  }
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    fbConfigured = true;
    initPostTypeToggle();
    initMemberTags();
    initViewFilter();
    loadFanPosts();
  } catch (e) {
    console.error("Firebase初期化エラー:", e);
    renderFanboardDemo();
  }
}

/* ================================================
   投稿タイプ切り替え（全体 / メンバー個人）
   ================================================ */
function initPostTypeToggle() {
  const btns = document.querySelectorAll(".fb-type-btn");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      postType = btn.dataset.type;
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const memberSection = document.getElementById("fbMemberSection");
      if (postType === "member") {
        memberSection.style.display = "block";
      } else {
        memberSection.style.display = "none";
        selectedMember = null;
        document.querySelectorAll(".fanboard-member-tag").forEach((t) => {
          t.classList.remove("active");
          t.style.background = "";
          t.style.color = "";
        });
      }
    });
  });
}

/* ================================================
   メンバータグ（投稿フォーム・1人だけ選択）
   ================================================ */
function initMemberTags() {
  const wrap = document.getElementById("fbMemberTags");
  if (!wrap || !window.MEMBERS) return;
  wrap.innerHTML = "";
  MEMBERS.forEach((m) => {
    const lastName = m.name.split(" ")[1] || m.name;
    const tag = document.createElement("button");
    tag.className = "fanboard-member-tag";
    tag.style.borderColor = m.memberColor || "var(--pink-l)";
    tag.textContent = lastName;
    tag.dataset.name = m.name;
    tag.addEventListener("click", () => {
      // 1人だけ選択
      if (selectedMember === m.name) {
        selectedMember = null;
        tag.classList.remove("active");
        tag.style.background = "";
        tag.style.color = "";
      } else {
        selectedMember = m.name;
        document.querySelectorAll(".fanboard-member-tag").forEach((t) => {
          t.classList.remove("active");
          t.style.background = "";
          t.style.color = "";
        });
        tag.classList.add("active");
        tag.style.background = m.memberColor || "var(--pink)";
        tag.style.color = "white";
      }
    });
    wrap.appendChild(tag);
  });
}

/* ================================================
   閲覧フィルター（全体 / メンバー別）
   ================================================ */
function initViewFilter() {
  const bar = document.getElementById("fbFilterBar");
  if (!bar || !window.MEMBERS) return;
  bar.innerHTML = "";

  // 「すべて」ボタン
  const allBtn = document.createElement("button");
  allBtn.className = "fb-filter-btn active";
  allBtn.textContent = "すべて";
  allBtn.addEventListener("click", () => setViewFilter("すべて", allBtn));
  bar.appendChild(allBtn);

  // 「全体撮影」ボタン
  const groupBtn = document.createElement("button");
  groupBtn.className = "fb-filter-btn";
  groupBtn.textContent = "🎬 全体";
  groupBtn.addEventListener("click", () => setViewFilter("全体", groupBtn));
  bar.appendChild(groupBtn);

  // メンバーごとのボタン
  MEMBERS.forEach((m) => {
    const lastName = m.name.split(" ")[1] || m.name;
    const btn = document.createElement("button");
    btn.className = "fb-filter-btn";
    btn.textContent = lastName;
    btn.style.borderColor = m.memberColor || "var(--pink-l)";
    btn.dataset.memberName = m.name;
    btn.dataset.color = m.memberColor || "";
    btn.addEventListener("click", () => setViewFilter(m.name, btn));
    bar.appendChild(btn);
  });
}

function setViewFilter(name, btn) {
  filterMember = name;
  document.querySelectorAll(".fb-filter-btn").forEach((b) => {
    b.classList.remove("active");
    b.style.background = "";
    b.style.color = "";
  });
  btn.classList.add("active");
  if (btn.dataset.color) {
    btn.style.background = btn.dataset.color;
    btn.style.color = "white";
  }
  renderFilteredPosts();
}

/* ================================================
   投稿する
   ================================================ */
async function submitFanPost() {
  const nickname = document.getElementById("fbNickname").value.trim();
  const url = document.getElementById("fbUrl").value.trim();
  const comment = document.getElementById("fbComment").value.trim();
  const errEl = document.getElementById("fbError");
  errEl.style.display = "none";

  if (!nickname) {
    showFbError("ニックネームを入力してください");
    return;
  }
  if (!url) {
    showFbError("動画URLを入力してください");
    return;
  }
  if (!isValidVideoUrl(url)) {
    showFbError("YouTubeまたはTikTokのURLを入力してください");
    return;
  }
  if (!comment) {
    showFbError("コメントを入力してください");
    return;
  }
  if (postType === "member" && !selectedMember) {
    showFbError("メンバーを1人選んでください");
    return;
  }

  if (!fbConfigured) {
    showFbError("Firebase未設定のため投稿できません。");
    return;
  }

  const btn = document.querySelector(".fanboard-submit");
  btn.textContent = "投稿中...";
  btn.disabled = true;

  try {
    await db.collection("fanposts").add({
      nickname,
      url,
      comment,
      postType, // 'all' or 'member'
      member: postType === "member" ? selectedMember : null,
      platform: detectPlatform(url),
      embedUrl: getEmbedUrl(url),
      thumbnailUrl: getThumbnailUrl(url),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    // フォームリセット
    document.getElementById("fbNickname").value = "";
    document.getElementById("fbUrl").value = "";
    document.getElementById("fbComment").value = "";
    selectedMember = null;
    postType = "all";
    document.querySelectorAll(".fb-type-btn").forEach((b, i) => {
      b.classList.toggle("active", i === 0);
    });
    document.getElementById("fbMemberSection").style.display = "none";
    document.querySelectorAll(".fanboard-member-tag").forEach((t) => {
      t.classList.remove("active");
      t.style.background = "";
      t.style.color = "";
    });

    // EmailJS でメール通知
    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        nickname: nickname,
        post_type: postType === "all" ? "全体撮影" : "メンバー個人",
        member: postType === "member" ? selectedMember : "なし",
        comment: comment,
        url: url,
        date: new Date().toLocaleString("ja-JP"),
      })
      .catch((e) => console.error("メール送信エラー:", e));

    btn.textContent = "投稿しました♡";
    setTimeout(() => {
      btn.textContent = "投稿する ♡";
      btn.disabled = false;
    }, 2000);
  } catch (e) {
    showFbError("投稿に失敗しました: " + e.message);
    btn.textContent = "投稿する ♡";
    btn.disabled = false;
  }
}

function showFbError(msg) {
  const el = document.getElementById("fbError");
  el.textContent = msg;
  el.style.display = "block";
}

/* ================================================
   URL判定・変換
   ================================================ */
function isValidVideoUrl(url) {
  return /youtu\.?be|tiktok\.com/.test(url);
}
function detectPlatform(url) {
  if (/youtu\.?be/.test(url)) return "youtube";
  if (/tiktok\.com/.test(url)) return "tiktok";
  return "other";
}
function getVideoId(url) {
  const yt = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return yt ? yt[1] : null;
}
function getEmbedUrl(url) {
  const id = getVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : url;
}
function getThumbnailUrl(url) {
  const id = getVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}

/* ================================================
   投稿一覧（全件取得してフロントでフィルタ）
   ================================================ */
let allPosts = [];

function loadFanPosts() {
  if (!db) return;

  if (unsubscribe) unsubscribe();

  unsubscribe = db
    .collection("fanposts")
    .orderBy("createdAt", "desc")
    .limit(100)
    .onSnapshot((snapshot) => {
      allPosts = [];
      snapshot.forEach((doc) => allPosts.push({ id: doc.id, ...doc.data() }));
      renderFilteredPosts();
    });
}

function renderFilteredPosts() {
  const list = document.getElementById("fanboardList");
  const countEl = document.getElementById("fbPostCount");
  if (!list) return;

  let filtered = allPosts;

  if (filterMember === "全体") {
    filtered = allPosts.filter((d) => d.postType === "all");
  } else if (filterMember !== "すべて") {
    filtered = allPosts.filter((d) => d.member === filterMember);
  }

  if (countEl) countEl.textContent = `${filtered.length}件`;

  if (!filtered.length) {
    list.innerHTML =
      '<p style="text-align:center;color:var(--sub);font-size:14px;padding:2rem;grid-column:1/-1">まだ投稿がありません♡</p>';
    return;
  }

  list.innerHTML = "";
  filtered.forEach((d) => list.appendChild(buildPostCard(d.id, d)));
}

/* ================================================
   投稿カードを生成
   ================================================ */
function buildPostCard(id, d) {
  const card = document.createElement("div");
  card.className = "fanboard-card";

  const date = d.createdAt
    ? new Date(d.createdAt.seconds * 1000).toLocaleDateString("ja-JP")
    : "";
  const platform = d.platform || detectPlatform(d.url);
  const thumbnail = d.thumbnailUrl || getThumbnailUrl(d.url);

  // タイプバッジ
  let typeBadge = "";
  if (d.postType === "member" && d.member) {
    const m = window.MEMBERS
      ? MEMBERS.find((mb) => mb.name === d.member)
      : null;
    const color = m ? m.memberColor : "var(--pink)";
    const lastName = d.member.split(" ")[1] || d.member;
    typeBadge = `<span class="fanboard-post-tag" style="background:${color};color:white">${lastName}</span>`;
  } else {
    typeBadge = `<span class="fanboard-post-tag" style="background:#e0f2fe;color:#0369a1">🎬 全体</span>`;
  }

  const mediaHtml =
    platform === "youtube" && thumbnail
      ? `<a href="${d.url}" target="_blank" rel="noopener" class="fanboard-thumb-link">
        <img src="${thumbnail}" alt="動画サムネイル" class="fanboard-thumb">
        <div class="fanboard-play">▶</div>
       </a>`
      : `<a href="${d.url}" target="_blank" rel="noopener" class="fanboard-url-link">
        ${platform === "tiktok" ? "🎵" : "🎬"} 動画を見る →
       </a>`;

  card.innerHTML = `
    <div class="fanboard-card-media">${mediaHtml}</div>
    <div class="fanboard-card-body">
      <div class="fanboard-card-tags" style="margin-bottom:6px">${typeBadge}</div>
      <div class="fanboard-card-comment">${escapeHtml(d.comment)}</div>
      <div class="fanboard-card-meta">
        <span class="fanboard-card-nick">♡ ${escapeHtml(d.nickname)}</span>
        <span class="fanboard-card-date">${date}</span>
      </div>
    </div>
  `;
  return card;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ================================================
   Firebase未設定時のデモ表示
   ================================================ */
function renderFanboardDemo() {
  const list = document.getElementById("fanboardList");
  if (list)
    list.innerHTML = `
    <div class="fanboard-setup-notice">
      <div style="font-size:20px;margin-bottom:8px">🔧</div>
      <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:8px">Firebase設定が必要です</div>
      <div style="font-size:12px;color:var(--sub);line-height:1.8">
        <code>js/fanboard.js</code> の <code>firebaseConfig</code> を設定してください。
      </div>
    </div>`;
  // フォームのデモ用メンバータグだけ表示
  initMemberTagsStatic();
}

function initMemberTagsStatic() {
  const wrap = document.getElementById("fbMemberTags");
  if (!wrap || !window.MEMBERS) return;
  wrap.innerHTML = "";
  MEMBERS.forEach((m) => {
    const tag = document.createElement("button");
    tag.className = "fanboard-member-tag";
    tag.style.borderColor = m.memberColor || "var(--pink-l)";
    tag.textContent = m.name.split(" ")[1] || m.name;
    wrap.appendChild(tag);
  });
}

/* ================================================
   DOMContentLoaded
   ================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // EmailJS読み込み
  const ejsScript = document.createElement("script");
  ejsScript.src =
    "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
  ejsScript.onload = () => emailjs.init(EMAILJS_PUBLIC_KEY);
  document.head.appendChild(ejsScript);

  // 投稿タイプボタン
  document.querySelectorAll(".fb-type-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      postType = btn.dataset.type;
      document
        .querySelectorAll(".fb-type-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const ms = document.getElementById("fbMemberSection");
      if (ms) ms.style.display = postType === "member" ? "block" : "none";
      if (postType === "member") initMemberTags();
    });
  });

  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    const scripts = [
      "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
      "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js",
    ];
    let loaded = 0;
    scripts.forEach((src) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => {
        if (++loaded === scripts.length) initFirebase();
      };
      document.head.appendChild(s);
    });
  } else {
    renderFanboardDemo();
  }
});
