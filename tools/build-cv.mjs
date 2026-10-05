#!/usr/bin/env node
/**
 * Gera os PDFs do currículo:
 *
 *   node tools/build-cv.mjs
 *   → cv/lucas-nishimura-cv-{pt,en}.pdf            publicados no site
 *   → .scratch/cv/lucas-nishimura-cv-{pt,en}.pdf   com telefone, fora do git
 *
 * São duas edições da mesma folha. A pública não tem telefone, e é a que vai
 * para o GitHub Pages. A privada só existe se .scratch/contato.json existir
 * na sua máquina, nunca é versionada, e é o arquivo que você anexa num
 * e-mail. O número não está em lugar nenhum do repositório: entra por
 * injeção, na hora da impressão.
 *
 * Como funciona: monta cv.html num arquivo único (mesma técnica do
 * build-preview, porque módulo ES não carrega de file://), fixa idioma e
 * telefone em window.__CV_LANG__ / __CV_PHONE__ e manda um Chrome sem
 * interface imprimir a folha. É o mesmo motor do "Salvar em PDF" do
 * navegador.
 *
 * Sem dependência de npm: o site não tem etapa de build e não vai ganhar uma.
 * O único requisito é um Chrome ou Chromium na máquina. Se estiver em lugar
 * incomum, aponte: CHROME_BIN=/caminho/para/chrome node tools/build-cv.mjs
 */

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const LANGS = ['pt', 'en'];
const OUT_DIR = join(root, 'cv');

/* .scratch/ inteiro está no .gitignore desde o primeiro commit do projeto:
   é onde as coisas que não se publicam moram. */
const PRIVATE_DIR = join(root, '.scratch', 'cv');
const CONTACT_FILE = join(root, '.scratch', 'contato.json');

/* A folha é feita de quatro arquivos. O resumo deles vai para cv/.stamp, e
   tools/check-content.mjs compara: assim dá para saber se o PDF publicado
   ainda corresponde ao conteúdo do site, sem depender de data de arquivo. */
export const SOURCES = ['data/content.js', 'cv.html', 'cv.css', 'cv.js'];

export function fingerprint() {
  const h = createHash('sha256');
  for (const f of SOURCES) h.update(read(f));
  return h.digest('hex').slice(0, 16);
}

/* ------------------------------------------------- achar um navegador --- */

function candidates() {
  const list = [process.env.CHROME_BIN, process.env.CHROME_PATH];

  /* Chromium do Playwright, quando já existe na máquina. */
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (pw && existsSync(pw)) {
    for (const dir of readdirSync(pw)) {
      if (!dir.startsWith('chromium')) continue;
      list.push(join(pw, dir, 'chrome-linux', 'chrome'));
      list.push(join(pw, dir, 'chrome-linux', 'headless_shell'));
      list.push(join(pw, dir, 'chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium'));
    }
  }

  return list.concat([
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
  ]).filter(Boolean);
}

function findChrome() {
  for (const bin of candidates()) {
    if (existsSync(bin)) return bin;
  }
  console.error(`
  ✗ Nenhum Chrome ou Chromium encontrado.

    Instale um, ou aponte o que você já tem:
      CHROME_BIN="/caminho/para/chrome" node tools/build-cv.mjs

    Alternativa sem ferramenta nenhuma: abra cv.html no navegador e use
    Imprimir → Salvar em PDF. A folha é a mesma.
`);
  process.exit(1);
}

/* ------------------------------------------ montar a folha num arquivo --- */

function singleFile(lang, phone) {
  const styles = read('styles.css');
  const cvCss = read('cv.css');
  const content = read('data/content.js').replace(/^export\s+/gm, '');
  const script = read('cv.js').replace(/^import[^;]+;\s*/m, '');

  /* Idioma e telefone entram como dados, serializados: um número com aspas ou
     barra invertida não teria como escapar para dentro do código da folha. */
  const boot = `window.__CV_LANG__ = ${JSON.stringify(lang)};`
    + (phone ? ` window.__CV_PHONE__ = ${JSON.stringify(phone)};` : '');

  return read('cv.html')
    .replace('<link rel="stylesheet" href="./styles.css" />', `<style>\n${styles}\n</style>`)
    .replace('<link rel="stylesheet" href="./cv.css" />', `<style>\n${cvCss}\n</style>`)
    .replace('</head>', `<script>${boot}</script>\n</head>`)
    .replace(
      '<script type="module" src="./cv.js"></script>',
      `<script type="module">\n${content}\n${script}\n</script>`
    );
}

/** Telefone da máquina local, se houver. Ausente não é erro: é o caso normal
    em qualquer checkout que não seja o seu. */
function localPhone() {
  if (!existsSync(CONTACT_FILE)) return '';
  try {
    const phone = JSON.parse(readFileSync(CONTACT_FILE, 'utf8')).phone;
    return typeof phone === 'string' ? phone.trim() : '';
  } catch (err) {
    console.error(`  ! ${CONTACT_FILE} ilegível (${err.message}); seguindo sem telefone`);
    return '';
  }
}

/* ---------------------------------------------------------- impressão --- */

/* Só imprime quando chamado direto. tools/check-content.mjs importa este
   arquivo só pela impressão digital, e não pode sair abrindo navegador. */
function main() {
  const chrome = findChrome();
  const work = mkdtempSync(join(tmpdir(), 'cv-'));
  const phone = localPhone();

  /* A edição pública sempre sai. A privada só quando há telefone local. */
  const editions = [{ dir: OUT_DIR, phone: '', label: 'cv', stamp: true }];
  if (phone) editions.push({ dir: PRIVATE_DIR, phone, label: '.scratch/cv', stamp: false });

  try {
    for (const edition of editions) {
      mkdirSync(edition.dir, { recursive: true });

      for (const lang of LANGS) {
        const page = join(work, `cv-${lang}.html`);
        const pdf = join(edition.dir, `lucas-nishimura-cv-${lang}.pdf`);
        writeFileSync(page, singleFile(lang, edition.phone), 'utf8');

        execFileSync(chrome, [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--no-pdf-header-footer',
          /* Dá tempo de o módulo montar a folha antes de a página ser impressa. */
          '--virtual-time-budget=5000',
          `--print-to-pdf=${pdf}`,
          `file://${page}`
        ], { stdio: ['ignore', 'ignore', 'pipe'] });

        if (!existsSync(pdf)) throw new Error(`o navegador não escreveu ${pdf}`);
        const kb = (statSync(pdf).size / 1024).toFixed(0);
        const mark = edition.phone ? ' com telefone, fora do git' : '';
        console.log(`  ✓ ${edition.label}/lucas-nishimura-cv-${lang}.pdf  (${kb} KB)${mark}`);
      }

      if (edition.stamp) writeFileSync(join(edition.dir, '.stamp'), `${fingerprint()}\n`, 'utf8');
    }

    if (!phone) {
      console.log(`\n  · sem ${CONTACT_FILE.replace(root + '/', '')}: só a edição pública.`);
      console.log('    Para a cópia com telefone: {"phone": "+55 11 90000-0000"} nesse arquivo.');
    }
    console.log('');
  } catch (err) {
    console.error(`\n  ✗ falha ao gerar o PDF: ${err.message}\n`);
    process.exitCode = 1;
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
