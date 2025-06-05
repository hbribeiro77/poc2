'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Flex, Image, Group, Text,
  useMantineTheme,
  Radio,
  Textarea,
  Stack,
  Title,
  Paper,
  SimpleGrid,
  Button,
  Table,
  Badge,
  ActionIcon,
  Tooltip,
  ScrollArea,
  Affix,
  ThemeIcon,
  Modal,
  Avatar,
  Accordion,
  Checkbox,
  Select,
  TextInput
} from '@mantine/core';
import { 
  IconAlertCircle, 
  IconInfoCircle, 
  IconMessageDots,
  IconPlus,
  IconCheck,
  IconPencil,
  IconTrash,
  IconFileTypePdf,
  IconChartLine,
  IconBrandWhatsapp,
  IconX,
  IconDoorExit,
  IconMessageChatbot,
  IconMessageCircle,
  IconSend,
  IconCalendar
} from '@tabler/icons-react';
import Link from 'next/link';
import PastaHeader from '../../components/PastaHeader/PastaHeader';
import ModalConfirmacaoAssustadora from '../../components/ConfirmActionModal/ModalConfirmacaoAssustadora';
import { DatePickerInput } from '@mantine/dates';
import { Dropzone, PDF_MIME_TYPE } from '@mantine/dropzone';

// Dados de Exemplo INICIAL para passar ao PastaHeader
const initialPastaData = {
  area: "Cível",
  assistido: "BART SIMPSON",
  assunto: "DIREITO DA SAÚDE / Mental / Internação compulsória",
  descricao: "",
  status: "Ativa",
  motivoArquivamento: null,
  lastStatusChangeBy: null,
  lastStatusChangeAt: null,
  processo: "5000260-33.2019.8.21.0109",
  comarca: "Marau",
  orgaoJulgador: "Juízo da 2ª Vara Judicial da Comarca de Marau",
  classe: "Procedimento Comum",
  // Simulação de múltiplos contatos para a pasta
  contatos: [
    { id: 'assistido_principal', nome: "BART SIMPSON", relacao: "Assistido Principal" },
    { id: 'contato_secundario_1', nome: "HOMER SIMPSON", relacao: "Pai" },
    { id: 'contato_secundario_2', nome: "MARGE SIMPSON", relacao: "Mãe" },
  ],
  counts: {
      atendimentos: 0,
      pecas: 1,
      documentos: 0,
      observacoes: 0,
      assistidos: null,
      certidoes: null,
      processos: null,
      dadosPasta: null,
  }
};

// Dados mock para a tabela de atendimentos
const atendimentosData = [
  { id: 1, data: '14/10/2021', situacao: 'Rascunho', relato: 'Est et aut dolor. Quibusdam un...', providencia: 'Petição inicial', assistido: 'PRISCILLA AUFDERHAR...', defensoria: '1ª DEFENSORIA PÚBLICA DE BAGÉ' },
  { id: 2, data: '14/10/2021', situacao: 'Rascunho', relato: 'Quod quia sit. Ratione consequ...', providencia: 'Petição inicial', assistido: 'MR. KELVIN KASSULKE ...', defensoria: '1ª DEFENSORIA PÚBLICA DE BAGÉ' },
];

export default function PastaPage() {
  const [pastaData, setPastaData] = useState(initialPastaData);
  const theme = useMantineTheme();

  // Estado para controlar o layout da seção Dados (movido para cá)
  const [selectedLayout, setSelectedLayout] = useState('atual');

  // Estados dos Modais (simplificado)
  const [archiveModalOpened, setArchiveModalOpened] = useState(false);
  const [reactivateModalOpened, setReactivateModalOpened] = useState(false);
  const [motivoSelecionado, setMotivoSelecionado] = useState(null);
  const [archiveObservation, setArchiveObservation] = useState('');

  const [activePastaSection, setActivePastaSection] = useState(null);

  // Estados para o Modal de Chat WhatsApp
  const [isWhatsappChatModalOpen, setIsWhatsappChatModalOpen] = useState(false);
  const [whatsappChatHistory, setWhatsappChatHistory] = useState([]);
  const [whatsappMessageContent, setWhatsappMessageContent] = useState('');
  const [currentChatContactName, setCurrentChatContactName] = useState('');
  const [currentChatContactInitials, setCurrentChatContactInitials] = useState('');
  const assistidoWhatsappResponseTimeoutRef = useRef(null); // Para resposta automática

  // Estado para o modal de seleção de contato para o chat
  const [isContactSelectModalOpen, setIsContactSelectModalOpen] = useState(false);
  const [selectedContactIdForChat, setSelectedContactIdForChat] = useState(null);

  // Estado para o formulário de atendimento dentro do modal de chat
  const [atendimentoFormData, setAtendimentoFormData] = useState({
    data: null,
    defensoria: '',
    pessoa: '',
    processo: '',
    relato: '',
    providencia: '',
    detalhesProvidencia: '',
    formaAtendimento: '',
    urgente: false,
    documentos: [],
  });
  const [activeAccordionItems, setActiveAccordionItems] = useState([]);

  // Abre modal de arquivamento
  const handleOpenArchiveModal = () => {
    setMotivoSelecionado(null);
    setArchiveModalOpened(true);
  };
  // Fecha modal de arquivamento
  const handleCloseArchiveModal = () => {
    setArchiveModalOpened(false);
    setArchiveObservation('');
  };

  // Abre modal de desarquivamento
  const handleOpenReactivateModal = () => setReactivateModalOpened(true);
  // Fecha modal de desarquivamento
  const handleCloseReactivateModal = () => setReactivateModalOpened(false);

  // Confirma ARQUIVAMENTO
  const handleConfirmArchive = () => {
    if (!motivoSelecionado) return;
    const timestamp = new Date();
    const user = "Humberto Borges Ribeiro (3925811)"; // Idealmente, viria de um contexto de usuário
    console.log(`Arquivando pasta ${pastaData.processo} pelo motivo: ${motivoSelecionado}. Observação: ${archiveObservation}`);
    setPastaData({
      ...pastaData,
      status: 'Arquivada',
      motivoArquivamento: motivoSelecionado,
      observacaoArquivamento: archiveObservation,
      lastStatusChangeBy: user,
      lastStatusChangeAt: timestamp
    });
    handleCloseArchiveModal(); // Fecha o modal específico
  };

  // Confirma DESARQUIVAMENTO
  const handleConfirmReactivate = () => {
    const timestamp = new Date();
    const user = "Humberto Borges Ribeiro (3925811)"; // Idealmente, viria de um contexto de usuário
    setPastaData({
      ...pastaData,
      status: 'Ativa',
      motivoArquivamento: null,
      lastStatusChangeBy: user,
      lastStatusChangeAt: timestamp
    });
    handleCloseReactivateModal(); // Fecha o modal específico
  };

  // Função para lidar com a seleção de seção do PastaHeader
  const handleSectionSelect = (section) => {
    setActivePastaSection(prevSection => prevSection === section ? null : section);
  };

  // Adaptação da função getAssistidoInfo para a string do pastaData.assistido
  const getAssistidoInfoFromString = (nomeCompletoStr) => {
    if (!nomeCompletoStr) return { nome: 'Assistido', iniciais: 'AS' };
    const partesNome = nomeCompletoStr.trim().split(' ');
    const nome = nomeCompletoStr.trim();
    let iniciais = 'AS'; // Default
    if (partesNome.length > 0 && partesNome[0]) {
      iniciais = partesNome[0][0];
      if (partesNome.length > 1 && partesNome[partesNome.length - 1]) {
        iniciais += partesNome[partesNome.length - 1][0];
      } else if (partesNome[0].length > 1) {
        iniciais = partesNome[0].substring(0,2); // Pega as duas primeiras se nome único
      }
    }
    return { nome, iniciais: iniciais.toUpperCase() };
  };

  const handleOpenWhatsappChatModal = () => {
    const assistidoInfo = getAssistidoInfoFromString(pastaData.assistido);
    setCurrentChatContactName(assistidoInfo.nome);
    setCurrentChatContactInitials(assistidoInfo.iniciais);
    setWhatsappChatHistory([]); // Começa chat vazio
    setWhatsappMessageContent('');
    setIsWhatsappChatModalOpen(true);
  };

  const handleCloseWhatsappChatModal = () => {
    setIsWhatsappChatModalOpen(false);
    if (assistidoWhatsappResponseTimeoutRef.current) {
      clearTimeout(assistidoWhatsappResponseTimeoutRef.current);
      assistidoWhatsappResponseTimeoutRef.current = null;
    }
  };

  const handleSendWhatsappMessage = () => {
    if (!whatsappMessageContent.trim()) return;
    const newMessage = {
      id: `defensor-wp-${Date.now()}`,
      sender: 'defensor',
      name: 'Teste Defensor - Portal Defensor', // Pode ser dinâmico no futuro
      text: whatsappMessageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setWhatsappChatHistory(prev => [...prev, newMessage]);
    setWhatsappMessageContent('');

    // Limpa timeout anterior, se houver
    if (assistidoWhatsappResponseTimeoutRef.current) {
        clearTimeout(assistidoWhatsappResponseTimeoutRef.current);
    }

    // Resposta automática do assistido após 5 segundos
    assistidoWhatsappResponseTimeoutRef.current = setTimeout(() => {
      const assistidoResponse = {
        id: `assistido-wp-reply-${Date.now()}`,
        sender: 'assistido',
        name: currentChatContactName || 'Assistido',
        text: 'Sim, obrigado', // Mensagem mock de resposta
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setWhatsappChatHistory(prev => [...prev, assistidoResponse]);
      assistidoWhatsappResponseTimeoutRef.current = null;
    }, 5000);
  };

  // Limpa o histórico e outros estados do chat WhatsApp quando o modal é aberto/fechado (já coberto no open/close)
  // Este useEffect é para garantir limpeza se o modal fosse desmontado de outra forma, mas pode ser redundante
  useEffect(() => {
    if (!isWhatsappChatModalOpen) {
      setWhatsappChatHistory([]);
      setWhatsappMessageContent('');
      // setSelectedContactIdForChat(null); // Resetar contato selecionado ao fechar chat principal. Decidi não resetar aqui para permitir reabrir o chat com o mesmo contato se o modal for fechado acidentalmente.
      if (assistidoWhatsappResponseTimeoutRef.current) {
        clearTimeout(assistidoWhatsappResponseTimeoutRef.current);
        assistidoWhatsappResponseTimeoutRef.current = null;
      }
    }
  }, [isWhatsappChatModalOpen]);

  // Handler para mudanças nos campos do formulário de atendimento
  const handleAtendimentoFormChange = (field, value) => {
    setAtendimentoFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handler para upload de arquivos
  const handleDropzoneDrop = (files) => {
    setAtendimentoFormData(prev => ({ ...prev, documentos: [...prev.documentos, ...files] }));
    // Aqui você pode adicionar lógica para fazer upload dos arquivos para um servidor, etc.
    console.log('Documentos adicionados:', files);
  };

  const handleSaveRascunhoAtendimento = () => {
    console.log("Salvando rascunho do atendimento:", atendimentoFormData);
    // Adicionar lógica para salvar como rascunho
    alert("Rascunho do atendimento salvo (simulação)!");
  };

  const handleSaveAtendimento = () => {
    console.log("Salvando atendimento:", atendimentoFormData);
    // Adicionar lógica para salvar definitivamente
    // Poderia fechar o modal ou limpar o formulário após salvar
    alert("Atendimento salvo (simulação)!");
  };

  // Abre o MODAL DE SELEÇÃO DE CONTATO para o chat WhatsApp
  const handleOpenContactSelectModal = () => {
    setSelectedContactIdForChat(null); // Reseta a seleção anterior
    setIsContactSelectModalOpen(true);
  };

  // Fecha o MODAL DE SELEÇÃO DE CONTATO
  const handleCloseContactSelectModal = () => {
    setIsContactSelectModalOpen(false);
  };

  // Após selecionar o contato, PROSSEGUE PARA ABRIR O CHAT WHATSAPP
  const handleProceedToWhatsappChat = () => {
    if (!selectedContactIdForChat) {
      // Idealmente, o botão de "Iniciar Conversa" no modal de seleção estaria desabilitado
      console.error("Nenhum contato selecionado para o chat.");
      return;
    }
    const selectedContact = pastaData.contatos.find(c => c.id === selectedContactIdForChat);
    if (!selectedContact) {
      console.error("Contato selecionado não encontrado.");
      return;
    }

    const assistidoInfo = getAssistidoInfoFromString(selectedContact.nome);
    setCurrentChatContactName(assistidoInfo.nome);
    setCurrentChatContactInitials(assistidoInfo.iniciais);
    setWhatsappChatHistory([]); // Começa chat vazio
    setWhatsappMessageContent('');

    // Preencher automaticamente o campo "Pessoa" no formulário de atendimento
    handleAtendimentoFormChange('pessoa', selectedContact.nome);
    // Abrir a primeira seção do Accordion por padrão
    setActiveAccordionItems(['dados-iniciais']); 
    
    handleCloseContactSelectModal(); // Fecha o modal de seleção
    setIsWhatsappChatModalOpen(true); // Abre o modal de chat principal
  };

  return (
    <>
      <Flex gap={0} pb="xl">
        {/* Coluna Esquerda */}
        <Box style={{ maxWidth: 250, height: '100%' }}>
          <Image src="/menulateral.png" alt="Menu Lateral" height="70%" fit="contain" />
        </Box>

        {/* Coluna Direita */}
        <Box style={{ flex: 1, paddingLeft: theme.spacing.md, paddingRight: theme.spacing.md }}>
          {/* Renderiza o componente PastaHeader passando a prop renomeada */}
          <PastaHeader
            pastaData={pastaData}
            onOpenArchiveModal={handleOpenArchiveModal}
            onOpenReactivateConfirmModal={handleOpenReactivateModal}
            dadosLayout={selectedLayout}
            onSectionSelect={handleSectionSelect}
          />

          {/* Seção de Atendimentos Condicional */}
          {activePastaSection === 'atendimentos' && (
            <Paper p="md" mt="lg" shadow="sm" withBorder>
              <Group mb="md">
                <ThemeIcon variant="light" size="xl" color="teal">
                  <IconMessageDots style={{ width: '70%', height: '70%' }} />
                </ThemeIcon>
                <Title order={3} c="teal.7">Atendimentos</Title>
              </Group>

              <ScrollArea>
                <Table striped highlightOnHover withColumnBorders verticalSpacing="xs" miw={900}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Data</Table.Th>
                      <Table.Th>Situação</Table.Th>
                      <Table.Th>Relato do assistido</Table.Th>
                      <Table.Th>Providência</Table.Th>
                      <Table.Th>Assistido</Table.Th>
                      <Table.Th>Defensoria</Table.Th>
                      <Table.Th style={{ textAlign: 'center' }}>Ações</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {atendimentosData.map((item) => (
                      <Table.Tr key={item.id}>
                        <Table.Td>{item.data}</Table.Td>
                        <Table.Td><Badge color="orange" variant="light">{item.situacao}</Badge></Table.Td>
                        <Table.Td><Text truncate="end" style={{maxWidth: 150}}>{item.relato}</Text></Table.Td>
                        <Table.Td>{item.providencia}</Table.Td>
                        <Table.Td><Text truncate="end" style={{maxWidth: 150}}>{item.assistido}</Text></Table.Td>
                        <Table.Td><Text truncate="end" style={{maxWidth: 150}}>{item.defensoria}</Text></Table.Td>
                        <Table.Td>
                          <Group gap="xs" justify="center" wrap="nowrap">
                            <Tooltip label="Adicionar Providência" withArrow><ActionIcon variant="subtle" color="gray"><IconPlus size={16} /></ActionIcon></Tooltip>
                            <Tooltip label="Detalhes do Atendimento" withArrow><ActionIcon variant="subtle" color="gray"><IconInfoCircle size={16} /></ActionIcon></Tooltip>
                            <Tooltip label="Registrar Ciência" withArrow><ActionIcon variant="subtle" color="gray"><IconCheck size={16} /></ActionIcon></Tooltip>
                            <Tooltip label="Editar Atendimento" withArrow><ActionIcon variant="subtle" color="gray"><IconPencil size={16} /></ActionIcon></Tooltip>
                            <Tooltip label="Excluir Atendimento" withArrow><ActionIcon variant="subtle" color="red"><IconTrash size={16} /></ActionIcon></Tooltip>
                            <Tooltip label="Gerar PDF do Atendimento" withArrow><ActionIcon variant="subtle" color="gray"><IconFileTypePdf size={16} /></ActionIcon></Tooltip>
                            <Tooltip label="Visualizar Histórico" withArrow><ActionIcon variant="subtle" color="gray"><IconChartLine size={16} /></ActionIcon></Tooltip>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              <Group justify="flex-end" mt="xl">
                <Button 
                  variant="filled" 
                  color="teal.8"
                  leftSection={<IconBrandWhatsapp size={18} />}
                  onClick={handleOpenContactSelectModal}
                >
                  WhatsApp
                </Button>
                <Button color="teal" leftSection={<IconPlus size={18} />}>
                  Novo atendimento
                </Button>
              </Group>
            </Paper>
          )}
        </Box>
      </Flex>

      {/* Controle de Layout (Movido para cá) */}
      <Group justify="center" mt="xl">
         <Radio.Group
           name="layoutSelector"
           label={<Text fw={500} size="sm">Selecionar Layout para Dados da Pasta:</Text>}
           value={selectedLayout}
           onChange={setSelectedLayout}
         >
          <Group mt="xs">
            <Radio value="atual" label="Layout Atual" />
            <Radio value="colunas" label="Layout em Colunas" />
            <Radio value="agrupado" label="Layout Agrupado (com Divisor)" />
          </Group>
        </Radio.Group>
      </Group>

      {/* Link Voltar (sem o checkbox) */}
      <Group justify="center" mt="xl" pb="xl">
        <Link href="/">
          <Text c="dimmed" size="sm">Voltar para a Central</Text>
        </Link>
      </Group>

      {/* Modal de Confirmação de ARQUIVAMENTO */}
      <ModalConfirmacaoAssustadora
        opened={archiveModalOpened}
        onClose={handleCloseArchiveModal}
        onConfirm={handleConfirmArchive}
        title="Confirmar Arquivamento de Pasta"
        alertIcon={<IconAlertCircle size={16} style={{ color: theme.colors.yellow[8] }}/>}
        alertColor="yellow"
        alertMessage="Atenção! Arquivar a pasta a oculta na lista de pastas de seus assistidos e tem impacto direto nos relatórios de inteligência de negócio."
        checkboxLabel="Declaro ciência das implicações e confirmo o arquivamento desta pasta."
        confirmButtonLabel="Confirmar Arquivamento"
      >
        <Stack gap="xs">
         <Radio.Group
           value={motivoSelecionado}
           onChange={setMotivoSelecionado}
           label="Selecione o motivo do arquivamento:"
           withAsterisk
         >
           <Stack mt="xs">
              {/* Usa os mesmos motivos definidos no PastaHeader */}
             {[ 
                'Conclusão do Caso/Atendimento',
                'Perda de Contato com o Assistido',
                'Encaminhamento para Outro Órgão/Setor',
                'Arquivamento Administrativo'
             ].map((motivo) => (
               <Radio key={motivo} value={motivo} label={<Text fw={700} size="sm">{motivo}</Text>} />
             ))}
           </Stack>
         </Radio.Group>

         <Textarea
            label="Observação adicional (opcional):"
            value={archiveObservation}
            onChange={(event) => setArchiveObservation(event.currentTarget.value)}
            autosize
            minRows={2}
            mt="md"
         />

         <Text size="sm"> 
           Todas as alterações são auditadas e sujeitas a revisão.
         </Text>
       </Stack>
     </ModalConfirmacaoAssustadora>

      {/* Modal de Confirmação de DESARQUIVAMENTO (estilo assustador, textos originais restaurados) */}
      <ModalConfirmacaoAssustadora
        opened={reactivateModalOpened}
        onClose={handleCloseReactivateModal}
        onConfirm={handleConfirmReactivate}
        title="Confirmar Desarquivamento de Pasta"
        alertIcon={<IconAlertCircle size={16} style={{ color: theme.colors.yellow[8] }}/>}
        alertColor="yellow"
        alertMessage="Atenção: Desarquivar a pasta a torna visível na lista de pastas de seus assistidos e tem impacto direto nos relatórios de inteligência de negócio."
        bodyText={`A pasta foi arquivada pelo motivo: ${pastaData.motivoArquivamento || 'Não especificado'}. Confirma o desarquivamento?`}
        checkboxLabel="Declaro ciência das implicações e confirmo o desarquivamento desta pasta."
        confirmButtonLabel="Confirmar Desarquivamento"
      />

      {/* FAB para Novo Atendimento */}
      {activePastaSection === 'atendimentos' && (
        <Affix position={{ bottom: theme.spacing.xl, right: theme.spacing.xl }}>
          <Tooltip label="Novo Atendimento" withArrow position="left">
            <ActionIcon size="xl" radius="xl" color="teal" variant="filled" onClick={() => console.log('FAB Novo Atendimento Clicado')}>
              <IconPlus style={{ width: '60%', height: '60%' }} />
            </ActionIcon>
          </Tooltip>
        </Affix>
      )}

      {/* Modal de Chat WhatsApp */}
      <Modal
        opened={isWhatsappChatModalOpen}
        onClose={handleCloseWhatsappChatModal}
        size="lg"
        centered
        padding={0}
        withCloseButton={false}
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
                <IconBrandWhatsapp size={20} color={theme.white}/>
                <Text fw={700} c="white">Conversa com {currentChatContactName}</Text>
            </Group>
            <ActionIcon variant="transparent" onClick={handleCloseWhatsappChatModal} aria-label="Fechar modal">
              <IconX size={20} color={theme.white} />
            </ActionIcon>
          </Group>
        </Box>

        <Stack p="md" gap="lg">
          <Text size="sm"><Text fw={700} component="span">Autor:</Text> Teste Defensor - Portal Defensor</Text>
          <Group gap="sm" align="center">
            <Text size="sm" fw={700} component="span">Assistido:</Text>
            <Avatar color="blue" radius="xl" size="sm">{currentChatContactInitials}</Avatar>
            <Text size="sm">{currentChatContactName}</Text>
          </Group>

          {/* Formulário de Atendimento - REORDENADO PARA O TOPO */}
          <Accordion 
            variant="separated" 
            multiple 
            value={activeAccordionItems} 
            onChange={setActiveAccordionItems}
            // mt="lg" // Removido, pois agora está no topo
            // mb="lg" // Removido, pois agora está no topo
          >
            {/* 1. Dados Iniciais do Atendimento */}
            <Accordion.Item value="dados-iniciais">
              <Accordion.Control>Dados Iniciais do Atendimento</Accordion.Control>
              <Accordion.Panel>
                <Stack gap="sm">
                  <DatePickerInput
                    label="Data do Atendimento"
                    placeholder="Selecione a data"
                    value={atendimentoFormData.data}
                    onChange={(value) => handleAtendimentoFormChange('data', value)}
                    icon={<IconCalendar size="1rem" />}
                    withAsterisk
                  />
                  <TextInput
                    label="Defensoria"
                    placeholder="Nome da defensoria"
                    value={atendimentoFormData.defensoria}
                    onChange={(event) => handleAtendimentoFormChange('defensoria', event.currentTarget.value)}
                  />
                  <TextInput 
                    label="Pessoa" // Renomeado de "Pessoa Atendida"
                    placeholder="Nome da pessoa"
                    value={atendimentoFormData.pessoa} // Será preenchido automaticamente
                    onChange={(event) => handleAtendimentoFormChange('pessoa', event.currentTarget.value)}
                  />
                  {/* Campo Processo foi movido para "Registro Detalhado" */}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>

            {/* 2. Área de Chat - VEM APÓS DADOS INICIAIS */}
            {/* Note que o Accordion continua abaixo, esta é apenas uma marcação lógica de ordem */}
          </Accordion>

          <ScrollArea mah={300} mt="sm" mb="sm" type="auto" offsetScrollbars>
            <Stack gap="md" p="xs">
              {whatsappChatHistory.map((chat) => (
                <Paper 
                  key={chat.id} 
                  p="sm" 
                  radius="md" 
                  withBorder 
                  bg={chat.sender === 'defensor' ? theme.colors.green[0] : theme.colors.gray[0]}
                  style={{ alignSelf: chat.sender === 'defensor' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}
                >
                  <Group gap="xs" align="flex-start" wrap="nowrap">
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

          {/* Continuação do Formulário de Atendimento - Abaixo do Chat */}
          <Accordion 
            variant="separated" 
            multiple 
            value={activeAccordionItems} 
            onChange={setActiveAccordionItems}
            // mt="lg" // Já definido no Accordion principal ou remover se for o mesmo container
            // mb="lg"
          >
            {/* Item vazio para manter a estrutura caso o primeiro Accordion seja removido no futuro */}
            {/* <Accordion.Item value="placeholder-chat-separator"></Accordion.Item> */}

            {/* 3. Registro Detalhado do Atendimento */}
            <Accordion.Item value="registro-detalhado">
              <Accordion.Control>Registro Detalhado do Atendimento</Accordion.Control>
              <Accordion.Panel>
                <Stack gap="sm">
                  <Textarea
                    label="Relato do Assistido"
                    placeholder="Descreva o relato do assistido"
                    value={atendimentoFormData.relato}
                    onChange={(event) => handleAtendimentoFormChange('relato', event.currentTarget.value)}
                    autosize
                    minRows={2}
                    withAsterisk
                  />
                  <TextInput
                    label="Providência Adotada"
                    placeholder="Descreva a providência"
                    value={atendimentoFormData.providencia}
                    onChange={(event) => handleAtendimentoFormChange('providencia', event.currentTarget.value)}
                    withAsterisk
                  />
                  <Textarea
                    label="Detalhes da Providência"
                    placeholder="Detalhes adicionais sobre a providência"
                    value={atendimentoFormData.detalhesProvidencia}
                    onChange={(event) => handleAtendimentoFormChange('detalhesProvidencia', event.currentTarget.value)}
                    autosize
                    minRows={2}
                  />
                  <Select
                    label="Forma de Atendimento"
                    placeholder="Selecione a forma"
                    value={atendimentoFormData.formaAtendimento}
                    onChange={(value) => handleAtendimentoFormChange('formaAtendimento', value)}
                    data={['Presencial', 'Telefone', 'WhatsApp', 'E-mail', 'Outro']}
                  />
                  <TextInput // Movido para cá
                    label="Processo Vinculado (opcional)"
                    placeholder="Número do processo"
                    value={atendimentoFormData.processo}
                    onChange={(event) => handleAtendimentoFormChange('processo', event.currentTarget.value)}
                  />
                  <Checkbox
                    mt="xs"
                    label="Atendimento Urgente"
                    checked={atendimentoFormData.urgente}
                    onChange={(event) => handleAtendimentoFormChange('urgente', event.currentTarget.checked)}
                  />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>

            {/* 4. Documentos Entregues Durante o Atendimento */}
            <Accordion.Item value="documentos">
              <Accordion.Control>Documentos Entregues Durante o Atendimento</Accordion.Control>
              <Accordion.Panel>
                <Dropzone
                  onDrop={handleDropzoneDrop}
                  onReject={(files) => console.log('rejected files', files)}
                  maxSize={5 * 1024 ** 2} // 5MB
                  accept={PDF_MIME_TYPE} // Aceita apenas PDFs, pode ser expandido
                >
                  <Group justify="center" gap="xl" mih={150} style={{ pointerEvents: 'none' }}>
                    <Dropzone.Accept>
                      <IconCheck
                        style={{ width: 50, height: 50, color: theme.colors.blue[6] }}
                      />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX
                        style={{ width: 50, height: 50, color: theme.colors.red[6] }}
                      />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <IconFileTypePdf style={{ width: 50, height: 50 }} />
                    </Dropzone.Idle>
                    <div>
                      <Text size="xl" inline>
                        Arraste arquivos PDF aqui ou clique para selecionar
                      </Text>
                      <Text size="sm" c="dimmed" inline mt={7}>
                        Anexe documentos relevantes (limite de 5MB por arquivo)
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
                {atendimentoFormData.documentos.length > 0 && (
                  <Stack mt="md">
                    <Text size="sm" fw={500}>Documentos Selecionados:</Text>
                    {atendimentoFormData.documentos.map((file, index) => (
                      <Paper key={index} p="xs" withBorder shadow="xs">
                        <Group justify="space-between">
                           <Text size="sm" truncate>{file.name} ({(file.size / 1024).toFixed(2)} KB)</Text>
                           <ActionIcon 
                             color="red" 
                             size="sm" 
                             onClick={() => {
                               const newFiles = [...atendimentoFormData.documentos];
                               newFiles.splice(index, 1);
                               handleAtendimentoFormChange('documentos', newFiles);
                             }}
                           >
                             <IconX size={14} />
                           </ActionIcon>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          
          {/* 5. Botões de Ação para o Formulário de Atendimento - REPOSICIONADOS */}
          {activeAccordionItems.length > 0 && (
            <Group justify="flex-end" mt="md" mb="md"> {/* Adicionado mb="md" para separar da Textarea do chat */}
                <Button variant="default" onClick={handleSaveRascunhoAtendimento}>
                    Salvar Rascunho Atendimento
                </Button>
                <Button color="blue" onClick={handleSaveAtendimento}>
                    Salvar Atendimento
                </Button>
            </Group>
          )}

          {/* Textarea e botões de ação do CHAT permanecem no final */}
          <Textarea
            placeholder={`Mensagem para ${currentChatContactName}...`}
            value={whatsappMessageContent}
            onChange={(event) => setWhatsappMessageContent(event.currentTarget.value)}
            minRows={2}
            autosize
          />

          {/* Rodapé do Modal com os 3 botões */}
          <Group justify="space-between" mt="lg">
            <Button 
              color="red" 
              leftSection={<IconDoorExit size={16}/>} 
              onClick={handleCloseWhatsappChatModal} // Pode ter uma lógica diferente se "Encerrar" for mais que fechar
            >
              Encerrar conversa
            </Button>
            <Group>
              <Button variant="default" onClick={handleCloseWhatsappChatModal}>
                Fechar
              </Button>
              <Button 
                leftSection={<IconSend size={16}/>} 
                onClick={handleSendWhatsappMessage} 
                disabled={!whatsappMessageContent.trim()}
              >
                Enviar Mensagem
              </Button>
            </Group>
          </Group>
        </Stack>
      </Modal>

      {/* Modal de Seleção de Contato para Chat WhatsApp */}
      <Modal
        opened={isContactSelectModalOpen}
        onClose={handleCloseContactSelectModal}
        title={<Text fw={700}>Iniciar Conversa no WhatsApp</Text>}
        centered
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm">Selecione com quem você deseja conversar:</Text>
          <Radio.Group
            value={selectedContactIdForChat}
            onChange={setSelectedContactIdForChat}
            name="contactSelectRadioGroup"
            label="Contatos da Pasta"
            withAsterisk
          >
            <Stack mt="xs">
              {pastaData.contatos && pastaData.contatos.length > 0 ? (
                pastaData.contatos.map((contato) => (
                  <Radio 
                    key={contato.id} 
                    value={contato.id} 
                    label={`${contato.nome} (${contato.relacao || 'Não especificado'})`} 
                  />
                ))
              ) : (
                <Text c="dimmed" size="sm">Nenhum contato disponível nesta pasta.</Text>
              )}
            </Stack>
          </Radio.Group>
          
          <Group justify="flex-end" mt="lg">
            <Button variant="default" onClick={handleCloseContactSelectModal}>
              Cancelar
            </Button>
            <Button 
              onClick={handleProceedToWhatsappChat}
              disabled={!selectedContactIdForChat || !pastaData.contatos || pastaData.contatos.length === 0}
            >
              Iniciar Conversa
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}