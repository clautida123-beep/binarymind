/* Clock */
function tick(){document.getElementById('clock').textContent=new Date().toLocaleTimeString('fr-FR');}
setInterval(tick,1000);tick();

/* ===== LAMPS ===== */
const lampState={1:false,2:false};
function toggleLamp(n){
  lampState[n]=!lampState[n];
  const on=lampState[n];
  const card=document.getElementById('lamp'+n);
  const tog=document.getElementById('tog'+n);
  const status=document.getElementById('lstatus'+n);
  card.className='lamp-card '+(on?'on':'off');
  tog.classList.toggle('on',on);
  status.textContent=on?'ON':'OFF';
  status.className='lamp-status '+(on?'on':'off');
}

/* ===== PRODUCTS DATA ===== */
const products=[
  {id:1,name:'Lait demi-écrémé 1L',   rayon:'laitiers',   stock:72, max:100, price:'1,09 €'},
  {id:2,name:'Yaourt nature x8',       rayon:'laitiers',   stock:45, max:80,  price:'3,20 €'},
  {id:3,name:'Fromage emmental 400g',  rayon:'laitiers',   stock:28, max:60,  price:'3,80 €'},
  {id:4,name:'Beurre doux 250g',       rayon:'laitiers',   stock:18, max:50,  price:'2,15 €'},
  {id:5,name:'Pain de mie complet',    rayon:'boulangerie',stock:12, max:80,  price:'2,45 €'},
  {id:6,name:'Baguette tradition',     rayon:'boulangerie',stock:8,  max:60,  price:'1,20 €'},
  {id:7,name:'Croissants x6',          rayon:'boulangerie',stock:22, max:50,  price:'3,50 €'},
  {id:8,name:'Coca-Cola 1.5L',         rayon:'boissons',   stock:85, max:120, price:'1,99 €'},
  {id:9,name:'Eau minérale 6x1L',      rayon:'boissons',   stock:62, max:100, price:'3,29 €'},
  {id:10,name:'Jus d\'orange 1L',      rayon:'boissons',   stock:41, max:80,  price:'1,89 €'},
  {id:11,name:'Café moulu 250g',       rayon:'epicerie',   stock:35, max:70,  price:'4,50 €'},
  {id:12,name:'Pâtes spaghetti 500g',  rayon:'epicerie',   stock:54, max:90,  price:'0,99 €'},
  {id:13,name:'Riz basmati 1kg',       rayon:'epicerie',   stock:47, max:80,  price:'2,70 €'},
  {id:14,name:'Chips nature 150g',     rayon:'epicerie',   stock:29, max:60,  price:'1,49 €'},
  {id:15,name:'Poulet rôti 1.2kg',     rayon:'surgeles',   stock:14, max:40,  price:'8,99 €'},
  {id:16,name:'Lasagnes bolognaises',  rayon:'surgeles',   stock:31, max:60,  price:'3,75 €'},
  {id:17,name:'Glace vanille 1L',      rayon:'surgeles',   stock:19, max:50,  price:'3,20 €'},
];

const rayonIcons={laitiers:'🥛',boulangerie:'🥖',boissons:'🥤',epicerie:'🛒',surgeles:'🧊'};
const rayonNames={laitiers:'Laitiers',boulangerie:'Boulangerie',boissons:'Boissons',epicerie:'Épicerie',surgeles:'Surgelés'};
let activeRayon='tous';

function getStockClass(p){
  const pct=p.stock/p.max;
  if(pct>0.4)return'ok';
  if(pct>0.2)return'warn';
  return'low';
}

function renderTable(){
  const body=document.getElementById('prod-body');
  const filtered=activeRayon==='tous'?products:products.filter(p=>p.rayon===activeRayon);
  body.innerHTML=filtered.map(p=>{
    const pct=Math.round((p.stock/p.max)*100);
    const cls=getStockClass(p);
    const label=cls==='ok'?'Normal':cls==='warn'?'Bas':'Critique';
    return`<tr id="row-${p.id}">
      <td><div class="pname">${p.name}</div></td>
      <td style="color:var(--mu);font-size:.75rem">${rayonIcons[p.rayon]} ${rayonNames[p.rayon]}</td>
      <td style="text-align:center">
        <span class="pstock ps-${cls}">${p.stock} u.</span>
      </td>
      <td>
        <div style="display:flex;align-items:center;gap:7px;">
          <div class="pbar-wrap"><div class="pbar-fill pf-${cls}" style="width:${pct}%"></div></div>
          <span style="font-size:.65rem;color:var(--mu);min-width:28px;">${pct}%</span>
        </div>
      </td>
      <td style="font-family:'Syne',sans-serif;font-size:.8rem;font-weight:600;color:var(--acc)">${p.price}</td>
      <td style="text-align:center">
        <div style="display:flex;align-items:center;justify-content:center;gap:6px;">
          <div class="pminus" onclick="updateStock(${p.id},-1)" title="Simuler achat">−</div>
          <div class="pplus"  onclick="updateStock(${p.id},+5)" title="Réapprovisionner">+</div>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function updateStock(id, delta){
  const p=products.find(x=>x.id===id);
  if(!p)return;
  p.stock=Math.max(0,Math.min(p.max,p.stock+delta));
  renderTable();
  // flash row
  const row=document.getElementById('row-'+id);
  if(row){row.style.animation='none';void row.offsetWidth;row.classList.add('updated-flash');}
}

function showRayon(r){
  activeRayon=r;
  document.querySelectorAll('.rtab').forEach(t=>t.classList.remove('active'));
  event.target.classList.add('active');
  renderTable();
}

renderTable();

/* Auto-decrement stock every 10s (simulate sales) */
setInterval(()=>{
  const idx=Math.floor(Math.random()*products.length);
  const p=products[idx];
  if(p.stock>0){
    p.stock=Math.max(0,p.stock-Math.floor(Math.random()*3+1));
    renderTable();
  }
},10000);

/* ===== GPS TRUCK ANIMATION ===== */
// Route waypoints on the SVG map
const waypoints=[
  {cx:157,cy:33},
  {cx:157,cy:55},
  {cx:105,cy:55},
  {cx:105,cy:105},
  {cx:185,cy:105},
  {cx:185,cy:165},
];
const distances=[4.2,3.8,3.1,2.3,1.4,0];
const etas=['~12 min','~10 min','~8 min','~6 min','~3 min','Arrivé !'];
const speeds=[48,52,45,38,30,0];

let wpIdx=0;
function moveTruck(){
  if(wpIdx>=waypoints.length-1){
    document.getElementById('gps-dist').textContent='Arrivé';
    document.getElementById('gps-eta').textContent='✓ Livré';
    document.getElementById('gps-speed').textContent='0 km/h';
    // reset after 4s
    setTimeout(()=>{
      wpIdx=0;
      moveTruck();
    },5000);
    return;
  }
  wpIdx++;
  const wp=waypoints[wpIdx];
  const truck=document.getElementById('truck');
  const label=document.getElementById('truck-label');
  truck.setAttribute('cx',wp.cx);
  truck.setAttribute('cy',wp.cy);
  label.setAttribute('x',wp.cx);
  label.setAttribute('y',wp.cy-10);
  document.getElementById('gps-dist').textContent=distances[wpIdx]+' km';
  document.getElementById('gps-eta').textContent=etas[wpIdx];
  document.getElementById('gps-speed').textContent=speeds[wpIdx]+' km/h';
}
setInterval(moveTruck,4000);

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