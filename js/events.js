/**
 * α+ 公式ファンサイト
 * events.js — イベントデータ & イベントページ描画
 *
 * ★ イベント情報を追加・変更するときはここを編集してください ★
 */

const DOWS = ['日', '月', '火', '水', '木', '金', '土'];

/* ================================================
   イベントデータ
   type        : 'live' | 'event' | 'release' | 'fc'
   date        : 'YYYY-MM-DD' 形式
   openTime    : 開場時間（省略可）例 '17:30'
   startTime   : 開演時間（省略可）例 '18:00'
   endTime     : 終演時間（省略可）例 '20:30'
   setlist     : 出演タイムテーブル（省略可）
                 [{ time: '18:00', act: 'オープニング' }, ...]
   ================================================ */
const EVENTS = [
  {
    id: 1,
    name: 'α+ 春のスペシャルライブ',
    type: 'live',
    date: '2026-05-03',
    place: '○○ホール',
    openTime:  '17:30',
    startTime: '18:00',
    endTime:   '20:30',
    setlist: [
      { time: '18:00', act: 'オープニング' },
      { time: '18:15', act: '1部：新曲披露' },
      { time: '19:00', act: '休憩（15分）' },
      { time: '19:15', act: '2部：人気曲メドレー' },
      { time: '20:00', act: 'アンコール' },
      { time: '20:30', act: '終演' },
    ],
  },
  {
    id: 2,
    name: '握手会＆チェキ撮影会',
    type: 'event',
    date: '2026-05-10',
    place: '○○イベント会場',
    openTime:  '10:00',
    startTime: '11:00',
    endTime:   '17:00',
    setlist: [
      { time: '11:00', act: '第1部 握手会' },
      { time: '13:00', act: '昼休憩' },
      { time: '14:00', act: '第2部 チェキ撮影会' },
      { time: '17:00', act: '終了' },
    ],
  },
  {
    id: 3,
    name: '1st シングル「アルファの星」リリース',
    type: 'release',
    date: '2026-05-20',
    place: '各音楽ストア',
  },
  {
    id: 4,
    name: 'FC会員限定 お話し会',
    type: 'fc',
    date: '2026-06-01',
    place: '○○スタジオ',
    startTime: '14:00',
    endTime:   '16:00',
  },
  {
    id: 5,
    name: '夏の野外ライブ 2026',
    type: 'live',
    date: '2026-07-18',
    place: '○○野外音楽堂',
    openTime:  '16:00',
    startTime: '17:00',
    endTime:   '20:00',
    setlist: [
      { time: '17:00', act: 'オープニングアクト' },
      { time: '17:30', act: 'α+ ステージ①' },
      { time: '18:30', act: '休憩' },
      { time: '19:00', act: 'α+ ステージ②' },
      { time: '20:00', act: '終演' },
    ],
  },
  {
    id: 6,
    name: 'サイン会＆ミニライブ',
    type: 'event',
    date: '2026-07-25',
    place: '○○ショッピングモール',
    startTime: '13:00',
    endTime:   '16:00',
    setlist: [
      { time: '13:00', act: 'ミニライブ（3曲）' },
      { time: '13:45', act: 'サイン会' },
      { time: '16:00', act: '終了' },
    ],
  },
  {
    id: 7,
    name: 'Anniversary ライブ',
    type: 'live',
    date: '2026-09-15',
    place: '○○アリーナ',
    openTime:  '17:00',
    startTime: '18:00',
    endTime:   '21:00',
    setlist: [
      { time: '18:00', act: 'オープニング' },
      { time: '18:20', act: '1部：デビュー曲特集' },
      { time: '19:15', act: '休憩（20分）' },
      { time: '19:35', act: '2部：新曲＆コラボ' },
      { time: '20:30', act: 'アンコール' },
      { time: '21:00', act: '終演' },
    ],
  },
];

/* タイプごとのラベル */
const TYPE_LABELS = {
  live:    '🎤 ライブ',
  event:   '🎪 イベント',
  release: '💿 リリース',
  fc:      '⭐ FC限定',
};

/* ================================================
   時間表示ヘルパー
   ================================================ */
function buildTimeRow(e) {
  const parts = [];
  if (e.openTime)  parts.push(`開場 ${e.openTime}`);
  if (e.startTime) parts.push(`開演 ${e.startTime}`);
  if (e.endTime)   parts.push(`終演 ${e.endTime}`);
  if (!parts.length) return '';
  return `<div class="ev-time">🕐 ${parts.join('　')}</div>`;
}

function buildSetlist(e) {
  if (!e.setlist || !e.setlist.length) return '';
  const rows = e.setlist.map(s =>
    `<div class="setlist-row"><span class="setlist-time">${s.time}</span><span class="setlist-act">${s.act}</span></div>`
  ).join('');
  return `
    <div class="setlist-wrap">
      <div class="setlist-title">📋 タイムテーブル</div>
      ${rows}
    </div>`;
}

/* ================================================
   カウントダウン
   ================================================ */
function initCountdown() {
  const today    = new Date();
  const nextLive = EVENTS
    .filter(e => e.type === 'live' && new Date(e.date) > today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  if (!nextLive) return;

  document.getElementById('cdName').textContent = nextLive.name;

  const nd  = new Date(nextLive.date);
  const dow = DOWS[nd.getDay()];
  const startStr = nextLive.startTime ? `　開演 ${nextLive.startTime}` : '';
  document.getElementById('cdDateStr').textContent =
    `📍 ${nextLive.place}　${nd.getFullYear()}年${nd.getMonth()+1}月${nd.getDate()}日（${dow}）${startStr}`;

  const targetTime = nextLive.startTime
    ? new Date(`${nextLive.date}T${nextLive.startTime}:00`)
    : new Date(`${nextLive.date}T18:00:00`);

  function tick() {
    const diff = targetTime - new Date();
    if (diff <= 0) {
      ['cdD','cdH','cdM','cdS'].forEach(id => document.getElementById(id).textContent = '00');
      return;
    }
    document.getElementById('cdD').textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
    document.getElementById('cdH').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    document.getElementById('cdM').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('cdS').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
}

/* ================================================
   イベントリスト
   ================================================ */
let currentFilter = 'all';

function renderEventList() {
  const list = document.getElementById('eventList');
  if (!list) return;
  list.innerHTML = '';

  const today    = new Date();
  const filtered = currentFilter === 'all'
    ? EVENTS
    : EVENTS.filter(e => e.type === currentFilter);

  filtered
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach(e => {
      const d      = new Date(e.date);
      const diff   = Math.ceil((d - today) / 86400000);
      const isSoon = diff >= 0 && diff <= 14;
      const isPast = diff < 0;

      const item = document.createElement('div');
      item.className = 'event-item';
      item.style.opacity = isPast ? '0.5' : '1';

      const hasDetail = e.setlist && e.setlist.length;

      item.innerHTML = `
        ${isSoon ? '<div class="ev-soon">まもなく</div>' : ''}
        <div class="event-date-box">
          <div class="ev-month">${d.getMonth() + 1}月</div>
          <div class="ev-day">${d.getDate()}</div>
          <div class="ev-dow">${DOWS[d.getDay()]}</div>
        </div>
        <div class="event-info">
          <div><span class="ev-type ${e.type}">${TYPE_LABELS[e.type]}</span></div>
          <div class="ev-name">${e.name}</div>
          <div class="ev-place">📍 ${e.place}</div>
          ${buildTimeRow(e)}
          ${hasDetail ? `<button class="ev-detail-btn" onclick="toggleDetail(this)">タイムテーブルを見る ▼</button>` : ''}
          <div class="ev-detail" style="display:none">${buildSetlist(e)}</div>
        </div>
      `;
      list.appendChild(item);
    });

  if (!filtered.length) {
    list.innerHTML = '<p style="color:var(--sub);font-size:14px;text-align:center;padding:2rem">該当するイベントはありません</p>';
  }
}

function toggleDetail(btn) {
  const detail = btn.nextElementSibling;
  const open   = detail.style.display === 'block';
  detail.style.display = open ? 'none' : 'block';
  btn.textContent = open ? 'タイムテーブルを見る ▼' : '閉じる ▲';
}

function setFilter(f, btn) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderEventList();
  renderCalendar();
}

/* ================================================
   カレンダー & 日付クリックポップアップ
   ================================================ */
let calYear, calMonth;

function initCalendar() {
  const today = new Date();
  calYear  = today.getFullYear();
  calMonth = today.getMonth();
  renderCalendar();
}

function renderCalendar() {
  const today = new Date();
  document.getElementById('calTitle').textContent = `${calYear}年 ${calMonth + 1}月`;

  const days = document.getElementById('calDays');
  days.innerHTML = '';

  const first = new Date(calYear, calMonth, 1).getDay();
  const last  = new Date(calYear, calMonth + 1, 0).getDate();

  for (let i = 0; i < first; i++) {
    const d = document.createElement('div');
    d.className = 'cal-day empty';
    days.appendChild(d);
  }

  for (let d = 1; d <= last; d++) {
    const cell = document.createElement('div');
    const dow  = (first + d - 1) % 7;
    let cls    = 'cal-day';
    if (dow === 0) cls += ' sun';
    if (dow === 6) cls += ' sat';

    const isToday =
      d === today.getDate() &&
      calMonth === today.getMonth() &&
      calYear  === today.getFullYear();
    if (isToday) cls += ' today';

    const dateStr   = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayEvents = EVENTS.filter(e =>
      e.date === dateStr && (currentFilter === 'all' || e.type === currentFilter)
    );
    if (dayEvents.length) cls += ' has-event';

    cell.className = cls;

    const numDiv = document.createElement('div');
    numDiv.className   = 'day-num';
    numDiv.textContent = d;
    cell.appendChild(numDiv);

    dayEvents.forEach(e => {
      const dot = document.createElement('div');
      dot.className = `ev-dot ${e.type}`;
      cell.appendChild(dot);
    });

    if (dayEvents.length) {
      cell.addEventListener('click', () => openCalPopup(dateStr, dayEvents));
    }

    days.appendChild(cell);
  }
}

function openCalPopup(dateStr, evs) {
  const [y, m, d] = dateStr.split('-');
  const dow = DOWS[new Date(dateStr).getDay()];
  const title = `${parseInt(m)}月${parseInt(d)}日（${dow}）`;

  const body = evs.map(e => `
    <div class="cal-popup-event">
      <div class="cal-popup-header">
        <span class="ev-type ${e.type}" style="font-size:10px">${TYPE_LABELS[e.type]}</span>
        <span class="cal-popup-name">${e.name}</span>
      </div>
      <div class="cal-popup-place">📍 ${e.place}</div>
      ${buildTimeRow(e)}
      ${buildSetlist(e)}
    </div>
  `).join('');

  document.getElementById('calPopupTitle').textContent = title;
  document.getElementById('calPopupBody').innerHTML   = body;
  document.getElementById('calPopupBg').classList.add('open');
}

function closeCalPopup(e) {
  if (!e || e.target === document.getElementById('calPopupBg')) {
    document.getElementById('calPopupBg').classList.remove('open');
  }
}

function changeMonth(delta) {
  calMonth += delta;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  renderCalendar();
}

/* ================================================
   タブ切り替え
   ================================================ */
function switchView(v, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('viewList').style.display     = v === 'list'     ? 'block' : 'none';
  document.getElementById('viewCalendar').style.display = v === 'calendar' ? 'block' : 'none';
}

/* DOMContentLoaded 後に実行 */
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  renderEventList();
  initCalendar();
});
