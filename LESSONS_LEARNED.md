# Lições Aprendidas - Projeto Next.js + Mantine

Este documento registra desafios técnicos encontrados e as soluções aplicadas durante o desenvolvimento.

## 1. Erro de Hidratação (Hydration Failed) na Integração Inicial Mantine + Next.js App Router

**Problema:**

Logo após a configuração inicial do Mantine UI com o Next.js App Router, seguindo a documentação padrão (incluindo `MantineProvider` e `ColorSchemeScript` no `layout.js`), um erro de hidratação do React era disparado no console do navegador:

```
Hydration failed because the server rendered HTML didn't match the client...
...
<html
  lang="en"
- data-mantine-color-scheme="light"
>
...
src\app\layout.js (23:5) @ RootLayout
```

O erro indicava uma Mismatch entre o HTML renderizado pelo servidor (SSR) e o HTML inicial renderizado pelo cliente. Especificamente, o atributo `data-mantine-color-scheme="light"` estava presente na tag `<html>` renderizada pelo servidor, mas não era encontrado pelo cliente no momento da hidratação inicial.

**Tentativas Iniciais (Sem Sucesso):**

1.  **Inverter Ordem de Imports CSS:** Alterar a ordem de importação dos estilos (`@mantine/core/styles.css` antes de `globals.css`) no `layout.js` não resolveu o problema.
2.  **Definir `defaultColorScheme`:** Adicionar `defaultColorScheme="light"` explicitamente tanto no `<ColorSchemeScript />` quanto no `<MantineProvider />` também não surtiu efeito.

**Solução:**

A solução foi instruir o React a ignorar especificamente a diferença de atributos na tag `<html>` durante a hidratação. Isso foi feito adicionando o atributo `suppressHydrationWarning` diretamente à tag `<html>` no arquivo `src/app/layout.js`:

```javascript
// src/app/layout.js

// ... imports e outras configurações ...

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning> { /* <--- Adicionado aqui */ }
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MantineProvider defaultColorScheme="light">{children}</MantineProvider>
      </body>
    </html>
  );
}
```

**Explicação Técnica:**

O `ColorSchemeScript` do Mantine é projetado para adicionar o atributo `data-mantine-color-scheme` à tag `<html>` o mais cedo possível no cliente (antes da pintura) para evitar o flash de tema incorreto (FOUC). No entanto, essa modificação do DOM pelo script pode ocorrer *após* o servidor ter enviado o HTML inicial, mas *antes* do React hidratar completamente a aplicação no cliente. O React detecta essa diferença (atributo presente no SSR, mas potencialmente ausente ou diferente no DOM inicial do cliente *antes* da execução do script) e dispara o erro. O `suppressHydrationWarning` informa ao React para não se preocupar com essa diferença específica na tag `<html>`, aceitando que ela pode ser intencionalmente diferente entre o servidor e o cliente devido a scripts como o `ColorSchemeScript`. 