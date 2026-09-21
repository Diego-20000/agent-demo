// AgentPod — demo.js: interacciones vanilla compartidas entre las páginas del demo estático.
// Todo acá es simulado (no hay backend real detrás de este demo).

document.addEventListener('DOMContentLoaded', () => {
  initSpecSelector();
  initCategorySelector();
  initAgentSelector();
  initReservaSelector();
  initTerminalTypewriter();
  initUptimeCounter();
  initCopyButtons();
  initProvisioningChecklist();
  initCheckoutParams();
  initFakeActions();
});

// --- Construye el href de "Continuar al checkout" con los 3 parámetros actuales ---
function buildCheckoutLink() {
  const link = document.querySelector('[data-checkout-link]');
  if (!link) return;
  const selectedSpec = document.querySelector('.spec-row.selected');
  const selectedAgent = document.querySelector('.type-tab[data-agent].active');
  const price = selectedSpec ? selectedSpec.getAttribute('data-price') : '30.81';
  const type = selectedSpec ? selectedSpec.getAttribute('data-type') : 'Estándar';
  const detail = selectedSpec ? selectedSpec.getAttribute('data-detail') : '4 vCPU · 8GB RAM · 80GB disco';
  const agent = selectedAgent ? selectedAgent.getAttribute('data-agent') : 'Claude Code';
  link.href = `checkout.html?price=${price}&spec=${encodeURIComponent(type)}&detail=${encodeURIComponent(detail)}&agent=${encodeURIComponent(agent)}`;
}

// --- Configurador: selector de specs con precio en vivo ---
function initSpecSelector() {
  const rows = document.querySelectorAll('.spec-row[data-price]');
  if (!rows.length) return;
  const summaryPrice = document.querySelector('[data-summary-price]');
  const summarySpec = document.querySelector('[data-summary-spec]');
  const summaryDetail = document.querySelector('[data-summary-detail]');

  rows.forEach(row => {
    row.addEventListener('click', () => {
      rows.forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      const price = row.getAttribute('data-price');
      const type = row.getAttribute('data-type');
      const detail = row.getAttribute('data-detail');
      if (summaryPrice) summaryPrice.textContent = `$${price}/mes`;
      if (summarySpec) summarySpec.textContent = type;
      if (summaryDetail) summaryDetail.textContent = detail;
      buildCheckoutLink();
    });
  });
}

// --- Reserva: selector de spec que recalcula reserva/founding/resto ---
function initReservaSelector() {
  const rows = document.querySelectorAll('[data-reserva-amount]');
  if (!rows.length) return;
  const specRows = document.querySelectorAll('.spec-row[data-price]');
  if (!specRows.length) return;

  function apply(row) {
    const price = parseFloat(row.getAttribute('data-price'));
    const type = row.getAttribute('data-type');
    const detail = row.getAttribute('data-detail');
    const founding = price * 0.75;
    const reserva = price * 0.25;
    const resto = founding - reserva;

    document.querySelector('[data-reserva-spec]').textContent = `${type} · ${detail}`;
    document.querySelector('[data-reserva-normal]').textContent = `$${price.toFixed(2)}/mes`;
    document.querySelector('[data-reserva-founding]').textContent = `$${founding.toFixed(2)}`;
    document.querySelector('[data-reserva-amount]').textContent = reserva.toFixed(2);
    document.querySelector('[data-reserva-resto]').textContent = `$${resto.toFixed(2)}`;

    const specField = document.getElementById('reserva-spec-field');
    const usdField = document.getElementById('reserva-usd-field');
    if (specField) specField.value = `${type} · ${detail}`;
    if (usdField) usdField.value = reserva.toFixed(2);
  }

  specRows.forEach(row => {
    row.addEventListener('click', () => {
      specRows.forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      apply(row);
    });
  });
}

// --- Configurador: selector de familia de servidor (Estándar/Económica/Alto rendimiento/Dedicado) ---
function initCategorySelector() {
  const tabs = document.querySelectorAll('.type-tab[data-category]');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-category');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('[data-category-desc]').forEach(p => {
        p.classList.toggle('category-hidden', p.getAttribute('data-category-desc') !== category);
      });
      document.querySelectorAll('[data-category-list]').forEach(list => {
        list.classList.toggle('category-hidden', list.getAttribute('data-category-list') !== category);
      });

      const activeList = document.querySelector(`[data-category-list="${category}"]`);
      const firstRow = activeList ? activeList.querySelector('.spec-row') : null;
      if (firstRow) firstRow.click();
    });
  });
}

// --- Configurador: selector de agente (Claude Code / Cursor CLI / Antigravity CLI) ---
function initAgentSelector() {
  const tabs = document.querySelectorAll('.type-tab[data-agent]');
  if (!tabs.length) return;
  const summaryAgent = document.querySelector('[data-summary-agent]');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const agent = tab.getAttribute('data-agent');
      if (summaryAgent) summaryAgent.textContent = agent;
      buildCheckoutLink();
    });
  });
}

// --- Checkout / provisioning: leer specs elegidas desde la URL ---
function initCheckoutParams() {
  const params = new URLSearchParams(location.search);
  const price = params.get('price'), spec = params.get('spec'), detail = params.get('detail'), agent = params.get('agent');

  const priceEl = document.getElementById('co-price');
  if (priceEl) {
    if (price) priceEl.textContent = price;
    if (spec) document.getElementById('co-spec').textContent = spec;
    if (detail) document.getElementById('co-detail').textContent = detail;
    if (agent) document.getElementById('co-agent').textContent = agent;
    const continueBtn = document.getElementById('co-continue');
    if (continueBtn) {
      const p = price || '30.81', s = spec || 'Estándar', d = detail || '4 vCPU · 8GB RAM · 80GB disco', a = agent || 'Claude Code';
      continueBtn.href = `provisioning.html?price=${p}&spec=${encodeURIComponent(s)}&detail=${encodeURIComponent(d)}&agent=${encodeURIComponent(a)}`;
    }
  }

  const provSpec = document.getElementById('prov-spec');
  if (provSpec) {
    if (agent) document.getElementById('prov-agent').textContent = agent;
    if (detail) provSpec.textContent = `Estándar · ${detail}`;
    if (price) document.getElementById('prov-price').textContent = `$${price}/mes`;
    const readyAgent = document.getElementById('ready-agent');
    if (readyAgent && agent) readyAgent.textContent = agent;
  }
}

// --- Botones sin backend real: dan feedback en vez de ser un link muerto ---
function initFakeActions() {
  document.querySelectorAll('[data-fake-rotate]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const suffix = Math.random().toString(16).slice(2, 6);
      const tokenEl = document.querySelector('[data-token-suffix]');
      if (tokenEl) tokenEl.textContent = suffix;
      const original = btn.textContent;
      btn.textContent = 'Token rotado ✓';
      setTimeout(() => { btn.textContent = original; }, 1800);
    });
  });

  document.querySelectorAll('[data-fake-archive]').forEach(btn => {
    let archived = false;
    btn.addEventListener('click', e => {
      e.preventDefault();
      if (archived) return;
      if (!confirm('¿Archivar pod-x7f2? Queda un snapshot por 7 días — el servidor real se borra recién después, manualmente.')) return;
      archived = true;
      document.querySelectorAll('.badge.running').forEach(b => { b.textContent = 'archiving'; b.className = 'badge archiving'; });
      document.querySelectorAll('.badge.active').forEach(b => { b.textContent = 'restricted'; b.className = 'badge restricted'; });
      btn.textContent = 'Archivando...';
      btn.classList.add('is-disabled');
      btn.setAttribute('aria-disabled', 'true');
    });
  });

  document.querySelectorAll('[data-fake-toast]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const msg = btn.getAttribute('data-fake-toast');
      const original = btn.textContent;
      btn.textContent = msg;
      setTimeout(() => { btn.textContent = original; }, 1800);
    });
  });
}

// --- Terminal que "escribe sola" ---
function initTerminalTypewriter() {
  const el = document.querySelector('[data-typewriter]');
  if (!el) return;
  const lines = JSON.parse(el.getAttribute('data-typewriter'));
  el.textContent = '';
  let lineIdx = 0, charIdx = 0;

  function typeChar() {
    if (lineIdx >= lines.length) return;
    const line = lines[lineIdx];
    if (charIdx <= line.length) {
      el.innerHTML = lines.slice(0, lineIdx).map(l => `<div>${l}</div>`).join('')
        + `<div>${line.slice(0, charIdx)}<span class="cursor">▊</span></div>`;
      charIdx++;
      setTimeout(typeChar, 18 + Math.random() * 24);
    } else {
      lineIdx++;
      charIdx = 0;
      setTimeout(typeChar, 350);
    }
  }
  typeChar();
}

// --- Contador "activo hace N días/horas" ---
function initUptimeCounter() {
  const el = document.querySelector('[data-uptime-since]');
  if (!el) return;
  const sinceMs = Date.parse(el.getAttribute('data-uptime-since'));
  function render() {
    const diff = Date.now() - sinceMs;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    el.textContent = days > 0 ? `Activo hace ${days} días` : `Activo hace ${hours}h`;
  }
  render();
  setInterval(render, 60000);
}

// --- Copiar al portapapeles (config MCP, endpoint) ---
function initCopyButtons() {
  document.querySelectorAll('[data-copy-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.getAttribute('data-copy-target'));
      if (!target) return;
      navigator.clipboard.writeText(target.textContent.trim()).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copiado ✓';
        setTimeout(() => { btn.textContent = original; }, 1600);
      }).catch(() => {});
    });
  });
}

// --- Checklist animado de provisioning ---
function initProvisioningChecklist() {
  const rows = document.querySelectorAll('.check-row[data-step]');
  if (!rows.length) return;
  const readyBlock = document.querySelector('[data-ready-block]');
  let i = 0;

  function step() {
    if (i > 0) rows[i - 1].classList.replace('active', 'done');
    if (i >= rows.length) {
      if (readyBlock) {
        readyBlock.style.display = 'block';
        readyBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    rows[i].classList.add('active');
    i++;
    setTimeout(step, 900 + Math.random() * 500);
  }
  step();
}
