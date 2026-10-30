// mock-data.js — dados fictícios da demo (somente em memória).
// Consumido por mock-firebase.js.
// Usuário de teste: "demo" / código "246810". ownerUid dos registros = "demo".
window.__AURORA_SEED = {
  usuarios: {
    demo: {
      uid: 'demo',
      username: 'demo',
      nome: 'Usuário Demo',
      criadoEm: '2026-01-02T09:00:00.000Z',
      ultimoAcessoEm: '2026-10-16T12:00:00.000Z'
    }
  },
  casos: {},
  chamados: {
    ch1: {
      id: 'ch1', ownerUid: 'demo', protocolo: '2026-0142', solicitante: 'Bilheteria',
      titulo: 'Impressora da bilheteria não imprime',
      descricao: 'A impressora recebe os comandos mas não imprime; fila travada no spooler.',
      status: 'em_andamento',
      data: '2026-10-14T09:12:00.000Z',
      atualizadoEm: '2026-10-15T10:00:00.000Z',
      imagens: [],
      links: [{ rotulo: 'Manual', url: 'https://exemplo.com/manual' }],
      queries: [{ resumo: 'Limpar spooler', query: 'net stop spooler' }]
    },
    ch2: {
      id: 'ch2', ownerUid: 'demo', protocolo: '2026-0139', solicitante: 'Operações',
      titulo: 'Totem do saguão congelando',
      descricao: 'O totem reinicia sozinho aproximadamente a cada 30 minutos.',
      status: 'validacao_cliente',
      data: '2026-10-13T14:30:00.000Z',
      atualizadoEm: '2026-10-15T16:20:00.000Z',
      imagens: ['assets/favicon.png'],
      links: [],
      queries: []
    },
    ch3: {
      id: 'ch3', ownerUid: 'demo', protocolo: '2026-0131', solicitante: 'Manutenção',
      titulo: 'Cabo de rede rompido na plataforma 3',
      descricao: 'Cabo substituído e conexão testada com sucesso.',
      status: 'concluido',
      data: '2026-10-10T08:00:00.000Z',
      atualizadoEm: '2026-10-12T11:00:00.000Z',
      dataConclusao: '2026-10-12T11:00:00.000Z',
      imagens: [],
      links: [],
      queries: []
    }
  },
  conclusoes: {
    'demo_2026-10-20': {
      ownerUid: 'demo', username: 'demo',
      link: 'https://desk.aurora.example/chamado/2026-0143',
      dia: '2026-10-20', data: '2026-10-20T09:40:00.000Z',
      chamadoId: 'ch1', titulo: 'Impressora da bilheteria não imprime'
    },
    'demo_2026-10-15': {
      ownerUid: 'demo', username: 'demo',
      link: 'https://desk.aurora.example/chamado/2026-0142',
      dia: '2026-10-15', data: '2026-10-15T16:05:00.000Z',
      chamadoId: 'ch3', titulo: 'Cabo de rede rompido na plataforma 3'
    },
    'maria_2026-10-19': {
      ownerUid: 'maria', username: 'maria',
      link: 'https://desk.aurora.example/chamado/2026-0141',
      dia: '2026-10-19', data: '2026-10-19T11:20:00.000Z',
      titulo: 'Totem do saguão reiniciando'
    },
    'maria_2026-10-14': {
      ownerUid: 'maria', username: 'maria',
      link: 'https://desk.aurora.example/chamado/2026-0140',
      dia: '2026-10-14', data: '2026-10-14T14:10:00.000Z',
      titulo: 'Impressora fiscal sem comunicacao'
    }
  },
  anotacoes: {
    'demo_2026-10-05': {
      data: '2026-10-05', ownerUid: 'demo',
      ligacao: [{ hora: '09:10', texto: 'Ligação para a operadora sobre o link de internet.' }],
      reuniao: []
    },
    'demo_2026-10-12': {
      data: '2026-10-12', ownerUid: 'demo',
      ligacao: [],
      reuniao: [{ hora: '14:00', texto: 'Reunião de alinhamento com a coordenação.' }]
    },
    'demo_2026-10-15': {
      data: '2026-10-15', ownerUid: 'demo',
      ligacao: [{ hora: '08:45', texto: 'Suporte a bilheteria (impressora).' }],
      reuniao: [{ hora: '16:30', texto: 'Revisão dos chamados da semana.' }]
    },
    'demo_2026-10-22': {
      data: '2026-10-22', ownerUid: 'demo',
      ligacao: [
        { hora: '09:47', texto: 'Marina (Filial Norte) - (55) 90000-0000 - Dificuldade no sistema da Viação Litoral. Orientado a acionar o suporte da Viação Litoral por se tratar de sistema terceiro; cliente contatou e a demanda foi resolvida.' },
        { hora: '11:49', texto: '(51) 90000-0000 - Ligação interrompida/queda na linha antes do início do atendimento.' }
      ],
      reuniao: []
    }
  },
  links: {
    lk1: { id: 'lk1', nome: 'Terminal Aurora Centro', categoriaId: 'contatos', empresa: 'Viação Aurora', localidade: 'Centro', telefone: '(11) 4000-0000' },
    lk2: { id: 'lk2', nome: 'Portal interno', categoriaId: 'sites', empresa: '', url: 'https://exemplo.com' },
    lk3: { id: 'lk3', nome: 'Monitor de rede', categoriaId: 'ferramentas', empresa: '', url: 'https://exemplo.com/rede' }
  },
  blocos_fixos: {
    senhas: {
      itens: [
        { titulo: 'Wi-Fi da loja', senha: 'wi-fi-teste' },
        { titulo: 'Roteador', senha: 'admin-teste' },
        { titulo: 'Sistema de gestão', senha: 'trocar123' }
      ]
    }
  },
  config: {
    convites: { codigos: ['246810'] },
    categorias: {
      lista: [
        { id: 'ecommerce', nome: 'Ecommerce', icone: '🛒', padrao: true },
        { id: 'contatos', nome: 'Contatos', icone: '📞', padrao: true },
        { id: 'sites', nome: 'Sites úteis', icone: '🌐', padrao: true },
        { id: 'ferramentas', nome: 'Ferramentas', icone: '🔧', padrao: true },
        { id: 'internos', nome: 'Internos', icone: '📁', padrao: true }
      ]
    },
    aplicacao: { semeado: false }
  }
};
