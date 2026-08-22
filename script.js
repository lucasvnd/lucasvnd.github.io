import { CONTENT } from './data/content.js';

/* Sem animação de entrada: o dossiê é impresso, não encenado. Isso também
   remove o observador que a versão anterior recriava a cada troca de filtro. */

const LANGS = ['pt', 'en'];
const $ = (sel) => document.querySelector(sel);

let lang = resolveInitialLang();

/* ------------------------------------------------------------- helpers --- */

function resolveInitialLang() {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(fromUrl)) return fromUrl;
  try {
    const saved = localStorage.getItem('portfolio-lang');
    if (LANGS.includes(saved)) return saved;
  } catch (e) { /* armazenamento bloqueado */ }
  return (navigator.language || 'pt').toLowerCase().startsWith('en') ? 'en' : 'pt';
}

/** Resolve um nó traduzível { pt, en }. Strings puras passam intactas. */
function t(node) {
  if (node == null) return '';
  if (typeof node === 'string') return node;
  return node[lang] ?? node.pt ?? '';
}

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/** Lê "method.exhibits" a partir de um caminho pontuado. */
function pick(path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), CONTENT);
}

/* ---------------------------------------------------------- diagramas --- */

function arrow(x, y1, y2) {
  return `<path class="d-line" d="M${x} ${y1}V${y2 - 5}" /><polygon class="d-arrow" points="${x - 3.5},${y2 - 5} ${x + 3.5},${y2 - 5} ${x},${y2}" />`;
}

/**
 * Espinha vertical à esquerda com setas horizontais entrando em caixas
 * empilhadas. É a forma honesta de desenhar "um fluxo chama N sub-fluxos":
 * cada seta sai da mesma origem, e nenhuma fica solta no ar.
 */
function spine(fromX, fromY, items, opts) {
  const { x = 30, boxX = 54, boxW = 210, boxH = 34, gap = 4, startY = 130 } = opts;
  const mid = (i) => startY + i * (boxH + gap) + boxH / 2;
  const lastMid = mid(items.length - 1);
  return `
    <path class="d-line" d="M${fromX} ${fromY}V${startY - 8}H${x}V${lastMid}" />
    ${items.map((label, i) => `
      <path class="d-line" d="M${x} ${mid(i)}H${boxX - 5}" />
      <polygon class="d-arrow" points="${boxX - 5},${mid(i) - 3.5} ${boxX - 5},${mid(i) + 3.5} ${boxX},${mid(i)}" />
      <rect class="d-box" x="${boxX}" y="${startY + i * (boxH + gap)}" width="${boxW}" height="${boxH}" />
      <text class="d-sub" x="${boxX + 10}" y="${mid(i) + 3}">${esc(label)}</text>`).join('')}`;
}

function node(x, y, w, h, label, sub, accent) {
  return `
    <rect class="${accent ? 'd-box-accent' : 'd-box'}" x="${x}" y="${y}" width="${w}" height="${h}" />
    <text class="d-label" x="${x + 11}" y="${y + (sub ? 19 : h / 2 + 3)}">${esc(label)}</text>
    ${sub ? `<text class="d-sub" x="${x + 11}" y="${y + 32}">${esc(sub)}</text>` : ''}`;
}

const DIAGRAMS = {
  disparo() {
    const L = lang === 'en'
      ? [['Form', 'lead capture'], ['Queue in DB', 'pending leads'], ['Scheduled job', 'who is eligible'], ['Batch send', 'waits between sends'], ['WhatsApp', 'delivery']]
      : [['Formulário', 'captação do lead'], ['Fila em banco', 'leads pendentes'], ['Job agendado', 'quem está apto'], ['Disparo em lote', 'espera entre envios'], ['WhatsApp', 'entrega']];
    const tag = lang === 'en' ? 'FLOW' : 'FLUXO';
    const ys = [8, 66, 124, 182, 240];
    return `<svg viewBox="0 0 340 292" role="img" aria-label="${lang === 'en' ? 'Three flows: capture, decide, send' : 'Três fluxos: captar, decidir, enviar'}">
      ${ys.map((y, i) => node(84, y, 180, 42, L[i][0], L[i][1], i === 3)).join('')}
      ${ys.slice(0, -1).map((y) => arrow(174, y + 42, y + 58)).join('')}
      <text class="d-note" x="8" y="34">${tag} 1</text>
      <text class="d-note" x="8" y="150">${tag} 2</text>
      <text class="d-note" x="8" y="208">${tag} 3</text>
    </svg>`;
  },

  triagem() {
    const L = lang === 'en'
      ? { entry: ['Webhook', 'single entry point'], ai: ['Classify + extract', 'AI, before any write'], leaves: ['Create contact', 'Move deal', 'Registry check', 'Draft email'] }
      : { entry: ['Webhook', 'ponto de entrada único'], ai: ['Classificar + extrair', 'IA, antes de escrever'], leaves: ['Criar contato', 'Mover negócio', 'Consulta cadastral', 'Redigir e-mail'] };
    return `<svg viewBox="0 0 340 300" role="img" aria-label="${lang === 'en' ? 'One entry point fanning into four sub-flows' : 'Um ponto de entrada abrindo em quatro sub-fluxos'}">
      ${node(84, 8, 180, 42, L.entry[0], L.entry[1])}
      ${arrow(174, 50, 66)}
      ${node(84, 66, 180, 42, L.ai[0], L.ai[1], true)}
      ${spine(174, 108, L.leaves, { startY: 128 })}
      <text class="d-note" x="8" y="292">${lang === 'en' ? 'ONE RESPONSIBILITY EACH · 9 FLOWS' : 'UMA RESPONSABILIDADE CADA · 9 FLUXOS'}</text>
    </svg>`;
  },

  produto() {
    const L = lang === 'en'
      ? { hub: ['Agent', 'conversation'], entry: ['Official API', 'inbound'], tools: ['Legislative lookup', 'Document analysis', 'AI cost telemetry', 'Scheduled cleanup'] }
      : { hub: ['Agente', 'conversação'], entry: ['API oficial', 'entrada'], tools: ['Busca legislativa', 'Análise de documento', 'Telemetria de custo', 'Limpeza agendada'] };
    return `<svg viewBox="0 0 340 300" role="img" aria-label="${lang === 'en' ? 'An agent calling tool sub-flows' : 'Um agente chamando sub-fluxos de ferramenta'}">
      ${node(84, 8, 180, 42, L.entry[0], L.entry[1])}
      ${arrow(174, 50, 66)}
      ${node(84, 66, 180, 46, L.hub[0], L.hub[1], true)}
      ${spine(174, 112, L.tools, { startY: 132 })}
      <text class="d-note" x="8" y="292">${lang === 'en' ? '13 FLOWS · TOOLS AS SUB-FLOWS' : '13 FLUXOS · FERRAMENTAS COMO SUB-FLUXOS'}</text>
    </svg>`;
  }
};

/* ---------------------------------------------------------- renderers --- */

function renderStaticText() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(pick(el.dataset.i18n));
  });
  document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
  document.title = 'Lucas Nishimura';
  $('#theme-toggle').setAttribute('aria-label', t(CONTENT.ui.themeToggle));
  document.querySelectorAll('#lang-switch button').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  });
}

function renderFacts() {
  $('#facts').innerHTML = CONTENT.facts.map((f) => `
    <div class="fact">
      <dt>${esc(t(f.k))}</dt>
      <dd>${esc(lang === 'en' && f.vEn ? f.vEn : f.v)}</dd>
    </div>`).join('');
  $('#footer-year').textContent = String(new Date().getFullYear());
}

function categories() {
  const seen = [];
  CONTENT.projects.forEach((p) => { const c = t(p.category); if (!seen.includes(c)) seen.push(c); });
  return [t(CONTENT.ui.all), ...seen];
}

function renderRoles() {
  $('#roles').innerHTML = CONTENT.experience.roles.map((r) => `
    <li class="role">
      <span class="role-period">${esc(t(r.period))}</span>
      <div class="role-body">
        <p class="role-title">${esc(t(r.role))} <span class="role-org">${esc(t(r.org))}</span></p>
        <p class="role-detail">${esc(t(r.detail))}</p>
      </div>
    </li>`).join('');
}

function renderEducation() {
  $('#education').innerHTML = CONTENT.education.items.map((e) => `
    <li class="role">
      <span class="role-period">${esc(t(e.period))}</span>
      <div class="role-body">
        <p class="role-title">${esc(t(e.course))} <span class="role-org">${esc(t(e.org))}</span></p>
        <p class="role-detail">${esc(t(e.detail))}</p>
      </div>
    </li>`).join('');
}

function renderFilters(active) {
  $('#filters').innerHTML = categories().map((c) => `
    <button type="button" class="chip" data-filter="${esc(c)}" aria-pressed="${String(c === active)}">${esc(c)}</button>`).join('');
}

function systemCard(p) {
  const figures = p.figures.map((f) => `
    <div class="figure"><strong>${esc(lang === 'en' && f.nEn ? f.nEn : f.n)}</strong><span>${esc(t(f.l))}</span></div>`).join('');
  const shots = p.shots?.length
    ? `<div class="shot-strip">${p.shots.map((s) => `<img src="${esc(s.src)}" alt="${esc(t(s.alt))}" loading="lazy" />`).join('')}</div>`
    : '';
  return `<article class="system" data-category="${esc(t(p.category))}">
    <div class="system-top">
      <span class="ident">${esc(p.ident)}</span>
      <span class="sector">${esc(t(p.sector))}</span>
    </div>
    <h3>${esc(p.title)}</h3>
    <p class="system-summary">${esc(t(p.summary))}</p>
    ${shots}
    <div class="figures">${figures}</div>
    <div class="stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>
    <button type="button" class="system-open" data-open="${esc(p.id)}">${esc(t(CONTENT.systems.detail))} →</button>
  </article>`;
}

function renderSystems(filter) {
  const all = t(CONTENT.ui.all);
  const visible = !filter || filter === all
    ? CONTENT.projects
    : CONTENT.projects.filter((p) => t(p.category) === filter);
  $('#system-grid').innerHTML = visible.map(systemCard).join('');
}

function renderExhibits() {
  $('#exhibits').innerHTML = CONTENT.method.exhibits.map((ex) => {
    const copy = `<div class="exhibit-copy">
      <p class="eyebrow">${esc(t(ex.label))}</p>
      <h3>${esc(t(ex.title))}</h3>
      <p class="exhibit-note">${esc(t(ex.note))}</p>
      ${ex.source ? `<p class="exhibit-source">${esc(ex.source)}</p>` : ''}
    </div>`;
    return `<article class="exhibit">${copy}<div>${exhibitBody(ex)}</div></article>`;
  }).join('');
}

function exhibitBody(ex) {
  if (ex.kind === 'domain') {
    return `<div class="term-block">
      <p class="term-name">${esc(ex.term)}</p>
      <p class="term-def">${esc(t(ex.body))}</p>
      <div class="callout">
        <span class="callout-label">${esc(t(ex.invariantLabel))}</span>
        <p>${esc(t(ex.invariant))}</p>
      </div>
      <p class="aftermath">${esc(t(ex.aftermath))}</p>
      <p class="avoid"><strong>${esc(t(ex.avoidLabel))}:</strong> ${esc(t(ex.avoid))}</p>
    </div>`;
  }

  if (ex.kind === 'adr') {
    const a = ex.adr;
    const sections = a.sections.map((s) => `
      <div class="sheet-section">
        <p class="sheet-h">${esc(t(s.h))}</p>
        ${s.p ? `<p class="sheet-p">${esc(t(s.p))}</p>` : ''}
        ${s.table ? sheetTable(s.table) : ''}
      </div>`).join('');
    return `<div class="sheet">
      <div class="sheet-head">
        <span class="sheet-id">${esc(a.id)}</span>
        <span class="sheet-meta">${esc(a.source)} · ${esc(a.date)}</span>
        <span class="stamp">${esc(t(a.status))}</span>
      </div>
      <div class="sheet-body">
        <p class="sheet-title">${esc(t(a.title))}</p>
        ${sections}
      </div>
    </div>`;
  }

  // kind === 'flow'
  return `<dl class="process">${ex.steps.map((s, i) => `
    <div class="process-step">
      <span class="ident">${String(i + 1).padStart(2, '0')}</span>
      <dt>${esc(t(s.k))}</dt>
      <dd>${esc(t(s.v))}</dd>
    </div>`).join('')}</dl>`;
}

function sheetTable(table) {
  return `<div class="sheet-table-wrap"><table class="sheet-table">
    <thead><tr>${table.head.map((h) => `<th>${esc(t(h))}</th>`).join('')}</tr></thead>
    <tbody>${table.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(t(c))}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`;
}

function renderAutomations() {
  $('#auto-list').innerHTML = CONTENT.automations.items.map((a) => {
    const flowsLabel = lang === 'en' ? 'flows' : 'fluxos';
    const nodesLabel = lang === 'en' ? 'nodes' : 'nós';
    return `<article class="auto">
      <div class="auto-copy">
        <div class="auto-top">
          <span class="ident">${esc(a.ident)}</span>
          <span class="sector">${esc(t(a.sector))}</span>
        </div>
        <h3>${esc(t(a.title))}</h3>
        <p class="auto-summary">${esc(t(a.summary))}</p>
        <div class="auto-counts figures">
          <div class="figure"><strong>${a.flows}</strong><span>${flowsLabel}</span></div>
          <div class="figure"><strong>~${a.nodes}</strong><span>${nodesLabel}</span></div>
        </div>
        <ul class="auto-points">${a.points.map((p) => `<li>${esc(t(p))}</li>`).join('')}</ul>
      </div>
      <div class="diagram">${DIAGRAMS[a.diagram] ? DIAGRAMS[a.diagram]() : ''}</div>
    </article>`;
  }).join('');
}

function renderLinks() {
  const { email, linkedin } = CONTENT.identity;
  const mail = `<a href="mailto:${esc(email)}">${esc(email)}</a>`;
  const li = `<a href="${esc(linkedin)}" target="_blank" rel="noopener noreferrer">linkedin.com/in/lucas-nishimura</a>`;
  $('#profile-links').innerHTML = `<li>${mail}</li><li>${li}</li>`;
  $('#footer-contact').innerHTML = `Lucas Nishimura · ${mail}`;
}

const dialog = $('#record-dialog');

/* Qual registro está aberto. Sem isto, trocar de idioma com o diálogo aberto
   deixaria o conteúdo dele no idioma anterior. */
let openId = null;

function openRecord(id) {
  const p = CONTENT.projects.find((x) => x.id === id);
  if (!p) return;
  openId = id;
  $('#dialog-ident').textContent = `${p.ident} · ${p.title}`;
  $('#dialog-body').innerHTML = `
    <p class="eyebrow">${esc(t(p.category))}</p>
    <h2>${esc(p.title)}</h2>
    <p class="lead">${esc(t(p.summary))}</p>
    <div class="dialog-block">
      <p class="sheet-h">${lang === 'en' ? 'Notes' : 'Notas'}</p>
      <p class="exhibit-note">${esc(t(p.proof))}</p>
    </div>
    <div class="dialog-block">
      <p class="sheet-h">${lang === 'en' ? 'Technical highlights' : 'Destaques técnicos'}</p>
      <ul>${p.highlights.map((h) => `<li>${esc(t(h))}</li>`).join('')}</ul>
    </div>
    <div class="dialog-block">
      <p class="sheet-h">Stack</p>
      <div class="stack" style="margin-top:.6rem">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>
    </div>
    <div class="dialog-block">
      <p class="sheet-h">${lang === 'en' ? 'Sector' : 'Setor'}</p>
      <p class="exhibit-note">${esc(t(p.sector))}</p>
    </div>`;
  if (!dialog.open) dialog.showModal();
}

dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => { openId = null; });
$('#dialog-close').addEventListener('click', () => dialog.close());

/* ------------------------------------------------------------- eventos --- */

$('#system-grid').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-open]');
  if (btn) openRecord(btn.dataset.open);
});

$('#filters').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-filter]');
  if (!btn) return;
  const value = btn.dataset.filter;
  renderFilters(value);
  renderSystems(value);
});

$('#lang-switch').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-lang]');
  if (!btn || btn.dataset.lang === lang) return;
  lang = btn.dataset.lang;
  try { localStorage.setItem('portfolio-lang', lang); } catch (err) { /* ignora */ }
  const url = new URL(location.href);
  url.searchParams.set('lang', lang);
  history.replaceState(null, '', url);
  renderAll();
});

$('#theme-toggle').addEventListener('click', () => {
  const current = document.documentElement.dataset.theme
    || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('portfolio-theme', next); } catch (e) { /* ignora */ }
});

/* --------------------------------------------------------------- boot --- */

function renderAll() {
  renderStaticText();
  renderFacts();
  renderRoles();
  renderEducation();
  renderFilters(t(CONTENT.ui.all));
  renderSystems(null);
  renderExhibits();
  renderAutomations();
  renderLinks();
  if (dialog.open && openId) openRecord(openId);
}

renderAll();
