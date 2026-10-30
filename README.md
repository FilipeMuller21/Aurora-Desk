# Aurora Desk

> **EN** — A dependency-free help-desk web app (vanilla HTML/CSS/JS) for an IT support
> team. It ships with an in-memory, Firebase-compatible mock, so the whole demo runs
> offline in the browser: no API keys, no backend, no build step.

Central de chamados e base de conhecimento para equipes de suporte de TI, escrita em
**HTML, CSS e JavaScript puros** — sem framework, sem bundler, sem `node_modules`.

O backend é um **mock em memória** que implementa a API do Firebase (Auth + Firestore).
Resultado: a demo inteira roda no navegador, offline, sem chave e sem banco.

---

## Demo

🔗 **https://filipemuller21.github.io/aurora-desk/**
Repositório: **https://github.com/FilipeMuller21/aurora-desk**

Clique em **Entrar na demo** (ou use `demo` / código `246810`).
Todos os dados são fictícios e voltam ao estado inicial a cada recarregamento.

## Funcionalidades

- **Casos e links** (`index.html`) — base de conhecimento de atendimentos, com
  categorias (contatos, sites úteis, ferramentas, internos), contatos com telefone,
  acesso remoto, totens e links úteis. Busca, destaque e CRUD completo.
- **Chamados em andamento** (`chamados.html`) — fila de atendimentos com status
  (em andamento, validação, concluído), carrossel, lightbox de imagens e upload com
  compressão para WebP.
- **Anotações** (`anotacoes.html`) — calendário mensal com registros diários de
  ligações e reuniões, bloco de senhas, busca no histórico e exportação do dia em
  `.json` ou `.md`.
- **Ranking** (`ranking.html`) — leaderboard de chamados encerrados, com abas por
  período e registro manual ou automático ao concluir um chamado.
- **Login** (`login.html`) — acesso por usuário + código de convite, com
  auto-registro no primeiro acesso e redirecionamento seguro.
- **Indicador de sincronização** — chip no header mostrando usuário e estado
  (online / offline / sincronizando), com fallback para `localStorage`.
- **Backup** — exportação e importação de dados em JSON.

## Stack e decisões

| Decisão | Por quê |
|---|---|
| HTML/CSS/JS puro, tudo em um arquivo por tela | O ambiente de destino é uma estação Windows sem toolchain; abrir o arquivo já funciona. |
| SDK `compat` do Firebase | Permite usar a API global `firebase.*` sem bundler e sem `import`. |
| Mock em memória com a mesma API | Dá para desenvolver, testar e demonstrar sem tocar no banco real. |
| `firestore.rules` versionado | O isolamento entre usuários é server-side, não só na interface. |
| Tema escuro por padrão | Uso prolongado em tela, ambiente de suporte. |

Sem `package.json`, sem build, sem dependências de runtime além do SDK do Firebase
(substituído pelo mock na demo).

## Estrutura

```
.
├── index.html          # casos + links (tela principal)
├── chamados.html       # chamados em andamento
├── anotacoes.html      # calendário, ligações, reuniões, senhas
├── ranking.html        # leaderboard
├── login.html          # acesso + botão da demo
├── app-comum.js        # init, gate de auth, helpers compartilhados
├── mock-firebase.js    # mock de Auth/Firestore (mesma API do SDK compat)
├── mock-data.js        # seed fictício da demo
├── estilo.css          # tokens e reset compartilhados
├── firestore.rules     # regras de segurança (referência)
├── assets/             # logo e favicon (PNG)
└── docs/               # arquitetura e roteiro de teste
```

## Rodando local

Não precisa de nada instalado: abra `index.html` no navegador.

Se preferir servir por HTTP (recomendado, evita restrições de `file://`):

```bash
python -m http.server 8000
# http://localhost:8000
```

## Usando um Firebase real

1. Crie um projeto no console do Firebase e ative **Authentication → E-mail/senha**.
2. Preencha `firebaseConfig` em `app-comum.js` com as chaves do seu projeto.
3. Troque, nas telas, os scripts `mock-data.js` + `mock-firebase.js` pelos SDKs
   `firebase-app-compat.js`, `firebase-auth-compat.js` e `firebase-firestore-compat.js`.
4. Publique `firestore.rules`.
5. Crie o documento `config/convites` com `{ "codigos": ["SEU-CODIGO"] }`.

## Sobre os dados

Empresa, pessoas, telefones, domínios, projetos e credenciais deste repositório são
**fictícios**. Nada aqui aponta para um sistema real.

## Licença

MIT — veja [LICENSE](LICENSE).
