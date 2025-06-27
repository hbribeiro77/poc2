'use client';

import { Box, Flex, Card, Title, Text, Image, Group, ThemeIcon, Paper, Table, Button, Pagination, Select, ActionIcon, Indicator, ScrollArea, Tooltip, useMantineTheme, Modal, TextInput, Stack, Avatar, MultiSelect, Textarea } from '@mantine/core';
import Link from 'next/link';
import { IconUsers, IconX, IconCheck, IconTag, IconDoorExit, IconMessageChatbot, IconMessageCircle, IconInfoCircle } from '@tabler/icons-react';
import {
  IconSend, IconTrash, IconAddressBook, IconMailCheck,
  IconSendOff, IconQuestionMark, IconPlus, IconMessageCheck, IconMessageX, IconAlertCircle,
  IconEdit, IconClock
} from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';
import { Timeline } from '@mantine/core';
import ChatUI from '../../components/ChatUI/ChatUI';

export default function ContatosPage() {
  const theme = useMantineTheme();
  const [contatosPrincipaisActivePage, setContatosPrincipaisActivePage] = useState(1);
  const [contatosPrincipaisItemsPerPage, setContatosPrincipaisItemsPerPage] = useState('10');

  const [historicoActivePage, setHistoricoActivePage] = useState(1);
  const [historicoItemsPerPage, setHistoricoItemsPerPage] = useState('10');

  // Estados para o Modal de Envio de Mensagem
  const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);
  const [selectedContactForMessage, setSelectedContactForMessage] = useState(null);
  const [selectedMessageTemplate, setSelectedMessageTemplate] = useState('');
  const [selectedDefensoria, setSelectedDefensoria] = useState(['sistemas']);

  // Estados para o Modal de Aprovação de Providência
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedEtiquetas, setSelectedEtiquetas] = useState([]);
  const [approvalMessageContent, setApprovalMessageContent] = useState('');
  const [approvalChatHistory, setApprovalChatHistory] = useState([]);
  const [isApprovalChatActive, setIsApprovalChatActive] = useState(true);
  const [currentChatMessageId, setCurrentChatMessageId] = useState(null); // Para rastrear a mensagem sendo editada
  const assistidoResponseTimeoutRef = useRef(null);
  const chatViewportRef = useRef(null);

  // Estados para o Modal de Detalhes do Histórico
  const [isHistoryDetailModalOpen, setIsHistoryDetailModalOpen] = useState(false);
  const [selectedMessageForHistory, setSelectedMessageForHistory] = useState(null);
  const [historyDetailChat, setHistoryDetailChat] = useState([]);

  const [historicoMensagens, setHistoricoMensagens] = useState([
    { id: 1, data: '23/04/2025 12:33', mensagem: 'Defensoria Informa: 022.053.290-73', remetente: 'Marjorie Fátima Beck Teixeira', defensoria: '14ª DEFENSORIA PÚBL ESPECIALIZADA EM...', contato: '(51) 99218-8869', status: 'lida', acaoRespondida: false, numRespostas: 0 },
    { id: 2, data: '15/04/2025 17:42', mensagem: 'Seja bem-vindo(a) a DPE/RS! Guarde este numero...', remetente: 'Marta Wayne', defensoria: 'UNIDADE DE SISTEMAS DE INFORMAÇÃO', contato: '(11) 97805-7049', status: 'lida', acaoRespondida: false, numRespostas: 0 },
    { id: 3, data: '11/08/2023 12:45', mensagem: 'Seja bem-vindo(a) a DPE/RS! Guarde este numero...', remetente: 'Marta Wayne', defensoria: 'CENTRO DE APOIO TÉCNICO ESPECIALIZADO - CATE', contato: '(11) 97805-7049', status: 'lida', acaoRespondida: false, numRespostas: 0 },
    { id: 4, data: '15/06/2022 17:45', mensagem: 'Seja bem-vindo(a) a DPE/RS! Guarde este numero...', remetente: 'Marta Wayne', defensoria: 'UNIDADE DE SISTEMAS DE INFORMAÇÃO', contato: '(11) 97805-7049', status: 'lida', acaoRespondida: false, numRespostas: 0 },
    { id: 5, data: '15/06/2022 17:40', mensagem: 'Seja bem-vindo(a) a DPE/RS! Guarde este numero...', remetente: 'Marta Wayne', defensoria: 'UNIDADE DE SISTEMAS DE INFORMAÇÃO', contato: '(11) 97805-7049', status: 'lida', acaoRespondida: false, numRespostas: 0 },
    { id: 6, data: '23/03/2022 12:32', mensagem: 'Aprovacao de providencia: "Solicito a confirmacao..."', remetente: 'Marta Wayne', defensoria: 'CENTRO DE APOIO TÉCNICO ESPECIALIZADO - CATE', contato: '(11) 97805-7049', status: 'pendente', acaoRespondida: false, numRespostas: 0 },
    { id: 7, data: '01/11/2021 12:35', mensagem: 'DECLARACAO Eu, MARTA WAYNE, CPF: 900.516.530-87...', remetente: 'Marta Wayne', defensoria: 'UNIDADE DE SISTEMAS DE INFORMAÇÃO', contato: '(11) 97805-7049', status: 'pendente', acaoRespondida: true, numRespostas: 1 },
    { id: 8, data: '26/07/2021 14:15', mensagem: 'Seja bem-vindo(a) a DPE/RS! Guarde este numero...', remetente: 'Marta Wayne', defensoria: 'UNIDADE DE SISTEMAS DE INFORMAÇÃO', contato: '(11) 97805-7049', status: 'pendente_sem_resposta', acaoRespondida: false, numRespostas: 0 },
    { id: 9, data: '20/07/2021 12:49', mensagem: 'Seja bem-vindo(a) a DPE/RS! Guarde este numero...', remetente: 'Marta Wayne', defensoria: 'UNIDADE DE SISTEMAS DE INFORMAÇÃO', contato: '(11) 97805-7049', status: 'pendente', acaoRespondida: true, numRespostas: 1 },
    { id: 10, data: '19/07/2021 17:56', mensagem: 'Seja bem-vindo(a) a DPE/RS! Guarde este numero...', remetente: 'Marta Wayne', defensoria: 'UNIDADE DE SISTEMAS DE INFORMAÇÃO', contato: '(11) 97805-7049', status: 'pendente', acaoRespondida: true, numRespostas: 1 },
  ]);

  const contatosPrincipaisData = [
    { id: 1, tipo: 'Celular', contato: '(11) 97805-7049', observacoes: 'Marta Wayne', atualizadoEm: '03/08/2022 10:13:18', principal: true },
    // Adicione mais contatos principais se necessário
  ];

  const contatosReceitaData = [
    { id: 1, tipo: 'Email', contato: 'RICARDO_RIVALDO@UOL.COM.BR', atualizadoEm: '27/05/2025' },
  ];

  const totalContatosPrincipaisPages = Math.ceil(contatosPrincipaisData.length / parseInt(contatosPrincipaisItemsPerPage));
  const paginatedContatosPrincipais = contatosPrincipaisData.slice(
    (contatosPrincipaisActivePage - 1) * parseInt(contatosPrincipaisItemsPerPage),
    contatosPrincipaisActivePage * parseInt(contatosPrincipaisItemsPerPage)
  );

  const totalHistoricoPages = Math.ceil(historicoMensagens.length / parseInt(historicoItemsPerPage));
  const paginatedHistoricoMensagens = historicoMensagens.slice(
    (historicoActivePage - 1) * parseInt(historicoItemsPerPage),
    historicoActivePage * parseInt(historicoItemsPerPage)
  );

  const renderStatusIcon = (item) => {
    switch (item.status) {
      case 'lida':
        return <Tooltip label="Mensagem lida/enviada"><ThemeIcon color="blue" variant="light" size="sm"><IconMailCheck size="1rem" /></ThemeIcon></Tooltip>;
      case 'pendente':
        return (
          <Tooltip label="Pendente de resposta/confirmação">
            <ThemeIcon color="orange" variant="light" size="sm">
              <IconClock size="1rem" />
            </ThemeIcon>
          </Tooltip>
        );
      case 'pendente_sem_resposta':
         return <Tooltip label="Pendente (sem resposta)"><ThemeIcon color="gray" variant="light" size="sm"><IconQuestionMark size="1rem" /></ThemeIcon></Tooltip>;
      default:
        return <Tooltip label="Status desconhecido"><ThemeIcon color="gray" variant="light" size="sm"><IconAlertCircle size="1rem" /></ThemeIcon></Tooltip>;
    }
  };

 const renderAcaoIcon = (item) => {
    if (item.acaoRespondida && item.numRespostas > 0) {
      return (
        <Tooltip label={`Respondida (${item.numRespostas})`}>
          <Indicator label={item.numRespostas} size={12} color="green">
            <ActionIcon variant="subtle" size="sm" onClick={() => handleOpenHistoryDetailModal(item)}>
              <IconSend size="1rem" />
            </ActionIcon>
          </Indicator>
        </Tooltip>
      );
    }
    return (
      <Tooltip label="Não há respostas/Nenhuma ação necessária">
        <ActionIcon variant="subtle" size="sm">
          <IconSendOff size="1rem" />
        </ActionIcon>
      </Tooltip>
    );
  };

  const handleCloseSendMessageModal = () => {
    setIsSendMessageModalOpen(false);
    setSelectedContactForMessage(null);
    setSelectedMessageTemplate('');
  };

  const handleSendMessage = () => {
    // Lógica para enviar a mensagem viria aqui
    if (selectedMessageTemplate === 'aprov_providencia') {
      setIsSendMessageModalOpen(false); // Fecha o primeiro modal
      setIsApprovalModalOpen(true);    // Abre o modal de aprovação
      // Não reseta selectedContactForMessage aqui, pois será usado no segundo modal
      // selectedMessageTemplate também é usado para o título do segundo modal
    } else {
      console.log("Enviando mensagem (outro template) para:", selectedContactForMessage, "Template:", selectedMessageTemplate);
      handleCloseSendMessageModal();
    }
  };

  const handleCloseApprovalModal = () => {
    // Se estávamos em uma conversa, salva o histórico dela na tabela principal
    if (currentChatMessageId && approvalChatHistory.length > 0) {
        const wasChatEnded = approvalChatHistory.some(m => m.id.startsWith('system-end'));
        setHistoricoMensagens(prev =>
            prev.map(msg =>
                msg.id === currentChatMessageId
                    ? { 
                        ...msg, 
                        chatTranscript: approvalChatHistory,
                        numRespostas: approvalChatHistory.filter(m => m.sender === 'assistido').length,
                        status: approvalChatHistory.some(m => m.sender === 'assistido') ? 'pendente' : 'pendente_sem_resposta',
                        isChatEnded: wasChatEnded,
                      }
                    : msg
            )
        );
    }

    // Limpa todos os estados relacionados ao modal de chat
    setIsApprovalModalOpen(false);
    setApprovalChatHistory([]);
    setApprovalMessageContent('');
    setSelectedEtiquetas([]);
    setIsApprovalChatActive(true);
    setCurrentChatMessageId(null);
    if (assistidoResponseTimeoutRef.current) {
        clearTimeout(assistidoResponseTimeoutRef.current);
        assistidoResponseTimeoutRef.current = null;
    }
  };

  const handleSendApprovalMessage = () => {
    if (!approvalMessageContent.trim()) return;

    const fullMessage = selectedMessageTemplate === 'aprov_providencia'
      ? `${approvalMessageContent}\n\nResponda "Sim" para aprovar a providencia encaminhada pela Defensoria.`
      : approvalMessageContent;

    const newMessage = {
      id: `defensor-${Date.now()}`,
      sender: 'defensor',
      name: 'Teste Defensor - Portal Defensor',
      text: fullMessage,
      timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    // Apenas cria o registro da tabela na primeira mensagem enviada
    if (approvalChatHistory.length === 0) {
        const newId = `msg-${Date.now()}`;
        const messageToAdd = {
            id: newId,
            data: new Date().toLocaleString('pt-BR'),
            mensagem: newMessage.text.substring(0, 50) + '...',
            remetente: getAssistidoInfo(selectedContactForMessage).nome,
            defensoria: selectedDefensoria.map(val => defensoriaOptions.find(opt => opt.value === val)?.label).join(', '),
            contato: selectedContactForMessage.contato,
            status: 'pendente_sem_resposta', // Começa sem resposta
            acaoRespondida: true, // Ação necessária
            numRespostas: 0, // Começa com 0 respostas
            chatTranscript: [], // Prepara para armazenar a conversa
            isChatEnded: false, // Começa como não encerrada
        };
        setHistoricoMensagens(prev => [messageToAdd, ...prev]);
        setCurrentChatMessageId(newId); // Rastreia o ID da nova mensagem
    }

    setApprovalChatHistory(prevHistory => [...prevHistory, newMessage]);
    setApprovalMessageContent('');

    if (assistidoResponseTimeoutRef.current) {
      clearTimeout(assistidoResponseTimeoutRef.current);
    }

    assistidoResponseTimeoutRef.current = setTimeout(() => {
      const assistidoName = selectedContactForMessage ? (getAssistidoInfo(selectedContactForMessage).nome || 'Assistido') : 'Assistido';
      const assistidoResponse = {
        id: `assistido-reply-${Date.now()}`,
        sender: 'assistido',
        name: assistidoName,
        text: 'Sim, obrigado',
        timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };
      setApprovalChatHistory(prevHistory => [...prevHistory, assistidoResponse]);
      assistidoResponseTimeoutRef.current = null;
    }, 5000);

    console.log(
      "Mensagem de aprovação ENVIADA para:", selectedContactForMessage,
      "Template Original:", selectedMessageTemplate, 
      "Etiquetas:", selectedEtiquetas,
      "Conteúdo Mensagem:", newMessage.text
    );
  };

  const handleEndApprovalChat = () => {
    const endMessage = {
      id: `system-end-${Date.now()}`,
      sender: 'defensor',
      name: 'Sistema',
      text: `Conversa encerrada pelo atendente.`,
      timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    setApprovalChatHistory(prev => [...prev, endMessage]);
    setIsApprovalChatActive(false);
  };

  const messageTemplates = [
    { value: 'local_atendimento', label: 'Informar local do atendimento' },
    { value: 'texto_livre', label: 'Texto livre' },
    { value: 'corona_cancelado', label: 'Atendimento cancelado - CORONAVÍRUS' },
    { value: 'corona_cancelado_poa', label: 'Atendimento cancelado - CORONAVÍRUS (Porto Alegre)' },
    { value: 'aprov_providencia', label: 'Aprovação de providência' },
    { value: 'decl_hipo_financeira', label: 'Declaração de hipossuficiência financeira' },
    { value: 'decl_hipo_organizacional', label: 'Declaração de hipossuficiência organizacional' },
    { value: 'decl_desemprego', label: 'Declaração de desemprego' },
  ];

  const etiquetaOptions = [
    { value: 'urgente', label: 'Urgente' },
    { value: 'documentacao_pendente', label: 'Documentação Pendente' },
    { value: 'aguardando_ciencia', label: 'Aguardando Ciência' },
    { value: 'prazo_fatal', label: 'Prazo Fatal' },
  ];

  const defensoriaOptions = [
      { value: 'cate', label: 'CENTRO DE APOIO TÉCNICO ESPECIALIZADO - CATE' },
      { value: 'sistemas', label: 'UNIDADE DE SISTEMAS DE INFORMAÇÃO' },
      { value: 'dpe_14', label: '14ª DEFENSORIA PÚBL ESPECIALIZADA EM...' },
  ];

  // Função para obter nome e iniciais do assistido
  const getAssistidoInfo = (contato) => {
    if (contato && contato.observacoes) {
      const nomeCompleto = contato.observacoes.split('-')[0].trim();
      const partesNome = nomeCompleto.split(' ');
      const iniciais = partesNome.length > 1 
        ? `${partesNome[0][0]}${partesNome[partesNome.length - 1][0]}`
        : partesNome[0].substring(0, 2);
      return { nome: nomeCompleto, iniciais: iniciais.toUpperCase() };
    }
    return { nome: 'N/D', iniciais: 'N/D' };
  };

  const assistidoInfo = selectedContactForMessage ? getAssistidoInfo(selectedContactForMessage) : { nome: 'N/D', iniciais: 'N/D' };
  const templateLabel = messageTemplates.find(t => t.value === selectedMessageTemplate)?.label || '';

  // Limpa o histórico e outros estados quando o modal de aprovação é aberto ou fechado
  useEffect(() => {
    if (!isApprovalModalOpen) {
      // A lógica de limpeza agora está em handleCloseApprovalModal
    } else {
        // Lógica de inicialização quando o modal abre
        setIsApprovalChatActive(true); // Reseta ao abrir
        setHistoryDetailChat([]); // Limpa o chat de detalhes para evitar piscar de conteúdo antigo
    }
  }, [isApprovalModalOpen]);

  useEffect(() => {
    // Efeito para rolar o chat para a última mensagem.
    // O setTimeout garante que a rolagem ocorra após o DOM ser atualizado,
    // especialmente ao reabrir um chat, evitando uma race condition.
    if (isApprovalModalOpen && chatViewportRef.current) {
      setTimeout(() => {
        if (chatViewportRef.current) { // Verifica novamente, pois o componente pode ser desmontado
            chatViewportRef.current.scrollTo({ top: chatViewportRef.current.scrollHeight, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [approvalChatHistory, isApprovalModalOpen]);

  const handleOpenHistoryDetailModal = (item) => {
    let chatToShow = [];
    // Usa o histórico real se ele existir
    if (item.chatTranscript && item.chatTranscript.length > 0) {
        chatToShow = item.chatTranscript;
    } else {
        // Mantém o fallback para dados antigos/mockados
        chatToShow = [
          {
            id: `defensor-hist-${item.id}`,
            sender: 'defensor',
            name: 'Teste Defensor - Portal Defensor',
            text: item.mensagem,
            timestamp: 'data antiga'
          },
        ];
        // Adiciona a resposta mockada apenas se o item diz que houve resposta
        if (item.numRespostas > 0) {
             chatToShow.push({
                id: `assistido-hist-${item.id}`,
                sender: 'assistido',
                name: item.remetente,
                text: 'Sim, obrigado.', // Resposta genérica para dados antigos
                timestamp: 'data antiga'
            });
        }
    }

    setHistoryDetailChat(chatToShow);
    setSelectedMessageForHistory(item);
    setIsHistoryDetailModalOpen(true);
  };

  const handleContinueConversation = (item) => {
    // Encontra o objeto de contato completo para popular o modal de chat
    const contact = contatosPrincipaisData.find(c => c.contato === item.contato);
    if (!contact) {
        // Idealmente, mostrar uma notificação de erro para o usuário
        console.error("Contato original não encontrado para continuar a conversa.");
        return;
    }

    // Prepara o estado para o modal de chat
    setSelectedContactForMessage(contact);
    setCurrentChatMessageId(item.id);
    setApprovalChatHistory(item.chatTranscript || []);
    setIsApprovalChatActive(true); // Força a reativação do chat
    // Assume o template. O ideal seria armazenar o template original também.
    setSelectedMessageTemplate('aprov_providencia'); 
    
    // Fecha o modal de histórico e abre o modal de chat
    setIsHistoryDetailModalOpen(false);
    setIsApprovalModalOpen(true);
  };

  const handleCloseHistoryDetailModal = () => {
    setIsHistoryDetailModalOpen(false);
    setSelectedMessageForHistory(null);
    setHistoryDetailChat([]); // Limpa o histórico ao fechar
  };

  return (
    <>
      <Flex gap={0} pb="xl">

        {/* Coluna Esquerda (Imagem Lateral Estática) */}
        <Box style={{ maxWidth: 250, height: '100%' }}>
          {/* Usando o menu lateral padrão, não interativo */}
          <Image
            src="/menulateral.png"
            alt="Menu Lateral"
            height="70%"
            fit="contain"
          />
        </Box>

        {/* Coluna Direita (Conteúdo da Nova Página) */}
        <Box style={{ flex: 1 }}>
          <Card shadow="sm" padding={0} radius="md" withBorder>
            <Box pt={0} px="lg" pb="lg">

              {/* Imagem Superior Estática (mantida, similar a páginas de cadastro) */}
              <Image
                src="/menucadastro.png"
                alt="Menu Superior"
                width="100%"
                mb="lg"
              />

              {/* Título da Página */}
              <Group align="center" mb="lg" bg="gray.1" p="sm">
                <ThemeIcon variant="light" size="lg">
                  <IconUsers stroke={1.5} />
                </ThemeIcon>
                <Text fw={500} size="xl" c="blue">
                  Contatos
                </Text>
              </Group>

              {/* Conteúdo Principal da Página (Placeholder) */}
              {/* 
              <Text>
                Gerenciamento de contatos (assistidos, partes contrárias, etc.) virá aqui...
              </Text>
              */}
              {/* Adicione aqui os componentes Mantine para sua funcionalidade */}

              {/* Seção Contatos Principais */}
              <Paper withBorder p="md" mt="lg" shadow="sm">
                <Box pb="xs" mb="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
                  <Group>
                      <ThemeIcon variant="light" size="lg" radius="md">
                          <IconAddressBook style={{ width: '1.5rem', height: '1.5rem' }} />
                      </ThemeIcon>
                      <Text fw={600} size="lg">Contatos</Text>
                  </Group>
                </Box>
                <ScrollArea>
                  <Table striped highlightOnHover withColumnBorders verticalSpacing="sm" miw={700}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th style={{ backgroundColor: theme.colors.gray[1] }}>Tipo</Table.Th>
                        <Table.Th style={{ backgroundColor: theme.colors.gray[1] }}>Contato</Table.Th>
                        <Table.Th style={{ backgroundColor: theme.colors.gray[1] }}>Observações</Table.Th>
                        <Table.Th style={{ backgroundColor: theme.colors.gray[1] }}>Atualizado em</Table.Th>
                        <Table.Th style={{ backgroundColor: theme.colors.gray[1] }}>Principal</Table.Th>
                        <Table.Th style={{ width: 120, textAlign: 'center', backgroundColor: theme.colors.gray[1] }}>Ações</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {paginatedContatosPrincipais.map((item) => (
                        <Table.Tr key={item.id}>
                          <Table.Td>{item.tipo}</Table.Td>
                          <Table.Td>{item.contato}</Table.Td>
                          <Table.Td>
                            <Text truncate="end" style={{ maxWidth: 150 }}>{item.observacoes || '-'}</Text>
                          </Table.Td>
                          <Table.Td>{item.atualizadoEm}</Table.Td>
                          <Table.Td>{item.principal ? 'Principal' : 'Não'}</Table.Td>
                          <Table.Td>
                            <Group gap="xs" justify="center" wrap="nowrap">
                              <Tooltip label="Enviar mensagem">
                                <ActionIcon 
                                  variant="transparent" 
                                  color="gray"
                                  onClick={() => {
                                    setSelectedContactForMessage(item);
                                    setSelectedMessageTemplate(''); // Limpa seleção anterior
                                    setIsSendMessageModalOpen(true);
                                  }}
                                >
                                  <IconSend size="1rem" />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Editar contato">
                                <ActionIcon variant="transparent" color="gray">
                                  <IconEdit size="1rem" />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Excluir contato">
                                <ActionIcon variant="transparent" color="gray">
                                  <IconTrash size="1rem" />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
                <Group justify="space-between" mt="md">
                  <Pagination total={totalContatosPrincipaisPages} value={contatosPrincipaisActivePage} onChange={setContatosPrincipaisActivePage} size="sm" />
                  <Select
                    data={['5', '10', '20']}
                    value={contatosPrincipaisItemsPerPage}
                    onChange={(value) => {
                      setContatosPrincipaisItemsPerPage(value);
                      setContatosPrincipaisActivePage(1); // Reset to first page
                    }}
                    style={{ width: 75 }}
                    size="xs"
                  />
                </Group>
                <Group justify="flex-end" mt="md">
                    <Button leftSection={<IconPlus size={16} />} color="blue">
                        Novo contato
                    </Button>
                </Group>
              </Paper>

              {/* Seção Outros Contatos Disponíveis */}
              <Title order={4} mt="xl" mb="xs" c="gray.7">Outros contatos disponíveis:</Title>
              <Paper withBorder p="md" shadow="sm">
                <Title order={5} c="dimmed" mb="sm">Encontrados no cadastro compartilhado pela Receita Federal</Title>
                <ScrollArea>
                  <Table striped highlightOnHover withColumnBorders verticalSpacing="sm" miw={500}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th style={{ backgroundColor: theme.colors.gray[1] }}>Tipo</Table.Th>
                        <Table.Th style={{ backgroundColor: theme.colors.gray[1] }}>Contato</Table.Th>
                        <Table.Th style={{ backgroundColor: theme.colors.gray[1] }}>Atualizado em</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {contatosReceitaData.map((item) => (
                        <Table.Tr key={item.id}>
                          <Table.Td>{item.tipo}</Table.Td>
                          <Table.Td>{item.contato}</Table.Td>
                          <Table.Td>{item.atualizadoEm}</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Paper>

              {/* Seção Histórico de Mensagens */}
              <Title order={4} mt="xl" mb="xs" c="gray.7">Histórico de mensagens</Title>
              <Paper withBorder p="md" shadow="sm">
                <ScrollArea>
                  <Table striped highlightOnHover withColumnBorders verticalSpacing="sm" miw={900}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th style={{ backgroundColor: theme.colors.gray[1] }}>Data</Table.Th>
                        <Table.Th style={{ backgroundColor: theme.colors.gray[1] }}>Mensagem de texto</Table.Th>
                        <Table.Th style={{ backgroundColor: theme.colors.gray[1] }}>Remetente</Table.Th>
                        <Table.Th style={{ backgroundColor: theme.colors.gray[1] }}>Defensoria</Table.Th>
                        <Table.Th style={{ backgroundColor: theme.colors.gray[1] }}>Contato</Table.Th>
                        <Table.Th style={{ width: 100, textAlign: 'center', backgroundColor: theme.colors.gray[1] }}>Ações</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {paginatedHistoricoMensagens.map((item) => (
                        <Table.Tr key={item.id}>
                          <Table.Td>{item.data}</Table.Td>
                          <Table.Td><Text truncate="end" style={{ maxWidth: 250 }}>{item.mensagem}</Text></Table.Td>
                          <Table.Td><Text truncate="end" style={{ maxWidth: 150 }}>{item.remetente}</Text></Table.Td>
                          <Table.Td><Text truncate="end" style={{ maxWidth: 150 }}>{item.defensoria}</Text></Table.Td>
                          <Table.Td>{item.contato}</Table.Td>
                          <Table.Td>
                            <Group gap="xs" justify="center">
                              {renderStatusIcon(item)}
                              {renderAcaoIcon(item)}
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
                <Group justify="space-between" mt="md">
                  <Pagination total={totalHistoricoPages} value={historicoActivePage} onChange={setHistoricoActivePage} size="sm" />
                   <Select
                    data={['5', '10', '20']}
                    value={historicoItemsPerPage}
                    onChange={(value) => {
                      setHistoricoItemsPerPage(value);
                      setHistoricoActivePage(1); // Reset to first page
                    }}
                    style={{ width: 75 }}
                    size="xs"
                  />
                </Group>
              </Paper>

            </Box>
          </Card>
        </Box>

      </Flex>

      {/* Link discreto para voltar ao Hub */}
      <Group justify="center" mt="xl" pb="xl">
        <Link href="/">
          <Text c="dimmed" size="sm">
            Voltar para a Central
          </Text>
        </Link>
      </Group>

      {/* Modal de Envio de Mensagem */}
      <Modal
        opened={isSendMessageModalOpen}
        onClose={handleCloseSendMessageModal}
        title={
          <Group gap="xs">
            <IconSend size={22} />
            <Text fw={700}>Enviar Mensagem</Text>
          </Group>
        }
        size="lg"
        centered
        radius="md"
        styles={{
            header: { backgroundColor: theme.colors.dark[6] },
            title: { color: theme.white },
            close: {
                color: theme.white,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            },
        }}
        >
        <Stack pt="sm">
            <Text>Para: {selectedContactForMessage?.contato}</Text>
            <MultiSelect
            label="Defensoria"
                placeholder="Selecione a(s) defensoria(s)"
                data={defensoriaOptions}
                value={selectedDefensoria}
                onChange={setSelectedDefensoria}
          />
          <Select
                label="Modelo de Mensagem"
                placeholder="Selecione um modelo"
            data={messageTemplates}
            value={selectedMessageTemplate}
            onChange={(value) => setSelectedMessageTemplate(value || '')}
            searchable
            nothingFoundMessage="Nenhum template encontrado"
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleCloseSendMessageModal}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSendMessage} 
              disabled={!selectedMessageTemplate}
            >
              Enviar Mensagem
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modal de Aprovação de Providência */}
      <Modal
        opened={isApprovalModalOpen}
        onClose={handleCloseApprovalModal}
        padding={0}
        withCloseButton={false}
        size="xl" // Maior para comportar o Textarea
        centered
        radius="md"
        zIndex={1001} // Para garantir que fique sobre o primeiro modal se houver overlap rápido
      >
        <Box 
          style={{
            backgroundColor: theme.colors.dark[7],
            borderTopLeftRadius: 'var(--mantine-radius-md)',
            borderTopRightRadius: 'var(--mantine-radius-md)',
          }}
          px="md" 
          py="sm"
        >
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <IconCheck size={20} color={theme.white}/>
              <Text fw={700} c="white">Mensagem #33402: {templateLabel}</Text>
            </Group>
            <ActionIcon variant="transparent" onClick={handleCloseApprovalModal} aria-label="Fechar modal">
              <IconX size={20} color={theme.white} />
            </ActionIcon>
          </Group>
        </Box>

        <Stack p="md" gap="lg">
            <Group justify="space-between" align="center">
                <Text size="sm"><Text fw={700} component="span">Atendente:</Text> Teste Defensor - Portal Defensor</Text>
                <Group gap="sm" align="center">
                    <Text size="sm" fw={700} component="span">Assistido:</Text>
                    <Text size="sm">{assistidoInfo.nome}</Text>
                </Group>
            </Group>

          {/* Área de Histórico de Chat */}
          <Box mt="md" mb="md">
            <ChatUI
              chatHistory={approvalChatHistory}
              viewportRef={chatViewportRef}
              messageContent={approvalMessageContent}
              onMessageChange={(event) => setApprovalMessageContent(event.currentTarget.value)}
              isChatActive={isApprovalChatActive}
              contactName={assistidoInfo.nome}
              fixedMessageSuffix={
                selectedMessageTemplate === 'aprov_providencia' && !approvalChatHistory.some(m => m.sender === 'defensor')
                  ? 'Responda "Sim" para aprovar a providencia encaminhada pela Defensoria.'
                  : null
              }
              actionButtons={
                <Group justify="space-between" mt="lg">
                    <Group gap="xs">
                        <Button 
                            color="red" 
                            leftSection={<IconDoorExit size={16}/>} 
                            onClick={handleEndApprovalChat}
                            disabled={!isApprovalChatActive}
                        >
                            Encerrar conversa
                        </Button>
                        <Tooltip 
                            label="Caso encerre a conversa, você não receberá novas respostas do assistido."
                            withArrow
                            multiline
                            w={220}
                            zIndex={1002}
                        >
                            <ThemeIcon variant="subtle" color="gray" radius="xl">
                                <IconInfoCircle size={20} />
                            </ThemeIcon>
                        </Tooltip>
                    </Group>
                  <Group>
                    <Button variant="default" onClick={handleCloseApprovalModal}>
                      Fechar
                    </Button>
                    <Button 
                      leftSection={<IconSend size={16}/>} 
                      onClick={handleSendApprovalMessage}
                      disabled={!approvalMessageContent.trim() || !isApprovalChatActive}
                    >
                      Enviar Mensagem
                    </Button>
                  </Group>
                </Group>
              }
            />
          </Box>
        </Stack>
      </Modal>

      <Modal
        opened={isHistoryDetailModalOpen}
        onClose={handleCloseHistoryDetailModal}
        title={
          <Stack gap={0}>
            <Text c="white" fw={700}>Histórico de mensagens</Text>
            <Text size="xs" c="gray.5">
                Número de respostas: {selectedMessageForHistory?.numRespostas || 0}
            </Text>
          </Stack>
        }
        styles={{
            header: { backgroundColor: theme.colors.dark[6], alignItems: 'flex-start' },
            title: { flex: 1 },
            close: { color: theme.white, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } },
            body: { display: 'flex', flexDirection: 'column', height: '70vh' }
        }}
        size="lg"
      >
          <Stack gap="xs" mb="md">
              <Text size="sm">
                  <Text component="span" fw={500}>Enviado para: </Text>
                  {selectedMessageForHistory?.remetente} ({selectedMessageForHistory?.contato})
              </Text>
          </Stack>
          <Box style={{ flex: 1, minHeight: 0 }}>
            <ChatUI
                chatHistory={historyDetailChat}
                viewportRef={chatViewportRef}
                isChatActive={false}
                contactName={selectedMessageForHistory?.remetente || "Assistido"}
                fullHeight
            />
          </Box>
          <Group justify="flex-start" mt="md">
              <Button>Imprimir</Button>
              {selectedMessageForHistory && !selectedMessageForHistory.isChatEnded && selectedMessageForHistory.chatTranscript?.length > 0 && (
                  <Button color="green" onClick={() => handleContinueConversation(selectedMessageForHistory)}>
                      Continuar Conversa
                  </Button>
              )}
          </Group>
      </Modal>
    </>
  );
} 