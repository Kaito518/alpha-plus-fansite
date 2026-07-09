/**
 * α+ 公式ファンサイト
 * compare.js — メンバー共通点・フィルター機能
 */

/* ================================================
   フィルター状態
   ================================================ */
const compareState = {
  mbti:   null,
  blood:  null,
  from:   null,
  height: null,
};

/* ================================================
   身長をカテゴリに変換
   ================================================ */
function heightCategory(h) {
  const n = parseInt(h);
  if (isNaN(n)) return '不明';
  if (n < 152) return '〜151cm';
  if (n < 156) return '152〜155cm';
  if (n < 160) return '156〜159cm';
  if (n < 163) return '160〜162cm';
  return '163cm〜';
}

/* ================================================
   MBTIを大分類に変換（共通点まとめ用）
   ================================================ */
function mbtiGroup(mbti) {
  const m = mbti.replace(/[-－]\w+$/, '').trim().toUpperCase().slice(0, 4);
  return m;
}

/* ================================================
   初期化
   ================================================ */
function initCompare() {
  if (!window.MEMBERS) return;

  // --- ユニーク値を収集 ---
  const mbtis   = [...new Set(MEMBERS.map(m => mbtiGroup(m.mbti)))].sort();
  const bloods  = [...new Set(MEMBERS.map(m => m.blood.replace(/（.*?）/, '').trim()))].sort();
  const froms   = [...new Set(MEMBERS.map(m => m.from))].sort();
  const heights = [...new Set(MEMBERS.map(m => heightCategory(m.height)))].sort();

  buildFilterBtns('filterMbti',   mbtis,   'mbti');
  buildFilterBtns('filterBlood',  bloods,  'blood');
  buildFilterBtns('filterFrom',   froms,   'from');
  buildFilterBtns('filterHeight', heights, 'height');

  renderCompareResult();
  renderCompareSummary();
}

function buildFilterBtns(containerId, values, key) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  wrap.innerHTML = '';
  values.forEach(v => {
    const btn = document.createElement('button');
    btn.className = 'compare-filter-btn';
    btn.textContent = v;
    btn.addEventListener('click', () => {
      compareState[key] = compareState[key] === v ? null : v;
      wrap.querySelectorAll('.compare-filter-btn').forEach(b => b.classList.remove('active'));
      if (compareState[key]) btn.classList.add('active');
      renderCompareResult();
    });
    wrap.appendChild(btn);
  });
}

/* ================================================
   フィルター結果を描画
   ================================================ */
function renderCompareResult() {
  const grid  = document.getElementById('compareResultGrid');
  const label = document.getElementById('compareResultLabel');
  if (!grid || !window.MEMBERS) return;

  const activeFilters = Object.entries(compareState).filter(([, v]) => v !== null);

  if (!activeFilters.length) {
    label.textContent = '';
    grid.innerHTML = '<p style="font-size:13px;color:var(--sub);text-align:center;padding:1.5rem">上のフィルターを選ぶと共通点があるメンバーが表示されます♡</p>';
    return;
  }

  const matched = MEMBERS.filter(m => {
    return activeFilters.every(([key, val]) => {
      if (key === 'mbti')   return mbtiGroup(m.mbti) === val;
      if (key === 'blood')  return m.blood.replace(/（.*?）/, '').trim() === val;
      if (key === 'from')   return m.from === val;
      if (key === 'height') return heightCategory(m.height) === val;
      return true;
    });
  });

  const filterDesc = activeFilters.map(([k, v]) => {
    const labels = { mbti: 'MBTI', blood: '血液型', from: '出身地', height: '身長' };
    return `${labels[k]}:${v}`;
  }).join(' / ');

  label.innerHTML = `<span class="compare-result-count">${matched.length}人</span>が一致（${filterDesc}）`;

  if (!matched.length) {
    grid.innerHTML = '<p style="font-size:13px;color:var(--sub);text-align:center;padding:1.5rem">条件に一致するメンバーがいません</p>';
    return;
  }

  grid.innerHTML = '';
  matched.forEach(m => {
    const bg = m.memberColor || '#fce7f3';
    const card = document.createElement('div');
    card.className = 'compare-member-card';
    card.style.borderColor = m.memberColor || 'var(--pink-l)';
    card.innerHTML = `
      <div class="compare-avatar" style="background:${bg}">
        <img src="images/${m.illust}" alt="${m.name}"
          style="width:100%;height:100%;object-fit:cover;object-position:center top;border-radius:50%"
          onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
        <span style="display:none;font-size:22px">${m.emoji}</span>
      </div>
      <div class="compare-name">${m.name}</div>
      <div class="compare-ruby">${m.nameRuby}</div>
    `;
    card.addEventListener('click', () => openMemberModal(m));
    grid.appendChild(card);
  });
}

/* ================================================
   共通点まとめカードを描画
   ================================================ */
function renderCompareSummary() {
  const grid = document.getElementById('compareSummaryGrid');
  if (!grid || !window.MEMBERS) return;

  // MBTI別グループ
  const mbtiMap = {};
  MEMBERS.forEach(m => {
    const g = mbtiGroup(m.mbti);
    if (!mbtiMap[g]) mbtiMap[g] = [];
    mbtiMap[g].push(m);
  });

  // 血液型別
  const bloodMap = {};
  MEMBERS.forEach(m => {
    const b = m.blood.replace(/（.*?）/, '').trim();
    if (!bloodMap[b]) bloodMap[b] = [];
    bloodMap[b].push(m);
  });

  // 出身地別
  const fromMap = {};
  MEMBERS.forEach(m => {
    if (!fromMap[m.from]) fromMap[m.from] = [];
    fromMap[m.from].push(m);
  });

  // 身長別
  const heightMap = {};
  MEMBERS.forEach(m => {
    const h = heightCategory(m.height);
    if (!heightMap[h]) heightMap[h] = [];
    heightMap[h].push(m);
  });

  const sections = [
    { title: '🧠 MBTI別', map: mbtiMap, emoji: '' },
    { title: '🩸 血液型別', map: bloodMap, emoji: '' },
    { title: '📍 出身地別', map: fromMap, emoji: '' },
    { title: '📏 身長別', map: heightMap, emoji: '' },
  ];

  grid.innerHTML = '';

  sections.forEach(sec => {
    const secEl = document.createElement('div');
    secEl.className = 'compare-summary-section';
    secEl.innerHTML = `<div class="compare-summary-title">${sec.title}</div>`;

    Object.entries(sec.map)
      .sort((a, b) => b[1].length - a[1].length)
      .forEach(([key, members]) => {
        const row = document.createElement('div');
        row.className = 'compare-summary-row';
        const dots = members.map(m =>
          `<span class="compare-dot" style="background:${m.memberColor || '#fce7f3'}" title="${m.name}"></span>`
        ).join('');
        row.innerHTML = `
          <div class="compare-summary-key">${key}</div>
          <div class="compare-summary-dots">${dots}</div>
          <div class="compare-summary-names">${members.map(m => m.name.split(' ')[1] || m.name).join('・')}</div>
        `;
        secEl.appendChild(row);
      });

    grid.appendChild(secEl);
  });
}

document.addEventListener('DOMContentLoaded', initCompare);
