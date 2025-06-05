# Instruções para Envio ao Repositório

Este documento descreve os passos para enviar as alterações do projeto para o repositório Git.

## Passos para o Push

1.  **Adicionar todas as alterações ao Stage:**
    Este comando adiciona todos os arquivos novos e modificados à área de preparação (staging) do Git.
    ```bash
    git add .
    ```

2.  **Criar um Commit:**
    Este comando salva as alterações no repositório local com uma mensagem descritiva.
    ```bash
    git commit -m "feat: Atualizações e melhorias no projeto"
    ```
    *Substitua "feat: Atualizações e melhorias no projeto" por uma mensagem que descreva suas alterações (ex: "fix: corrige bug no login", "docs: atualiza o README").*

3.  **Enviar as alterações para o repositório remoto:**
    Este comando envia os commits do seu repositório local para o repositório remoto na branch `main` (ou `master`, dependendo do seu projeto).
    ```bash
    git push origin main
    ``` 