#!/usr/bin/env node
/**
 * Gera preview.html: o site inteiro num arquivo só.
 *
 *   node tools/build-preview.mjs
 *
 * Serve para revisar ou compartilhar antes de publicar, em contextos que não
 * carregam arquivos vizinhos. NÃO é o artefato de produção: o site publicado
 * continua sendo multi-arquivo, com o conteúdo separado em data/content.js
 * justamente para poder ser editado sem abrir HTML.
 *
 * preview.html está no .gitignore. É derivado, nunca fonte.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const css = read('styles.css');
const content = read('data/content.js').replace(/^export\s+/gm, '');
const script = read('script.js').replace(/^import[^;]+;\s*/m, '');

const html = read('index.html')
  .replace('<link rel="stylesheet" href="./styles.css" />', `<style>\n${css}\n</style>`)
  .replace(
    '<script type="module" src="./script.js"></script>',
    `<script type="module">\n${content}\n${script}\n</script>`
  );

writeFileSync(join(root, 'preview.html'), html, 'utf8');

const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
console.log(`\n  ✓ preview.html gerado: ${kb} KB, arquivo único\n`);
