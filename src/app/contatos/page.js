'use client';

import { Box, Flex, Card, Title, Text, Image, Group, ThemeIcon, Paper, Table, Button, Pagination, Select, ActionIcon, Indicator, ScrollArea, Tooltip, useMantineTheme, Modal, TextInput, Stack, Avatar, MultiSelect, Textarea } from '@mantine/core';
import Link from 'next/link';
import { IconUsers, IconX, IconCheck, IconTag, IconDoorExit, IconMessageChatbot, IconMessageCircle } from '@tabler/icons-react';
import {
  IconSend, IconTrash, IconAddressBook, IconMailCheck,
  IconSendOff, IconQuestionMark, IconPlus, IconMessageCheck, IconMessageX, IconAlertCircle,
  IconEdit, IconClock
} from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';

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

  // Estados para o Modal de Aprovação de Providência
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedEtiquetas, setSelectedEtiquetas] = useState([]);
  const [approvalMessageContent, setApprovalMessageContent] = useState('');
  const [approvalChatHistory, setApprovalChatHistory] = useState([]);
  const assistidoResponseTimeoutRef = useRef(null);

  const contatosPrincipaisData = [
    { id: 1, tipo: 'Celular', contato: '(11) 97805-7049', observacoes: 'raul dantas - sinch', atualizadoEm: '03/08/2022 10:13:18', principal: true },
    // Adicione mais contatos principais se necessário
  ];

  const contatosReceitaData = [
    { id: 1, tipo: 'Email', contato: 'RICARDO_RIVALDO@UOL.COM.BR', atualizadoEm: '27/05/2025' },
  ];

  const historicoMensagensData = [
    { id: 1, data: '23/04/2025 12:33', mensagem: 'Defensoria Informa: 022.053.290-73', remetente: 'Marjorie Fátima Beck Teixeira', defensoria: '14ª DEFENSORIA PÚBL ESPECIALIZADA EM...', contato: '(51) 99218-8869', status: 'lida', acaoRespondida: false, numRespostas: 0 },
    { id: 2, data: '15/04/2025 17:42', mensagem: 'Seja bem-vindo(a) a DPE/RS! Guarde este numero: e nosso numero para mensagens. Atencao! Para sua seguranca, na...', remetente: 'Humberto Borges Ribeiro', defensoria: 'UNIDADE DE SISTEMAS DE INFORMAÇÃO', contato: '(51) 99238-7778', status: 'lida', acaoRespondida: false, numRespostas: 0 },
    { id: 3, data: '11/08/2023 12:45', mensagem: 'Seja bem-vindo(a) a DPE/RS! Guarde este numero: e nosso numero para mensagens. Atencao! Para sua seguranca, na...', remetente: 'Humberto Borges Ribeiro', defensoria: 'CENTRO DE APOIO TÉCNICO ESPECIALIZADO - CATE', contato: '(51) 99238-7778', status: 'lida', acaoRespondida: false, numRespostas: 0 },
    { id: 4, data: '15/06/2022 17:45', mensagem: 'Seja bem-vindo(a) a DPE/RS! Guarde este numero: e nosso numero para mensagens. Atencao! Para sua seguranca, na...', remetente: 'Humberto Borges Ribeiro', defensoria: 'UNIDADE DE SISTEMAS DE INFORMAÇÃO', contato: '(51) 99238-7778', status: 'lida', acaoRespondida: false, numRespostas: 0 },
    { id: 5, data: '15/06/2022 17:40', mensagem: 'Seja bem-vindo(a) a DPE/RS! Guarde este numero: e nosso numero para mensagens. Atencao! Para sua seguranca, na...', remetente: 'Humberto Borges Ribeiro', defensoria: 'UNIDADE DE SISTEMAS DE INFORMAÇÃO', contato: '(51) 99238-7778', status: 'lida', acaoRespondida: false, numRespostas: 0 },
    { id: 6, data: '23/03/2022 12:32', mensagem: 'Aprovacao de providencia: "Solicito a confirmacao do acordo. "Atendimento presencial para esclarecer o acordo...', remetente: 'Humberto Borges Ribeiro', defensoria: 'CENTRO DE APOIO TÉCNICO ESPECIALIZADO - CATE', contato: '(51) 99238-7778', status: 'pendente', acaoRespondida: false, numRespostas: 0 },
    { id: 7, data: '01/11/2021 12:35', mensagem: 'DECLARACAO Eu, HUMBERTO BORGES RIBEIRO, CPF: 900.516.530-87, declaro para os devidos fins que resido n...', remetente: 'Humberto Borges Ribeiro', defensoria: 'UNIDADE DE SISTEMAS DE INFORMAÇÃO', contato: '(51) 99238-7778', status: 'pendente', acaoRespondida: true, numRespostas: 1 },
    { id: 8, data: '26/07/2021 14:15', mensagem: 'Seja bem-vindo(a) a DPE/RS! Guarde este numero: e nosso numero para mensagens. Atencao! Para sua seguranca, na...', remetente: 'Humberto Borges Ribeiro', defensoria: 'UNIDADE DE SISTEMAS DE INFORMAÇÃO', contato: '(51) 99238-7778', status: 'pendente_sem_resposta', acaoRespondida: false, numRespostas: 0 },
    { id: 9, data: '20/07/2021 12:49', mensagem: 'Seja bem-vindo(a) a DPE/RS! Guarde este numero: e nosso numero para mensagens. Atencao! Para sua seguranca, na...', remetente: 'Humberto Borges Ribeiro', defensoria: 'UNIDADE DE SISTEMAS DE INFORMAÇÃO', contato: '(51) 99238-7778', status: 'pendente', acaoRespondida: true, numRespostas: 1 },
    { id: 10, data: '19/07/2021 17:56', mensagem: 'Seja bem-vindo(a) a DPE/RS! Guarde este numero: e nosso numero para mensagens. Atencao! Para sua seguranca, na...', remetente: 'Humberto Borges Ribeiro', defensoria: 'UNIDADE DE SISTEMAS DE INFORMAÇÃO', contato: '(51) 99238-7778', status: 'pendente', acaoRespondida: true, numRespostas: 1 },
  ];

  const totalContatosPrincipaisPages = Math.ceil(contatosPrincipaisData.length / parseInt(contatosPrincipaisItemsPerPage));
  const paginatedContatosPrincipais = contatosPrincipaisData.slice(
    (contatosPrincipaisActivePage - 1) * parseInt(contatosPrincipaisItemsPerPage),
    contatosPrincipaisActivePage * parseInt(contatosPrincipaisItemsPerPage)
  );

  const totalHistoricoPages = Math.ceil(historicoMensagensData.length / parseInt(historicoItemsPerPage));
  const paginatedHistoricoMensagens = historicoMensagensData.slice(
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
            <ActionIcon variant="subtle" size="sm">
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
    setIsApprovalModalOpen(false);
    // selectedContactForMessage e selectedMessageTemplate são resetados pelo handleCloseSendMessageModal se necessário
    // ou mantidos se o fluxo for direto para cá.
  };

  const handleSendApprovalMessage = () => {
    if (!approvalMessageContent.trim()) return;

    const newMessage = {
      id: `defensor-${Date.now()}`,
      sender: 'defensor',
      name: 'Teste Defensor - Portal Defensor',
      text: approvalMessageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

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
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

  // Inicializa o chat com a mensagem do assistido quando o modal abre e o contato é selecionado
  useEffect(() => {
    if (isApprovalModalOpen && selectedContactForMessage) {
        // Define um ID único para a mensagem mock para evitar problemas de chave
        const assistidoMockMessage = {
            id: `assistido-mock-${Date.now()}`,
            sender: 'assistido',
            name: getAssistidoInfo(selectedContactForMessage).nome || 'Assistido',
            text: 'Sim, obrigado',
            timestamp: 'há poucos segundos' // Timestamp mock
        };
        setApprovalChatHistory([assistidoMockMessage]);
    } else {
        setApprovalChatHistory([]); // Limpa o histórico se o modal estiver fechado ou sem contato
    }
  }, [isApprovalModalOpen, selectedContactForMessage]);

  // Limpa o histórico e outros estados quando o modal de aprovação é aberto ou fechado
  useEffect(() => {
    if (!isApprovalModalOpen) {
      setApprovalChatHistory([]); // Limpa o histórico ao fechar
      setApprovalMessageContent('');
      setSelectedEtiquetas([]);
      // Cancela qualquer timeout pendente para a resposta do assistido
      if (assistidoResponseTimeoutRef.current) {
        clearTimeout(assistidoResponseTimeoutRef.current);
        assistidoResponseTimeoutRef.current = null;
      }
    } else {
        setApprovalChatHistory([]); // Garante que o chat comece vazio ao abrir
    }
  }, [isApprovalModalOpen]);

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
        padding={0} // Remove padding padrão para customizar header e footer
        withCloseButton={false} // Remove botão X padrão, será adicionado manualmente
        size="md"
        centered
        radius="md"
      >
        {/* Cabeçalho Customizado do Modal */}
        <Box 
          style={{
            backgroundColor: theme.colors.dark[7], // Cor escura para o cabeçalho
            borderTopLeftRadius: 'var(--mantine-radius-md)',
            borderTopRightRadius: 'var(--mantine-radius-md)',
          }}
          px="md" 
          py="sm"
        >
          <Group justify="space-between" align="center">
            <Text fw={700} c="white">Mensagem a ser enviada</Text>
            <ActionIcon variant="transparent" onClick={handleCloseSendMessageModal} aria-label="Fechar modal">
              <IconX size={20} color={theme.white} />
            </ActionIcon>
          </Group>
        </Box>

        {/* Corpo do Modal */}
        <Stack p="md" gap="md">
          <TextInput
            label="Defensoria"
            withAsterisk
            value="2ª DEFENSORIA PÚBLICA ESPECIALIZADA CÍVEL DO FORO CENTRAL"
            readOnly
            rightSection={<IconX size={14} color={theme.colors.gray[5]} />} // Ícone X no campo Defensoria
            styles={{ 
              label: { marginBottom: '4px' },
              input: { backgroundColor: theme.colors.gray[0], cursor: 'not-allowed'}
            }}
          />
          <Select
            label="Mensagem"
            withAsterisk
            placeholder="Selecione"
            data={messageTemplates}
            value={selectedMessageTemplate}
            onChange={(value) => setSelectedMessageTemplate(value || '')}
            searchable
            nothingFoundMessage="Nenhum template encontrado"
            styles={{ label: { marginBottom: '4px' } }}
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
          <Text size="sm"><Text fw={700} component="span">Autor:</Text> Teste Defensor - Portal Defensor</Text>
          
          <Group gap="sm" align="center">
            <Text size="sm" fw={700} component="span">Assistido:</Text>
            <Avatar color="blue" radius="xl" size="sm">{assistidoInfo.iniciais}</Avatar>
            <Text size="sm">{assistidoInfo.nome}</Text>
            <IconSend size={16} color={theme.colors.gray[6]} />
          </Group>

          <MultiSelect
            label="Etiquetas"
            placeholder="Selecione as etiquetas"
            data={etiquetaOptions}
            value={selectedEtiquetas}
            onChange={setSelectedEtiquetas}
            leftSection={<IconTag size={16} />}
            searchable
            clearable
            nothingFoundMessage="Nenhuma etiqueta encontrada"
          />

          {/* Área de Histórico de Chat */}
          <ScrollArea mah={200} mt="md" mb="md" type="auto">
            <Stack gap="md">
              {approvalChatHistory.map((chat) => (
                <Paper 
                  key={chat.id} 
                  p="sm" 
                  radius="md" 
                  withBorder 
                  bg={chat.sender === 'defensor' ? theme.colors.green[0] : theme.colors.gray[0]}
                  style={{ alignSelf: chat.sender === 'defensor' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}
                >
                  <Group gap="xs" align="flex-start">
                    <ThemeIcon 
                      variant="light" 
                      color={chat.sender === 'defensor' ? 'green' : 'gray'} 
                      size="md"
                      radius="xl"
                    >
                      {chat.sender === 'defensor' ? <IconMessageChatbot size={18} /> : <IconMessageCircle size={18} />}
                    </ThemeIcon>
                    <Box style={{ flex: 1 }}>
                      <Text size="xs" fw={700}>{chat.name}</Text>
                      <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{chat.text}</Text>
                    </Box>
                  </Group>
                  <Text size="xs" c="dimmed" ta="right" mt={4}>{chat.timestamp}</Text>
                </Paper>
              ))}
            </Stack>
          </ScrollArea>

          <Textarea
            label="Mensagem"
            placeholder="Digite a mensagem aqui..."
            value={approvalMessageContent}
            onChange={(event) => setApprovalMessageContent(event.currentTarget.value)}
            minRows={4}
            autosize
            withAsterisk
          />

          <Group justify="space-between" mt="lg">
            <Button color="red" leftSection={<IconDoorExit size={16}/>} onClick={handleCloseApprovalModal}>
              Encerrar conversa
            </Button>
            <Group>
              <Button variant="default" onClick={handleCloseApprovalModal}>
                Fechar
              </Button>
              <Button leftSection={<IconSend size={16}/>} onClick={handleSendApprovalMessage}>
                Enviar Mensagem
              </Button>
            </Group>
          </Group>
        </Stack>
      </Modal>
    </>
  );
} 