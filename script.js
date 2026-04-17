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

    /*
    setTimeout(() => {
      const overlay = document.getElementById('success');
      document.getElementById('success-title').textContent = `Bienvenue, ${labels[selectedRole]} !`;
      document.getElementById('success-sub').textContent = 'Chargement de votre espace téléphonie…';
      
      // On ajoute la classe "show" pour afficher l'écran de succès
      overlay.classList.add('show');

      // 👉 AJOUT ICI : passer au dashboard après affichage
      setTimeout(() => {
        // CORRECTION ICI : On enlève bien "show" et pas "success" !
        overlay.classList.remove('show');
        
        // On affiche la deuxième interface
        document.getElementById('app-screen').classList.add('active'); 
      }, 2000); // temps d'affichage du success
  
    }, 800);
    */

    setTimeout(() => {
      const overlay = document.getElementById('success');
      const appScreen = document.getElementById('app-screen');
      
      // 1. On prépare et on affiche l'écran "Success"
      document.getElementById('success-title').textContent = `Bienvenue, ${labels[selectedRole]} !`;
      document.getElementById('success-sub').textContent = 'Chargement de votre espace téléphonie…';
      overlay.classList.add('show');

      // 2. On attend 2 secondes avant de changer
      setTimeout(() => {
          // On cache l'overlay "Success" en enlevant la classe qui le rend visible
          overlay.classList.remove('show'); 
          
          // On pourrait aussi le cacher complètement pour être sûr
          overlay.style.display = 'none'; 

          // 3. On affiche l'interface "App-screen"
          appScreen.classList.add('active');
          
          // Optionnel : on force l'affichage si ton CSS utilise display
          appScreen.style.display = 'block'; 
          
        }, 2000); 

    }, 800);
    
  }