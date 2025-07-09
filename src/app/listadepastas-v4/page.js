'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Box, Flex, Card, Image, Group, ThemeIcon, Alert, Stack, Button, Select, ActionIcon, Badge, Tabs, Divider, Text } from '@mantine/core';
import { IconFolders, IconInfoCircle, IconFolderPlus, IconSettings, IconSortDescending, IconFolderCheck, IconArchive, IconBrandWhatsapp, IconMessageChatbot, IconMail } from '@tabler/icons-react';
import PastaListItem from '../../components/PastaListItem/PastaListItem';
import pastasDataFromJson from '../../data/pastas-data.json';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useChatManager } from '../../hooks/useChatManager';
import ConversasAtivasModal from '../../components/ConversasAtivasModal/ConversasAtivasModal';

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
      assistido: 'Marta Wayne',
      telefone: '(51) 99238-7778',
      processosAssociados: [`${processoNum}-47.${ano}.8.21.${String(comarcaIndex + 1).padStart(4, '0')}`]
    });
  }
  return generatedPastas;
}

function PastasPageContent() {
  const searchParams = useSearchParams();
  const { openChat, chats, simulateNewMessage } = useChatManager();

  const [pastasToDisplay, setPastasToDisplay] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('ativas');
  const [conversasAtivasModalOpen, setConversasAtivasModalOpen] = useState(false);
  const [pastaAtual, setPastaAtual] = useState(null);

  const SIDEBAR_WIDTH = 250;

  const customMaximizedStyles = {
    width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
    height: '100vh',
    top: 0,
    left: `${SIDEBAR_WIDTH}px`,
  };

  useEffect(() => {
    setIsMounted(true);

    const generateParam = searchParams.get('generate');
    const generateCount = parseInt(generateParam, 10);

    if (!isNaN(generateCount) && generateCount > 0) {
      const pastasGeradas = generateFakePastas(generateCount);
      setPastasToDisplay(pastasGeradas);
      // Define a primeira pasta como atual
      if (pastasGeradas.length > 0) {
        setPastaAtual(pastasGeradas[0]);
      }
    } else {
      const pastasModificadas = pastasDataFromJson.map(pasta => ({
        ...pasta,
        assistido: 'Marta Wayne',
        telefone: '(51) 99238-7778'
      }));
      setPastasToDisplay(pastasModificadas);
      // Define a primeira pasta como atual
      if (pastasModificadas.length > 0) {
        setPastaAtual(pastasModificadas[0]);
      }
    }
  }, [searchParams]);

  const handleChatClick = (pasta) => {
    // Define a pasta atual para usar na modal de conversas ativas
    setPastaAtual(pasta);
    
    // Adiciona nova conversa no histórico para Contatos v2
    const novaConversa = {
      id: `chat-${Date.now()}`,
      data: new Date().toLocaleString('pt-BR'),
      mensagem: `WhatsApp: Conversa sobre processo ${pasta.processoPrincipal}`,
      remetente: pasta.assistido || 'Marta Wayne',
      defensoria: pasta.orgaoJulgador || 'Defensoria Pública',
      contato: pasta.telefone || '(51) 99238-7778',
      status: 'pendente_sem_resposta',
      acaoRespondida: true,
      numRespostas: 0,
      pasta: pasta // Salva dados da pasta para referência
    };

    // Salva no localStorage para a página contatos-v2 acessar
    const conversasExistentes = JSON.parse(localStorage.getItem('novasConversas') || '[]');
    conversasExistentes.unshift(novaConversa); // Adiciona no início
    localStorage.setItem('novasConversas', JSON.stringify(conversasExistentes));
    
    // Abre o chat normalmente
    openChat(pasta, { 
      maximizedStyles: customMaximizedStyles,
      initialAlignment: 'right'
    });
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

  const handleSimulateNewMessage = () => {
    const lastChat = chats.length > 0 ? chats[chats.length - 1] : null;
    if (lastChat) {
      simulateNewMessage(lastChat.id);
    } else {
      console.log("Nenhum chat aberto para simular mensagem.");
    }
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

  if (!isMounted) {
    return null; 
  }

  return (
    <Box style={{ height: '100vh', boxSizing: 'border-box' }}>
      <Flex
          style={{ height: '100%' }}
      >
        {/* Coluna da Esquerda (Menu Lateral Fixo) */}
        <Box style={{ width: 250, flexShrink: 0 }}>
            <Image
                src="/menulaterallistadepastasv4.png" 
                alt="Menu Lateral - Clique para ver Conversas Ativas"
                fit="contain"
                style={{ 
                  height: '100%', 
                  objectPosition: 'top',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onClick={() => setConversasAtivasModalOpen(true)}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
            />
        </Box>

        {/* Wrapper para posicionamento relativo do ActionIcon */}
        <Box style={{ flex: 1, position: 'relative' }}> 
          <ActionIcon
              variant="light"
              radius="xl"
              size="lg"
              onClick={handleSimulateNewMessage}
              style={{ position: 'absolute', top: 20, left: 32, zIndex: 10 }}
              disabled={chats.length === 0}
              title="Simular recebimento de nova mensagem"
          >
            <Text size="sm" fw={700}>+1</Text>
          </ActionIcon>

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
              <Link href="/contatos-v2" style={{ textDecoration: 'none' }}>
                <Image 
                  src="/menucadastro.png"
                  alt="Menu de Cadastro - Clique para acessar Contatos v2"
                  width="100%"
                  mb="lg"
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                />
              </Link>

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
              {filteredPastas.length === 0 ? (
                  <Alert variant="light" color="blue" title="Nenhuma pasta encontrada." icon={<IconInfoCircle />}>Não há pastas para exibir (verifique o filtro aplicado ou aguarde o carregamento).</Alert>
              ) : (
                  filteredPastas.map(pasta => (
                      <PastaListItem
                      key={pasta.id}
                      pasta={pasta}
                      onArchive={handleArchivePasta}
                      onUnarchive={handleUnarchivePasta}
                      onChatClick={handleChatClick}
                      />
                  ))
              )}
              </Stack>
              <Divider my="md" />
              <Flex justify="center" align="center" style={{ padding: '1rem 0' }}>
                  <Button component={Link} href="/" variant="subtle">
                      Voltar à Central de Protótipos
                  </Button>
              </Flex>
          </Card>
        </Box>
      </Flex>

      {/* Modal de Conversas Ativas */}
      <ConversasAtivasModal 
        opened={conversasAtivasModalOpen}
        onClose={() => setConversasAtivasModalOpen(false)}
        pastaAtual={pastaAtual}
      />
    </Box>
  );
}

export default function PastasPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PastasPageContent />
    </Suspense>
  );
}