# Portfólio de Lucas Nishimura

Site estático bilíngue (pt-BR / en), sem etapa de build e sem dependências.
Publica no GitHub Pages por Actions, a cada push na `main`.

## Estrutura

```text
index.html          shell semântico; conteúdo montado por JS
404.html            página de erro
styles.css          tokens de tema + componentes
script.js           renderização, idioma, tema, filtros, diálogo, diagramas
data/content.js     ← TODO o conteúdo vive aqui, nos dois idiomas
og.png              imagem de compartilhamento (1200×630)
tools/
  check-content.mjs  validador de conteúdo (rode antes de publicar)
  build-preview.mjs  gera preview.html, arquivo único, para revisão
.scratch/           anotações internas; NÃO versionado, NÃO publicado
```

## Editar conteúdo

Tudo em `data/content.js`. Cada texto visível é um par bilíngue:

```js
title: pair('Quatro sistemas em produção.', 'Four systems in production.')
```

Não existem dois dicionários paralelos: os dois idiomas moram lado a lado, o
que torna impossível traduzir metade e esquecer a outra sem que o validador
acuse.

Depois de qualquer edição:

```bash
node tools/check-content.mjs
```

Ele reprova se: faltar um idioma, um campo obrigatório estiver vazio, um id de
projeto estiver duplicado, um diagrama for desconhecido, uma captura apontar
para arquivo inexistente, ou se um **termo proibido** aparecer no conteúdo.

## Capturas de tela: especificação

Os encaixes já existem. Os cards ficam completos sem imagem nenhuma, então
pode publicar antes e preencher depois.

| Item | Valor |
| --- | --- |
| Proporção | **16:10** (é o que o CSS recorta) |
| Largura mínima | **1440 px** (2× o slot, para telas retina) |
| Formato | **WebP** de preferência; PNG serve |
| Peso alvo | até **250 KB** por imagem |
| Local | `assets/shots/<id-do-sistema>/<nome>.webp` |
| Quantidade | 2 a 3 por sistema. Mais que isso vira galeria, não prova |

Regras de sanitização, sem exceção:

1. **Nada de borrão ou tarja.** É reversível, deixa contexto em volta e
   comunica amadorismo. Capture uma tela que já esteja limpa.
2. **Dado falso onde der.** Suba local com dados de teste e capture isso.
3. **Conversa de cliente final não entra**, borrada ou não. É dado de
   terceiro que não é seu para publicar.
4. Sem URL interna, sem e-mail, sem nome de cliente, sem token na barra.

Para registrar uma captura, adicione ao array `shots` do projeto:

```js
shots: [
  { src: './assets/shots/cw_editor/kanban.webp',
    alt: pair('Funil Kanban com estágios', 'Kanban funnel with stages') }
]
```

O validador confere que o arquivo existe e que há texto alternativo.

## Rodar local

```bash
python -m http.server 8765
# http://127.0.0.1:8765/
```

Parâmetro de idioma: `?lang=en` abre direto em inglês e é compartilhável.

## Publicar

Push na `main`. O workflow valida o conteúdo, monta o artefato por **lista
explícita** de arquivos e publica.

A montagem por lista é deliberada: publicar a raiz inteira levaria junto
`tools/` e qualquer anotação interna.

## Verificação antes de declarar pronto

O site não tem suíte de testes versionada, de propósito, para não trazer
dependências. A verificação tem duas frentes:

1. `node tools/check-content.mjs` valida invariantes de conteúdo e privacidade.
2. Navegador: filtros, diálogo (fecha por botão, clique fora e Escape),
   seletor de idioma, persistência de tema, largura de celular sem rolagem
   horizontal, console limpo.
