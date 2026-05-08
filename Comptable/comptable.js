/* Clock */
function tick(){document.getElementById('clock').textContent=new Date().toLocaleTimeString('fr-FR');}
setInterval(tick,1000);tick();

// 1. Ouvre la fenêtre quand on clique sur le bouton de la sidebar
function openLogoutModal() {
  document.getElementById('logout-modal').classList.add('show');
}

// 2. Ferme la fenêtre si l'utilisateur clique sur "Non"
function closeLogoutModal() {
  document.getElementById('logout-modal').classList.remove('show');
}

// 3. Déconnecte pour de vrai si l'utilisateur clique sur "Oui"
function confirmLogout() {
  // On cache la fenêtre de confirmation
  document.getElementById('logout-modal').classList.remove('show');
}

/* Animate bars on load */
window.addEventListener('load',()=>{
  setTimeout(()=>{
    document.querySelector('.bar-in').style.width='100%';
    document.querySelector('.bar-out').style.width='25.7%';
    document.querySelector('.bar-net').style.width='74.3%';
  },200);
});

// ===== CALL PANEL =====
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

// Logout

// ===== DÉCONNEXION =====

// 1. Ouvre la fenêtre quand on clique sur le bouton de la sidebar
function openLogoutModal() {
  document.getElementById('logout-modal').classList.add('show');
}

// 2. Ferme la fenêtre si l'utilisateur clique sur "Non"
function closeLogoutModal() {
  document.getElementById('logout-modal').classList.remove('show');
}

// 3. Déconnecte pour de vrai si l'utilisateur clique sur "Oui"
function confirmLogout() {
  document.getElementById('logout-modal').classList.remove('show');
  window.location.href = '../Caissier/main.html';
}
