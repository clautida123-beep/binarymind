/* Clock */
function tick(){document.getElementById('clock').textContent=new Date().toLocaleTimeString('fr-FR');}
setInterval(tick,1000);tick();

/* ===== BADGE / CARD SYSTEM ===== */
const agents = {
  EM: { name:'Emmanuel', role:'Agent · Sécurité',  num:'SEC-2024-007', granted:true,  color:'rgba(255,107,138,.15)', colorVar:'#ff6b8a',  dept:'Sécurité' },
  SA: { name:'Samuel',   role:'Caissier',           num:'CAI-2024-003', granted:true,  color:'rgba(99,190,255,.15)',  colorVar:'#63beff',  dept:'Caissier' },
  CL: { name:'Claudia',  role:'Comptable',          num:'COM-2024-002', granted:true,  color:'rgba(167,139,250,.15)',colorVar:'#a78bfa',  dept:'Comptable' },
  ME: { name:'Melscha',  role:'Logistique',         num:'LOG-2024-005', granted:true,  color:'rgba(74,222,128,.15)', colorVar:'#4ade80',  dept:'Logistique' },
};
let currentAgent = 'EM';

function selectAgent(id, name, role, num, color, colorVar) {
  currentAgent = id;
  // Update card visual
  document.getElementById('card-initials').textContent = id;
  document.getElementById('card-initials').style.color = agents[id].colorVar;
  document.getElementById('card-initials').style.background = agents[id].color;
  document.getElementById('card-name').textContent = name;
  document.getElementById('card-role').textContent = role;
  document.getElementById('card-num').textContent = 'ID · ' + num;
  // Chip selection UI
  ['EM','SA','CL','ME'].forEach(k => document.getElementById('chip-'+k).classList.remove('selected'));
  document.getElementById('chip-'+id).classList.add('selected');
  // Reset result
  const r = document.getElementById('access-result');
  r.classList.remove('show','granted','denied');
}

function scanCard() {
  const agent = agents[currentAgent];
  const result = document.getElementById('access-result');
  const icon   = document.getElementById('acc-icon');
  const svg    = document.getElementById('acc-svg');
  const verdict= document.getElementById('acc-verdict');
  const sub    = document.getElementById('acc-sub');
  const badge  = document.getElementById('acc-badge');

  // flash card
  const card = document.getElementById('id-card');
  card.style.boxShadow = agent.granted
    ? '0 0 20px rgba(74,222,128,.5)'
    : '0 0 20px rgba(255,107,138,.5)';
  setTimeout(() => card.style.boxShadow = '', 1000);

  result.classList.remove('show','granted','denied');

  setTimeout(() => {
    if (agent.granted) {
      result.classList.add('show','granted');
      icon.className = 'access-icon g';
      svg.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
      svg.setAttribute('stroke','#4ade80');
      verdict.textContent = '✓ Accès Accordé';
      verdict.className = 'access-verdict g';
      sub.textContent = agent.name + ' · ' + agent.dept + ' — ' + agent.num;
      badge.textContent = 'AUTORISÉ';
      badge.className = 'access-badge ab-g';
    } else {
      result.classList.add('show','denied');
      icon.className = 'access-icon d';
      svg.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
      svg.setAttribute('stroke','#ff6b8a');
      verdict.textContent = '✕ Accès Refusé';
      verdict.className = 'access-verdict d';
      sub.textContent = 'Carte non reconnue — ID · ???';
      badge.textContent = 'REFUSÉ';
      badge.className = 'access-badge ab-d';
    }
    // Add to log
    addLog(agent.name, agent.dept, agent.granted);
  }, 500);
}

function addLog(name, dept, granted) {
  const list = document.getElementById('log-list');
  const now  = new Date();
  const hh   = String(now.getHours()).padStart(2,'0');
  const mm   = String(now.getMinutes()).padStart(2,'0');
  const item = document.createElement('div');
  item.className = 'log-item';
  item.style.animation = 'fi .35s ease both';
  item.innerHTML = `
    <div class="log-dot ${granted ? 'log-dot-ok' : 'log-dot-err'}"></div>
    <span class="log-name">${name} · ${dept}</span>
    <span class="log-verdict ${granted ? 'lv-ok' : 'lv-err'}">${granted ? 'Accordé' : 'Refusé'}</span>
    <span class="log-time">${hh}:${mm}</span>`;
  list.insertBefore(item, list.firstChild);
}

/* Simulate a REFUSED card for demo — triple-click the card */
let clickCount = 0;
document.getElementById('id-card').addEventListener('click', () => {
  clickCount++;
  if (clickCount === 3) {
    clickCount = 0;
    // temporarily simulate unknown card
    const orig = agents[currentAgent].granted;
    agents[currentAgent].granted = false;
    scanCard();
    setTimeout(() => agents[currentAgent].granted = orig, 1000);
  }
});

/* ===== CAMERAS ===== */
const camTimers = {A:0, B:0};
const camPaused = {A:false, B:false};
let selCamId = 'A';

setInterval(() => {
  for (const k of ['A','B']) {
    if (!camPaused[k]) {
      camTimers[k]++;
      const h = String(Math.floor(camTimers[k]/3600)).padStart(2,'0');
      const m = String(Math.floor((camTimers[k]%3600)/60)).padStart(2,'0');
      const s = String(camTimers[k]%60).padStart(2,'0');
      document.getElementById('ctim'+k).textContent = h+':'+m+':'+s;
    }
  }
}, 1000);

function selCam(id) {
  selCamId = id;
  document.querySelectorAll('.cam-cell').forEach(c => c.classList.remove('sel'));
  document.getElementById('cam'+id).classList.add('sel');
  document.getElementById('sel-lbl').textContent = id === 'A' ? '01' : '02';
  const p = camPaused[id];
  document.getElementById('pause-lbl').textContent = p ? 'Reprendre' : 'Pause';
  document.getElementById('pause-ico').style.display = p ? 'none' : 'block';
  document.getElementById('play-ico').style.display  = p ? 'block' : 'none';
  document.getElementById('btn-pause').classList.toggle('act', p);
}

function togglePause() {
  const id = selCamId;
  camPaused[id] = !camPaused[id];
  const p = camPaused[id];
  document.getElementById('scan'+id).classList.toggle('paused', p);
  document.getElementById('pov'+id).classList.toggle('show', p);
  document.getElementById('rdot'+id).classList.toggle('paused', p);
  document.getElementById('rlbl'+id).textContent = p ? 'PAUSE' : 'REC';
  document.getElementById('pause-lbl').textContent = p ? 'Reprendre' : 'Pause';
  document.getElementById('pause-ico').style.display = p ? 'none' : 'block';
  document.getElementById('play-ico').style.display  = p ? 'block' : 'none';
  document.getElementById('btn-pause').classList.toggle('act', p);
}

function doReplay() {
  const id = selCamId;
  if (camPaused[id]) {
    camPaused[id] = false;
    document.getElementById('scan'+id).classList.remove('paused');
    document.getElementById('pov'+id).classList.remove('show');
    document.getElementById('rdot'+id).classList.remove('paused');
    document.getElementById('rlbl'+id).textContent = 'REC';
    document.getElementById('pause-lbl').textContent = 'Pause';
    document.getElementById('pause-ico').style.display = 'block';
    document.getElementById('play-ico').style.display  = 'none';
    document.getElementById('btn-pause').classList.remove('act');
  }
  camTimers[id] = 0;
  const f = document.getElementById('rflash');
  f.style.display = 'inline';
  setTimeout(() => f.style.display = 'none', 3000);
}

/* ===== CALL ===== */

let panelOpen = false;

function toggleCallPanel() {
  panelOpen = !panelOpen;
  document.getElementById('call-panel').classList.toggle('open', panelOpen);
  document.getElementById('call-fab').classList.toggle('open', panelOpen);
  document.getElementById('fab-icon-phone').style.display = panelOpen ? 'none' : 'block';
  document.getElementById('fab-icon-close').style.display = panelOpen ? 'block' : 'none';
}

function switchTab(tab) {
  document.querySelectorAll('.cp-tab').forEach((t, i) => t.classList.toggle('active', (i === 0 && tab === 'contacts') || (i === 1 && tab === 'history')));
  document.getElementById('tab-contacts').classList.toggle('active', tab === 'contacts');
  document.getElementById('tab-history').classList.toggle('active', tab === 'history');
}

// ===== CALLING =====
let callState = 'idle'; // idle | ringing | active
let callTimer = null; let callSeconds = 0;
let isRecording = false;
let ringTimeout = null;
let currentContact = null;

function startCall(name, dept, color) {
  if (callState !== 'idle') return;
  callState = 'ringing';
  currentContact = { name, dept, color };

  // show ringing
  const rav = document.getElementById('ring-avatar');
  rav.textContent = name[0];
  rav.style.background = `linear-gradient(135deg, ${color}, #818cf8)`;
  document.getElementById('ring-name').textContent = name + ' · ' + dept;

  document.getElementById('contact-list-view').style.display = 'none';
  document.getElementById('ringing-view').classList.add('show');
  document.getElementById('active-call-view').classList.remove('show');

  // simulate answer after 3s
  ringTimeout = setTimeout(() => answerCall(name, dept, color), 3000);
}

function answerCall(name, dept, color) {
  callState = 'active';
  document.getElementById('ringing-view').classList.remove('show');

  const av = document.getElementById('call-avatar');
  av.textContent = name[0];
  av.style.background = `linear-gradient(135deg, ${color}, #818cf8)`;
  document.getElementById('call-name-display').textContent = name;
  document.getElementById('call-status-txt').textContent = dept + ' · En communication';
  document.getElementById('active-call-view').classList.add('show');

  callSeconds = 0;
  callTimer = setInterval(() => {
    callSeconds++;
    const m = String(Math.floor(callSeconds / 60)).padStart(2,'0');
    const s = String(callSeconds % 60).padStart(2,'0');
    document.getElementById('call-timer').textContent = m + ':' + s;
  }, 1000);
}

function cancelCall() {
  if (ringTimeout) clearTimeout(ringTimeout);
  callState = 'idle';
  document.getElementById('ringing-view').classList.remove('show');
  document.getElementById('active-call-view').classList.remove('show');
  document.getElementById('contact-list-view').style.display = '';
  addHistory(currentContact, 0, false);
  currentContact = null;
}

function endCall() {
  if (callTimer) clearInterval(callTimer);
  const dur = callSeconds;
  const rec = isRecording;
  if (isRecording) { isRecording = false; document.getElementById('rec-btn').classList.remove('recording'); }
  callState = 'idle';
  document.getElementById('active-call-view').classList.remove('show');
  document.getElementById('contact-list-view').style.display = '';
  callSeconds = 0;
  document.getElementById('call-timer').textContent = '00:00';
  addHistory(currentContact, dur, rec);
  currentContact = null;
}

function toggleRecord() {
  isRecording = !isRecording;
  document.getElementById('rec-btn').classList.toggle('recording', isRecording);
}

// ===== HISTORY =====
let callHistory = [];

function addHistory(contact, dur, recorded) {
  if (!contact) return;
  callHistory.unshift({ name: contact.name, dept: contact.dept, color: contact.color, dur, recorded, time: new Date().toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'}) });
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('history-list');
  document.getElementById('history-empty').style.display = callHistory.length ? 'none' : '';
  // Remove old items
  list.querySelectorAll('.hist-item').forEach(el => el.remove());

  callHistory.forEach(h => {
    const div = document.createElement('div');
    div.className = 'hist-item';
    const m = String(Math.floor(h.dur / 60)).padStart(2,'0');
    const s = String(h.dur % 60).padStart(2,'0');
    div.innerHTML = `
      <div class="hist-icon ${h.recorded ? 'rec' : 'out'}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
      </div>
      <div class="hist-info">
        <div class="hist-name">${h.name} ${h.recorded ? '<span class="hist-rec-badge">REC</span>' : ''}</div>
        <div class="hist-meta">${h.dept} · ${h.time}</div>
      </div>
      <div class="hist-dur">${h.dur > 0 ? m+':'+s : 'Annulé'}</div>
    `;
    list.appendChild(div);
  });
}