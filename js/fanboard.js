/**
 * α+ 公式ファンサイト
 * fanboard.js — ファン動画掲示板（Firebase Firestore使用）
 *
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
   Firebase 初期化
   ================================================ */
let db = null;
let fbConfigured = false;

function initFirebase() {
  // 設定が未入力の場合はデモモードで動作
  if (firebaseConfig.apiKey === "YOUR_API_KEY") {
    renderFanboardDemo();
    return;
  }

  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    fbConfigured = true;
    loadFanPosts();
    initMemberTags();
  } catch (e) {
    console.error("Firebase初期化エラー:", e);
    renderFanboardDemo();
  }
}

/* ================================================
   メンバータグ（投稿フォーム）
   ================================================ */
let selectedMembers = [];

function initMemberTags() {
  const wrap = document.getElementById("fbMemberTags");
  if (!wrap || !window.MEMBERS) return;
  wrap.innerHTML = "";
  MEMBERS.forEach((m) => {
    const tag = document.createElement("button");
    tag.className = "fanboard-member-tag";
    tag.style.borderColor = m.memberColor || "var(--pink-l)";
    tag.textContent = m.name.split(" ")[1] || m.name;
    tag.addEventListener("click", () => {
      const idx = selectedMembers.indexOf(m.name);
      if (idx === -1) {
        selectedMembers.push(m.name);
        tag.classList.add("active");
        tag.style.background = m.memberColor || "var(--pink)";
        tag.style.color = "white";
      } else {
        selectedMembers.splice(idx, 1);
        tag.classList.remove("active");
        tag.style.background = "";
        tag.style.color = "";
      }
    });
    wrap.appendChild(tag);
  });
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

  if (!fbConfigured) {
    showFbError(
      "Firebase未設定のため投稿できません。js/fanboard.jsの設定をしてください。",
    );
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
      members: selectedMembers,
      platform: detectPlatform(url),
      embedUrl: getEmbedUrl(url),
      thumbnailUrl: getThumbnailUrl(url),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    // リセット
    document.getElementById("fbNickname").value = "";
    document.getElementById("fbUrl").value = "";
    document.getElementById("fbComment").value = "";
    selectedMembers = [];
    document.querySelectorAll(".fanboard-member-tag").forEach((t) => {
      t.classList.remove("active");
      t.style.background = "";
      t.style.color = "";
    });

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
  if (yt) return yt[1];
  return null;
}

function getEmbedUrl(url) {
  const id = getVideoId(url);
  if (id) return `https://www.youtube.com/embed/${id}`;
  return url;
}

function getThumbnailUrl(url) {
  const id = getVideoId(url);
  if (id) return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  return null;
}

/* ================================================
   投稿一覧を読み込む（リアルタイム）
   ================================================ */
function loadFanPosts() {
  if (!db) return;

  db.collection("fanposts")
    .orderBy("createdAt", "desc")
    .limit(50)
    .onSnapshot((snapshot) => {
      const list = document.getElementById("fanboardList");
      const countEl = document.getElementById("fbPostCount");
      if (!list) return;

      countEl.textContent = `${snapshot.size}件の投稿`;

      if (snapshot.empty) {
        list.innerHTML =
          '<p style="text-align:center;color:var(--sub);font-size:14px;padding:2rem">まだ投稿がありません。最初の投稿をしてみよう♡</p>';
        return;
      }

      list.innerHTML = "";
      snapshot.forEach((doc) => {
        const d = doc.data();
        list.appendChild(buildPostCard(doc.id, d));
      });
    });
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
  const memberTags = (d.members || [])
    .map((name) => {
      const m = window.MEMBERS ? MEMBERS.find((mb) => mb.name === name) : null;
      const color = m ? m.memberColor : "var(--pink)";
      return `<span class="fanboard-post-tag" style="background:${color};color:white">${name.split(" ")[1] || name}</span>`;
    })
    .join("");

  const platform = d.platform || detectPlatform(d.url);
  const thumbnail = d.thumbnailUrl || getThumbnailUrl(d.url);

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
      <div class="fanboard-card-comment">${escapeHtml(d.comment)}</div>
      <div class="fanboard-card-meta">
        <span class="fanboard-card-nick">♡ ${escapeHtml(d.nickname)}</span>
        <span class="fanboard-card-date">${date}</span>
      </div>
      ${memberTags ? `<div class="fanboard-card-tags">${memberTags}</div>` : ""}
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
  initMemberTagsDemo();
  const list = document.getElementById("fanboardList");
  const countEl = document.getElementById("fbPostCount");
  if (countEl) countEl.textContent = "";
  if (list)
    list.innerHTML = `
    <div class="fanboard-setup-notice">
      <div style="font-size:20px;margin-bottom:8px">🔧</div>
      <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:8px">Firebase設定が必要です</div>
      <div style="font-size:12px;color:var(--sub);line-height:1.8">
        投稿機能を使うには <code>js/fanboard.js</code> の<br>
        <code>firebaseConfig</code> を設定してください。<br><br>
        <a href="https://console.firebase.google.com/" target="_blank" rel="noopener"
          style="color:var(--pink);font-weight:700">Firebase Console →</a><br>
        でプロジェクトを作成してAPIキーを取得してください。
      </div>
    </div>
  `;
}

function initMemberTagsDemo() {
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
  // Firebase SDKを動的に読み込む
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
    initMemberTagsDemo();
  }
});
