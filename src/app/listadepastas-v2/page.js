'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Box, Flex, Card, Title, Text, Image, Group, ThemeIcon, Alert, Stack, Button, Select, ActionIcon, Badge, Tabs, Divider } from '@mantine/core';
import { IconFolders, IconInfoCircle, IconFolderPlus, IconPlus, IconTag, IconFolder, IconSettings, IconArrowUp, IconSortAscending, IconFolderCheck, IconArchive, IconSortDescending } from '@tabler/icons-react';
import PastaListItem from '../../components/PastaListItem/PastaListItem';
import pastasDataFromJson from '../../data/pastas-data.json';
import { useSearchParams } from 'next/navigation';
import ChatPanel from '../../components/ChatPanel/ChatPanel';
import Link from 'next/link';

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

// Componente interno que usa useSearchParams
function PastasContent() {
  const searchParams = useSearchParams();

  const [pastasToDisplay, setPastasToDisplay] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('ativas');
  const [selectedPastaId, setSelectedPastaId] = useState(null);
  const [chatHistories, setChatHistories] = useState({});
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);

  const handleChatUpdate = (pastaId, newHistory) => {
    setChatHistories(prev => ({
      ...prev,
      [pastaId]: newHistory,
    }));
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

  const handleArchivePasta = (pastaId, reason, observation) => {
    setPastasToDisplay(currentPastas =>
      currentPastas.map(pasta =>
        pasta.id === pastaId
          ? { ...pasta, status: 'Arquivada', motivoArquivamento: reason, observacaoArquivamento: observation }
          : pasta
      )
    );
    if (pastaId === selectedPastaId) {
        setIsChatPanelOpen(false);
    }
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

  const handleStartChat = (pastaId) => {
    setSelectedPastaId(pastaId);
    setIsChatPanelOpen(true);
  };

  const handleCloseChatPanel = () => {
    setIsChatPanelOpen(false);
    setSelectedPastaId(null);
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

  const selectedPasta = pastasToDisplay.find(p => p.id === selectedPastaId);

  const tabStyle = {
    fontFamily: 'Open Sans, sans-serif',
    fontWeight: 700,
    fontSize: '12px',
    lineHeight: '155%',
    letterSpacing: '0%',
    color: '#0d99ff'
  };

  return (
    <Box style={{ height: '100vh', boxSizing: 'border-box' }}>
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
                    marginLeft: '1rem' // Espaçamento para separar do menu
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
                        onStartChat={() => handleStartChat(pasta.id)}
                        />
                    ))
                    )
                ) : (
                    <Alert variant="light" color="gray" title="Carregando lista de pastas..." icon={<IconInfoCircle />}>A lista de pastas será exibida em breve.</Alert>
                )}
                </Stack>

                <Divider my="md" />
                <Flex justify="center" align="center" style={{ padding: '1rem 0' }}>
                    <Link href="/" passHref>
                        <Text c="blue" td="underline">
                            Voltar para a Central
                        </Text>
                    </Link>
                </Flex>
            </Card>

            {/* Coluna da Direita (Chat Panel com Animação de Largura) */}
            <Box
                style={{
                    width: isChatPanelOpen ? 350 : 0,
                    flexShrink: 0,
                    overflow: 'hidden',
                    transition: 'width 0.3s ease-in-out',
                    height: '100%',
                }}
            >
                {/* Contêiner interno com largura fixa para proteger o conteúdo */}
                <Box style={{ width: 350, height: '100%' }}>
                    <ChatPanel
                        isOpen={isChatPanelOpen}
                        onClose={handleCloseChatPanel}
                        pasta={selectedPasta}
                        chatHistory={selectedPasta ? chatHistories[selectedPasta.id] || [] : []}
                        onChatUpdate={(newHistory) => handleChatUpdate(selectedPasta.id, newHistory)}
                    />
                </Box>
            </Box>
        </Flex>
    </Box>
  );
}

// Componente principal com Suspense boundary
export default function PastasPage() {
  return (
    <Suspense fallback={<Text ta="center" c="dimmed">Carregando pastas...</Text>}>
      <PastasContent />
    </Suspense>
  );
} 