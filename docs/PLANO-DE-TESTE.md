# Roteiro de teste manual

Sem framework de teste: a validação é manual, no navegador. Rode
`python -m http.server 8000` e abra `http://localhost:8000`.

## Login

- [ ] Abrir a raiz sem sessão → redireciona para `login.html`.
- [ ] Botão **Entrar na demo** → entra e cai em `index.html`.
- [ ] Login manual `demo` / `246810` → funciona.
- [ ] Código errado → mensagem de erro, sem criar sessão.
- [ ] `?redirect=chamados` → depois do login, abre `chamados.html`.
- [ ] `?redirect=https://exemplo.com` → ignorado, cai em `index.html`.
- [ ] **Sair** → volta ao login.

## Casos e links (`index.html`)

- [ ] Criar, editar e excluir um caso.
- [ ] Busca filtra por título e descrição.
- [ ] Criar link em cada categoria (contato, site, ferramenta, interno).
- [ ] Exportar JSON e reimportar em uma sessão limpa.

## Chamados (`chamados.html`)

- [ ] Criar chamado com imagem → imagem aparece comprimida (WebP).
- [ ] Mudar status até concluído → gera ponto no ranking.
- [ ] Lightbox abre e fecha.
- [ ] Chamados de outro usuário não aparecem (isolamento por `ownerUid`).

## Anotações (`anotacoes.html`)

- [ ] Navegar entre meses; dia com registro fica marcado.
- [ ] Adicionar ligação e reunião no dia.
- [ ] Exportar o dia em `.json` e em `.md`.
- [ ] Bloco de senhas: criar, copiar, editar e excluir.

## Ranking (`ranking.html`)

- [ ] Abas Hoje / Semana / Mês somam pontos corretamente.
- [ ] Registro manual exige link válido.
- [ ] Mesmo chamado não pontua duas vezes.

## Responsivo

- [ ] Largura ≤ 700 px: header quebra corretamente nas cinco telas.
