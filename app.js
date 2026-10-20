(function () {
  'use strict';

  const app = document.getElementById('app');
  const SAVE_KEY = 'pokePartnerSavedResults_v1';
  const DIMENSIONS = window.TRAIT_DIMENSIONS;
  const BIO_CATEGORIES = window.BIO_CATEGORIES;
  const POKEMON = window.POKEMON_DATA;
  const DIM_KEYS = DIMENSIONS.filter(d => d.key !== 'bio').map(d => d.key);

  const STATE_DEFAULT_WEIGHTS = {
    approach: 3, social: 3, values: 4, challenge: 3,
    lifestyle: 3, companion: 4, bio: 3
  };

  const BIO_PICK_OPTIONS = BIO_CATEGORIES;
  const questions = [
    {
      id: 'q1', type: 'single', title: '遇到一個陌生又有挑戰性的問題時，你通常會？',
      subtitle: '沒有標準答案，選擇最接近你平常做法的選項。', options: [
        {id:'a',title:'先蒐集資訊、整理線索，再規劃行動',desc:'我希望先弄清楚狀況。',profile:{approach:4,challenge:1}},
        {id:'b',title:'先試著做做看，再依結果調整',desc:'實際行動能幫助我找到答案。',profile:{approach:1,challenge:4}},
        {id:'c',title:'找可信任的人討論，一起想辦法',desc:'不同觀點能讓解法更完整。',profile:{approach:3,social:4,values:3}},
        {id:'d',title:'先觀察環境，等待適合的時機',desc:'我會保留彈性，不急著決定。',profile:{approach:2,challenge:2,lifestyle:2}}
      ]
    },
    {
      id: 'q2', type: 'single', title: '在團隊或朋友圈中，你比較常扮演什麼角色？',
      subtitle: '想像你和朋友一起完成一件重要的事情。', options: [
        {id:'a',title:'規劃者：整理資訊、安排步驟',desc:'喜歡讓事情有方向。',profile:{approach:4,social:2}},
        {id:'b',title:'帶頭者：鼓起勇氣，推動大家前進',desc:'遇到卡關時願意先行動。',profile:{approach:2,social:2,challenge:4}},
        {id:'c',title:'支持者：注意每個人的需要並提供協助',desc:'我重視團隊的信任與感受。',profile:{social:4,values:4,companion:4}},
        {id:'d',title:'獨立完成自己負責的部分',desc:'我喜歡自主，也會負起責任。',profile:{approach:3,social:0,values:2}}
      ]
    },
    {
      id: 'q3', type: 'single', title: '以下哪一件事最能讓你覺得「這很重要」？',
      subtitle: '選擇最符合你目前想法的一項。', options: [
        {id:'a',title:'和重要的人建立信任，彼此支持',desc:'關係中的可靠與真誠很重要。',profile:{values:4,social:4,companion:4}},
        {id:'b',title:'保有自由，能依自己的想法探索',desc:'我希望有選擇與自主的空間。',profile:{values:0,lifestyle:3,challenge:3}},
        {id:'c',title:'持續成長，完成具有挑戰的目標',desc:'突破自己會帶來成就感。',profile:{values:2,challenge:4,approach:3}},
        {id:'d',title:'生活穩定，自己與身邊的人都能安心',desc:'平靜、照顧與安全感不可少。',profile:{values:4,challenge:0,lifestyle:1,companion:4}}
      ]
    },
    {
      id: 'q4', type: 'single', title: '面對不確定的挑戰，你通常會？',
      subtitle: '請選擇最像你的反應。', options: [
        {id:'a',title:'先確認風險，再決定要不要投入',desc:'我希望把風險控制在可接受的範圍。',profile:{approach:4,challenge:0}},
        {id:'b',title:'試試不同方法，不怕過程中修正',desc:'嘗試本身就是學習的一部分。',profile:{approach:2,challenge:4}},
        {id:'c',title:'找夥伴一起面對，互相支援',desc:'合作會讓我更有信心。',profile:{social:4,challenge:2,values:4}},
        {id:'d',title:'把它看成一次冒險，先踏出第一步',desc:'未知會讓我感到興奮。',profile:{challenge:4,lifestyle:4,approach:1}}
      ]
    },
    {
      id: 'q5', type: 'single', title: '理想的休息日，你最想怎麼度過？',
      subtitle: '想像完全由自己安排的一天。', options: [
        {id:'a',title:'待在熟悉的地方，安靜做喜歡的事',desc:'我享受自己的步調。',profile:{lifestyle:0,social:0,challenge:0}},
        {id:'b',title:'去沒去過的地方走走、探索新事物',desc:'新鮮感能讓我充滿活力。',profile:{lifestyle:4,challenge:3,approach:2}},
        {id:'c',title:'和朋友相聚，分享最近的生活',desc:'互動與陪伴會讓我開心。',profile:{lifestyle:3,social:4,values:4}},
        {id:'d',title:'學習新技能或研究感興趣的主題',desc:'投入探索、整理知識也很有趣。',profile:{lifestyle:2,approach:4,challenge:2}}
      ]
    },
    {
      id: 'q6', type: 'single', title: '和在乎的人意見不同時，你比較可能怎麼做？',
      subtitle: '這題沒有「比較成熟」或「比較正確」的答案。', options: [
        {id:'a',title:'把事情釐清，找出雙方理解的差異',desc:'先處理問題本身。',profile:{approach:4,social:2,values:2}},
        {id:'b',title:'先理解對方的感受，讓彼此能好好說話',desc:'關係與感受值得被重視。',profile:{social:4,values:4,companion:4}},
        {id:'c',title:'先暫停一下，等心情整理好再談',desc:'我需要時間思考和沉澱。',profile:{approach:3,lifestyle:1,challenge:1}},
        {id:'d',title:'希望直接討論，盡快找出能前進的方式',desc:'我傾向主動處理衝突。',profile:{approach:2,challenge:4,social:3}}
      ]
    },
    {
      id: 'q7', type: 'single', title: '如果你和朋友在陌生城市迷路了，你會？',
      subtitle: '把自己放進這個情境，選擇最自然的反應。', options: [
        {id:'a',title:'打開地圖，確認位置並規劃路線',desc:'先弄清楚方向。',profile:{approach:4,challenge:1,lifestyle:1}},
        {id:'b',title:'觀察周圍，邊探索邊尋找可能的路',desc:'把意外當成探索的一部分。',profile:{approach:2,challenge:4,lifestyle:4}},
        {id:'c',title:'詢問當地人，找出可信的資訊',desc:'善用交流來解決問題。',profile:{social:4,values:3,approach:2}},
        {id:'d',title:'先確認大家狀況，再一起決定怎麼走',desc:'確保同行的人都能跟上。',profile:{social:4,values:4,challenge:1}}
      ]
    },
    {
      id: 'q8', type: 'single', title: '你最希望寶可夢夥伴為你的生活帶來什麼？',
      subtitle: '這題反映你期待的夥伴關係。', options: [
        {id:'a',title:'可靠的安全感，在困難時能互相守護',desc:'希望彼此信任、互相照顧。',profile:{companion:4,values:4,challenge:2}},
        {id:'b',title:'一起挑戰未知，留下刺激的冒險回憶',desc:'希望夥伴敢嘗試也願意成長。',profile:{companion:3,challenge:4,lifestyle:4}},
        {id:'c',title:'有趣又有活力，平常相處充滿歡笑',desc:'日常陪伴也可以很有魅力。',profile:{companion:4,lifestyle:4,social:4}},
        {id:'d',title:'安靜而穩定的陪伴，不必時時說話',desc:'舒服自在，比熱鬧更重要。',profile:{companion:4,lifestyle:1,social:2}}
      ]
    },
    {
      id: 'q9', type: 'single', title: '親近的人遇到低潮時，你通常會怎麼支持對方？',
      subtitle: '請選擇你最自然的支持方式。', options: [
        {id:'a',title:'陪他一起想辦法，並協助採取行動',desc:'我會想幫忙推進事情。',profile:{values:4,social:4,challenge:4}},
        {id:'b',title:'先聽對方說，讓他知道有人在身邊',desc:'陪伴本身就是支持。',profile:{values:4,social:4,companion:4}},
        {id:'c',title:'整理問題、提供不同角度的分析',desc:'我會試著讓事情變得清楚。',profile:{approach:4,values:3,social:2}},
        {id:'d',title:'尊重對方的空間，等他需要時再協助',desc:'支持也包含給彼此選擇。',profile:{values:2,social:1,companion:2}}
      ]
    },
    {
      id: 'q10', type: 'single', title: '學習一件完全陌生的事情時，你比較喜歡？',
      subtitle: '選擇最符合你平時的學習方式。', options: [
        {id:'a',title:'先訂計畫，按步驟逐一理解',desc:'有架構會讓我更安心。',profile:{approach:4,lifestyle:1,challenge:1}},
        {id:'b',title:'先動手實驗，從結果中摸索',desc:'做中學最有感。',profile:{approach:1,challenge:4,lifestyle:3}},
        {id:'c',title:'找人請教，透過討論加深理解',desc:'交流能幫助我吸收新想法。',profile:{social:4,approach:3}},
        {id:'d',title:'反覆練習到熟悉，再逐步提高難度',desc:'我相信穩定累積的力量。',profile:{approach:3,lifestyle:2,challenge:3}}
      ]
    },
    {
      id: 'q11', type: 'single', title: '如果和寶可夢一起旅行，你最期待哪種旅程？',
      subtitle: '想像一段讓你真正享受其中的冒險。', options: [
        {id:'a',title:'路線清楚、準備充分，安心地看遍景點',desc:'規劃讓旅程更順暢。',profile:{approach:4,lifestyle:1,challenge:1}},
        {id:'b',title:'不設太多限制，看到有趣的地方就去看看',desc:'意外發現才有旅行感。',profile:{challenge:4,lifestyle:4,approach:1}},
        {id:'c',title:'透過一路上的合作，和夥伴建立默契',desc:'共同經歷比目的地更重要。',profile:{values:4,social:4,companion:4}},
        {id:'d',title:'觀察自然、收集知識，慢慢認識世界',desc:'我喜歡深入探索。',profile:{approach:4,lifestyle:3,challenge:2}}
      ]
    },
    {
      id: 'q12', type: 'priority', title: '這一次，你最希望配對結果優先反映哪個面向？',
      subtitle: '這個選擇會對你設定的權重做小幅調整，不會完全取代原本設定。', options: DIMENSIONS.map(d => ({id:d.key,title:d.label,desc:d.hint,priority:d.key}))
    },
    {
      id: 'q13', type: 'bio-pick', title: '你最喜歡哪三種生物風格？',
      subtitle: '請選出剛好三種。這是喜好加分，不代表你不喜歡其他類型。'
    },
    {
      id: 'q14', type: 'bio-reject', title: '有哪些生物類型是你明確想避開的？',
      subtitle: '這些類型會作為排除條件。可以不選；若沒有特別排斥，直接繼續即可。'
    }
  ];

  const state = {
    page: 'welcome', mode: 'match', weights: {...STATE_DEFAULT_WEIGHTS},
    excludedIds: [], favoriteSearch: '', answers: {}, questionIndex: 0,
    selectedBio: [], rejectedBio: [], results: [], profile: null,
    adjustedWeights: null, priorityDimension: null, allowSave: false
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const padDex = id => String(id).padStart(4, '0');
  const getPokemon = id => POKEMON.find(p => p.id === Number(id));
  const savedResults = () => {
    try { const raw = localStorage.getItem(SAVE_KEY); const parsed = raw ? JSON.parse(raw) : []; return Array.isArray(parsed) ? parsed : []; }
    catch (_) { return []; }
  };
  const showToast = message => {
    let toast = document.querySelector('.toast');
    if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role','status'); document.body.appendChild(toast); }
    toast.textContent = message; toast.classList.add('show');
    clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
  };
  const updateFavoriteList = () => {
    const list = document.getElementById('favorite-list');
    const count = document.getElementById('favorite-count');
    if (!list) return;
    const term = (state.favoriteSearch || '').trim().toLocaleLowerCase();
    const filtered = POKEMON.filter(p => !term || p.nameZh.includes(term) || p.nameEn.toLowerCase().includes(term) || String(p.id) === term).slice(0, 90);
    list.innerHTML = filtered.map(p => `
      <label class="favorite-option" title="${esc(p.nameZh)}">
        <input type="checkbox" data-favorite-id="${p.id}" ${state.excludedIds.includes(p.id) ? 'checked' : ''}>
        <span>${esc(p.nameZh)}</span>
      </label>`).join('') || '<p class="mini-note">找不到符合的寶可夢。</p>';
    if (count) count.textContent = `已選擇 ${state.excludedIds.length} 隻排除對象`;
    list.querySelectorAll('[data-favorite-id]').forEach(input => input.addEventListener('change', event => {
      const id = Number(event.target.dataset.favoriteId);
      if (event.target.checked && !state.excludedIds.includes(id)) state.excludedIds.push(id);
      if (!event.target.checked) state.excludedIds = state.excludedIds.filter(value => value !== id);
      const counter = document.getElementById('favorite-count');
      if (counter) counter.textContent = `已選擇 ${state.excludedIds.length} 隻排除對象`;
    }));
  };

  function renderWelcome() {
    app.innerHTML = `
      <section class="hero">
        <div class="hero-copy">
          <span class="eyebrow"><span class="eyebrow-dot"></span> PERSONALITY × POKÉMON</span>
          <h1>找到最適合你的<br><span class="highlight">寶可夢夥伴</span></h1>
          <p class="hero-desc">從你的處事方式、價值觀、生活節奏與喜好出發，探索三隻和你契合的寶可夢，看看你們為什麼適合成為夥伴。</p>
          <div class="feature-row">
            <span class="feature-pill">◉ 約 3–5 分鐘</span><span class="feature-pill">◇ 14 道題目</span><span class="feature-pill">♡ 個人化分析</span>
          </div>
          <button class="btn btn-primary" id="begin-btn">開始測驗 <span aria-hidden="true">→</span></button>
        </div>
        <div class="hero-art" aria-hidden="true"><div class="hero-orbit"></div><div class="hero-mon">✦</div></div>
      </section>
      <div class="section-card" style="margin-top:22px">
        <div class="screen-heading">
          <span class="step-label">ABOUT THIS MATCH</span>
          <h2>不是找最強的，而是找最契合的</h2>
          <p>這是一個以個性與偏好為核心的趣味配對器。Pokémon GO 資訊只作為延伸，不會影響主要排名。</p>
        </div>
        <div class="profile-summary">
          <div class="summary-box"><strong>01</strong><span>認識自己的偏好</span></div>
          <div class="summary-box"><strong>02</strong><span>比對寶可夢特徵</span></div>
          <div class="summary-box"><strong>03</strong><span>查看前三名與理由</span></div>
        </div>
        <p class="mini-note">資料提醒：目前內建的是第一版示範候選資料，尚未涵蓋全國圖鑑所有物種。配對特徵為初始模型標籤，不是官方人格設定；後續應逐筆核對官方圖鑑與作品。</p>
      </div>`;
    document.getElementById('begin-btn').addEventListener('click', () => { state.page = 'setup'; render(); });
  }

  function renderSetup() {
    const weightRows = DIMENSIONS.map(dim => `
      <div class="weight-control">
        <div class="weight-top"><label for="weight-${dim.key}">${esc(dim.label)}</label><span class="weight-value" id="weight-value-${dim.key}">${state.weights[dim.key]}</span></div>
        <input id="weight-${dim.key}" type="range" min="1" max="5" step="1" value="${state.weights[dim.key]}" data-weight="${dim.key}" aria-label="${esc(dim.label)}重要程度">
        <p class="weight-hint">${esc(dim.hint)}</p>
      </div>`).join('');

    app.innerHTML = `
      <section class="section-card">
        <div class="screen-heading">
          <span class="step-label">STEP 01 · 配對設定</span>
          <h2>先決定你想探索什麼</h2>
          <p>調整本次配對重點，再開始回答問題。設定只影響這次測驗，不會改變寶可夢的基本資料。</p>
        </div>
        <h3 class="section-title">選擇測驗模式</h3>
        <div class="mode-grid">
          <label class="select-card ${state.mode === 'match' ? 'selected' : ''}">
            <input type="radio" name="mode" value="match" ${state.mode === 'match' ? 'checked' : ''}>
            <div><strong>尋找最適合我的寶可夢</strong><span>你本來喜歡的寶可夢也可以進入排名。</span></div>
          </label>
          <label class="select-card ${state.mode === 'discover' ? 'selected' : ''}">
            <input type="radio" name="mode" value="discover" ${state.mode === 'discover' ? 'checked' : ''}>
            <div><strong>發現新的寶可夢夥伴</strong><span>排除你已經非常喜歡的寶可夢，尋找其他可能。</span></div>
          </label>
        </div>
        <div id="favorite-exclusion" style="display:${state.mode === 'discover' ? 'block' : 'none'}">
          <h3 class="section-title">想先排除哪些既有最愛？</h3>
          <p class="mini-note">可搜尋並多選；留空代表不排除。這份第一版清單只包含部分物種。</p>
          <input id="favorite-search" class="search-input" type="search" placeholder="搜尋中文名、英文名或圖鑑編號" value="${esc(state.favoriteSearch)}" autocomplete="off">
          <div id="favorite-list" class="favorite-list"></div>
          <div id="favorite-count" class="chip-count">已選擇 ${state.excludedIds.length} 隻排除對象</div>
        </div>
        <div class="divider"></div>
        <h3 class="section-title">設定分析面向的重要程度</h3>
        <p class="mini-note" style="margin-bottom:13px">1 代表不太重要，5 代表非常重要。最後一題會讓你指定本次最希望優先反映的面向，系統只會在此設定上做小幅調整。</p>
        <div class="weight-grid">${weightRows}</div>
        <div class="form-actions"><button class="btn btn-quiet" id="back-home">← 返回首頁</button><div class="right-actions"><button class="btn btn-primary" id="start-quiz">開始回答 <span aria-hidden="true">→</span></button></div></div>
      </section>`;

    app.querySelectorAll('input[name="mode"]').forEach(input => input.addEventListener('change', event => {
      state.mode = event.target.value; renderSetup();
    }));
    app.querySelectorAll('[data-weight]').forEach(input => input.addEventListener('input', event => {
      const key = event.target.dataset.weight;
      state.weights[key] = Number(event.target.value);
      const value = document.getElementById(`weight-value-${key}`);
      if (value) value.textContent = event.target.value;
    }));
    const search = document.getElementById('favorite-search');
    if (search) {
      updateFavoriteList();
      search.addEventListener('input', event => { state.favoriteSearch = event.target.value; updateFavoriteList(); });
    }
    document.getElementById('back-home').addEventListener('click', () => { state.page = 'welcome'; render(); });
    document.getElementById('start-quiz').addEventListener('click', () => {
      state.answers = {}; state.selectedBio = []; state.rejectedBio = []; state.questionIndex = 0;
      state.page = 'quiz'; render();
    });
  }

  function currentQuestion() { return questions[state.questionIndex]; }
  function isCurrentAnswered(q) {
    if (q.type === 'bio-pick') return (state.answers[q.id] || []).length === 3;
    if (q.type === 'bio-reject') return true;
    return Boolean(state.answers[q.id]);
  }

  function renderQuestion() {
    const q = currentQuestion();
    const step = state.questionIndex + 1;
    const percent = Math.round(step / questions.length * 100);
    let inner = '';
    if (q.type === 'single' || q.type === 'priority') {
      const selected = state.answers[q.id];
      inner = `<div class="option-list">${q.options.map((option, idx) => `
        <button type="button" class="answer-option ${selected === option.id ? 'selected' : ''}" data-option="${esc(option.id)}" aria-pressed="${selected === option.id}">
          <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
          <span class="option-copy"><strong>${esc(option.title)}</strong><small>${esc(option.desc || '')}</small></span>
        </button>`).join('')}</div>`;
    } else if (q.type === 'bio-pick') {
      const selected = state.answers[q.id] || [];
      inner = `<div class="bio-grid">${BIO_PICK_OPTIONS.map(item => `
        <button type="button" class="bio-chip ${selected.includes(item.key) ? 'selected' : ''}" data-bio="${item.key}" aria-pressed="${selected.includes(item.key)}">
          <span class="bio-emoji">${item.emoji}</span>${esc(item.label)}
        </button>`).join('')}</div><p class="selection-note">目前已選 ${selected.length} / 3 種。選出三種後才能繼續。</p>`;
    } else {
      const selected = state.answers[q.id] || [];
      inner = `<div class="bio-grid">${BIO_PICK_OPTIONS.map(item => `
        <button type="button" class="bio-chip ${selected.includes(item.key) ? 'selected' : ''}" data-reject-bio="${item.key}" aria-pressed="${selected.includes(item.key)}">
          <span class="bio-emoji">${item.emoji}</span>${esc(item.label)}
        </button>`).join('')}</div><p class="selection-note">已選 ${selected.length} 種排斥類型。可以不選，若沒有特別排斥就直接繼續。</p>`;
    }

    app.innerHTML = `
      <section class="question-card">
        <div class="progress-wrap"><div class="progress-meta"><span>你的配對測驗</span><span>第 ${step} / ${questions.length} 題</span></div><div class="progress-track"><div class="progress-bar" style="width:${percent}%"></div></div></div>
        <div class="section-card">
          <div class="screen-heading"><span class="step-label">STEP 02 · PERSONALITY CHECK</span><h2 class="question-main">${esc(q.title)}</h2><p class="question-sub">${esc(q.subtitle)}</p></div>
          ${inner}
          <div id="question-warning" class="inline-warning" style="display:none"></div>
          <div class="form-actions"><button class="btn btn-quiet" id="prev-question">${step === 1 ? '← 回到設定' : '← 上一題'}</button><div class="right-actions"><button class="btn btn-primary" id="next-question" ${isCurrentAnswered(q) ? '' : 'disabled'}>${step === questions.length ? '查看配對結果' : '下一題'} <span aria-hidden="true">→</span></button></div></div>
        </div>
      </section>`;

    if (q.type === 'single' || q.type === 'priority') {
      app.querySelectorAll('[data-option]').forEach(button => button.addEventListener('click', () => {
        state.answers[q.id] = button.dataset.option;
        renderQuestion();
      }));
    }
    if (q.type === 'bio-pick') {
      app.querySelectorAll('[data-bio]').forEach(button => button.addEventListener('click', () => {
        const key = button.dataset.bio;
        const list = [...(state.answers[q.id] || [])];
        if (list.includes(key)) state.answers[q.id] = list.filter(v => v !== key);
        else if (list.length < 3) state.answers[q.id] = [...list, key];
        else showToast('請先取消一個選項，再選擇其他類型。');
        renderQuestion();
      }));
    }
    if (q.type === 'bio-reject') {
      app.querySelectorAll('[data-reject-bio]').forEach(button => button.addEventListener('click', () => {
        const key = button.dataset.rejectBio;
        const list = [...(state.answers[q.id] || [])];
        state.answers[q.id] = list.includes(key) ? list.filter(v => v !== key) : [...list, key];
        renderQuestion();
      }));
    }
    document.getElementById('prev-question').addEventListener('click', () => {
      if (state.questionIndex === 0) { state.page = 'setup'; render(); }
      else { state.questionIndex -= 1; renderQuestion(); }
    });
    document.getElementById('next-question').addEventListener('click', () => {
      if (!isCurrentAnswered(q)) {
        const warn = document.getElementById('question-warning');
        if (warn) { warn.textContent = q.type === 'bio-pick' ? '請選滿三種最喜歡的生物類型。' : '請先選擇一個答案。'; warn.style.display = 'block'; }
        return;
      }
      if (state.questionIndex < questions.length - 1) { state.questionIndex += 1; renderQuestion(); }
      else calculateAndRenderResults();
    });
  }

  function buildProfile() {
    const buckets = {};
    DIM_KEYS.forEach(key => { buckets[key] = []; });
    questions.forEach(q => {
      if (q.type !== 'single') return;
      const selectedId = state.answers[q.id];
      const option = q.options.find(o => o.id === selectedId);
      if (!option || !option.profile) return;
      Object.entries(option.profile).forEach(([key, value]) => { if (buckets[key] && Number.isFinite(value)) buckets[key].push(value); });
    });
    const profile = {};
    Object.entries(buckets).forEach(([key, values]) => {
      profile[key] = values.length ? values.reduce((sum, n) => sum + n, 0) / values.length : 2;
    });
    profile.bio = 2;
    return { profile, counts: Object.fromEntries(Object.entries(buckets).map(([key, values]) => [key, values.length])) };
  }

  function getAdjustedWeights() {
    const original = {...state.weights};
    const priority = state.answers.q12;
    if (priority && Object.prototype.hasOwnProperty.call(original, priority)) original[priority] *= 1.1;
    const total = Object.values(original).reduce((sum, n) => sum + n, 0);
    return Object.fromEntries(Object.entries(original).map(([key, value]) => [key, value / total]));
  }

  function bioScore(pokemon) {
    const favorites = state.answers.q13 || [];
    const rejected = state.answers.q14 || [];
    if (pokemon.bioTags.some(tag => rejected.includes(tag))) return {excluded: true, score: 0};
    if (!favorites.length) return {excluded: false, score: 50};
    const hits = pokemon.bioTags.filter(tag => favorites.includes(tag)).length;
    return {excluded: false, score: hits ? 100 : 50};
  }

  const traitDisplay = {
    approach: {low:'較偏向直覺行動與即時調整', high:'較偏向分析、整理資訊與規劃'},
    social: {low:'較重視獨立與個人空間', high:'較重視合作、交流與互相支持'},
    values: {low:'較重視自主探索與個人選擇', high:'較重視信任、關懷與互相支持'},
    challenge: {low:'較傾向謹慎評估與穩定前進', high:'較願意迎接挑戰與嘗試突破'},
    lifestyle: {low:'較喜歡安靜、熟悉且規律的步調', high:'較喜歡活躍、多變與新鮮體驗'},
    companion: {low:'較欣賞獨立、保有空間的夥伴', high:'較期待陪伴、守護與互相支持'}
  };

  function describeTrait(key, value) {
    const desc = traitDisplay[key];
    if (!desc) return '多元的特質偏好';
    return value >= 2.5 ? desc.high : desc.low;
  }

  function scorePokemon(pokemon, profile, weights) {
    const bio = bioScore(pokemon);
    if (bio.excluded) return null;
    if (state.mode === 'discover' && state.excludedIds.includes(pokemon.id)) return null;
    const dimensionScores = {};
    let weightedSum = 0;
    let weightSum = 0;
    DIM_KEYS.forEach(key => {
      const candidateValue = pokemon.traitScores[key];
      if (!Number.isFinite(candidateValue)) return;
      const match = Math.max(0, 100 - 25 * Math.abs(profile[key] - candidateValue));
      dimensionScores[key] = match;
      weightedSum += match * weights[key];
      weightSum += weights[key];
    });
    dimensionScores.bio = bio.score;
    weightedSum += bio.score * weights.bio;
    weightSum += weights.bio;
    const score = weightSum ? weightedSum / weightSum : 0;
    return {...pokemon, score: Math.round(score), dimensionScores, profileSnapshot: profile};
  }

  function pickDiverseTopThree(candidates) {
    const sorted = [...candidates].sort((a,b) => b.score - a.score || a.id - b.id);
    if (sorted.length <= 3) return sorted;
    const chosen = [sorted[0]];
    while (chosen.length < 3) {
      const unused = sorted.filter(p => !chosen.some(c => c.id === p.id));
      if (!unused.length) break;
      const bestRemaining = unused[0];
      const usedFamilies = new Set(chosen.map(p => p.family));
      const diverseNear = unused.find(p => !usedFamilies.has(p.family) && bestRemaining.score - p.score <= 5);
      chosen.push(diverseNear || bestRemaining);
    }
    return chosen;
  }

  function calculateAndRenderResults() {
    const {profile, counts} = buildProfile();
    const weights = getAdjustedWeights();
    state.profile = profile;
    state.profileCounts = counts;
    state.adjustedWeights = weights;
    const rejected = state.answers.q14 || [];
    const candidates = POKEMON.map(p => scorePokemon(p, profile, weights)).filter(Boolean);
    state.results = pickDiverseTopThree(candidates);
    state.page = 'results';
    renderResults({candidateCount:candidates.length, rejected});
  }

  function matchLevel(score) {
    if (score >= 85) return '高度契合';
    if (score >= 70) return '相當契合';
    if (score >= 55) return '部分契合';
    return '探索型配對';
  }

  function reasonsFor(result) {
    const entries = DIM_KEYS.map(key => ({key, score: result.dimensionScores[key], weight: state.adjustedWeights[key]}))
      .filter(row => Number.isFinite(row.score))
      .sort((a,b) => (b.score * b.weight) - (a.score * a.weight));
    const chosen = entries.slice(0,3);
    const reasons = chosen.map(row => {
      const label = DIMENSIONS.find(d => d.key === row.key).label;
      return {label, score: Math.round(row.score), text:`你的回答呈現出「${describeTrait(row.key, state.profile[row.key])}」的傾向；本次配對模型在「${label}」面向給予這隻寶可夢較高的相符評分。`};
    });
    const tags = result.bioTags.filter(tag => (state.answers.q13 || []).includes(tag)).map(tag => BIO_CATEGORIES.find(c => c.key === tag)?.label).filter(Boolean);
    if (tags.length) reasons.push({label:'生物偏好',score:100,text:`牠的初版生物標籤符合你選出的喜好類型：${tags.join('、')}。`});
    if (!reasons.length) reasons.push({label:'綜合配對',score:result.score,text:'依照目前的答案與候選資料，這隻寶可夢在整體評分中名列前茅。'});
    return reasons.slice(0,3);
  }

  function getSprite(pokemon) {
    return pokemon.spriteUrl || 'assets/placeholder.svg';
  }

  function cardHtml(pokemon, index) {
    const isFirst = index === 0;
    const reasons = reasonsFor(pokemon);
    const types = pokemon.types.map(t => `<span class="type-pill">${esc(t)}</span>`).join('');
    const featureRows = DIMENSIONS.map(dim => {
      const v = pokemon.dimensionScores[dim.key];
      if (!Number.isFinite(v)) return '';
      return `<li><strong>${esc(dim.label)}</strong>：${Math.round(v)} 分</li>`;
    }).filter(Boolean).join('');
    const topTagNames = pokemon.bioTags.map(key => BIO_CATEGORIES.find(c => c.key === key)?.label).filter(Boolean).slice(0,5);
    const official = `https://tw.portal-pokemon.com/play/pokedex/${padDex(pokemon.id)}`;
    return `
      <article class="pokemon-card ${isFirst ? 'rank-1' : ''}" data-result-card="${pokemon.id}">
        <span class="rank-label">${isFirst ? '✦ 最佳配對' : `TOP ${index + 1}`}</span>
        <div class="pokemon-art"><img src="${esc(getSprite(pokemon))}" alt="${esc(pokemon.nameZh)}" loading="lazy" onerror="this.onerror=null;this.src='assets/placeholder.svg';"></div>
        <div class="pokemon-body">
          <span class="dex-no">NO. ${padDex(pokemon.id)}</span>
          <h3 class="pokemon-name">${esc(pokemon.nameZh)}</h3><p class="pokemon-en">${esc(pokemon.nameEn)}</p>
          <div class="type-row">${types}</div>
          <div class="score-row"><span class="score-big">${pokemon.score}<small style="font-size:.8rem">/100</small></span><span class="score-caption">${matchLevel(pokemon.score)}</span></div>
          <div class="score-track"><div class="score-fill" style="width:${pokemon.score}%"></div></div>
          <p class="reason-short">${esc(reasons[0]?.text || '依照本次測驗的整體配對結果。')}</p>
          <button type="button" class="card-link" data-toggle-detail="${pokemon.id}" aria-expanded="false">查看配對分析 <span>＋</span></button>
          <div class="detail-panel" id="detail-${pokemon.id}">
            <h4 class="detail-title">為什麼推薦牠？</h4>
            <div class="reasons-list">${reasons.map(r => `<div class="reason-line"><span class="reason-check">✓</span><span><strong>${esc(r.label)}</strong><br>${esc(r.text)}</span></div>`).join('')}</div>
            <h4 class="detail-title">各面向契合度</h4>
            <ul>${featureRows}</ul>
            <h4 class="detail-title">初版生物分類標籤</h4>
            <div class="tag-row">${topTagNames.map(t => `<span class="tag">${esc(t)}</span>`).join('') || '<span class="mini-note">尚無可顯示的分類標籤</span>'}</div>
            <h4 class="detail-title">資料依據與來源</h4>
            <p>配對特徵是本版系統整理的暫定標籤，不代表官方人格設定，也尚未逐筆完成來源核對。官方圖鑑連結提供基本資料的查詢入口，不應視為每一項配對特徵的直接證據。</p>
            <p><a class="source-link" href="${official}" target="_blank" rel="noopener noreferrer">查看官方寶可夢圖鑑 ↗</a></p>
            <p><a class="source-link" href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">圖片資料來源：PokéAPI Sprite Repository ↗</a></p>
            <div class="no-data-note">本次配對為娛樂與自我探索用途。分數代表此系統中的相對契合程度，不是經過科學驗證的心理測量。</div>
          </div>
        </div>
      </article>`;
  }

  function renderSavedHistory() {
    const list = savedResults();
    if (!list.length) return `<div class="history-panel"><h3 class="section-title">已保存的結果</h3><div class="empty-state"><strong>目前沒有保存的測驗</strong><span>你可以在結果頁面選擇保存到此瀏覽器。</span></div></div>`;
    return `<div class="history-panel section-card"><h3 class="section-title" style="margin-top:0">已保存的結果</h3>${list.slice().reverse().map(item => `
      <div class="history-row"><div><strong>${esc(item.topNames?.join('、') || '寶可夢配對結果')}</strong><small>${esc(item.date || '')} · ${esc(item.modeLabel || '')}</small></div><button class="btn btn-quiet" type="button" data-delete-save="${esc(item.id)}">刪除</button></div>`).join('')}
      <div class="form-actions"><button class="btn btn-quiet" type="button" id="clear-saves">清除全部保存紀錄</button></div></div>`;
  }

  function renderResults(meta = {}) {
    if (!state.results.length) {
      app.innerHTML = `<section class="results-hero"><span class="result-medal">◇</span><h2>這次的候選條件太嚴格了</h2><p>目前資料集裡找不到符合所有排斥條件的候選者。為了尊重你的選擇，系統沒有自動忽略排斥條件或編造結果。</p></section>
        <div class="section-card"><p>你可以回到最後一題，取消部分排斥類型後重新計算。第一版候選資料僅包含部分物種，也可能因此無法找到合適的結果。</p><div class="form-actions"><button class="btn btn-quiet" id="change-rejections">← 調整排斥條件</button><button class="btn btn-primary" id="restart">重新測驗</button></div></div>`;
      document.getElementById('change-rejections').addEventListener('click', () => { state.page='quiz'; state.questionIndex=13; renderQuestion(); });
      document.getElementById('restart').addEventListener('click', resetAll);
      return;
    }
    const resultSummary = state.results.map(r => ({id:r.id,nameZh:r.nameZh,score:r.score}));
    app.innerHTML = `
      <section class="results-hero"><span class="result-medal">✦</span><span class="step-label" style="justify-content:center;margin-top:12px">YOUR POKÉ PARTNER</span><h2>你的寶可夢夥伴揭曉！</h2><p>這三隻寶可夢在本次配對模型中與你的回答有較高的契合度。展開卡片，可以了解分數與推薦理由。</p></section>
      <div class="profile-summary">
        <div class="summary-box"><strong>${state.results.length}</strong><span>推薦夥伴</span></div>
        <div class="summary-box"><strong>${esc(DIMENSIONS.find(d => d.key === state.answers.q12)?.label || '綜合分析')}</strong><span>本次優先面向</span></div>
        <div class="summary-box"><strong>${state.mode === 'discover' ? '新夥伴' : '完整配對'}</strong><span>測驗模式</span></div>
      </div>
      <div class="results-grid">${state.results.map(cardHtml).join('')}</div>
      <div class="result-save-box">
        <label><input type="checkbox" id="allow-save" ${state.allowSave ? 'checked' : ''}><span><strong>我同意將本次結果保存至此瀏覽器</strong><br>紀錄只保存在這台裝置的瀏覽器，不會傳送到伺服器。預設不保存，可隨時清除。</span></label>
        <div class="form-actions" style="margin-top:14px"><button class="btn btn-secondary" id="save-result" ${state.allowSave ? '' : 'disabled'}>保存本次結果</button><span class="mini-note">保存的是答案摘要與推薦結果。</span></div>
      </div>
      <div class="result-controls"><button class="btn btn-primary" id="download-card">下載分享卡 SVG</button><button class="btn btn-secondary" id="restart">再測一次</button><button class="btn btn-quiet" id="back-answers">返回修改答案</button></div>
      ${renderSavedHistory()}
      <p class="mini-note" style="text-align:center;margin-top:20px">候選資料：${meta.candidateCount ?? POKEMON.length} 隻示範物種。第一版尚未涵蓋全國圖鑑；推薦標籤為初步模型設定，需持續核對與擴充。</p>`;

    app.querySelectorAll('[data-toggle-detail]').forEach(btn => btn.addEventListener('click', () => {
      const panel = document.getElementById(`detail-${btn.dataset.toggleDetail}`);
      const expanded = panel.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(expanded));
      btn.innerHTML = expanded ? '收合配對分析 <span>−</span>' : '查看配對分析 <span>＋</span>';
    }));
    const allowSave = document.getElementById('allow-save');
    const saveButton = document.getElementById('save-result');
    allowSave.addEventListener('change', () => { state.allowSave = allowSave.checked; saveButton.disabled = !state.allowSave; });
    saveButton.addEventListener('click', saveCurrentResult);
    document.getElementById('download-card').addEventListener('click', downloadShareCard);
    document.getElementById('restart').addEventListener('click', resetAll);
    document.getElementById('back-answers').addEventListener('click', () => { state.page = 'quiz'; state.questionIndex = 0; renderQuestion(); });
    app.querySelectorAll('[data-delete-save]').forEach(btn => btn.addEventListener('click', () => {
      const updated = savedResults().filter(item => item.id !== btn.dataset.deleteSave);
      localStorage.setItem(SAVE_KEY, JSON.stringify(updated)); renderResults(meta); showToast('已刪除保存紀錄。');
    }));
    const clear = document.getElementById('clear-saves');
    if (clear) clear.addEventListener('click', () => {
      if (!window.confirm('確定要清除這個瀏覽器保存的所有測驗結果嗎？')) return;
      localStorage.removeItem(SAVE_KEY); renderResults(meta); showToast('已清除所有保存紀錄。');
    });
  }

  function saveCurrentResult() {
    if (!state.allowSave) { showToast('請先勾選同意保存。'); return; }
    try {
      const entries = savedResults();
      const now = new Date();
      const record = {
        id: `r-${now.getTime()}`,
        date: now.toLocaleString('zh-TW', {year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}),
        modeLabel: state.mode === 'discover' ? '發現新夥伴' : '尋找最適合的夥伴',
        topNames: state.results.map(p => p.nameZh),
        results: state.results.map(p => ({id:p.id,score:p.score})),
        weights: state.weights,
        answers: state.answers,
        appVersion: '1.0'
      };
      entries.push(record);
      localStorage.setItem(SAVE_KEY, JSON.stringify(entries.slice(-20)));
      showToast('結果已保存到此瀏覽器。');
      renderResults({candidateCount:POKEMON.length});
    } catch (error) { showToast('目前無法保存，可能是瀏覽器儲存空間受到限制。'); }
  }

  function downloadShareCard() {
    const cards = state.results;
    const lines = cards.map((p, index) => `<text x="80" y="${310 + index*105}" font-size="25" font-weight="700" fill="#24283b">${esc(p.nameZh)} · ${p.nameEn}</text><text x="80" y="${344 + index*105}" font-size="17" fill="#686b7c">NO. ${padDex(p.id)}　契合度 ${p.score}/100　${matchLevel(p.score)}</text>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="690" viewBox="0 0 900 690"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffe6b2"/><stop offset=".55" stop-color="#ffe6e5"/><stop offset="1" stop-color="#e8e5ff"/></linearGradient></defs><rect width="900" height="690" rx="36" fill="#fffdf9"/><rect x="20" y="20" width="860" height="650" rx="30" fill="url(#bg)"/><text x="55" y="75" font-size="19" font-weight="800" fill="#d9404b" letter-spacing="3">POKÉ PARTNER</text><text x="55" y="135" font-size="42" font-weight="900" fill="#24283b">你的寶可夢夥伴</text><text x="55" y="175" font-size="20" fill="#686b7c">依照個性、價值觀、生活方式與偏好進行配對</text>${lines}<text x="55" y="640" font-size="15" fill="#777184">趣味配對結果 · 非官方心理測驗 · 資料特徵為初版模型標籤</text></svg>`;
    const blob = new Blob([svg], {type:'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'pokemon-partner-result.svg'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    showToast('分享卡已下載為 SVG 檔案。');
  }

  function resetAll() {
    state.page = 'welcome'; state.mode = 'match'; state.weights = {...STATE_DEFAULT_WEIGHTS};
    state.excludedIds = []; state.favoriteSearch = ''; state.answers = {}; state.questionIndex = 0;
    state.selectedBio = []; state.rejectedBio = []; state.results = []; state.profile = null;
    state.adjustedWeights = null; state.priorityDimension = null; state.allowSave = false;
    render();
  }

  function render() {
    if (state.page === 'welcome') renderWelcome();
    else if (state.page === 'setup') renderSetup();
    else if (state.page === 'quiz') renderQuestion();
    else if (state.page === 'results') renderResults({candidateCount:POKEMON.length});
  }

  render();
})();
