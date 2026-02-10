# Regras de Negócio: Campo Nome Social (Dados Pessoais)

Documento para apresentação das regras implementadas no cadastro de Dados Pessoais em relação ao campo **Nome Social**.

---

## 1. Objetivo do campo Nome Social

O campo **Nome Social** é de **uso exclusivo para identidade de gênero** de pessoas travestis e transexuais. Não deve ser utilizado para apelidos, vulgo ou cadastro de outra pessoa. O uso incorreto impacta documentos oficiais e exige fluxo de validação e responsabilização.

---

## 2. Estados do campo

O campo Nome Social pode estar em um dos seguintes estados, que definem se é editável, se exibe ícones de alerta ou de validação, e se há botão "Editar":

| Situação | Aspecto do campo | Editável? | Ícone / Ação visível |
|----------|-------------------|-----------|------------------------|
| **Nome social preenchido e não validado** | Apagadinho (somente leitura) | Não | Triângulo de alerta (amarelo); ao passar o mouse, popover com texto informando que não foi validado e botão "Validar" |
| **Nome social validado** | Apagadinho (somente leitura) | Não | Check verde + botão "Editar"; ao passar o mouse no check, popover com "Validado por [Nome] ([Matrícula]) em [data e horário]" |
| **Nome social salvo em branco** | Apagadinho (vazio, somente leitura) | Não | Apenas botão "Editar" (sem check) |
| **Em edição** (após clicar em Editar e confirmar na modal) | Normal (editável) | Sim | Nenhum ícone durante a digitação; ao salvar, o valor é considerado já validado |

---

## 3. Validação do nome social (modal “assustadora”)

- **Quando aparece:** Ao acessar a página de Dados Pessoais, se o campo Nome Social estiver **preenchido** e **ainda não validado**, a modal de **Validação de Nome Social** abre automaticamente.
- **Conteúdo da modal:**
  - Alerta em destaque informando que o campo é de uso exclusivo para identidade de gênero e que o uso incorreto impacta documentos oficiais.
  - Exibição do valor atual do nome social encontrado no cadastro.
  - Três opções de ação:
    1. **Confirmar como Nome Social** – O dado está correto e refere-se à identidade de gênero do assistido.
    2. **Não é Nome Social (Mover para Observações)** – É apelido, vulgo ou outra informação que deve ser preservada no histórico.
    3. **Não é Nome Social (Excluir dado)** – A informação está incorreta ou não deve constar no cadastro.
  - Checkbox de responsabilidade: *"Sou responsável pelas informações aqui indicadas e confirmo sua veracidade. Todas as alterações são auditadas e sujeitas a revisão."*
  - Botões: **Cancelar** e **Confirmar Edição** (este só habilitado com o checkbox marcado).
- **Após confirmar:** O nome social fica **validado**; o sistema registra quem validou (nome, matrícula) e data/horário para auditoria. Se a opção for "Excluir dado", o campo é limpo.

---

## 4. Dificultar alteração do nome social já validado

- Quando o nome social está **validado** (ou foi **salvo em branco**), o campo fica **apagadinho** e **somente leitura**.
- Para alterar o valor, o usuário deve:
  1. Clicar no botão **Editar** ao lado do campo.
  2. Na modal **Editar Nome Social**, ler o alerta sobre o uso exclusivo do campo, marcar o checkbox de responsabilidade e clicar em **Confirmar Edição**.
- **Após confirmar:** O campo passa a ser **editável**. O nome que o usuário inserir ou alterar nessa edição será considerado **já validado** ao clicar em **Salvar** (não dispara nova modal de validação).
- Durante a edição, **não** é exibido o triângulo de alerta; o triângulo só aparece quando há valor não validado e o usuário **não** está em modo edição.

---

## 5. Nome social salvo em branco

- Se o usuário **deixar o campo Nome Social em branco** e clicar em **Salvar**, o sistema considera que o cadastro foi salvo **sem nome social**.
- O campo passa a ficar **apagadinho**, **somente leitura** e **vazio**, com apenas o botão **Editar** (sem ícone de check).
- Para preencher nome social depois, o usuário clica em **Editar**, confirma na modal Editar Nome Social, preenche o valor e salva; esse valor é tratado como já validado.

---

## 6. Check verde e informação de “Validado por”

- Quando o nome social está **validado** e o campo tem valor, é exibido um **ícone de check verde** ao lado do campo (no bloco travado, junto com o botão Editar; no bloco editável, quando validado).
- Ao **passar o mouse** no check, é exibido um **popover** com o texto:  
  **"Validado por [Nome do validador] ([Matrícula]) em [dd/mm/aaaa HH:mm]".**
- Esses dados são gravados:
  - Ao confirmar na **modal de Validação de Nome Social** (ações Confirmar ou Mover para Observações).
  - Ao **Salvar** o formulário após ter liberado a edição pelo botão Editar (nome inserido na edição é considerado validado pelo usuário atual).

---

## 7. Botão “Descartar alterações”

- Ao clicar em **Descartar alterações**, o formulário volta ao estado inicial e **todas** as bandeiras relacionadas ao nome social são resetadas, entre elas:
  - Nome social validado ou não
  - Nome social salvo em branco ou não
  - Modo edição
  - Dados de “Validado por” (nome, matrícula, data/hora).

---

## 8. Resumo do fluxo para o usuário

1. **Entrou na página com nome social preenchido e não validado** → Campo apagadinho, só triângulo de alerta; modal de validação abre automaticamente.
2. **Validou na modal** → Campo continua apagadinho, aparece check verde e botão Editar; ao passar o mouse no check, vê “Validado por … em …”.
3. **Quer alterar o nome social** → Clica em Editar, confirma na modal Editar Nome Social, altera o valor e salva; o novo valor fica validado.
4. **Salvou o nome social em branco** → Campo fica apagadinho e vazio, só com botão Editar; para preencher depois, usa Editar e salva (valor já validado).
5. **Descartar** → Tudo volta ao estado inicial, incluindo “validado” e “validado por”.

---

*Documento gerado com base nas regras implementadas no protótipo de Dados Pessoais (poc2).*
