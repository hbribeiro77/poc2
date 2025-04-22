import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalConfirmacaoAssustadora from './ModalConfirmacaoAssustadora';
import { MantineProvider } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import userEvent from '@testing-library/user-event';

// Mock das funções passadas como props
const mockOnClose = jest.fn();
const mockOnConfirm = jest.fn();

// Componente wrapper com MantineProvider para que estilos/tema funcionem
const renderWithProvider = (ui, { providerProps, ...renderOptions } = {}) => {
  return render(
    <MantineProvider {...providerProps}>{ui}</MantineProvider>,
    renderOptions
  );
};

describe('ModalConfirmacaoAssustadora', () => {
  const defaultProps = {
    opened: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    title: 'Título de Teste',
    alertIcon: <IconAlertCircle size={16} />,
    alertColor: 'yellow',
    alertMessage: 'Mensagem de Alerta Teste',
    bodyText: 'Corpo do Texto Teste',
    checkboxLabel: 'Checkbox Label Teste',
    confirmButtonLabel: 'Confirmar Teste',
  };

  // Limpa mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar o modal com o título correto quando opened=true', () => {
    renderWithProvider(<ModalConfirmacaoAssustadora {...defaultProps} />);

    // Verifica se o modal está no documento (pelo título, que é um bom indicador)
    expect(screen.getByRole('dialog', { name: 'Título de Teste' })).toBeInTheDocument();
    // Asserção CORRIGIDA: Espera que o título ESTEJA no documento
    expect(screen.getByText('Título de Teste')).toBeInTheDocument(); 
  });

  test('não deve renderizar o modal quando opened=false', () => {
    renderWithProvider(<ModalConfirmacaoAssustadora {...defaultProps} opened={false} />);

    // Verifica se o modal NÃO está no documento
    expect(screen.queryByRole('dialog', { name: 'Título de Teste' })).not.toBeInTheDocument();
  });

  test('deve exibir a mensagem de alerta e o texto do corpo', () => {
    renderWithProvider(<ModalConfirmacaoAssustadora {...defaultProps} />);

    expect(screen.getByText(defaultProps.alertMessage)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.bodyText)).toBeInTheDocument();
  });

  test('o botão de confirmação deve estar desabilitado inicialmente', () => {
    renderWithProvider(<ModalConfirmacaoAssustadora {...defaultProps} />);

    // Encontra o botão pelo seu texto (label)
    const confirmButton = screen.getByRole('button', { name: defaultProps.confirmButtonLabel });
    expect(confirmButton).toBeDisabled();
  });

  test('clicar no checkbox deve habilitar o botão de confirmação', async () => {
    // Precisamos do userEvent para simular cliques
    const user = userEvent.setup();
    renderWithProvider(<ModalConfirmacaoAssustadora {...defaultProps} />);

    const confirmButton = screen.getByRole('button', { name: defaultProps.confirmButtonLabel });
    const checkbox = screen.getByLabelText(defaultProps.checkboxLabel);

    // Verifica se o botão está desabilitado inicialmente (reforço)
    expect(confirmButton).toBeDisabled();

    // Simula o clique no checkbox
    await user.click(checkbox);

    // Verifica se o botão está habilitado após o clique
    expect(confirmButton).toBeEnabled();
  });

  test('clicar no botão Cancelar deve chamar onClose', async () => {
    const user = userEvent.setup();
    renderWithProvider(<ModalConfirmacaoAssustadora {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });

    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled(); // Garante que onConfirm não foi chamado
  });

  test('clicar no botão Confirmar (após marcar checkbox) deve chamar onConfirm', async () => {
    const user = userEvent.setup();
    renderWithProvider(<ModalConfirmacaoAssustadora {...defaultProps} />);

    const confirmButton = screen.getByRole('button', { name: defaultProps.confirmButtonLabel });
    const checkbox = screen.getByLabelText(defaultProps.checkboxLabel);

    // 1. Clica no checkbox para habilitar o botão
    await user.click(checkbox);
    expect(confirmButton).toBeEnabled(); // Confirma que está habilitado

    // 2. Clica no botão Confirmar
    await user.click(confirmButton);

    // Verifica se onConfirm foi chamado e onClose não
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('clicar no botão Confirmar SEM marcar checkbox NÃO deve chamar onConfirm', async () => {
    const user = userEvent.setup();
    renderWithProvider(<ModalConfirmacaoAssustadora {...defaultProps} />);

    const confirmButton = screen.getByRole('button', { name: defaultProps.confirmButtonLabel });

    // Verifica que o botão está desabilitado
    expect(confirmButton).toBeDisabled();

    // Tenta clicar no botão desabilitado (userEvent geralmente não dispara eventos em botões desabilitados,
    // mas adicionamos a verificação nos mocks para garantir)
    // O clique em si pode ou não ocorrer dependendo da versão/implementação, mas a ação não deve ser chamada
    await user.click(confirmButton).catch(() => { /* Ignora erro de clique em elemento desabilitado */ });

    // Verifica se NENHUMA função foi chamada
    expect(mockOnConfirm).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test(`deve aplicar a cor de fundo azul ao alerta quando alertColor='blue'`, () => {
    // É preciso pegar o valor exato da cor do tema para comparar
    const blue1 = MantineProvider.defaultProps?.theme?.colors?.blue?.[1] || '#d0ebff'; // Fallback genérico azul claro
    renderWithProvider(
      <ModalConfirmacaoAssustadora {...defaultProps} alertColor="blue" />
    );

    // Encontra o Alert (pode ser pelo texto ou pelo role 'alert' se aplicável)
    const alertElement = screen.getByText(defaultProps.alertMessage).closest('[role="alert"]') || screen.getByRole('alert');
    expect(alertElement).toHaveStyle(`background-color: ${blue1}`);
  });

  test(`deve aplicar a cor de fundo vermelha ao alerta quando alertColor='red'`, () => {
    const red1 = MantineProvider.defaultProps?.theme?.colors?.red?.[1] || '#ffe3e3'; // Fallback genérico vermelho claro
    renderWithProvider(
      <ModalConfirmacaoAssustadora {...defaultProps} alertColor="red" />
    );

    const alertElement = screen.getByText(defaultProps.alertMessage).closest('[role="alert"]') || screen.getByRole('alert');
    expect(alertElement).toHaveStyle(`background-color: ${red1}`);
  });

}); 