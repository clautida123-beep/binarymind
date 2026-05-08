  let selectedRole = null;

  function selectRole(btn) {
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedRole = btn.dataset.role;
  }

  function togglePw() {
    const input = document.getElementById('pw');
    const closed = document.getElementById('eye-closed');
    if (input.type === 'password') {
      input.type = 'text';
      open.style.display  = 'none';
      closed.style.display = 'block';
    } else {
      input.type = 'password';
      open.style.display  = 'block';
      closed.style.display = 'none';
    }
  }

  function clearError() {
    document.getElementById('pw').classList.remove('error');
    document.getElementById('err').classList.remove('show');
  }
  
  function showError(msg) {
    const input = document.getElementById('pw');
    const err   = document.getElementById('err');
    document.getElementById('err-text').textContent = msg;
    input.classList.add('error');
    err.classList.add('show');
    input.focus();
    input.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(0)' }
    ], { duration: 300, easing: 'ease' });
  }

  function connect() {
    const pw  = document.getElementById('pw').value;
    const btn = document.getElementById('btn');

    if (!selectedRole) {
      showError('Veuillez sélectionner votre poste');
      return;
    }
    if (!pw) {
      showError('Veuillez entrer votre mot de passe');
      return;
    }
    if (pw !== '1234') {
      showError('Mot de passe incorrect');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Connexion…';

    const labels = {
      caissier: 'Caissier·ère',
      comptable: 'Comptable',
      manager: 'Manager',
      securite: 'Agent de sécurité',
      logistique: 'Logistique'
    };

    setTimeout(() => {
      const overlay = document.getElementById('success');
      document.getElementById('success-title').textContent = `Bienvenue, ${labels[selectedRole]} !`;
      document.getElementById('success-sub').textContent = 'Chargement de votre espace téléphonie…';
      overlay.classList.add('show');

      // 👇 AJOUTE CE NOUVEAU CHRONOMÈTRE JUSTE ICI 👇
      setTimeout(() => {
  overlay.classList.remove('show');

  const redirections = {
    caissier:   'caissier.html',
    comptable:  '../Comptable/comptable.html',
    manager:    '../Manager/manager.html',
    securite:   '../Sécurité/securite.html',
    logistique: '../Logistique/logistique.html'
  };

  window.location.href = redirections[selectedRole];
}, 3000);
    }, 800);
  }