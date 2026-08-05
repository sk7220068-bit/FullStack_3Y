/* ==========================================================================
   ApexDev Studio - Master JavaScript Application Logic
   Theme Handler, Navigation, Interactive Widgets, Forms & Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initStatsCounter();
  initProjectsFilter();
  initSimulator();
  initAuthAndForms();
});

/* --- Theme Management --- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('apexdev_theme') || 'dark';
  
  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeIcon(storedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('apexdev_theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} theme`, 'info');
    });
  }
}

function updateThemeIcon(theme) {
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

/* --- Mobile Nav & Active Page --- */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Highlight active link based on window location
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --- Animated Counter Statistics --- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target') || '0', 10);
        const prefix = entry.target.getAttribute('data-prefix') || '';
        const suffix = entry.target.getAttribute('data-suffix') || '';
        let count = 0;
        const step = Math.ceil(target / 40);

        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            count = target;
            clearInterval(timer);
          }
          entry.target.textContent = `${prefix}${count}${suffix}`;
        }, 30);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => observer.observe(num));
}

/* --- Projects Filter & Search --- */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const searchInput = document.getElementById('project-search');

  if (!projectCards.length) return;

  function filterProjects() {
    const activeCategory = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const title = card.querySelector('.project-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.project-desc')?.textContent.toLowerCase() || '';

      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = title.includes(query) || desc.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterProjects);
  }
}

/* --- Interactive Code Simulator --- */
function initSimulator() {
  const codeEditor = document.getElementById('code-editor');
  const consoleOutput = document.getElementById('console-output');
  const runBtn = document.getElementById('run-code-btn');

  if (!runBtn || !codeEditor || !consoleOutput) return;

  runBtn.addEventListener('click', () => {
    const code = codeEditor.value;
    consoleOutput.innerHTML = '<span style="color: #94a3b8;">> Executing script...</span><br/>';
    
    setTimeout(() => {
      try {
        let logs = [];
        const customConsole = {
          log: (...args) => logs.push(args.join(' ')),
          error: (...args) => logs.push(`<span style="color: #ff5f56;">[Error] ${args.join(' ')}</span>`),
          info: (...args) => logs.push(`<span style="color: #00f2fe;">[Info] ${args.join(' ')}</span>`)
        };

        // Safe execution context
        const runFn = new Function('console', code);
        runFn(customConsole);

        if (logs.length > 0) {
          consoleOutput.innerHTML = logs.map(line => `> ${line}`).join('<br/>');
        } else {
          consoleOutput.innerHTML = '> Execution completed with no output.';
        }
        showToast('Code executed successfully!', 'success');
      } catch (err) {
        consoleOutput.innerHTML = `<span style="color: #ff5f56;">> Execution Exception: ${err.message}</span>`;
        showToast('Execution error', 'error');
      }
    }, 400);
  });
}

/* --- Auth Tabs, Demo Login & Contact Form --- */
function initAuthAndForms() {
  const tabAuthBtn = document.getElementById('tab-auth-btn');
  const tabContactBtn = document.getElementById('tab-contact-btn');
  const authSection = document.getElementById('auth-form-section');
  const contactSection = document.getElementById('contact-form-section');
  const demoLoginBtn = document.getElementById('demo-login-btn');
  const loginForm = document.getElementById('login-form');
  const contactForm = document.getElementById('contact-form');
  const clientDashboard = document.getElementById('client-dashboard');
  const logoutBtn = document.getElementById('logout-btn');

  // Tab Switching
  if (tabAuthBtn && tabContactBtn && authSection && contactSection) {
    tabAuthBtn.addEventListener('click', () => {
      tabAuthBtn.classList.add('active');
      tabContactBtn.classList.remove('active');
      authSection.style.display = 'block';
      contactSection.style.display = 'none';
    });

    tabContactBtn.addEventListener('click', () => {
      tabContactBtn.classList.add('active');
      tabAuthBtn.classList.remove('active');
      contactSection.style.display = 'block';
      authSection.style.display = 'none';
    });
  }

  // Quick Demo Login
  if (demoLoginBtn) {
    demoLoginBtn.addEventListener('click', () => {
      document.getElementById('email-input').value = 'alex.dev@apex.io';
      document.getElementById('password-input').value = '••••••••••••';
      showToast('Demo credentials autofilled! Submitting...', 'info');
      setTimeout(() => {
        if (authSection && clientDashboard) {
          authSection.style.display = 'none';
          document.querySelector('.auth-wrapper').style.display = 'none';
          clientDashboard.style.display = 'block';
          showToast('Welcome back, Alex! Client portal unlocked.', 'success');
        }
      }, 700);
    });
  }

  // Login Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email-input').value;
      if (!email) return;

      if (authSection && clientDashboard) {
        document.querySelector('.auth-wrapper').style.display = 'none';
        clientDashboard.style.display = 'block';
        document.getElementById('user-email-display').textContent = email;
        showToast('Login successful!', 'success');
      }
    });
  }

  // Logout Button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clientDashboard.style.display = 'none';
      document.querySelector('.auth-wrapper').style.display = 'grid';
      showToast('Logged out of Client Portal.', 'info');
    });
  }

  // Contact Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Message sent! We will respond within 24 hours.', 'success');
      contactForm.reset();
    });
  }
}

/* --- Toast Notification Utility --- */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* --- Modal Popup Controller --- */
function openModal(title, contentHtml) {
  let backdrop = document.getElementById('global-modal');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'global-modal';
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal-box">
        <button class="modal-close" onclick="closeModal()">&times;</button>
        <h3 id="modal-title" style="margin-bottom: 1rem; font-size: 1.6rem;"></h3>
        <div id="modal-body" style="color: var(--text-muted); font-size: 0.95rem;"></div>
      </div>
    `;
    document.body.appendChild(backdrop);
  }

  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = contentHtml;
  backdrop.classList.add('active');
}

function closeModal() {
  const backdrop = document.getElementById('global-modal');
  if (backdrop) {
    backdrop.classList.remove('active');
  }
}
