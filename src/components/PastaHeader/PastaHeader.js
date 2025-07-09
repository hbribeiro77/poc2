'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Title, Text, Group, ThemeIcon, Paper,
  ActionIcon, Grid, Stack, UnstyledButton, useMantineTheme,
  Badge, Tooltip,
  Menu,
  Select,
  Textarea,
  Button,
  Divider,
  Flex,
  Modal,
  ScrollArea
} from '@mantine/core';
import {
  IconTrash, IconPlus, IconUser, IconMessageChatbot, IconFileText,
  IconLicense, IconFile, IconMessageCircle, IconScale, IconInfoCircle, IconChevronLeft,
  IconAlertTriangle, IconArchive, IconArchiveOff, IconFileDescription, IconNotes, IconClipboardText,
  IconBrandWhatsapp, IconLayoutDashboard, IconDotsVertical
} from '@tabler/icons-react';

// IMPORTA o componente PastaActionButton de seu novo local
import PastaActionButton from '../PastaActionButton/PastaActionButton';
import SendMessageModal from '../SendMessageModal/SendMessageModal';
import { useChatManager } from '../../hooks/useChatManager';

// --- Componente Principal PastaHeader ---
export default function PastaHeader({ pastaData, onOpenReactivateConfirmModal, onOpenArchiveModal, dadosLayout, onSectionSelect, showVisaoGeralButton }) {
  const { openChat } = useChatManager();
  const [isDadosVisible, setIsDadosVisible] = useState(false);
  const [editedArea, setEditedArea] = useState(pastaData?.area || '');
  const [editedAssunto, setEditedAssunto] = useState(pastaData?.assunto || '');
  const [editedDescricao, setEditedDescricao] = useState(pastaData?.descricao || '');
  const [infoModalOpened, setInfoModalOpened] = useState(false);
  const [sendMessageModalOpen, setSendMessageModalOpen] = useState(false);
  const [selectedContactForMessage, setSelectedContactForMessage] = useState(null);
  const theme = useMantineTheme();

  // Sincroniza estado de edição se pastaData mudar externamente
  useEffect(() => {
    if (pastaData) {
      setEditedArea(pastaData.area || '');
      setEditedAssunto(pastaData.assunto || '');
      setEditedDescricao(pastaData.descricao || '');
    }
  }, [pastaData]);

  // Verifica se pastaData existe para evitar erros
  if (!pastaData) {
    return null; // Ou renderizar um estado de carregamento/vazio
  }

  const isAtiva = pastaData.status === 'Ativa';
  const archiveButtonLabel = isAtiva ? 'Arquivar Pasta' : 'Desarquivar Pasta';
  const ArchiveIcon = isAtiva ? IconArchive : IconArchiveOff;

  // Motivos de arquivamento
  const motivosArquivamento = [
    'Conclusão do Caso/Atendimento',
    'Perda de Contato com o Assistido',
    'Encaminhamento para Outro Órgão/Setor',
    'Arquivamento Administrativo'
  ];

  // Função para formatar a data/hora para o tooltip
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('pt-BR'); // Formato local brasileiro (só data)
  };

  // Handlers para a seção Dados da Pasta
  const handleDadosClick = () => {
    setIsDadosVisible(!isDadosVisible);
    // Resetar ao abrir/fechar, caso não tenha salvo
    if (pastaData) {
        setEditedArea(pastaData.area || '');
        setEditedAssunto(pastaData.assunto || '');
        setEditedDescricao(pastaData.descricao || '');
    }
  };

  const handleDadosCancel = () => {
    setIsDadosVisible(false);
    // Resetar campos
    if (pastaData) {
        setEditedArea(pastaData.area || '');
        setEditedAssunto(pastaData.assunto || '');
        setEditedDescricao(pastaData.descricao || '');
    }
  };

  const handleDadosSave = () => {
    console.log("Salvando Dados da Pasta:", { 
        area: editedArea, 
        assunto: editedAssunto, 
        descricao: editedDescricao 
    });
    // Aqui chamaria uma função para atualizar pastaData real (via prop)
    setIsDadosVisible(false);
  };

  // Handlers para a Modal de Informações
  const openInfoModal = () => setInfoModalOpened(true);
  const closeInfoModal = () => setInfoModalOpened(false);

  const handleOpenApprovalChat = (contact) => {
    // Cria um objeto `pasta` com a estrutura esperada pelo openChat
    const chatPastaData = {
      id: `${pastaData.numeroProcesso}-${contact.id}`, // ID único para o chat
      assistido: contact.nome,
      telefone: contact.telefone,
      processoPrincipal: pastaData.numeroProcesso,
      assunto: `Aprovação de Peça - ${pastaData.assunto}`,
      descricao: `Conversa para aprovação de peça com ${contact.nome}.`,
    };
    openChat(chatPastaData, { 
      initialMessage: 'Olá! Preciso da sua aprovação para a seguinte providência: [Descrição da Providência]. Você aprova?',
      templateType: 'peca' 
    });
  };

  /* == Bloco de Conteúdo: Informações de Leitura == */
  const readOnlyInfo = (
      <Stack gap="xs" mb="md" pr={0}>
        {/* Ordem Solicitada */}
        <Text size="sm"><Text span fw={500}>Data de criação:</Text> {pastaData.dataCriacao ? formatTimestamp(pastaData.dataCriacao) : '01/01/2023 10:00:00'}</Text>
        <Text size="sm"><Text span fw={500}>Criado por:</Text> {pastaData.criadoPor || 'Usuário Sistema (12345)'}</Text>
        <Text size="sm"><Text span fw={500}>Defensoria:</Text> {pastaData.defensoria || 'Defensoria Exemplo POA'}</Text>
        {/* Status e Detalhes de Arquivamento */}
        {pastaData.status !== 'Ativa' && (
           <>
             <Text size="sm"><Text span fw={500}>Status:</Text> Arquivada</Text>
             <Text size="sm"><Text span fw={500}>Data de Arquivamento:</Text> {formatTimestamp(pastaData.lastStatusChangeAt) || 'N/A'}</Text>
             {/* Motivo com observação opcional em itálico */}
             <Text size="sm">
                <Text span fw={500}>Motivo do Arquivamento:</Text> {pastaData.motivoArquivamento || 'N/A'}
                {pastaData.observacaoArquivamento && (
                  <Text span style={{ fontStyle: 'italic', marginLeft: '4px' }}>
                    ({pastaData.observacaoArquivamento})
                  </Text>
                )}
             </Text>
             <Text size="sm"><Text span fw={500}>Arquivado por:</Text> {pastaData.lastStatusChangeBy || 'N/A'}</Text>
           </>
        )}
        {pastaData.status === 'Ativa' && (
            <Text size="sm"><Text span fw={500}>Status:</Text> Ativa</Text> 
        )}
      </Stack>
  );

  /* == Bloco de Conteúdo: Campos Editáveis == */
  const editableFields = (
      <Stack gap="md" pl={0}>
          <Select
              label="Área"
              placeholder="Selecione a área"
              value={editedArea}
              onChange={(value) => setEditedArea(value || '')}
              data={['Cível', 'Criminal', 'Trabalhista', 'Família', 'Previdenciário']} // Placeholder
              clearable
          />
          <Select
              label="Assunto CNJ"
              placeholder="Selecione ou digite o assunto"
              value={editedAssunto}
              onChange={(value) => setEditedAssunto(value || '')}
              data={[
                  'DIREITO CIVIL / Obrigações / Espécies de Contratos',
                  'DIREITO PENAL / Crimes contra a vida / Homicídio Qualificado',
                  'DIREITO DO TRABALHO / Contrato Individual de Trabalho / Reclamatória Trabalhista',
                  'DIREITO DE FAMÍLIA / Casamento / Divórcio Litigioso',
                  'DIREITO DO CONSUMIDOR / Contratos de Consumo / Telefonia',
                  'DIREITO DA SAÚDE / Mental / Internação compulsória' // Adicionado do exemplo
              ]} // Placeholder
              searchable
              clearable
          />
          {/* Omitindo o terceiro Select vazio da imagem */}
          <Textarea
              label="Descrição adicional"
              placeholder="Digite uma descrição adicional para a pasta"
              value={editedDescricao}
              onChange={(event) => setEditedDescricao(event.currentTarget.value)}
              autosize
              minRows={3}
          />
      </Stack>
  );

  // Definindo estilos da modal aqui para ter acesso ao theme
  const infoModalStyles = {
    header: { backgroundColor: theme.colors.dark[6] },
    title: { color: theme.white, fontWeight: 700 },
    close: {
      color: theme.white,
      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
    },
  };

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      {/* 1. Cabeçalho */}
      <Group justify="space-between" mb="md">
          <Group gap="xs">
              <ActionIcon variant="subtle" color="gray" size="lg">
                  <IconChevronLeft />
              </ActionIcon>
              <Title order={3}>Pasta {pastaData.area}</Title>
          </Group>
        <Group>
          {/* Ícone de Informação Adicionado */}
          <Tooltip label="Ver informações da pasta" withArrow position="bottom">
             <ActionIcon 
                variant="default" 
                size="lg" 
                aria-label="Ver informações da pasta" 
                onClick={openInfoModal}
              >
                  <IconInfoCircle stroke={1.5} />
             </ActionIcon>
           </Tooltip>

          {/* Botão Arquivar/Reativar com Menu condicional -> Agora onClick direto */}
          {isAtiva ? (
                <Tooltip label={archiveButtonLabel} withArrow position="bottom">
                  <ActionIcon
                    variant="default"
                    size="lg"
                    aria-label={archiveButtonLabel}
                onClick={onOpenArchiveModal}
                  >
                    <ArchiveIcon stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
          ) : (
            // Se não estiver ativa, botão chama onOpenReactivateConfirmModal
            <Tooltip label={archiveButtonLabel} withArrow position="bottom">
              <ActionIcon
                variant="default"
                size="lg"
                aria-label={archiveButtonLabel}
                onClick={onOpenReactivateConfirmModal}
              >
                <ArchiveIcon stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          )}

          {/* Botões existentes */}
          <Tooltip label="Excluir Pasta" withArrow position="bottom">
            <ActionIcon variant="default" size="lg" aria-label="Excluir Pasta"><IconTrash stroke={1.5} /></ActionIcon>
          </Tooltip>
          <Tooltip label="Adicionar Novo Item" withArrow position="bottom">
            <ActionIcon variant="default" size="lg" aria-label="Adicionar"><IconPlus stroke={1.5} /></ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {/* 2. Bloco de Informações */}
      <Grid gutter="lg" mb="md">
          {/* Coluna Assistido */}
          <Grid.Col span={{ base: 12, md: 4 }}>
              <Group wrap="nowrap" align="flex-start">
              <ThemeIcon variant="light" size="lg" radius="xl"><IconUser stroke={1.5} /></ThemeIcon>
              <Stack gap={2}>
                  {pastaData.contatos && pastaData.contatos.map((contato) => {
                    const relacao = contato.relacao === 'Assistido Principal' ? 'Assistido' : 'Familiar';
                    return (
                      <Box key={contato.id} mb={8}>
                        <Group gap="xs" align="baseline">
                          <Text fw={500} size="sm">{contato.nome}</Text>
                          <Group gap={4} align="center">
                            <Text size="xs" c="dimmed">{contato.telefone}</Text>
                            {contato.hasWhatsapp && (
                              <ActionIcon
                                variant="subtle"
                                color="green"
                                size="sm"
                                onClick={() => {
                                  setSelectedContactForMessage(contato);
                                  setSendMessageModalOpen(true);
                                }}
                              >
                                <IconBrandWhatsapp size={14} color={theme.colors.green[6]} />
                              </ActionIcon>
                            )}
                          </Group>
                        </Group>
                        <Text size="xs" c="dimmed">{relacao}</Text>
                      </Box>
                    );
                  })}
              </Stack>
              </Group>
          </Grid.Col>
            {/* Coluna Assunto/Status */}
          <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="xs">
              <Group gap="xs"><Text size="xs" fw={700} w={70}>Assunto</Text><Text size="xs">{pastaData.assunto}</Text></Group>
              <Group gap="xs"><Text size="xs" fw={700} w={70}>Descrição</Text><Text size="xs">{pastaData.descricao || '-'}</Text></Group>
              <Group gap="xs" align="center">
                <Text size="xs" fw={700} w={70}>Status</Text>
                 <Badge color={pastaData.status === 'Ativa' ? 'green' : 'gray'} variant="light" size="sm">
                    {pastaData.status}
                  </Badge>
              </Group>
              </Stack>
          </Grid.Col>
          {/* Coluna Processo */}
          <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="xs">
              <Group gap="xs"><Text size="xs" fw={700} w={100}>Processo</Text><Text size="xs">{pastaData.processo}</Text></Group>
              <Group gap="xs"><Text size="xs" fw={700} w={100}>Comarca</Text><Text size="xs">{pastaData.comarca}</Text></Group>
              <Group gap="xs"><Text size="xs" fw={700} w={100}>Órgão Julgador</Text><Text size="xs">{pastaData.orgaoJulgador}</Text></Group>
              <Group gap="xs"><Text size="xs" fw={700} w={100}>Classe</Text><Text size="xs">{pastaData.classe}</Text></Group>
              </Stack>
          </Grid.Col>
      </Grid>

      <Divider my="md" />

      {/* 4. Barra de Botões */}
      <Group justify="center">
        <ScrollArea>
          <Group gap="xs" wrap="nowrap">
            {showVisaoGeralButton && (
              <PastaActionButton
                title="Visão Geral"
                icon={IconLayoutDashboard}
                onClick={() => onSectionSelect('visaoGeral')}
                isActive={dadosLayout === 'visaoGeral'}
              />
            )}
            <PastaActionButton
              title="Assistidos, parte adversa e qualificação"
              icon={IconUser}
              onClick={() => onSectionSelect('assistidos')}
              isActive={dadosLayout === 'assistidos'}
            />
            <PastaActionButton
              title="Atendimentos"
              icon={IconMessageChatbot}
              count={pastaData.counts.atendimentos}
              onClick={() => onSectionSelect('atendimentos')}
              isActive={dadosLayout === 'atendimentos'}
            />
            <PastaActionButton
              title="Peças e ofícios"
              icon={IconFileText}
              count={pastaData.counts.pecas}
              onClick={() => onSectionSelect('pecas')}
              isActive={dadosLayout === 'pecas'}
            />
            <PastaActionButton
              title="Requisição de certidões"
              icon={IconLicense}
              alert
              onClick={() => onSectionSelect('certidoes')}
              isActive={dadosLayout === 'certidoes'}
            />
            <PastaActionButton
              title="Documentos"
              icon={IconFile}
              count={pastaData.counts.documentos}
              onClick={() => onSectionSelect('documentos')}
              isActive={dadosLayout === 'documentos'}
            />
            <PastaActionButton
              title="Observações"
              icon={IconMessageCircle}
              count={pastaData.counts.observacoes}
              onClick={() => onSectionSelect('observacoes')}
              isActive={dadosLayout === 'observacoes'}
            />
            <PastaActionButton
              title="Processos"
              icon={IconScale}
              onClick={() => onSectionSelect('processos')}
              isActive={dadosLayout === 'processos'}
            />
            <PastaActionButton
              title="Dados da pasta"
              icon={IconClipboardText}
              onClick={handleDadosClick}
              isActive={isDadosVisible}
            />
          </Group>
        </ScrollArea>
      </Group>

      {/* 5. Seção de Dados da Pasta (Condicional) */}
      {isDadosVisible && (
        <Paper withBorder p="md" mt="lg" radius="md">
          {/* Título Fixo */}
           <Group justify="space-between" mb="md">
               <Group>
                   <ThemeIcon variant="light"><IconClipboardText size={20} /></ThemeIcon>
                   <Title order={5}>Dados da Pasta</Title>
               </Group>
                {/* Poderia ter um botão de fechar aqui também */}
           </Group>

           {/* == Renderização Condicional do Layout == */} 
           {dadosLayout === 'atual' && (
              <>
                  {readOnlyInfo}
                  {editableFields}
              </>
           )}

           {/* == Renderização Condicional do Layout (usando prop) == */}
            {dadosLayout === 'colunas' && (
                <Flex gap="md" direction={{ base: 'column', md: 'row' }}> { /* Restaurado gap, Empilha em mobile */}
                    {/* Coluna Esquerda: Edição (INVERTIDO) */}
                    <Box style={{ flex: 1 }}> { /* Removido padding */}
                       {editableFields}
                    </Box>

                    {/* Divisor Vertical */}
                    <Divider orientation="vertical" />

                    {/* Coluna Direita: Informações (INVERTIDO) */}
                    <Box style={{ flex: 1 }}> { /* Removido padding */}
                       {readOnlyInfo}
                    </Box>
                </Flex>
            )}

            {dadosLayout === 'agrupado' && (
                <>
                    {readOnlyInfo}
                    <Divider my="md" label="Editar Dados" labelPosition="center" />
                    {editableFields}
                </>
            )}

           {/* Botões Fixos */}
           <Group justify="flex-end" mt="lg">
               <Button variant="default" onClick={handleDadosCancel}>
                   Cancelar
               </Button>
               <Button color="teal" onClick={handleDadosSave}>
                   Salvar
               </Button>
    </Group>
        </Paper>
      )}

      {/* Modal Padrão para Exibir Informações */}
      <Modal
         opened={infoModalOpened}
         onClose={closeInfoModal}
         title="Informações da Pasta #58148128"
         centered
         size="lg"
         styles={infoModalStyles}
      >
         <Stack gap="xs" mt="md">
            {/* Data Criação */}
            <Grid align="baseline">
               <Grid.Col span={4}><Text size="sm" fw={700} ta="right">Data de criação:</Text></Grid.Col>
               <Grid.Col span={8}><Text size="sm">{pastaData.dataCriacao ? formatTimestamp(pastaData.dataCriacao) : '01/01/2023'}</Text></Grid.Col>
            </Grid>
             {/* Criado por */}
            <Grid align="baseline">
               <Grid.Col span={4}><Text size="sm" fw={700} ta="right">Criado por:</Text></Grid.Col>
               <Grid.Col span={8}><Text size="sm">{pastaData.criadoPor || 'Usuário Sistema (12345)'}</Text></Grid.Col>
            </Grid>
            {/* Defensoria */}
            <Grid align="baseline">
               <Grid.Col span={4}><Text size="sm" fw={700} ta="right">Defensoria:</Text></Grid.Col>
               <Grid.Col span={8}><Text size="sm">{pastaData.defensoria || 'Defensoria Exemplo POA'}</Text></Grid.Col>
            </Grid>
             {/* Status e Detalhes de Arquivamento */}
            {pastaData.status !== 'Ativa' ? (
                <>
                  <Grid align="baseline">
                     <Grid.Col span={4}><Text size="sm" fw={700} ta="right">Status:</Text></Grid.Col>
                     <Grid.Col span={8}><Text size="sm">Arquivada</Text></Grid.Col>
                  </Grid>
                  <Grid align="baseline">
                     <Grid.Col span={4}><Text size="sm" fw={700} ta="right">Data de Arquivamento:</Text></Grid.Col>
                     <Grid.Col span={8}><Text size="sm">{formatTimestamp(pastaData.lastStatusChangeAt) || 'N/A'}</Text></Grid.Col>
                  </Grid>
                  <Grid align="baseline">
                     <Grid.Col span={4}><Text size="sm" fw={700} ta="right">Motivo do Arquivamento:</Text></Grid.Col>
                     <Grid.Col span={8}>
                        <Text size="sm">
                           {pastaData.motivoArquivamento || 'N/A'}
                           {pastaData.observacaoArquivamento && (
                           <Text span style={{ fontStyle: 'italic', marginLeft: '4px' }}>
                              ({pastaData.observacaoArquivamento})
                           </Text>
                           )}
                        </Text>
                     </Grid.Col>
                  </Grid>
                  <Grid align="baseline">
                     <Grid.Col span={4}><Text size="sm" fw={700} ta="right">Arquivado por:</Text></Grid.Col>
                     <Grid.Col span={8}><Text size="sm">{pastaData.lastStatusChangeBy || 'N/A'}</Text></Grid.Col>
                  </Grid>
                </>
             ) : (
                  <Grid align="baseline">
                     <Grid.Col span={4}><Text size="sm" fw={700} ta="right">Status:</Text></Grid.Col>
                     <Grid.Col span={8}><Text size="sm">Ativa</Text></Grid.Col>
                  </Grid>
             )}
         </Stack>

         {/* Footer Customizado */}
          <Group justify="flex-end" mt="xl">
             <Button color="blue" onClick={closeInfoModal}>Fechar</Button>
          </Group>
      </Modal>

      {selectedContactForMessage && (
          <SendMessageModal
              opened={sendMessageModalOpen}
              onClose={() => setSendMessageModalOpen(false)}
              contact={selectedContactForMessage}
              templateLabel="Envio de Documento por E-mail"
          />
      )}

    </Paper>
  );
} 