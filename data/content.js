/**
 * Fonte única de conteúdo do portfólio.
 *
 * Toda string visível ao usuário é um "nó traduzível": um objeto { pt, en }.
 * Não existem dois dicionários paralelos. Cada texto carrega os dois idiomas
 * lado a lado, o que torna impossível traduzir metade e esquecer a outra sem
 * que `tools/check-content.mjs` acuse.
 *
 * Para adicionar um projeto: copie um bloco de `projects`, preencha os dois
 * idiomas, rode `node tools/check-content.mjs`.
 */

/** Marca o início: lançamento público do ChatGPT. */
export const START_DATE = '2022-11-30';

const pair = (pt, en) => ({ pt, en });

export const CONTENT = {
  identity: {
    name: 'Lucas Nishimura',
    handle: 'lucasvnd',
    email: 'lucasmrnbr@gmail.com',
    location: pair('São Paulo, SP — Brasil', 'São Paulo, Brazil'),
    /* Telefone não mora aqui: este arquivo é publicado. Ele fica em
       .scratch/contato.json, fora do git, e só entra na cópia do currículo
       que tools/build-cv.mjs gera para você anexar em e-mail. */
    linkedin: 'https://www.linkedin.com/in/lucas-nishimura',
    role: pair('Desenvolvimento assistido por IA', 'AI-assisted development')
  },

  nav: {
    experience: pair('Experiência', 'Experience'),
    systems: pair('Sistemas', 'Systems'),
    education: pair('Formação', 'Education'),
    method: pair('Método', 'Method'),
    automations: pair('Automações', 'Automation'),
    contact: pair('Contato', 'Contact')
  },

  /* Bloco de perfil: quem, o que, como falar. Nada de manchete nem chamada. */
  profile: {
    role: pair('Segurança da informação, automação e desenvolvimento assistido por IA',
               'Information security, automation and AI-assisted development'),
    bio: pair(
      'Dezessete anos em TI corporativa e infraestrutura, os últimos oito em segurança da informação, no Brasil e na Nova Zelândia. Entre 2025 e 2026 entreguei os sistemas e automações listados abaixo, atuando no ciclo completo: modelagem do domínio, arquitetura, implementação, integração com sistemas de terceiros, publicação e operação. O desenvolvimento foi assistido por IA em todas as etapas, e cada decisão de arquitetura ficou registrada em documento versionado junto ao código.',
      'Seventeen years in enterprise IT and infrastructure, the last eight in information security, in Brazil and New Zealand. Between 2025 and 2026 I delivered the systems and automations listed below, working across the full cycle: domain modelling, architecture, implementation, third-party integration, deployment and operation. Development was AI-assisted at every stage, and each architectural decision was recorded in a document versioned alongside the code.'
    ),
    disclosure: pair(
      'Os sistemas são privados e foram entregues a clientes reais. Apresentados aqui de forma sanitizada: sem código, sem credenciais, sem dados de clientes. Clientes identificados por setor.',
      'The systems are private and were delivered to real clients. Presented here in sanitized form: no code, no credentials, no client data. Clients identified by sector.'
    )
  },

  /* Ficha de dados. Tabela, nao vitrine de numeros. */
  facts: [
    { k: pair('Sistemas em produção', 'Systems in production'), v: '4' },
    { k: pair('Setores', 'Sectors'), v: '3' },
    { k: pair('Fluxos de automação entregues', 'Automation flows delivered'), v: '~70' },
    { k: pair('Commits nos sistemas listados', 'Commits across listed systems'), v: '2.573', vEn: '2,573' },
    { k: pair('Decisões de arquitetura registradas', 'Architecture decisions on record'), v: '149' },
    { k: pair('Arquivos de teste', 'Test files'), v: '311' }
  ],

  /* Experiencia: tabela densa, para a pagina servir de curriculo sem virar um.
     PREENCHER as datas. O validador recusa enquanto houver "AAAA". */
  /* Experiencia: espelha exatamente o que o LinkedIn ja mostra publicamente.
     Nada declarado aqui vai alem do registro publico. */
  experience: {
    title: pair('Experiência', 'Experience'),
    note: pair('Dezessete anos em TI corporativa e infraestrutura, os últimos oito em segurança.',
               'Seventeen years in enterprise IT and infrastructure, the last eight in security.'),
    roles: [
      {
        period: pair('2026 - hoje', '2026 - present'),
        role: pair('Cyber Security Specialist', 'Cyber Security Specialist'),
        org: 'Hidrovias do Brasil',
        detail: pair(
          'Operação de segurança corporativa em ambiente industrial e logístico.',
          'Corporate security operations in an industrial and logistics environment.'
        )
      },
      {
        period: pair('2025 - 2026', '2025 - 2026'),
        role: pair('AI and Automation Specialist', 'AI and Automation Specialist'),
        org: 'Nishimura Tech Solutions',
        detail: pair(
          'Entrega dos sistemas e automações listados abaixo: análise, arquitetura, implementação, publicação e operação.',
          'Delivery of the systems and automations listed below: analysis, architecture, implementation, deployment and operation.'
        )
      },
      {
        period: pair('2025', '2025'),
        role: pair('AI and Innovation Head', 'AI and Innovation Head'),
        org: 'TopSend Comunicação Integrada',
        detail: pair(
          'Entrega de agentes de IA para clientes da agência e para a operação interna dela.',
          'Delivery of AI agents for the agency clients and for its own internal operation.'
        )
      },
      {
        period: pair('2025', '2025'),
        role: pair('AI and Automation Specialist', 'AI and Automation Specialist'),
        org: 'YachtMind',
        detail: pair(
          'Fluxos de consulta a APIs e apresentação de dados para um agente de IA, atendendo um cliente do setor náutico.',
          'API lookup and data presentation flows for an AI agent, serving a client in the yachting sector.'
        )
      },
      {
        period: pair('2023 - 2025', '2023 - 2025'),
        role: pair('Security Operations and Reporting Analyst', 'Security Operations and Reporting Analyst'),
        org: 'Caldic',
        detail: pair(
          'Alocado pela Amaris Consulting. Scripts de extração de dados de segurança do Entra ID e do API Defender, gestão de identidades e acessos, políticas, auditorias e ISO 27001.',
          'Placed through Amaris Consulting. Scripts extracting security data from Entra ID and API Defender, identity and access management, policies, audits and ISO 27001.'
        )
      },
      {
        period: pair('2022 - 2023', '2022 - 2023'),
        role: pair('Analista de Segurança Sênior', 'Senior Security Analyst'),
        org: 'ICBC Bank',
        detail: pair(
          'Resposta a incidentes, reestruturação do Active Directory e reforço dos protocolos de segurança.',
          'Incident response, Active Directory restructuring and strengthening of security protocols.'
        )
      },
      {
        period: pair('2020 - 2022', '2020 - 2022'),
        role: pair('Analista de Segurança Sênior', 'Senior Security Analyst'),
        org: 'Banco Pine',
        detail: pair(
          'Baselines de segurança e controles de conformidade regulatória em ambiente financeiro.',
          'Security baselines and regulatory compliance controls in a financial environment.'
        )
      },
      {
        period: pair('2018 - 2019', '2018 - 2019'),
        role: pair('ICT Project Manager', 'ICT Project Manager'),
        org: 'Wizbang Technologies',
        detail: pair(
          'Nova Zelândia. Gestão de projetos de infraestrutura, com as primeiras responsabilidades de segurança.',
          'New Zealand. Infrastructure project management, including the first security responsibilities.'
        )
      },
      {
        period: pair('2009 - 2016', '2009 - 2016'),
        role: pair('Infraestrutura e suporte de TIC', 'ICT infrastructure and support'),
        org: pair('Nova Zelândia e Brasil', 'New Zealand and Brazil'),
        detail: pair(
          'Dimension Data na Nova Zelândia; Gávea Investments, BTG Pactual, Scopus, Wittel e Consulado Britânico no Brasil.',
          'Dimension Data in New Zealand; Gávea Investments, BTG Pactual, Scopus, Wittel and the British Consulate General in Brazil.'
        )
      }
    ]
  },

  /* Formacao: espelha exatamente o que o LinkedIn ja mostra publicamente. */
  education: {
    title: pair('Formação', 'Education'),
    note: pair('Formação em tecnologia da informação e comunicação, na Nova Zelândia e no Brasil.',
               'Education in information and communication technology, in New Zealand and Brazil.'),
    items: [
      {
        period: pair('2015 - 2016', '2015 - 2016'),
        course: pair('Pós-graduação, Graduate Diploma em Tecnologias da Informação e Comunicação',
                     'Post Degree, Graduate Diploma in Information and Communication Technologies'),
        org: 'Manukau Institute of Technology',
        detail: pair('Nova Zelândia.', 'New Zealand.')
      },
      {
        period: pair('2008 - 2011', '2008 - 2011'),
        course: pair('Tecnologia em Redes de Computadores, Redes de Computadores e Telecomunicações',
                     'Computer Networks Technologies, Computer Systems Networking and Telecommunications'),
        org: 'Instituto Universitário SENAC',
        detail: pair('Brasil. Curso concluído.', 'Brazil. Completed.')
      }
    ]
  },

  /* Currículo: a mesma matéria-prima da página, recortada para caber numa
     folha A4. Nada aqui é declaração nova — é seleção do que já está acima. */
  cv: {
    title: pair('Currículo', 'Résumé'),
    subtitle: pair('Resumo em duas páginas. O detalhamento técnico fica no portfólio.',
                   'A two-page summary. The technical detail stays in the portfolio.'),
    download: pair('Baixar PDF', 'Download PDF'),
    print: pair('Imprimir', 'Print'),
    backLabel: pair('Portfólio', 'Portfolio'),
    linkLabel: pair('Currículo (PDF)', 'Résumé (PDF)'),
    profileTitle: pair('Perfil', 'Profile'),
    systemsTitle: pair('Sistemas entregues', 'Systems delivered'),
    systemsNote: pair('2025 - 2026, sanitizados: sem código, sem credenciais, sem dados de clientes. Clientes por setor.',
                      '2025 - 2026, sanitized: no code, no credentials, no client data. Clients by sector.'),
    automationsTitle: pair('Automações', 'Automation'),
    skillsTitle: pair('Competências', 'Skills'),
    skills: [
      {
        label: pair('Segurança da informação', 'Information security'),
        items: ['ISO 27001', 'NIST CSF', 'Entra ID', 'Active Directory',
                pair('Gestão de identidades e acessos', 'Identity and access management'),
                pair('Resposta a incidentes', 'Incident response'),
                pair('Políticas, auditoria e conformidade', 'Policy, audit and compliance')]
      },
      {
        label: pair('Desenvolvimento', 'Development'),
        items: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Python', 'Bun', 'Hono', 'tRPC', 'Prisma']
      },
      {
        label: pair('Dados e infraestrutura', 'Data and infrastructure'),
        items: ['PostgreSQL', 'Supabase', 'SQLite', 'Redis', 'Docker', 'Alembic', 'Leaflet',
                pair('APIs REST e integração com terceiros', 'REST APIs and third-party integration')]
      },
      {
        label: pair('Automação e IA', 'Automation and AI'),
        items: ['n8n', pair('Agentes de IA', 'AI agents'),
                pair('Desenvolvimento assistido por IA', 'AI-assisted development'),
                pair('Telemetria de custo de IA', 'AI cost telemetry')]
      },
      {
        label: pair('Método', 'Method'),
        items: [pair('Registros de decisão de arquitetura', 'Architecture decision records'),
                pair('Glossário de domínio versionado', 'Versioned domain glossary'),
                pair('Verificação no navegador', 'Browser verification'), 'Playwright', 'Git']
      },
      {
        label: pair('Idiomas', 'Languages'),
        items: [pair('Português (nativo)', 'Portuguese (native)'),
                pair('Inglês (nativo)', 'English (native)'),
                pair('Espanhol (básico)', 'Spanish (basic)')]
      }
    ],
    footerNote: pair('Portfólio com o detalhamento técnico de cada sistema: lucasvnd.github.io',
                     'Portfolio with the technical detail of each system: lucasvnd.github.io')
  },

  systems: {
    eyebrow: pair('SISTEMAS', 'SYSTEMS'),
    title: pair('Sistemas', 'Systems'),
    note: pair('Quatro sistemas em produção, em três setores.',
               'Four systems in production, across three sectors.'),
    detail: pair('Detalhes', 'Details'),
    close: pair('Fechar', 'Close'),
    shotPending: pair('Captura de tela pendente', 'Screenshot pending')
  },

  projects: [
    {
      id: 'cw_editor',
      ident: 'SYS-01',
      title: 'CW Editor',
      sector: pair('Imobiliária de loteamentos', 'Land development real estate'),
      category: pair('Operações & CRM', 'Operations & CRM'),
      summary: pair(
        'Plataforma de operações construída sobre um sistema de atendimento de terceiros: transforma conversas soltas num funil Kanban gerido, com analytics, auditoria e onboarding de equipe.',
        'An operations platform built on top of a third-party support system: it turns loose conversations into a managed Kanban funnel, with analytics, auditing and team onboarding.'
      ),
      proof: pair(
        'Cada decisão de arquitetura tem registro escrito, e a verificação acontece no navegador antes de qualquer entrega.',
        'Every architectural decision has a written record, and verification happens in the browser before anything ships.'
      ),
      stack: ['Next.js', 'React', 'Python', 'PostgreSQL', 'Redis', 'Playwright', 'Docker'],
      figures: [
        { n: '1.961', nEn: '1,961', l: pair('commits', 'commits') },
        { n: '138', l: pair('decisões registradas', 'recorded decisions') },
        { n: '311', l: pair('arquivos de teste', 'test files') }
      ],
      highlights: [
        pair('Funil Kanban com estágios, ordenação e filtros compostos', 'Kanban funnel with stages, ordering and composite filters'),
        pair('Proxy server-side: o navegador nunca vê credencial de terceiro', 'Server-side proxy: the browser never sees a third-party credential'),
        pair('Log de eventos e auditoria de autoria em notas mutáveis', 'Event log and authorship auditing on mutable notes'),
        pair('Ponte de mensageria substituindo o canal nativo', 'Messaging bridge replacing the native channel')
      ],
      shots: [] // encaixes preparados; ver README para as specs
    },
    {
      id: 'iapai',
      ident: 'SYS-02',
      title: 'IAPAI',
      sector: pair('Jurídico', 'Legal'),
      category: pair('Produto de IA', 'AI product'),
      summary: pair(
        'Produto de análise jurídica com IA, vendido por assinatura. Três camadas que se conversam: a aplicação web, a automação que orquestra o atendimento, e o motor que faz a análise em si.',
        'An AI legal-analysis product sold by subscription. Three layers talking to each other: the web application, the automation orchestrating support, and the engine doing the analysis itself.'
      ),
      proof: pair(
        'Produto completo de ponta a ponta (autenticação, assinatura, créditos, painel administrativo), com motor de análise instrumentado que mede o próprio custo de IA por execução.',
        'A complete product end to end (authentication, subscription, credits, admin panel), with an instrumented analysis engine that measures its own AI cost per run.'
      ),
      stack: ['Next.js', 'TypeScript', 'Supabase', 'Bun', 'Hono', 'tRPC', 'Prisma', 'n8n'],
      figures: [
        { n: '3', l: pair('camadas integradas', 'integrated layers') },
        { n: '8', l: pair('análises em paralelo', 'parallel analyses') },
        { n: '13', l: pair('fluxos de automação', 'automation flows') }
      ],
      highlights: [
        pair('Autenticação, assinatura, créditos e painel administrativo', 'Authentication, subscription, credits and admin panel'),
        pair('Motor de análise type-safe com oito seções processadas em paralelo', 'Type-safe analysis engine with eight sections processed in parallel'),
        pair('Agente que valida legislação antes de a análise começar', 'An agent that validates legislation before analysis begins'),
        pair('Telemetria de custo de IA por execução, com métricas exportadas', 'Per-run AI cost telemetry, with exported metrics')
      ],
      shots: []
    },
    {
      id: 'geosampa',
      ident: 'SYS-03',
      title: 'GeoSampa',
      sector: pair('Imobiliária de loteamentos', 'Land development real estate'),
      category: pair('Dados & Território', 'Data & Geo'),
      summary: pair(
        'Inteligência territorial: cruza bases geográficas oficiais com regiões desenhadas à mão pelo usuário e devolve uma lista qualificada, com exportação.',
        'Territorial intelligence: it crosses official geographic datasets with regions the user draws by hand, and returns a qualified list, with export.'
      ),
      proof: pair(
        'A fonte oficial bloqueia automação. Toda requisição atravessa uma camada própria de controle de ritmo, disjuntor, cache e rotação de saída.',
        'The official source blocks automation. Every request crosses a purpose-built layer of rate control, circuit breaker, cache and outbound rotation.'
      ),
      stack: ['React', 'TypeScript', 'Node.js', 'SQLite', 'Leaflet', 'Playwright'],
      figures: [
        { n: '6', l: pair('componentes de rede', 'network components') },
        { n: '139', l: pair('commits', 'commits') },
        { n: '3', l: pair('interfaces: CLI, API e worker', 'interfaces: CLI, API and worker') }
      ],
      highlights: [
        pair('Controle de ritmo e disjuntor por host, com política recarregável', 'Per-host rate control and circuit breaker, with reloadable policy'),
        pair('Detecção semântica de bloqueio: a fonte devolve erro com status de sucesso', 'Semantic block detection: the source returns errors with a success status'),
        pair('Cache com validade por tipo de requisição', 'Cache with per-request-type expiry'),
        pair('Jobs com acompanhamento de status e exportação', 'Jobs with status tracking and export')
      ],
      shots: []
    },
    {
      id: 'secops-hub',
      ident: 'SYS-04',
      title: 'SecOps Hub',
      sector: pair('Segurança corporativa', 'Corporate security'),
      category: pair('Segurança', 'Security'),
      summary: pair(
        'Painel operacional de segurança: reúne indicadores de fontes distintas, normaliza o que cada uma chama por um nome diferente, e entrega uma leitura única da postura.',
        'A security operations dashboard: it gathers indicators from distinct sources, normalizes what each one names differently, and delivers a single reading of posture.'
      ),
      proof: pair(
        'Identidades e dispositivos chegam duplicados de cada fonte. O painel depende de uma fonte de verdade acordada entre elas.',
        'Identities and devices arrive duplicated from every source. The dashboard depends on a source of truth agreed between them.'
      ),
      stack: ['Python', 'PostgreSQL', 'Docker', 'Alembic', 'REST APIs'],
      figures: [
        { n: '169', l: pair('commits', 'commits') },
        { n: '5', l: pair('decisões registradas', 'recorded decisions') },
        { n: '6', l: pair('funções do NIST CSF mapeadas', 'NIST CSF functions mapped') }
      ],
      highlights: [
        pair('Arquitetura por coletores, conectores e normalizadores', 'Architecture split into collectors, connectors and normalizers'),
        pair('Resolvedor de identidade como fonte de verdade dos painéis', 'Identity resolver as the dashboards’ source of truth'),
        pair('Classificação de dispositivo por origem', 'Origin-based device classification'),
        pair('Módulo de maturidade sobre o NIST CSF 2.0, em concepção', 'A maturity module on NIST CSF 2.0, in design')
      ],
      shots: []
    }
  ],

  method: {
    eyebrow: pair('MÉTODO', 'METHOD'),
    title: pair('Método', 'Method'),
    note: pair('Artefatos extraídos dos repositórios e sanitizados.',
               'Artifacts taken from the repositories and sanitized.'),
    exhibits: [
      {
        kind: 'domain',
        label: pair('MODELO DE DOMÍNIO', 'DOMAIN MODEL'),
        title: pair('Cada projeto tem uma linguagem escrita.', 'Every project has a written language.'),
        note: pair(
          'Um glossário versionado define cada termo do domínio, o que ele não é, e o que evitar dizer. Trecho real:',
          'A versioned glossary defines each domain term, what it is not, and what to avoid saying. Real excerpt:'
        ),
        source: 'CONTEXT.md · CW Editor',
        term: 'Card',
        body: pair(
          'Uma linha na tabela de itens do Kanban. Representa uma Conversa fixada em um Estágio específico de um Funil.',
          'A row in the Kanban items table. It represents a Conversation pinned to a specific Stage of a Funnel.'
        ),
        invariantLabel: pair('Invariante', 'Invariant'),
        invariant: pair(
          'Card não existe sem a Conversa dele. É constraint no banco, não promessa de quem escreve código: apagar uma Conversa leva o Card junto, por qualquer caminho.',
          'A Card cannot exist without its Conversation. It is a database constraint, not a promise from whoever writes the code: deleting a Conversation takes the Card with it, through any path.'
        ),
        aftermath: pair(
          'O defeito que isso matou tinha nome: Card órfão. Havia 366 deles em produção, abrindo em branco.',
          'The defect this killed had a name: orphan Card. There were 366 of them in production, opening blank.'
        ),
        avoidLabel: pair('Evitar', 'Avoid'),
        avoid: pair('ticket, issue, linha, entrada (em fala de produto).', 'ticket, issue, row, entry (in product speech).')
      },
      {
        kind: 'adr',
        label: pair('REGISTRO DE DECISÃO', 'DECISION RECORD'),
        title: pair('Toda decisão de arquitetura vira documento.', 'Every architectural decision becomes a document.'),
        note: pair(
          'São 149 registros somados nos sistemas. Este é um deles, na íntegra do que importa. Trata de um bug de dinheiro encontrado por verificação em navegador:',
          'There are 149 records across the systems. This is one of them, in the part that matters. It covers a money bug found through browser verification:'
        ),
        adr: {
          id: 'ADR-0013',
          source: 'CW Editor',
          status: pair('Aceita', 'Accepted'),
          date: '2026-06-12',
          title: pair(
            'Quebrar o conversor numérico em conversores semânticos',
            'Split the numeric parser into semantic parsers'
          ),
          sections: [
            {
              h: pair('Contexto', 'Context'),
              p: pair(
                'Uma única função convertia texto em número para seis consumidores: ordenação do quadro, distintivo do card, filtro por faixa, cálculo de faixa do conjunto e o cálculo de valor do terreno. Durante a verificação em navegador de uma entrega, descobriu-se que o texto "2.000" virava 2,0, numa leitura no formato americano, enquanto os operadores cadastram áreas no formato brasileiro, onde "2.000" significa dois mil metros quadrados.',
                'A single function converted text into numbers for six consumers: board sorting, the card badge, range filtering, dataset range calculation and the land-value calculation. While verifying a delivery in the browser, we found that the text "2.000" became 2.0, read as US format, while operators enter areas in Brazilian format, where "2.000" means two thousand square metres.'
              )
            },
            {
              h: pair('O nó', 'The knot'),
              table: {
                head: [pair('Campo', 'Field'), pair('Decimal solitário?', 'Lone decimal?'), pair('Milhar BR?', 'BR thousand?')],
                rows: [
                  [pair('Área (m²)', 'Area (m²)'), pair('NÃO, não existe terreno de 2,5 m²', 'NO, there is no 2.5 m² lot'), pair('SIM', 'YES')],
                  [pair('Razão / coeficiente', 'Ratio / coefficient'), pair('SIM', 'YES'), pair('NÃO, razão acima de 100 não faz sentido', 'NO, a ratio above 100 makes no sense')],
                  [pair('Dinheiro', 'Money'), pair('SIM, centavos', 'YES, cents'), pair('SIM', 'YES')]
                ]
              },
              p: pair(
                'Os seis consumidores não compartilham semântica. Uma heurística única sempre produz resultado ruim em pelo menos um dos três perfis.',
                'The six consumers do not share semantics. A single heuristic always produces a bad result in at least one of the three profiles.'
              )
            },
            {
              h: pair('Decisão', 'Decision'),
              p: pair(
                'Substituir a função única por quatro conversores semânticos: área, razão, moeda e genérico. Cada ponto de uso escolhe o conversor adequado ao tipo de valor que está lendo. Mexer na heurística de um não afeta o comportamento dos outros.',
                'Replace the single function with four semantic parsers: area, ratio, currency and generic. Each call site picks the parser appropriate to the kind of value it is reading. Changing one heuristic does not affect the behaviour of the others.'
              )
            }
          ]
        }
      },
      {
        kind: 'flow',
        label: pair('FLUXO DE TRABALHO', 'WORKING PROCESS'),
        title: pair('Etapas do fluxo de trabalho.', 'Stages of the working process.'),
        note: pair(
          'Cada etapa produz um artefato que a seguinte consome.',
          'Each stage produces an artifact the next one consumes.'
        ),
        steps: [
          {
            k: pair('Entrevista', 'Interview'),
            v: pair('Perguntas em rodadas até a decisão ficar sem sombra. Nada é assumido em silêncio.', 'Rounds of questions until the decision has no shadow left. Nothing is assumed silently.')
          },
          {
            k: pair('Especificação', 'Specification'),
            v: pair('A conversa vira documento: problema, solução, decisões e o que ficou fora de escopo.', 'The conversation becomes a document: problem, solution, decisions, and what was left out of scope.')
          },
          {
            k: pair('Tickets', 'Tickets'),
            v: pair('A spec quebra em fatias finas, cada uma atravessando o sistema inteiro de ponta a ponta.', 'The spec breaks into thin slices, each cutting through the whole system end to end.')
          },
          {
            k: pair('Construção', 'Build'),
            v: pair('Teste primeiro nos pontos de costura acordados. Sessões paralelas nunca disputam o mesmo arquivo.', 'Test-first at the agreed seams. Parallel sessions never contend for the same file.')
          },
          {
            k: pair('Verificação', 'Verification'),
            v: pair('Rodar e observar, no navegador. Nada é declarado pronto por leitura de código.', 'Run it and watch it, in the browser. Nothing is declared done by reading code.')
          },
          {
            k: pair('Revisão', 'Review'),
            v: pair('Dois eixos antes do commit: segue o padrão da casa, e faz o que a spec pediu.', 'Two axes before commit: does it follow house standards, and does it do what the spec asked.')
          }
        ]
      }
    ]
  },

  automations: {
    eyebrow: pair('AUTOMAÇÕES', 'AUTOMATION'),
    title: pair('Automações', 'Automation'),
    note: pair('Cerca de 70 fluxos autorais entregues. Os três sistemas abaixo são os mais representativos.',
               'Around 70 authored flows delivered. The three systems below are the most representative.'),
    diagramNote: pair(
      'Os diagramas foram redesenhados para este site. Capturas do editor e arquivos de exportação não são publicados: carregam nomes de nó, credenciais e endereços internos.',
      'The diagrams were redrawn for this site. Editor screenshots and export files are never published: they carry node names, credentials and internal addresses.'
    ),
    items: [
      {
        id: 'disparo',
        ident: 'AUT-01',
        title: pair('Captação e disparo em lote', 'Lead capture and batch outreach'),
        sector: pair('Imobiliária de loteamentos', 'Land development real estate'),
        flows: 3,
        nodes: 56,
        summary: pair(
          'Formulário capta o lead e o coloca numa fila. Um job periódico decide quem está apto a receber contato. Um terceiro fluxo dispara em lote, com espera entre envios para não queimar o número.',
          'A form captures the lead and places it in a queue. A scheduled job decides who is eligible for contact. A third flow sends in batches, waiting between messages so the number does not get burned.'
        ),
        diagram: 'disparo',
        points: [
          pair('Separação em três fluxos: captar, decidir e enviar nunca se misturam', 'Split into three flows: capture, decide and send never mix'),
          pair('Controle de ritmo explícito entre envios', 'Explicit pacing between sends'),
          pair('Fila em banco, não em memória, para que reinício não perca lead', 'Queue in the database, not in memory, so a restart loses no lead')
        ]
      },
      {
        id: 'triagem',
        ident: 'AUT-02',
        title: pair('Triagem de casos com IA', 'AI case triage'),
        sector: pair('Escritório de advocacia', 'Law firm'),
        flows: 9,
        nodes: 108,
        summary: pair(
          'O caso chega por webhook, é classificado e tem os dados extraídos por IA, e daí segue para o CRM: cria contato, move o negócio no funil, consulta cadastro e devolve um e-mail redigido.',
          'A case arrives by webhook, is classified and has its data extracted by AI, then moves on to the CRM: it creates the contact, moves the deal along the funnel, runs a registry check and returns a drafted email.'
        ),
        diagram: 'triagem',
        points: [
          pair('Um ponto de entrada só; tudo depois é sub-fluxo com responsabilidade única', 'A single entry point; everything after is a sub-flow with one responsibility'),
          pair('Classificação e extração estruturada antes de qualquer escrita no CRM', 'Classification and structured extraction before any CRM write'),
          pair('Biblioteca de consultas reaproveitada entre os fluxos', 'A query library reused across the flows')
        ]
      },
      {
        id: 'produto',
        ident: 'AUT-03',
        title: pair('Automação do produto de IA', 'AI product automation'),
        sector: pair('Jurídico', 'Legal'),
        flows: 13,
        nodes: 350,
        summary: pair(
          'É o atendimento do produto inteiro: agente conversacional com ferramentas de busca legislativa, análise de documentos recebidos, entrada pela API oficial de mensageria, telemetria de custo de IA e limpeza agendada.',
          'This is the whole product’s support layer: a conversational agent with legislative lookup tools, analysis of incoming documents, entry through the official messaging API, AI cost telemetry and scheduled cleanup.'
        ),
        diagram: 'produto',
        points: [
          pair('Ferramentas de busca externa expostas ao agente como sub-fluxos', 'External lookup tools exposed to the agent as sub-flows'),
          pair('Fluxo dedicado só a medir o custo de IA de cada execução', 'A flow dedicated purely to measuring each run’s AI cost'),
          pair('Planos distintos servidos por fluxos distintos, sem condicional gigante', 'Different plans served by different flows, with no giant conditional')
        ]
      }
    ]
  },

  links: {
    emailLabel: pair('E-mail', 'Email'),
    linkedinLabel: 'LinkedIn'
  },

  footer: {
    note: pair('Portfólio em evolução, atualizado conforme novos sistemas possam ser apresentados.', 'A portfolio in progress, updated as new systems become presentable.'),
    langLabel: pair('Idioma', 'Language')
  },

  ui: {
    all: pair('Todos', 'All'),
    themeToggle: pair('Alternar tema', 'Toggle theme'),
    skipToContent: pair('Pular para o conteúdo', 'Skip to content'),
    since: {
      years: pair('a', 'y'),
      months: pair('m', 'm')
    }
  },

  notFound: {
    code: '404',
    title: pair('Esta página não existe.', 'This page does not exist.'),
    lead: pair('O endereço pode ter mudado, ou nunca existiu.', 'The address may have changed, or it never existed.'),
    back: pair('Voltar ao início', 'Back to start')
  }
};
