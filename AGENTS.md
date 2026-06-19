# AGENTS.md

Este arquivo é a fonte de verdade do projeto. Mantenha-o curto, repetível e aplicável em toda conversa.

## Produto

O produto é um catálogo para WhatsApp: uma vitrine mobile-first para pequenos negócios apresentarem produtos ou serviços e converterem visitantes em conversas qualificadas. Público: confeitarias, marmitarias, salões, estética, artesãos e pequenos vendedores.

Hipótese: uma vitrine bonita, simples de publicar e com CTA claro para WhatsApp aumenta conversas com contexto e reduz perguntas repetitivas. Isto não é ecommerce: não existe checkout, carrinho, pedido, pagamento, frete, estoque transacional ou fluxo de compra fechado. A venda acontece na conversa.

Anti-objetivos:

- Não criar checkout.
- Não criar carrinho.
- Não criar pedidos.
- Não criar pagamento online.
- Não criar marketplace.
- Não adicionar entidades futuras sem necessidade real.

## Princípios de Produto

- Reduzir atrito: cada tela deve aproximar o visitante da conversa.
- Mobile first: celular é o ambiente principal.
- Conversa acima de checkout: o CTA principal leva ao WhatsApp com contexto.
- Simplicidade operacional: o dono do negócio deve conseguir manter tudo sem conhecimento técnico.
- Velocidade de publicação: criar, editar e publicar deve ser rápido.
- Clareza antes de poder: prefira menos opções bem resolvidas.

## Stack

- TanStack Start: aplicação full-stack, rotas e server functions.
- React: UI declarativa.
- TypeScript: domínio, contratos e estados.
- Drizzle + PostgreSQL: persistência relacional tipada.
- Tailwind + shadcn/ui: composição visual, acessibilidade e customização.
- Use a stack sem overengineering. Não crie camadas genéricas antes de existir dor real.

## Princípios de Engenharia

- Illegal states should be unrepresentable: modele tipos, schemas e invariantes para impedir estados inválidos.
- Explicit error handling: erros esperados retornam dados, não exceções escondidas.
- Domain first: comece por regras de `Catalog`, `Category` e `Product`, não por tela ou banco.
- Declarative code: código deve revelar intenção e regra antes de detalhe operacional.
- Self-documenting code: nomes claros valem mais que comentários explicando o óbvio.
- Small composable functions: funções pequenas, nomeadas e combináveis.
- No hidden side effects: leitura, escrita, ambiente e chamadas externas devem ser explícitos.
- Predictable control flow: caminhos de sucesso e erro devem ser fáceis de seguir.

## Domínio

Modele apenas estas entidades:

### Catalog

Raiz da vitrine pública de um negócio. Tem nome, identificador público estável, zero ou mais `Category` e zero ou mais `Product`. `Category` e `Product` não existem fora de um `Catalog`.

### Category

Organiza produtos dentro de um catálogo. Tem nome, pertence a exatamente um `Catalog`, pode possuir zero ou mais `Product` e não contém regras de venda, pedido ou pagamento.

### Product

Item exibido na vitrine para gerar intenção de conversa. Tem nome, pertence a exatamente um `Catalog`, pode pertencer a uma `Category` e preço, quando existir, é informativo. Não representa carrinho, pedido, estoque transacional ou checkout.

## Estrutura

Organize por feature de domínio:

```txt
src/features/catalog
src/features/category
src/features/product
```

Regras:

- `commands` alteram estado, validam intenção e aplicam regras.
- `queries` leem estado e não causam efeitos colaterais.
- `schemas` validam entradas externas e contratos.
- `ui` contém componentes específicos da feature.
- Código compartilhado só deve ser extraído quando houver uso real por mais de uma feature.

## UI/UX

- Toda experiência deve funcionar bem primeiro no celular.
- Todo fluxo deve ter estados explícitos: loading, empty, error e success.
- Nunca deixe uma ação sem resposta visual.
- O CTA principal deve iniciar conversa no WhatsApp com contexto do catálogo ou produto.
- Evite padrões visuais de ecommerce que sugiram carrinho, checkout ou pedido.
- Use HTML semântico, labels, contraste adequado e navegação por teclado em controles relevantes.
- Não comunique estado apenas por cor.

## Código

- Use componentes do shacn quando possivel, estou usando reui (https://reui.io/llms.txt)
- Evite `any`.
- Evite `null` como erro.
- Evite `boolean` para sucesso/falha sem contexto.
- Use union types para estados finitos.
- Use schemas para entrada externa.
- Componentes React não devem conter regra de domínio complexa.
- Evite `useEffect` para lógica derivável.
- Nomes devem refletir o domínio: `createCatalog`, `listProductsByCatalog`, `renameCategory`, `publishProduct`.
- Evite nomes genéricos como `manager`, `service`, `helper`, `processData` e `handleThing`.

## Error Handling

Erros esperados devem ser modelados como dados.

Prefira `Result`:

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E }
```

- Validação retorna erro específico e acionável.
- Erro de domínio usa tipo conhecido.
- Erro inesperado é capturado na borda e convertido para mensagem genérica.
- UI trata cada erro esperado com mensagem clara.
- Logs podem ter detalhe técnico; mensagens ao usuário devem ser simples.

## Definition of Done

Uma feature só está pronta quando:

- Domínio e invariantes foram modelados.
- Validações foram implementadas.
- Loading, empty, error e success foram tratados quando aplicáveis.
- Acessibilidade mínima foi respeitada.
- Commands e queries estão separados.
- Erros esperados retornam `Result` ou equivalente.
- O fluxo é claro no celular.
- Não foram adicionados conceitos de ecommerce.
- O código está legível, nomeado pelo domínio e sem efeitos escondidos.
- Ao final da implementação, rode `$fallow:fallow` para auditar saúde do código.

Comandos Fallow devem seguir a skill: usar `--format json --quiet`, incluir `--explain` quando útil e nunca usar modo interativo.
