import { CONTENT } from './data/content.js';

/**
 * Currículo: mesma fonte de conteúdo do portfólio, outro recorte.
 *
 * A página não declara nada por conta própria. Tudo o que aparece aqui vem de
 * data/content.js, então o currículo nunca diverge do portfólio: corrigiu lá,
 * corrigiu aqui e no PDF gerado por tools/build-cv.mjs.
 */

const LANGS = ['pt', 'en'];
const $ = (sel) => document.querySelector(sel);

let lang = resolveInitialLang();

/* ------------------------------------------------------------- helpers --- */

function resolveInitialLang() {
  /* Definido por tools/build-cv.mjs ao gerar o PDF de cada idioma: o arquivo
     impresso não tem URL nem localStorage de onde deduzir o idioma. */
  if (LANGS.includes(globalThis.__CV_LANG__)) return globalThis.__CV_LANG__;
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

function pick(path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), CONTENT);
}

/** Número com o separador do idioma, quando o conteúdo traz as duas formas. */
function num(item) {
  return lang === 'en' && item.nEn ? item.nEn : item.n;
}

/* ---------------------------------------------------------- renderers --- */

function renderStaticText() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(pick(el.dataset.i18n));
  });
  document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
  document.title = `Lucas Nishimura — ${t(CONTENT.cv.title)}`;
  $('#theme-toggle').setAttribute('aria-label', t(CONTENT.ui.themeToggle));
  document.querySelectorAll('#lang-switch button').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  });
  $('#cv-download').href = `./cv/lucas-nishimura-cv-${lang}.pdf`;
}

function renderContact() {
  const { email, location, linkedin } = CONTENT.identity;
  const li = linkedin.replace(/^https?:\/\/(www\.)?/, '');

  /* O telefone não está no repositório. tools/build-cv.mjs o injeta em
     __CV_PHONE__, lido de um arquivo local, só na cópia que você anexa num
     e-mail. Site e PDF publicado saem sem ele, e não há número algum a
     vazar do código-fonte. O href é o mesmo número sem formatação, para os dois não
     divergirem. */
  const phone = typeof globalThis.__CV_PHONE__ === 'string' ? globalThis.__CV_PHONE__ : '';
  const tel = phone
    ? `<li><a href="tel:+${esc(phone.replace(/\D/g, ''))}">${esc(phone)}</a></li>`
    : '';

  $('#cv-contact').innerHTML = [
    `<li>${esc(t(location))}</li>`,
    tel,
    `<li><a href="mailto:${esc(email)}">${esc(email)}</a></li>`,
    `<li><a href="${esc(linkedin)}">${esc(li)}</a></li>`,
    '<li><a href="https://lucasvnd.github.io/">lucasvnd.github.io</a></li>'
  ].join('');
}

function renderFacts() {
  $('#cv-facts').innerHTML = CONTENT.facts.map((f) => `
    <div class="cv-fact">
      <dt>${esc(t(f.k))}</dt>
      <dd>${esc(lang === 'en' && f.vEn ? f.vEn : f.v)}</dd>
    </div>`).join('');
}

/** Experiência e formação têm a mesma forma: período à esquerda, corpo à direita. */
function entry(period, title, org, detail) {
  return `<li class="cv-entry">
    <span class="cv-period">${esc(period)}</span>
    <div class="cv-entry-body">
      <p class="cv-entry-title">${esc(title)} <span class="cv-org">${esc(org)}</span></p>
      <p class="cv-entry-detail">${esc(detail)}</p>
    </div>
  </li>`;
}

function renderExperience() {
  $('#cv-experience').innerHTML = CONTENT.experience.roles
    .map((r) => entry(t(r.period), t(r.role), t(r.org), t(r.detail))).join('');
}

function renderEducation() {
  $('#cv-education').innerHTML = CONTENT.education.items
    .map((e) => entry(t(e.period), t(e.course), t(e.org), t(e.detail))).join('');
}

function renderSystems() {
  $('#cv-systems').innerHTML = CONTENT.projects.map((p) => `
    <li class="cv-system">
      <p class="cv-system-head">
        <span class="ident">${esc(p.ident)}</span>
        <strong>${esc(p.title)}</strong>
        <span class="cv-sector">${esc(t(p.sector))}</span>
      </p>
      <p class="cv-entry-detail">${esc(t(p.summary))}</p>
      <p class="cv-meta">
        <span class="cv-figures">${p.figures.map((f) => `${esc(num(f))} ${esc(t(f.l))}`).join(' · ')}</span>
        <span class="cv-stack">${p.stack.map(esc).join(' · ')}</span>
      </p>
    </li>`).join('');
}

function renderAutomations() {
  const flows = lang === 'en' ? 'flows' : 'fluxos';
  const nodes = lang === 'en' ? 'nodes' : 'nós';
  $('#cv-automations').innerHTML = CONTENT.automations.items.map((a) => `
    <li class="cv-system">
      <p class="cv-system-head">
        <span class="ident">${esc(a.ident)}</span>
        <strong>${esc(t(a.title))}</strong>
        <span class="cv-sector">${esc(t(a.sector))}</span>
      </p>
      <p class="cv-entry-detail">${esc(t(a.summary))}</p>
      <p class="cv-meta"><span class="cv-figures">${a.flows} ${flows} · ~${a.nodes} ${nodes}</span></p>
    </li>`).join('');
}

function renderSkills() {
  $('#cv-skills').innerHTML = CONTENT.cv.skills.map((g) => `
    <div class="cv-skill">
      <dt>${esc(t(g.label))}</dt>
      <dd>${g.items.map((i) => esc(t(i))).join(' · ')}</dd>
    </div>`).join('');
}

/* ------------------------------------------------------------- eventos --- */

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

$('#cv-print').addEventListener('click', () => window.print());

/* --------------------------------------------------------------- boot --- */

function renderAll() {
  renderStaticText();
  renderContact();
  renderFacts();
  renderExperience();
  renderSystems();
  renderAutomations();
  renderEducation();
  renderSkills();
}

renderAll();
