#!/usr/bin/env node
/**
 * Validador do conteúdo do portfólio: seam 2.
 *
 *   node tools/check-content.mjs
 *
 * Zero dependências, de propósito: o site não tem etapa de build e não vai
 * ganhar uma por causa de um teste.
 *
 * Cobre a falha silenciosa mais provável do projeto: conteúdo malformado
 * renderizando vazio na página.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { CONTENT } = await import('../data/content.js');

const problems = [];
const fail = (msg) => problems.push(msg);

/* --------------------------------------------- 1. paridade de idiomas --- */

const LANGS = ['pt', 'en'];

function isTranslatable(value) {
  return value
    && typeof value === 'object'
    && !Array.isArray(value)
    && LANGS.some((l) => l in value);
}

function walk(value, path) {
  if (isTranslatable(value)) {
    for (const l of LANGS) {
      if (!(l in value)) fail(`${path}: falta o idioma "${l}"`);
      else if (typeof value[l] !== 'string' || !value[l].trim()) fail(`${path}.${l}: vazio`);
    }
    const extra = Object.keys(value).filter((k) => !LANGS.includes(k));
    if (extra.length) fail(`${path}: chave inesperada num nó traduzível: ${extra.join(', ')}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => walk(item, `${path}[${i}]`));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k);
  }
}

walk(CONTENT, '');

/* ----------------------------------------------- 2. forma dos projetos --- */

const REQUIRED = ['id', 'ident', 'title', 'sector', 'category', 'summary', 'proof', 'stack', 'figures', 'highlights'];
const ids = new Set();

for (const [i, p] of CONTENT.projects.entries()) {
  const where = `projects[${i}]${p.id ? ` (${p.id})` : ''}`;
  for (const field of REQUIRED) {
    if (p[field] == null) fail(`${where}: falta "${field}"`);
  }
  if (Array.isArray(p.stack) && !p.stack.length) fail(`${where}: stack vazia`);
  if (Array.isArray(p.highlights) && !p.highlights.length) fail(`${where}: sem destaques`);
  if (p.id) {
    if (ids.has(p.id)) fail(`${where}: id duplicado`);
    ids.add(p.id);
  }
  for (const [j, shot] of (p.shots ?? []).entries()) {
    if (!shot.src) fail(`${where}.shots[${j}]: sem "src"`);
    else if (!existsSync(join(root, shot.src))) fail(`${where}.shots[${j}]: arquivo não existe: ${shot.src}`);
    if (!shot.alt) fail(`${where}.shots[${j}]: sem texto alternativo`);
  }
}

/* ---------------------------------------------- 3. diagramas referidos --- */

const KNOWN_DIAGRAMS = new Set(['disparo', 'triagem', 'produto']);
for (const [i, a] of CONTENT.automations.items.entries()) {
  if (!KNOWN_DIAGRAMS.has(a.diagram)) fail(`automations.items[${i}]: diagrama desconhecido: "${a.diagram}"`);
}

/* ------------------------------------------- 3b. experiencia preenchida --- */

for (const [i, r] of CONTENT.experience.roles.entries()) {
  const where = `experience.roles[${i}] (${typeof r.org === 'string' ? r.org : r.org.pt})`;
  const per = r.period && r.period.pt;
  if (!per || /A{4}/.test(per)) fail(`${where}: periodo por preencher ("${per}")`);
  if (!r.role || !r.detail) fail(`${where}: falta cargo ou descricao`);
}

/* ------------------------------------- 4. rede de segurança de privacidade --- */

/* Lista local de termos que não devem aparecer no conteúdo publicado.
   Fica fora do versionamento. Um termo por linha, # comenta. */
const listPath = join(root, '.scratch', 'forbidden.txt');
let privacyChecked = false;

if (existsSync(listPath)) {
  const terms = readFileSync(listPath, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));

  const haystack = JSON.stringify(CONTENT).toLowerCase();
  for (const term of terms) {
    if (haystack.includes(term.toLowerCase())) {
      fail(`PRIVACIDADE: termo proibido encontrado no conteúdo publicável: "${term}"`);
    }
  }
  privacyChecked = true;
}

/* -------------------------------------------------------------- saída --- */

if (problems.length) {
  console.error(`\n  ${problems.length} problema(s):\n`);
  for (const p of problems) console.error(`   ✗ ${p}`);
  console.error('');
  process.exit(1);
}

const projectCount = CONTENT.projects.length;
const autoCount = CONTENT.automations.items.length;
console.log(`\n  ✓ conteúdo íntegro: ${projectCount} sistemas, ${autoCount} automações, pt/en completos`);
if (!privacyChecked) {
  console.log('  ! lista local ausente, verificação de termos NÃO rodou');
}
console.log('');
