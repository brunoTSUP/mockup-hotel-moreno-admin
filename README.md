# Hotel Moreno · Protótipo administrativo

Fase 1: SPA comercial em português brasileiro com React, TypeScript, Vite, Tailwind CSS, componentes shadcn/ui (Button e Dialog sobre Radix), React Router, React Hook Form, Zod, date-fns e Context API. Sem backend ou serviços externos. Não publicado.

## Executar

Requer Node.js **20.19+ ou 22.12+** e npm. Neste ambiente há Node 22.14 em `/home/devuser/.nvm/versions/node/v22.14.0/bin` (o Node padrão do terminal é antigo). Se usar nvm, execute `nvm use 22.14.0` antes dos comandos.

```bash
npm install
npm run dev
```

Abra a URL informada pelo Vite (normalmente http://localhost:5173). O Dashboard é a página inicial. Acesse `/login` para apresentar a entrada simulada; qualquer usuário e senha preenchidos funcionam. O botão Sair abre o login. Não existe proteção de rotas ou autenticação real.

```bash
npm run build
npm run preview
```

A saída estática fica em `dist/`.

## As 30 telas principais

Os estados operacionais apresentados em modal são telas do fluxo comercial, conforme o pedido. Cadastro e edição compartilham o mesmo componente; PF/PJ usam um formulário com seletor de modalidade. Há ainda listagem de check-ins e detalhes/edição de check-outs como acessos auxiliares.

| Nº | Tela | Acesso |
|---|---|---|
| 1 | Dashboard | `/` |
| 2 | Quartos | `/quartos` — grade e lista |
| 3 | Cadastro/edição de quarto | `/quartos/novo`, `/quartos/:id/editar` |
| 4 | Detalhes do quarto | `/quartos/:id` |
| 5 | Iniciar manutenção | Modal no detalhe de quarto livre ou aguardando limpeza |
| 6 | Hospedagens | `/hospedagens` |
| 7 | Nova hospedagem | `/hospedagens/nova` |
| 8 | Detalhes da hospedagem | `/hospedagens/:id` |
| 9 | Finalizar hospedagem | Modal no detalhe ou na listagem |
| 10 | Cancelar hospedagem | Modal no detalhe ou na listagem |
| 11 | Hóspedes | `/hospedes` |
| 12 | Cadastro/edição de hóspede | `/hospedes/novo`, `/hospedes/:id/editar` |
| 13 | Detalhes do hóspede | `/hospedes/:id` |
| 14 | Exclusão física do hóspede | Modal na listagem ou no detalhe |
| 15 | Empresas | `/empresas` |
| 16 | Cadastro/edição de empresa | `/empresas/novo`, `/empresas/:id/editar` |
| 17 | Detalhes da empresa | `/empresas/:id` |
| 18 | Exclusão física da empresa | Modal na listagem ou no detalhe |
| 19 | Check-in PF | `/check-ins/novo` |
| 20 | Check-in PJ | `/check-ins/novo?modalidade=PJ` ou seletor PJ |
| 21 | Cadastro rápido de empresa | Modal no formulário de check-in PJ |
| 22 | Detalhes do check-in | `/check-ins/:id` |
| 23 | Comunicação ao hóspede | Modal no detalhe do check-in |
| 24 | Realizar check-out | `/check-outs/novo` |
| 25 | Decisão após o último check-out | Modal ao concluir a última saída ativa |
| 26 | Histórico de check-outs | `/check-outs` |
| 27 | Templates | `/templates` |
| 28 | Editor de template | `/templates/novo`, `/templates/:id/editar` |
| 29 | Configurações | `/configuracoes` |
| 30 | Login demonstrativo | `/login` |

Outros acessos: `/check-ins`, `/check-ins/:id/editar`, `/check-outs/:id/editar`, prévia de template, detalhe de check-out e alteração da previsão de saída. Rotas desconhecidas exibem uma página com retorno ao Dashboard.

## Roteiro de apresentação

1. Abra `/login` e entre com os campos preenchidos.
2. No Dashboard, selecione **Nova hospedagem**.
3. Escolha um quarto disponível; o período inicia às 13h e termina às 11h do dia seguinte. Os horários podem ser alterados.
4. Salve. O quarto passa a **Ocupado**, mesmo sem check-ins.
5. Cadastre um hóspede em **Hóspedes** usando documento fictício. Retorne à hospedagem em **Hospedagens**.
6. Selecione **Adicionar check-in**, escolha o hóspede e confirme uma entrada dentro do período da hospedagem. Para PJ, selecione ou cadastre uma empresa no modal.
7. No detalhe do check-in, abra **Enviar informações ao hóspede**, selecione o template e visualize a substituição das variáveis. **Simular envio** mostra feedback; nada é enviado.
8. Selecione **Realizar check-out**. Após a última saída, escolha **Finalizar hospedagem** ou **Manter hospedagem ativa**.
9. Se finalizar, o quarto fica **Aguardando limpeza**. No detalhe do quarto, selecione **Liberar após limpeza**.
10. Volte ao Dashboard e confira os indicadores. Recarregue a página para verificar a persistência.

Também é possível finalizar uma hospedagem com vários check-outs simultâneos, cancelar seus check-ins ativos em conjunto, alterar a previsão compartilhada, iniciar/encerrar manutenção e cancelar check-out quando a hospedagem ainda estiver ativa e houver capacidade.

## Dados e regras

- 31 quartos; 18 ocupados, 8 disponíveis, 3 aguardando limpeza e 2 em manutenção no estado inicial.
- Hóspedes brasileiros e estrangeiros, empresas, hospedagens ativas/concluídas/canceladas, entradas PF/PJ, saídas e templates relacionados.
- Datas iniciais relativas ao dia em que a demonstração é criada; dados já salvos mantêm suas datas. Não há relógio de negócio congelado.
- Identificadores pessoais de demonstração (CPF-DEMO, CNPJ-DEMO e PASS-DEMO), sem documentos pessoais reais.
- Um quarto não aceita duas hospedagens ativas; um hóspede não aceita dois check-ins ativos; a capacidade é conferida ao criar/editar entradas e quartos.
- A entrada real deve estar entre o início e a previsão de saída. A saída não pode ser anterior à entrada. Saídas vencidas exigem atualizar a previsão antes de novos check-ins.
- PF não mantém empresa; PJ exige empresa. A previsão de saída pertence à hospedagem.
- A última saída não finaliza automaticamente a hospedagem. Encerramento explícito e cancelamento deixam o quarto aguardando limpeza.
- Encerrar manutenção também solicita conferência de limpeza antes da liberação manual.
- Exclusão física de hóspedes e empresas remove entradas e saídas relacionadas com confirmação e contagem; preserva hospedagens. A exclusão de empresa preserva também hóspedes.
- Quartos com histórico não são excluídos para manter os relacionamentos.
- Templates permitem cadastro, edição, prévia, duplicação e exclusão. E-mail indisponível quando o hóspede não tem endereço cadastrado.
- Dados salvos no navegador sob a chave `hotel-moreno-demo-v1`. A restauração está em Configurações e pede confirmação. Armazenamento indisponível gera aviso e mantém a sessão em memória.

## Estrutura

```text
src/
  components/ui/       Button, Dialog, tabelas, campos e elementos compartilhados
  components/layout/   Sidebar, cabeçalho e layout responsivo
  components/forms/    Cadastros reutilizados e cadastro rápido de empresa
  components/dialogs/  Confirmações e operações em modal
  pages/               Telas dos módulos
  domain/              Tipos e schemas de validação
  data/                Dados fictícios relacionados
  services/            Operações locais e adaptador de persistência
  store/               Contexto de estado e feedback visual
  routes/              Rotas React Router
  lib/                 Datas, IDs e utilitários
public/
  _redirects           Fallback de rotas SPA
```

Os serviços expõem operações por domínio (quartos, hospedagens, hóspedes, empresas, check-ins, check-outs, templates e configurações). Regras ficam fora das páginas; `storage.ts` concentra o acesso ao localStorage. A futura integração Rails deverá introduzir adaptadores assíncronos e substituir a persistência local no contexto; não há HTTP implementado nesta fase.

## Verificação da Fase 1

- Build TypeScript + Vite concluído, com geração de `dist/`.
- Verificação pontual em memória: consistência inicial, criação e ocupação, duplicidade de check-in, PJ, preview, saída sem finalização automática, cancelamento de saída, encerramento conjunto, limpeza, manutenção, exclusões em cascata e round-trip de persistência.
- Revisão das rotas, links internos, formulários e gatilhos de modais no código; renderização pontual de páginas representativas com React DOM Server (sem navegador).
- O build informa aviso de bundle principal acima de 500 kB e avisos de comentários de otimização da dependência Zod. Não impedem a compilação; otimização avançada fica para a Fase 2.
- Não foram geradas capturas de tela nem executados testes extensivos. A interação visual em navegador não foi validada automaticamente neste ambiente.

## Cloudflare Pages

1. Envie este diretório para um repositório e conecte-o ao Cloudflare Pages.
2. Escolha **Vite** ou configuração personalizada.
3. Comando de build: `npm run build`.
4. Diretório de saída: `dist`.
5. Defina Node 22 no ambiente de build (por exemplo, `NODE_VERSION=22.14.0`).
6. O arquivo `public/_redirects` é copiado para `dist/_redirects` e encaminha as rotas internas para `index.html`, permitindo acesso direto e recarregamento.

Alternativa: execute o build local e envie `dist` pelo upload de arquivos do Cloudflare Pages. Não há segredos nem variáveis de API. Nenhuma publicação foi realizada.

## Limites e Fase 2

Este protótipo não tem autenticação real, backend, PostgreSQL, Rails, envio de mensagens, integração fiscal ou sincronização entre dispositivos/abas. Não inclui reservas, financeiro, tarifas ou pagamentos. As validações de documentos são básicas e aceitam os identificadores fictícios da apresentação. O acesso direto às rotas é intencional. Limpar os dados do navegador remove a demonstração salva.

O texto de referência da versão 4.8 não foi fornecido separadamente; foram implementadas as regras consolidadas explicitadas no pedido anexado. Regras adicionais dessa versão precisam ser comparadas com o documento original antes da implementação definitiva.

Ficam para a Fase 2, somente com autorização: testes abrangentes/E2E, revisão avançada de acessibilidade e arquitetura, capturas automatizadas, autenticação real, adaptadores HTTP, integração Rails/PostgreSQL, erros/concorrência e preparação para produção. A Fase 2 não foi iniciada.
