// ===== CLOCK =====

function updateClock() {
  const now = new Date();
  const t = now.toLocaleTimeString('fr-FR');
  document.getElementById('clock').textContent = t;
  document.getElementById('cam-time').textContent = t;
}
updateClock(); setInterval(updateClock, 1000);

// ===== CLIMATE =====
let climOn = false;
function setClim(on) {
  climOn = on;
  document.getElementById('btn-on').className  = 'pw-btn' + (on ? ' on-active' : '');
  document.getElementById('btn-off').className = 'pw-btn' + (!on ? ' off-active' : '');
  document.getElementById('slider-wrap').classList.toggle('enabled', on);
  const tag = document.getElementById('clim-status-tag');
  if (on) {
    tag.textContent = 'ACTIF';
    tag.style.cssText = 'font-size:0.65rem;color:var(--success);background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.25);padding:2px 8px;border-radius:20px;';
  } else {
    tag.textContent = 'ÉTEINT';
    tag.style.cssText = 'font-size:0.65rem;color:var(--error);background:rgba(255,107,138,0.1);border:1px solid rgba(255,107,138,0.25);padding:2px 8px;border-radius:20px;';
  }
}

function updateTemp(v) {
  v = parseInt(v);
  document.getElementById('temp-val').textContent = v + '°';
  const pct = ((v - 16) / (30 - 16)) * 100;
  document.getElementById('temp-thumb').style.left = pct + '%';
  const badge = document.getElementById('temp-badge');
  if (v <= 19) {
    badge.textContent = 'Froid'; badge.className = 'temp-badge badge-cold';
  } else if (v <= 24) {
    badge.textContent = 'Normal'; badge.className = 'temp-badge badge-normal';
  } else {
    badge.textContent = 'Chaud'; badge.className = 'temp-badge badge-hot';
  }
}

// ===== POS DATA =====
const products = [
  { name: 'Lait Entier 1L', cat: 'Produits laitiers', emoji: '🥛', color: '#3498db' },
  { name: 'Pain de Mie', cat: 'Boulangerie', emoji: '🍞', color: '#e67e22' },
  { name: 'Jus d\'Orange', cat: 'Boissons', emoji: '🍊', color: '#f39c12' },
  { name: 'Yaourt Fraise', cat: 'Produits laitiers', emoji: '🍓', color: '#e74c3c' },
  { name: 'Pâtes Spaghetti', cat: 'Épicerie', emoji: '🍝', color: '#9b59b6' },
  { name: 'Eau minérale', cat: 'Boissons', emoji: '💧', color: '#2ecc71' },
  { name: 'Fromage Brie', cat: 'Fromagerie', emoji: '🧀', color: '#f39c12' },
  { name: 'Chocolat Noir', cat: 'Confiserie', emoji: '🍫', color: '#8e44ad' },
  { name: 'Café Moulu', cat: 'Épicerie', emoji: '☕', color: '#795548' },
  { name: 'Riz Basmati', cat: 'Épicerie', emoji: '🍚', color: '#3d8bcd' },
];

let posItems = []; let posCount = 0; let posTotal = 0;

function addPosItem() {
  const p = products[Math.floor(Math.random() * products.length)];
  const qty = Math.floor(Math.random() * 3) + 1;
  const price = (Math.random() * 4 + 0.5).toFixed(2);
  const total = (qty * price).toFixed(2);
  const now = new Date().toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit', second:'2-digit'});

  posCount += qty;
  posTotal += parseFloat(total);
  document.getElementById('pos-count').textContent = posCount;
  document.getElementById('pos-total').textContent = posTotal.toFixed(2) + '€';

  const tbody = document.getElementById('pos-tbody');
  const tr = document.createElement('tr');
  tr.className = 'new-row';
  tr.innerHTML = `
    <td><span class="prod-badge"><span class="prod-dot" style="background:${p.color}"></span>${p.emoji} ${p.name}</span></td>
    <td style="color:var(--muted)">${p.cat}</td>
    <td><span class="pos-qty">${qty}</span></td>
    <td class="pos-price">${price}€</td>
    <td class="pos-total">${total}€</td>
    <td class="pos-time">${now}</td>
  `;
  tbody.insertBefore(tr, tbody.firstChild);
  if (tbody.children.length > 8) tbody.removeChild(tbody.lastChild);
}

addPosItem();
setInterval(addPosItem, 4000);

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
  // On cache la fenêtre de confirmation
  document.getElementById('logout-modal').classList.remove('show');
  
  // On cache le dashboard (Interface 3)
  document.getElementById('dashboard').style.display = 'none';
  
  // On réaffiche la page de connexion (Interface 1)
  document.querySelector('.page').style.display = 'flex';
  
  // On remet le bouton de connexion à zéro au cas où
  const btn = document.getElementById('btn');
  if(btn) {
      btn.disabled = false;
      btn.textContent = 'Se connecter';
  }

  // 1. Vider le mot de passe
const passwordInput = document.getElementById('pw'); // Vérifie bien que ton id est 'password'
if(passwordInput) {
    passwordInput.value = '';
}

// 3. ON DECOCHE TOUS LES ROLES
// On va chercher tous les boutons qui ont la classe "role-btn"
const allRoles = document.querySelectorAll('.role-btn');

allRoles.forEach(roles => {
    // On retire la classe qui les rend "cochés"
    // Vérifie dans ton CSS si c'est 'active' ou 'selected'
    roles.classList.remove('active'); 
    roles.classList.remove('selected'); 
});

// 4. On remet la variable du rôle choisi à vide
// (C'est la variable que tu utilises sûrement pour valider la connexion)
currentRole = null;
}