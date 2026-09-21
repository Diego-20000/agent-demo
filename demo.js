// AgentPod — demo.js: interacciones vanilla compartidas entre las páginas del demo estático.
// Todo acá es simulado (no hay backend real detrás de este demo).

document.addEventListener('DOMContentLoaded', () => {
  initSpecSelector();
  initTerminalTypewriter();
  initUptimeCounter();
  initCopyButtons();
  initProvisioningChecklist();
  initCheckoutParams();
  initFakeActions();
});

// --- Checkout: leer specs elegidas desde la URL ---
function initCheckoutParams() {
  const priceEl = document.getElementById('co-price');
  if (!priceEl) return;
  const params = new URLSearchParams(location.search);
  const price = params.get('price'), spec = params.get('spec'), detail = params.get('detail');
  if (price) priceEl.textContent = price;
  if (spec) document.getElementById('co-spec').textContent = spec;
  if (detail) document.getElementById('co-detail').textContent = detail;
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
    btn.addEventListener('click', e => {
      e.preventDefault();
      if (!confirm('¿Archivar pod-x7f2? Queda un snapshot por 7 días — el servidor real se borra recién después, manualmente.')) return;
      document.querySelectorAll('.badge.running').forEach(b => { b.textContent = 'archiving'; b.className = 'badge archiving'; });
      btn.textContent = 'Archivando...';
      btn.setAttribute('disabled', 'true');
      btn.style.opacity = '.5';
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

// --- Configurador: selector de specs con precio en vivo ---
function initSpecSelector() {
  const rows = document.querySelectorAll('.spec-row[data-price]');
  if (!rows.length) return;
  const summaryPrice = document.querySelector('[data-summary-price]');
  const summarySpec = document.querySelector('[data-summary-spec]');
  const summaryDetail = document.querySelector('[data-summary-detail]');
  const checkoutLink = document.querySelector('[data-checkout-link]');

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
      if (checkoutLink) checkoutLink.href = `checkout.html?price=${price}&spec=${encodeURIComponent(type)}&detail=${encodeURIComponent(detail)}`;
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
