/**
 * α+ 公式ファンサイト
 * app.js — ナビゲーション・スパークル などの共通処理
 */

/* ================================================
   スライダー
   ================================================ */
let slideIndex = 0;
let slideTimer = null;
const SLIDE_COUNT = 6;

function initSlider() {
  const dotsWrap = document.getElementById('sliderDots');
  if (!dotsWrap) return;
  for (let i = 0; i < SLIDE_COUNT; i++) {
    const btn = document.createElement('button');
    btn.className = 'slider-dot' + (i === 0 ? ' active' : '');
    btn.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(btn);
  }
  startSlideTimer();
}

function goToSlide(n) {
  slideIndex = (n + SLIDE_COUNT) % SLIDE_COUNT;
  const track = document.getElementById('sliderTrack');
  if (track) track.style.transform = `translateX(-${slideIndex * 100}%)`;
  document.querySelectorAll('.slider-dot').forEach((d, i) =>
    d.classList.toggle('active', i === slideIndex));
}

function slideMove(dir) {
  goToSlide(slideIndex + dir);
  resetSlideTimer();
}

function startSlideTimer() {
  slideTimer = setInterval(() => goToSlide(slideIndex + 1), 4000);
}
function resetSlideTimer() {
  clearInterval(slideTimer);
  startSlideTimer();
}

/* ================================================
   お知らせ詳細モーダル
   ================================================ */
const NEWS_DATA = {
  tour: {
    img: 'images/tour_poster.jpeg',
    body: `
      <div style="font-family:'Kaisei Decol',serif;font-size:18px;color:var(--pink);margin-bottom:.5rem">まだ見ぬ私たちへ</div>
      <div style="font-size:13px;color:var(--sub);margin-bottom:1rem">α+ First Tour 2026</div>
      <div class="news-modal-dates">
        <div class="news-date-row"><div class="news-date-city">愛知</div><div class="news-date-info"><b>10月3日（土）</b><br>NAGOYA ReNY limited</div></div>
        <div class="news-date-row"><div class="news-date-city">大阪</div><div class="news-date-info"><b>11月3日（火・祝）</b><br>LIVE HOUSE バナナホール</div></div>
        <div class="news-date-row"><div class="news-date-city">東京</div><div class="news-date-info"><b>11月29日（日）</b><br>ヒューリックホール東京</div></div>
      </div>`,
  },
  free: {
    img: 'images/freelive_poster.jpeg',
    body: `
      <div style="font-family:'Kaisei Decol',serif;font-size:16px;color:#0369a1;margin-bottom:.3rem">駆け抜けます、はじめての夏！</div>
      <div style="font-size:13px;color:var(--sub);margin-bottom:.5rem">Free Live Tour ｜ 無料観覧可能！</div>
      <div style="font-size:12px;font-weight:700;color:#be185d;background:#fce7f3;border-radius:10px;padding:8px 12px;margin-bottom:1rem">
        🎟 1,000円で優先入場＆特典会参加！女性限定エリアあり
      </div>
      <div class="news-modal-dates">
        <div class="news-date-row free-date-row"><div class="news-date-city">大阪</div><div class="news-date-info"><b>7月18日（土）</b><br>DAY: なんばパークス8F 円形劇場<br>NIGHT: ROCKTOWN（阿倍野）</div></div>
        <div class="news-date-row free-date-row"><div class="news-date-city">東京</div><div class="news-date-info"><b>7月20日（月）</b><br>有明ガーデン3F みんなのテラス</div></div>
        <div class="news-date-row free-date-row"><div class="news-date-city">東京</div><div class="news-date-info"><b>7月25日（土）</b><br>町田ターミナルプラザ</div></div>
        <div class="news-date-row free-date-row"><div class="news-date-city">神奈川</div><div class="news-date-info"><b>7月26日（日）</b><br>川崎ラ チッタ デッラ 中央噴水広場</div></div>
        <div class="news-date-row free-date-row"><div class="news-date-city">千葉</div><div class="news-date-info"><b>8月14日（金）</b><br>幕張豊砂駅前 とよすなうみかぜ広場</div></div>
        <div class="news-date-row free-date-row"><div class="news-date-city">神奈川</div><div class="news-date-info"><b>8月15日（土）</b><br>Niigo ひろば（横浜西口）</div></div>
        <div class="news-date-row free-date-row"><div class="news-date-city">埼玉</div><div class="news-date-info"><b>8月22日（土）</b><br>某所</div></div>
        <div class="news-date-row free-date-row"><div class="news-date-city">and</div><div class="news-date-info"><b>more…</b><br>続報をお待ちください！</div></div>
      </div>`,
  },
};

function openNewsBanner(key) {
  const data = NEWS_DATA[key];
  document.getElementById('newsModalImg').src = data.img;
  document.getElementById('newsModalBody').innerHTML = data.body;
  document.getElementById('newsBannerBg').classList.add('open');
}
function closeNewsBanner(e) {
  if (!e || e.target === document.getElementById('newsBannerBg')) {
    document.getElementById('newsBannerBg').classList.remove('open');
  }
}

/* ================================================
   ページ切り替え
   ================================================ */
function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ================================================
   スパークル（降ってくる記号の演出）
   ================================================ */
function initSparkles() {
  const wrap   = document.getElementById('sparkles');
  const sparks = ['✦', '★', '♡', '✿', '◆'];
  const colors = ['#f472b6', '#c084fc', '#7dd3fc', '#fbbf24'];

  setInterval(() => {
    const el = document.createElement('div');
    el.className = 'spark';
    el.textContent = sparks[Math.floor(Math.random() * sparks.length)];
    el.style.cssText = [
      `left: ${Math.random() * 100}vw`,
      `top: -20px`,
      `color: ${colors[Math.floor(Math.random() * colors.length)]}`,
      `animation-duration: ${3 + Math.random() * 3}s`,
      `font-size: ${12 + Math.random() * 14}px`,
      `position: absolute`,
    ].join(';');
    wrap.appendChild(el);
    setTimeout(() => el.remove(), 6000);
  }, 400);
}

/* DOMContentLoaded 後に実行 */
document.addEventListener('DOMContentLoaded', () => {
  initSparkles();
  initSlider();
});
