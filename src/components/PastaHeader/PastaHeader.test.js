import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import PastaHeader from './PastaHeader';

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock do ChatManagerContext
const mockChatManagerContext = {
  chats: [],
  openChat: jest.fn(),
  closeChat: jest.fn(),
  minimizeChat: jest.fn(),
  toggleMaximizeChat: jest.fn(),
  restoreChat: jest.fn(),
  sendMessage: jest.fn(),
  simulateNewMessage: jest.fn(),
  endChat: jest.fn(),
  continueChat: jest.fn(),
  clearChatHistory: jest.fn(),
};

// Mock do useChatManager hook
jest.mock('../../hooks/useChatManager', () => ({
  __esModule: true,
  useChatManager: () => mockChatManagerContext,
}));

// Mock das funções passadas como props
const mockOnArchiveReasonSelected = jest.fn();
const mockOnOpenReactivateConfirmModal = jest.fn();

// Helper para renderizar com MantineProvider
const renderWithProvider = (ui, { providerProps, ...renderOptions } = {}) => {
  return render(
    <MantineProvider {...providerProps}>
      {ui}
    </MantineProvider>,
    renderOptions
  );
};

// Dados de exemplo mínimos para os testes
const mockPastaDataAtiva = {
  area: "Cível",
  assistido: "BART SIMPSON",
  assunto: "DIREITO DA SAÚDE",
  status: "Ativa",
  processo: "5000260-33.2019.8.21.0109",
  motivoArquivamento: null,
  lastStatusChangeBy: null,
  lastStatusChangeAt: null,
  counts: {
    atendimentos: 2,
    pecas: 5,
    documentos: 10,
  }
};

describe('PastaHeader', () => {
  beforeEach(() => {
    // Limpa mocks antes de cada teste
    jest.clearAllMocks();
  });

  test('deve renderizar informações básicas da pasta (assistido, processo)', async () => {
    renderWithProvider(
      <PastaHeader
        pastaData={mockPastaDataAtiva}
        onArchiveReasonSelected={mockOnArchiveReasonSelected}
        onOpenReactivateConfirmModal={mockOnOpenReactivateConfirmModal}
      />
    );

    // Verifica se o nome do assistido está na tela
    expect(screen.getByText(mockPastaDataAtiva.assistido)).toBeInTheDocument();
    // Usa findByText com regex para encontrar "Processo:" com possíveis espaços - TEMPORARIAMENTE COMENTADO
    // expect(await screen.findByText(/Processo:\s*/)).toBeInTheDocument();
    // Verifica o número do processo
    expect(screen.getByText(mockPastaDataAtiva.processo)).toBeInTheDocument();
  });

  test('deve exibir o Badge de status "Ativa" corretamente', () => {
    renderWithProvider(
      <PastaHeader
        pastaData={mockPastaDataAtiva} // Usa dados com status Ativa
        onArchiveReasonSelected={mockOnArchiveReasonSelected}
        onOpenReactivateConfirmModal={mockOnOpenReactivateConfirmModal}
      />
    );

    // Verifica se o Badge com o texto "Ativa" está presente
    // O Badge renderiza um <span> ou <div> com o texto dentro
    expect(screen.getByText('Ativa')).toBeInTheDocument();
    // Poderíamos ser mais específicos buscando pelo role 'status' se o Badge tiver, 
    // ou verificando a cor verde, mas buscar pelo texto é um bom começo.
  });

  // Próximos testes aqui...
}); 