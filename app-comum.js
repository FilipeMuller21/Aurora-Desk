// app-comum.js — núcleo compartilhado das páginas do Aurora Desk.
// Script CLÁSSICO (sem type="module") para funcionar tanto em file:// quanto em servidor.
// Ordem de carga (demo):
//   mock-data.js → mock-firebase.js → app-comum.js → script inline da página
// Para usar um Firebase real, troque os dois primeiros scripts pelos SDKs do
// Firebase (compat) e preencha `firebaseConfig` com as chaves do seu projeto.
// Não depende do mock — usa apenas a API global `firebase`.

// ⚠ Configuração FICTÍCIA. Não é um projeto Firebase real: a demo publicada
// roda 100% em memória (mock-firebase.js). Estes campos existem apenas para
// mostrar onde a configuração real entraria.
var firebaseConfig = {
  apiKey: "DEMO_NAO_E_UMA_CHAVE_REAL",
  authDomain: "aurora-desk-demo.firebaseapp.com",
  projectId: "aurora-desk-demo",
  storageBucket: "aurora-desk-demo.firebasestorage.app",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000",
  measurementId: "G-DEMO000000"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var auth = firebase.auth();

// Usuário logado (preenchido pelo gate). Global, usado pelas páginas.
var usuarioAtual = null;

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function sair() {
  auth.signOut()
    .then(() => location.replace('login.html'))
    .catch(err => alert('Erro ao sair: ' + (err && err.message ? err.message : err)));
}

// Gate de acesso: redireciona ao login quando desconectado; caso contrário
// define `usuarioAtual` e chama `onLogado(user)` (inicialização da página).
function iniciarGate(redirect, onLogado) {
  auth.onAuthStateChanged(user => {
    if (!user) {
      location.replace('login.html?redirect=' + redirect);
      return;
    }
    usuarioAtual = user;
    if (typeof onLogado === 'function') onLogado(user);
  });
}
