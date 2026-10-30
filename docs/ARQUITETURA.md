# Arquitetura

Documento técnico do Aurora Desk: como as camadas se encaixam, o modelo de dados e
por que o mock existe.

## Visão em camadas

```
┌──────────────────────────────────────────────────────────┐
│ Telas (HTML + CSS + script inline por página)            │
│ index · chamados · anotacoes · ranking · login           │
└───────────────┬──────────────────────────────────────────┘
                │ API global `firebase.*` (SDK compat)
┌───────────────▼──────────────────────────────────────────┐
│ app-comum.js                                             │
│ init · gate de auth · sair() · escapeHtml()              │
└───────────────┬──────────────────────────────────────────┘
                │
     ┌──────────┴───────────┐
     │                      │
┌────▼─────────────┐  ┌─────▼──────────────────────────────┐
│ Firebase real    │  │ mock-firebase.js + mock-data.js    │
│ (produção)       │  │ (demo: estado em memória)          │
└──────────────────┘  └────────────────────────────────────┘
```

O ponto central: **as telas não sabem qual backend está embaixo**. Elas usam apenas
`firebase.firestore()` / `firebase.auth()`. Trocar o mock pelo SDK real é trocar
duas tags `<script>` — nenhuma tela muda.

## Ordem de carga

```html
<script src="mock-data.js"></script>     <!-- seed: window.__AURORA_SEED -->
<script src="mock-firebase.js"></script> <!-- define window.firebase -->
<script src="app-comum.js"></script>     <!-- initializeApp, db, auth, gate -->
<script>/* script inline da página */</script>
```

`mock-firebase.js` precisa vir antes de `app-comum.js`, porque é ele que cria o
objeto global `firebase`. `mock-data.js` precisa vir antes do mock, que lê o seed
na inicialização.

## Autenticação

O login não usa e-mail de verdade. O usuário digita **nome de usuário** e **código de
convite**; o app monta um e-mail sintético (`usuario@interno.local`) e usa o próprio
código como senha.

```
usuário + código
      │
      ├─ lê config/convites ──► código está na lista?  (fail-closed)
      │
      ├─ signInWithEmailAndPassword
      │        └─ user-not-found / invalid-credential ──► createUserWithEmailAndPassword
      │
      ├─ upsert usuarios/{uid} { uid, username, nome, criadoEm, ultimoAcessoEm }
      │
      └─ redirect sanitizado (?redirect=casos|chamados|anotacoes|ranking)
```

- `destinoSeguro()` só aceita caminhos internos conhecidos — evita open redirect.
- Falha ao gravar o perfil não bloqueia o acesso (o perfil é complementar).
- O gate em cada tela é `auth.onAuthStateChanged`: sem sessão, redireciona para o login.

Na demo, o botão **Entrar na demo** só preenche `demo` / `246810` e envia o mesmo
formulário — o fluxo de autenticação é o de verdade.

## Modelo de dados

| Coleção | Dono | Observação |
|---|---|---|
| `casos` | compartilhado | base de conhecimento de atendimentos |
| `links` | compartilhado | contatos, sites, ferramentas |
| `blocos_fixos` | compartilhado | bloco de senhas por usuário na UI |
| `config` | compartilhado | `categorias` e `convites` (leitura pública do convite) |
| `anotacoes` | **pessoal** | id `{uid}_{AAAA-MM-DD}`, filtrado por `ownerUid` |
| `chamados` | **pessoal** | filtrado por `ownerUid` |
| `conclusoes` | leitura aberta, escrita do dono | 1 doc = 1 ponto no ranking, imutável |
| `usuarios` | **pessoal** | perfil, só o próprio uid lê/escreve |

As regras em `firestore.rules` implementam isso no servidor: `list` filtrado por
`ownerUid`, `get` com guarda para documento inexistente, `create`/`update` exigindo
que o `ownerUid` seja o do usuário autenticado.

## O mock

`mock-firebase.js` é um shim de ~260 linhas que reproduz o subconjunto do SDK
`compat` usado pelo app:

- `initializeApp`, `firestore()`, `auth()`
- `collection().doc().get/set/update/delete/onSnapshot`
- `collection().where(...).orderBy(...).limit(...).get/onSnapshot`
- `batch()`
- `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut`,
  `onAuthStateChanged`

Características:

- **Estado em memória**: reinicia a cada recarregamento (bom para demo, óbvio para
  quem testa).
- **Sessão em `localStorage`**: mantém o login entre reloads.
- **Sem `where` composto**: os filtros são aplicados em memória, um por um.

Limitações conscientes: não há transações, índices, regras de segurança nem
persistência. É um mock para desenvolvimento e demonstração, não um substituto do
Firestore.

## Decisões

- **Sem framework**: o custo de um bundler não se paga para cinco telas mantidas por
  uma pessoa; abrir o arquivo direto no navegador é uma vantagem real.
- **Um arquivo por tela**: cada tela tem seu CSS e seu JS inline. Duplicação existe,
  mas o deploy é copiar a pasta.
- **`compat` em vez de modular**: a API global dispensa `import` e bundler.
- **Exportar/importar JSON**: backup manual sem depender de plano do Firebase.
- **Imagens em WebP**: upload de print de tela sem estourar o limite de documento.
