const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const welcomeName = document.getElementById('welcome-name');
const summaryPill = document.getElementById('summary-pill');
const topCategory = document.getElementById('top-category');
const averageRating = document.getElementById('average-rating');
const totalEntries = document.getElementById('total-entries');
const categoryBreakdown = document.getElementById('category-breakdown');
const vibeBreakdown = document.getElementById('vibe-breakdown');
const entriesList = document.getElementById('entries-list');
const authMessage = document.getElementById('auth-message');
const entryMessage = document.getElementById('entry-message');
const entryForm = document.getElementById('entry-form');
const toggleFormButton = document.getElementById('toggle-form-button');
const newEntryButton = document.getElementById('new-entry-button');
const profileButton = document.getElementById('profile-button');
const logoutButton = document.getElementById('logout-button');

const colors = {
  Book: '#7b61ff',
  Music: '#ff8f6b',
  Game: '#5abf9d',
  Movie: '#f0c36d',
  Chill: '#8ac7ff',
  Focused: '#8bd6a7',
  Cozy: '#edc08c',
  Energetic: '#ff8f6b',
  Happy: '#f6d76b',
  Reflective: '#c7b9ff',
};

function setMessage(element, text, type = '') {
  element.textContent = text;
  element.className = 'form-message';
  if (type) {
    element.classList.add(type);
  }
}

function showAuthView() {
  authSection.classList.remove('hidden');
  dashboardSection.classList.add('hidden');
  newEntryButton.classList.add('hidden');
  profileButton.classList.add('hidden');
  logoutButton.classList.add('hidden');
}

function showDashboardView() {
  authSection.classList.add('hidden');
  dashboardSection.classList.remove('hidden');
  newEntryButton.classList.remove('hidden');
  profileButton.classList.remove('hidden');
  logoutButton.classList.remove('hidden');
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}

function bindTabs() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((button) => button.classList.toggle('active', button === tab));
      const selected = tab.dataset.tab;
      document.getElementById('login-form').classList.toggle('active-form', selected === 'login');
      document.getElementById('signup-form').classList.toggle('active-form', selected === 'signup');
    });
  });
}

function renderBreakdown(target, map, type) {
  const entries = Object.entries(map || {});
  if (!entries.length) {
    target.innerHTML = `<div class="legend-item"><span><span class="dot" style="background:${type === 'category' ? '#d6d2eb' : '#dfe7f4'}"></span>No entries yet</span><strong>0%</strong></div>`;
    return;
  }

  const total = entries.reduce((sum, [, value]) => sum + value, 0);

  target.innerHTML = entries
    .map(([label, count]) => {
      const percentage = Math.round((count / total) * 100);
      const color = colors[label] || '#6b7280';
      return `
        <div class="legend-item">
          <span>
            <span class="dot" style="background:${color}"></span>${label}
          </span>
          <strong>${percentage}%</strong>
        </div>
      `;
    })
    .join('');
}

function renderEntries(entries) {
  if (!entries.length) {
    entriesList.innerHTML = '<p class="empty-state">No entries yet. Add your first vibe log.</p>';
    return;
  }

  entriesList.innerHTML = entries
    .map(
      (entry) => `
        <article class="entry-item">
          <div class="entry-item-header">
            <span class="entry-date">${new Date(entry.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span class="pill">${entry.vibe}</span>
          </div>
          <h4>${entry.title}</h4>
          <div class="entry-meta">
            <span>Category: ${entry.category}</span>
            <span>Rating: ${'★'.repeat(entry.rating)}${'☆'.repeat(5 - entry.rating)}</span>
            <span>Vibe: ${entry.vibe}</span>
          </div>
        </article>
      `
    )
    .join('');
}

async function loadDashboard() {
  try {
    const data = await apiRequest('/api/dashboard');
    const { entries, stats } = data;

    welcomeName.textContent = 'Your dashboard';
    summaryPill.textContent = `${stats.totalEntries} ${stats.totalEntries === 1 ? 'entry' : 'entries'}`;
    topCategory.textContent = stats.totalEntries ? stats.topCategory : 'No entries yet';
    averageRating.textContent = stats.totalEntries ? `${stats.averageRating} / 5` : '0.0 / 5';
    totalEntries.textContent = String(stats.totalEntries);

    renderBreakdown(categoryBreakdown, stats.categoryCounts, 'category');
    renderBreakdown(vibeBreakdown, stats.vibeCounts, 'vibe');
    renderEntries(entries);
  } catch (error) {
    console.error(error);
    setMessage(authMessage, error.message, 'error');
    showAuthView();
  }
}

async function checkSession() {
  try {
    const data = await apiRequest('/api/session');
    if (data.authenticated) {
      showDashboardView();
      welcomeName.textContent = `${data.user.name}'s dashboard`;
      await loadDashboard();
    } else {
      showAuthView();
    }
  } catch (error) {
    console.error(error);
    showAuthView();
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const payload = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  try {
    const data = await apiRequest('/api/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setMessage(authMessage, data.message || 'Logged in.', 'success');
    showDashboardView();
    welcomeName.textContent = `${data.user.name}'s dashboard`;
    await loadDashboard();
    form.reset();
  } catch (error) {
    setMessage(authMessage, error.message, 'error');
  }
}

async function handleSignup(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  try {
    const data = await apiRequest('/api/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setMessage(authMessage, data.message || 'Account created.', 'success');
    showDashboardView();
    welcomeName.textContent = `${data.user.name}'s dashboard`;
    await loadDashboard();
    form.reset();
  } catch (error) {
    setMessage(authMessage, error.message, 'error');
  }
}

async function handleLogout() {
  try {
    await apiRequest('/api/logout', { method: 'POST' });
    entryForm.reset();
    entryForm.classList.add('hidden');
    showAuthView();
    setMessage(authMessage, 'You have been logged out.', 'success');
  } catch (error) {
    setMessage(authMessage, error.message, 'error');
  }
}

async function handleEntrySubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const payload = {
    date: formData.get('date'),
    title: formData.get('title'),
    category: formData.get('category'),
    rating: Number(formData.get('rating')),
    vibe: formData.get('vibe'),
  };

  try {
    const data = await apiRequest('/api/entries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setMessage(entryMessage, data.message || 'Entry saved.', 'success');
    event.currentTarget.reset();
    entryForm.classList.add('hidden');
    await loadDashboard();
  } catch (error) {
    setMessage(entryMessage, error.message, 'error');
  }
}

document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('signup-form').addEventListener('submit', handleSignup);
document.getElementById('logout-button').addEventListener('click', handleLogout);
document.getElementById('entry-form').addEventListener('submit', handleEntrySubmit);
document.getElementById('toggle-form-button').addEventListener('click', () => {
  entryForm.classList.toggle('hidden');
  setMessage(entryMessage, '', '');
});
document.getElementById('cancel-entry').addEventListener('click', () => {
  entryForm.reset();
  entryForm.classList.add('hidden');
  setMessage(entryMessage, '', '');
});
newEntryButton.addEventListener('click', () => {
  entryForm.classList.remove('hidden');
  setMessage(entryMessage, '', '');
});
profileButton.addEventListener('click', () => {
  setMessage(authMessage, 'Profile view is coming soon!', 'success');
});

bindTabs();
checkSession();
