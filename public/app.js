* {
  box-sizing: border-box;
}

:root {
  --bg: #f5efe7;
  --panel: #fffdfb;
  --panel-strong: #f4eee9;
  --ink: #1f2430;
  --muted: #5f6470;
  --accent: #7b61ff;
  --accent-2: #ff8f6b;
  --green: #5abf9d;
  --yellow: #f0c36d;
  --pink: #ef7eb7;
  --shadow: 0 12px 32px rgba(39, 35, 45, 0.08);
  --radius: 22px;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(180deg, #f9f3ee 0%, #f4f0f7 100%);
  color: var(--ink);
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(113, 90, 142, 0.08);
  border-radius: 18px;
  padding: 18px 24px;
  box-shadow: var(--shadow);
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: white;
  font-weight: 800;
  border-radius: 12px;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 800;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.primary-button,
.secondary-button,
.tab {
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-weight: 600;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.primary-button {
  background: linear-gradient(135deg, var(--accent), #8e7cff);
  color: white;
  box-shadow: 0 10px 20px rgba(123, 97, 255, 0.25);
}

.secondary-button {
  background: #efe9ff;
  color: var(--ink);
}

.primary-button:hover,
.secondary-button:hover,
.tab:hover {
  transform: translateY(-1px);
}

.primary-button.small {
  padding: 0.55rem 0.9rem;
  font-size: 0.88rem;
}

.wide {
  width: 100%;
}

.content {
  margin-top: 28px;
}

.card,
.panel-card,
.stat-card {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(113, 90, 142, 0.08);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.auth-card {
  padding: 22px;
}

.auth-panel {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 28px;
}

.auth-copy {
  padding: 10px 8px;
}

.eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 0.72rem;
  color: var(--muted);
  font-weight: 700;
}

.auth-copy h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0 0 12px;
  line-height: 1.1;
}

.auth-copy p {
  margin: 0;
  font-size: 1.02rem;
  color: var(--muted);
  line-height: 1.7;
}

.auth-form-box {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  border: 1px solid rgba(118, 105, 138, 0.12);
  padding: 18px;
}

.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 18px;
}

.tab {
  background: #f1ecff;
  color: var(--muted);
}

.tab.active {
  background: var(--ink);
  color: white;
}

.auth-form {
  display: none;
  gap: 14px;
}

.active-form {
  display: flex;
  flex-direction: column;
}

.auth-form label,
.entry-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--ink);
}

input,
select {
  width: 100%;
  border: 1px solid rgba(79, 82, 103, 0.18);
  border-radius: 12px;
  background: rgba(247, 246, 250, 0.9);
  padding: 0.8rem 0.9rem;
  color: var(--ink);
}

input:focus,
select:focus {
  outline: 2px solid rgba(123, 97, 255, 0.18);
  border-color: rgba(123, 97, 255, 0.45);
}

.form-message {
  min-height: 20px;
  margin: 12px 0 0;
  font-size: 0.9rem;
  color: var(--muted);
}

.form-message.error {
  color: #b33a3a;
}

.form-message.success {
  color: #1c8b5d;
}

.dashboard {
  display: block;
}

.welcome-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.welcome-row h2 {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
}

.summary-pill {
  background: #fef4d7;
  color: #8a5d00;
  border-radius: 999px;
  font-weight: 700;
  padding: 0.5rem 0.9rem;
}

.stats-grid,
.panel-grid {
  display: grid;
  gap: 18px;
}

.stats-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 18px 0;
}

.stat-card {
  padding: 18px;
}

.stat-card h3,
.panel-card h3 {
  margin: 0 0 10px;
  font-size: 1rem;
  color: var(--muted);
}

.stat-card p {
  margin: 0;
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800;
}

.panel-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-bottom: 18px;
}

.panel-card {
  padding: 18px;
}

.legend-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: var(--ink);
}

.legend-item span:first-child {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.entry-panel {
  margin-top: 6px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.entry-form {
  display: grid;
  gap: 16px;
  background: #f9f5ff;
  border: 1px solid rgba(123, 97, 255, 0.1);
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 18px;
}

.field-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.entry-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
}

.entries-list {
  display: grid;
  gap: 12px;
}

.entry-item {
  border: 1px solid rgba(79, 82, 103, 0.1);
  background: rgba(248, 248, 250, 0.8);
  border-radius: 16px;
  padding: 18px;
}

.entry-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.entry-date {
  font-weight: 700;
  color: var(--muted);
}

.pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.25rem 0.7rem;
  font-size: 0.75rem;
  font-weight: 700;
  background: #edebff;
  color: var(--accent);
}

.entry-item h4 {
  margin: 0 0 10px;
  font-size: 1.24rem;
}

.entry-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--muted);
  font-size: 0.95rem;
}

.hidden {
  display: none !important;
}

@media (max-width: 760px) {
  .app-shell {
    padding: 16px;
  }

  .topbar,
  .auth-panel,
  .section-header,
  .welcome-row,
  .entry-actions,
  .field-row,
  .stats-grid,
  .panel-grid {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: stretch;
  }

  .topbar {
    gap: 12px;
  }

  .top-actions {
    width: 100%;
    justify-content: space-between;
  }

  .auth-panel {
    display: block;
  }

  .auth-copy {
    margin-bottom: 16px;
  }

  .field-row,
  .stats-grid,
  .panel-grid {
    display: grid;
    grid-template-columns: 1fr;
  }
}
