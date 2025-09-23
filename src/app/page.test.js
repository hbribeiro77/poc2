import React from 'react';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import HomePage from './page'; // Importa o componente da página do Hub

// Mock do Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe('HomePage (Hub)', () => {
  it('deve renderizar o título principal corretamente', () => {
    // Renderiza o componente envolvendo-o com MantineProvider
    render(
      <MantineProvider>
        <HomePage />
      </MantineProvider>
    );

    // Verifica se o título principal está no documento
    // Usamos uma regex case-insensitive para mais flexibilidade
    const mainTitle = screen.getByRole('heading', {
      name: /central de protótipos/i,
      level: 1 // Assumindo que é um <h1>
    });

    expect(mainTitle).toBeInTheDocument();
  });

  // TODO: Adicionar mais testes aqui depois, por exemplo:
  // - Verificar se o texto de boas-vindas é exibido
  // - Verificar se o card de Notificações existe
  // - Verificar se o botão dentro do card existe e tem o link correto
}); 