'use client';

import React, { useState, useEffect } from 'react';
import { Box, Flex, Card, Image, Group, ThemeIcon, Alert, Stack, Button, Select, ActionIcon, Badge, Tabs, Divider, Text } from '@mantine/core';
import { IconFolders, IconInfoCircle, IconFolderPlus, IconSettings, IconSortDescending, IconFolderCheck, IconArchive, IconBrandWhatsapp, IconMessageChatbot, IconMail } from '@tabler/icons-react';
import PastaListItem from '../../components/PastaListItem/PastaListItem';
import pastasDataFromJson from '../../data/pastas-data.json';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ApprovalChatModal from '../../components/ApprovalChatModal/ApprovalChatModal';

function generateFakePastas(count) {
  const generatedPastas = [];
  const areas = ['Cível', 'Criminal', 'Trabalhista', 'Família'];
  const comarcas = ['Porto Alegre', 'Canoas', 'Gravataí', 'Viamão', 'Alvorada'];
  const assuntos = [
    'DIREITO CIVIL / Obrigações / Espécies de Contratos',
    'DIREITO PENAL / Crimes contra a vida / Homicídio Qualificado',
    'DIREITO DO TRABALHO / Contrato Individual de Trabalho / Reclamatória Trabalhista',
    'DIREITO DE FAMÍLIA / Casamento / Divórcio Litigioso',
    'DIREITO DO CONSUMIDOR / Contratos de Consumo / Telefonia',
  ];
  const statuses = ['Ativa', 'Arquivada'];

  for (let i = 1; i <= count; i++) {
    const hasTags = Math.random() > 0.7;
    const processoNum = 8000000 + Math.floor(Math.random() * 100000);
    const ano = 2020 + Math.floor(Math.random() * 5);
    const comarcaIndex = Math.floor(Math.random() * comarcas.length);
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    generatedPastas.push({
      id: `gen-${i}`,
      processoPrincipal: `${processoNum}-47.${ano}.8.21.${String(comarcaIndex + 1).padStart(4, '0')}`,
      tags: hasTags ? ['Réu preso'] : [],
      status: status,
      ultimoAtendimento: `01/0${Math.floor(Math.random() * 9) + 1}/2024`,
      comarca: comarcas[comarcaIndex],
      orgaoJulgador: `Vara Genérica ${i} da ${comarcas[comarcaIndex]}`,
      area: areas[Math.floor(Math.random() * areas.length)],
      classe: `Classe Genérica ${i}`,
      assunto: assuntos[Math.floor(Math.random() * assuntos.length)],
      descricao: `Descrição automática para pasta gerada número ${i}.`,
      processosAssociados: [`${processoNum}-47.${ano}.8.21.${String(comarcaIndex + 1).padStart(4, '0')}`]
    });
  }
  return generatedPastas;
}

export default function PastasPage() {
  const searchParams = useSearchParams();

  const [pastasToDisplay, setPastasToDisplay] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('ativas');

  // Estados para o modal de chat de aprovação
  const [approvalModalOpened, setApprovalModalOpened] = useState(false);
  const [selectedPastaForChat, setSelectedPastaForChat] = useState(null);
  const [isChatMaximized, setIsChatMaximized] = useState(false);

  // --- NOVO ESTADO CENTRALIZADO PARA CHATS ---
  const [chatsState, setChatsState] = useState({});

  const SIDEBAR_WIDTH = 250;

  const customMaximizedStyles = {
    width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
    height: '100vh',
    left: `${SIDEBAR_WIDTH}px`,
    top: 0,
  };

  useEffect(() => {
    setIsMounted(true);

    const generateParam = searchParams.get('generate');
    const generateCount = parseInt(generateParam, 10);

    if (!isNaN(generateCount) && generateCount > 0) {
      setPastasToDisplay(generateFakePastas(generateCount));
    } else {
      setPastasToDisplay(pastasDataFromJson);
    }
  }, [searchParams]);

  const ensureChatState = (pastaId) => {
    setChatsState(prev => {
      if (!prev[pastaId]) {
        return { ...prev, [pastaId]: { messages: [], unreadCount: 0, isActive: true } };
      }
      return prev;
    });
  };

  const handleOpenApprovalChat = (pasta) => {
    ensureChatState(pasta.id);
    setSelectedPastaForChat(pasta);
    setApprovalModalOpened(true);
    setChatsState(prev => ({ ...prev, [pasta.id]: { ...prev[pasta.id], unreadCount: 0 } }));
  };

  const handleSendMessage = (text) => {
    if (!selectedPastaForChat) return;
    const pastaId = selectedPastaForChat.id;
    const { id, assunto, descricao } = selectedPastaForChat;
    const formattedText = `${text}\n\n---\nID: ${id}\nAssunto: ${assunto}\nDescrição: ${descricao}`;
    const newMessage = {
      id: `defensor-${Date.now()}`,
      sender: 'defensor',
      name: 'Humberto Borges Ribeiro',
      text: formattedText,
      timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setChatsState(prev => ({
      ...prev,
      [pastaId]: { ...prev[pastaId], messages: [...prev[pastaId].messages, newMessage] }
    }));

    setTimeout(() => {
      const assistidoResponse = {
        id: `assistido-reply-${Date.now()}`,
        sender: 'assistido',
        name: 'Marta Wayne',
        text: 'Ok, recebido. Obrigado!',
        timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };
      setChatsState(prev => ({
        ...prev,
        [pastaId]: {
          ...prev[pastaId],
          messages: [...prev[pastaId].messages, assistidoResponse],
          unreadCount: prev[pastaId].unreadCount + 1,
        }
      }));
    }, 2000);
  };
  
  const handleEndChat = () => {
    if (!selectedPastaForChat) return;
    const pastaId = selectedPastaForChat.id;
    const endMessage = {
      id: `system-${Date.now()}`,
      sender: 'system',
      text: 'Conversa encerrada pelo atendente.',
      timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    setChatsState(prev => ({
      ...prev,
      [pastaId]: { 
        ...prev[pastaId], 
        messages: [...prev[pastaId].messages, endMessage],
        isActive: false 
      }
    }));
  };

  const handleContinueChat = () => {
    if (!selectedPastaForChat) return;
    const pastaId = selectedPastaForChat.id;
    setChatsState(prev => ({
      ...prev,
      [pastaId]: { 
        ...prev[pastaId], 
        isActive: true 
      }
    }));
  };

  const handleSimulateNewMessage = () => {
    if (!selectedPastaForChat) return;
    const pastaId = selectedPastaForChat.id;
    const assistidoResponse = {
      id: `assistido-${Date.now()}`,
      sender: 'assistido',
      name: 'Marta Wayne',
      text: 'Olá! Fiquei com uma dúvida sobre a petição...',
      timestamp: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    setChatsState(prev => ({
      ...prev,
      [pastaId]: {
        ...prev[pastaId],
        messages: [...prev[pastaId].messages, assistidoResponse],
        unreadCount: prev[pastaId].unreadCount + 1,
      }
    }));
  };

  const handleRestore = () => {
    if (!selectedPastaForChat) return;
    const pastaId = selectedPastaForChat.id;
    setChatsState(prev => ({ ...prev, [pastaId]: { ...prev[pastaId], unreadCount: 0 } }));
  };

  const handleArchivePasta = (pastaId, reason, observation) => {
    setPastasToDisplay(currentPastas =>
      currentPastas.map(pasta =>
        pasta.id === pastaId
          ? { ...pasta, status: 'Arquivada', motivoArquivamento: reason, observacaoArquivamento: observation }
          : pasta
      )
    );
  };

  const handleUnarchivePasta = (pastaId) => {
    setPastasToDisplay(currentPastas =>
      currentPastas.map(pasta =>
        pasta.id === pastaId
          ? { ...pasta, status: 'Ativa', motivoArquivamento: undefined, observacaoArquivamento: undefined }
          : pasta
      )
    );
  };

  const countAtivas = pastasToDisplay.filter(p => p.status === 'Ativa').length;
  const countArquivadas = pastasToDisplay.filter(p => p.status === 'Arquivada').length;
  const countTodas = pastasToDisplay.length;

  const filteredPastas = pastasToDisplay.filter(pasta => {
    if (activeTab === 'ativas') {
      return pasta.status === 'Ativa';
    }
    if (activeTab === 'arquivadas') {
      return pasta.status === 'Arquivada';
    }
    if (activeTab === 'todas') {
      return true;
    }
    return false;
  });

  const tabStyle = {
    fontFamily: 'Open Sans, sans-serif',
    fontWeight: 700,
    fontSize: '12px',
    lineHeight: '155%',
    letterSpacing: '0%',
    color: '#0d99ff'
  };

  const handleCloseModal = () => {
    setApprovalModalOpened(false);
    setSelectedPastaForChat(null);
  };
  
  const activeChatState = selectedPastaForChat ? chatsState[selectedPastaForChat.id] : null;

  const markAsRead = (pastaId) => {
    setChatsState(prev => ({
      ...prev,
      [pastaId]: { ...prev[pastaId], unreadCount: 0 }
    }));
  };

  return (
    <Box style={{ height: '100vh', boxSizing: 'border-box' }}>
      {/* Botão de simulação discreto */}
      {!isChatMaximized && (
        <ActionIcon
            variant="light"
            radius="xl"
            size="lg"
            onClick={handleSimulateNewMessage}
            style={{ position: 'fixed', top: 20, left: SIDEBAR_WIDTH + 20, zIndex: 1001 }}
            disabled={!approvalModalOpened}
            title="Simular recebimento de nova mensagem"
        >
          <Text size="sm" fw={700}>+1</Text>
        </ActionIcon>
      )}
      
      <Flex
          style={{ height: '100%' }}
      >
        {/* Coluna da Esquerda (Menu Lateral Fixo) */}
        <Box style={{ width: 250, flexShrink: 0 }}>
            <Image
                src="/menulateral.png" 
                alt="Menu Lateral"
                fit="contain"
                style={{ height: '100%' }}
            />
        </Box>

        {/* Coluna Central (Conteúdo Principal com Rolagem INTERNA) */}
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                height: '100%',
                marginLeft: '1rem'
            }}
        >
            <Image 
            src="/menucadastro.png"
            alt="Menu de Cadastro"
            width="100%"
            mb="lg"
            />

            <Tabs value={activeTab} onChange={setActiveTab} mb="lg">
            <Tabs.List grow>
                <Tabs.Tab
                value="ativas"
                leftSection={<IconFolderCheck size={14} />}
                style={tabStyle}
                >
                Pastas ativas ({countAtivas})
                </Tabs.Tab>
                <Tabs.Tab
                value="arquivadas"
                leftSection={<IconArchive size={14} />}
                style={tabStyle}
                >
                Pastas Arquivadas ({countArquivadas})
                </Tabs.Tab>
                <Tabs.Tab
                value="todas"
                leftSection={<IconFolders size={14} />}
                style={tabStyle}
                >
                Todas as Pastas ({countTodas})
                </Tabs.Tab>

                <Group justify="flex-end" gap="xs" wrap="nowrap" style={{ flexGrow: 1, marginRight: 'var(--mantine-spacing-md)' }}>
                <Button variant="subtle" size="xs" leftSection={<IconSettings size={14}/>} style={tabStyle}>
                    Configurações de exibição
                </Button>
                <Button variant="subtle" size="xs" leftSection={<IconSortDescending size={14}/>} style={tabStyle}>
                        Remover destaque
                </Button>
                <Badge color="orange" variant="light">RÉU PRESO</Badge>
                <Select
                    placeholder="Último atendimento"
                    data={[]}
                    size="xs"
                    style={{ minWidth: 150 }}
                    rightSectionWidth={20}
                />
                <ActionIcon variant="filled" color="green" size="lg">
                    <IconSortDescending size={18}/>
                </ActionIcon>
                </Group>
            </Tabs.List>
            </Tabs>
            
            <Group align="center" mb="lg" bg="gray.1" p="sm">
            <ThemeIcon variant="light" size="lg"><IconFolders stroke={1.5} /></ThemeIcon>
            <Text fw={500} size="lg">Pastas do Assistido</Text>
            </Group>

            <Stack>
            {isMounted ? (
                filteredPastas.length === 0 ? (
                <Alert variant="light" color="blue" title="Nenhuma pasta encontrada." icon={<IconInfoCircle />}>Não há pastas para exibir (verifique o filtro aplicado ou aguarde o carregamento).</Alert>
                ) : (
                filteredPastas.map(pasta => (
                    <PastaListItem
                    key={pasta.id}
                    pasta={pasta}
                    onArchive={handleArchivePasta}
                    onUnarchive={handleUnarchivePasta}
                    onChatClick={handleOpenApprovalChat}
                    unreadCount={chatsState[pasta.id]?.unreadCount || 0}
                    />
                ))
                )
            ) : (
                <Alert variant="light" color="gray" title="Carregando lista de pastas..." icon={<IconInfoCircle />}>A lista de pastas será exibida em breve.</Alert>
            )}
            </Stack>
            <Divider my="md" />
            <Flex justify="center" align="center" style={{ padding: '1rem 0' }}>
                <Button component={Link} href="/" variant="subtle">
                    Voltar à Central de Protótipos
                </Button>
            </Flex>
        </Card>
      </Flex>

      {selectedPastaForChat && activeChatState && (
        <ApprovalChatModal
          opened={approvalModalOpened}
          onClose={handleCloseModal}
          pasta={selectedPastaForChat}
          contact={{ nome: 'Marta Wayne', telefone: '(51) 99238-7768' }}
          messageCount={activeChatState.unreadCount}
          onRestore={handleRestore}
          chatHistory={activeChatState.messages}
          onSendMessage={handleSendMessage}
          isChatActive={activeChatState.isActive}
          onEndChat={handleEndChat}
          onContinueChat={handleContinueChat}
          onScrolledToUnread={() => markAsRead(selectedPastaForChat.id)}
          maximizedStyles={customMaximizedStyles}
          onToggleMaximize={setIsChatMaximized}
          initialAlignment="right"
        />
      )}
    </Box>
  );
} 