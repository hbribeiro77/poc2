'use client';

import { 
  Box, Flex, Card, Title, Text, Image, Group, ThemeIcon, Button, 
  Tabs, TextInput, ActionIcon, ScrollArea, Stack, Badge, Divider,
  Paper, Textarea, Select, Modal, Grid, Menu, Checkbox, Loader, Overlay, Tooltip
} from '@mantine/core';
import Link from 'next/link';
import { 
  IconCheck, IconFileText, IconMessageCircle, IconCalendar, 
  IconGavel, IconCloudUpload, IconHourglass, IconSearch, 
  IconRefresh, IconFilter, IconSparkles, IconPlus, IconClock, 
  IconRefresh as IconRefreshCycle, IconArrowsMaximize, IconX, 
  IconPlayerPlay, IconChecklist, IconHome, IconSettings, 
  IconUsers, IconBrain, IconMessageChatbot, IconFolder, 
  IconChartBar, IconBell, IconBriefcase, IconCalendarEvent, 
  IconUserSearch, IconFiles
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useHotkeys } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import ProcessoCard from '../../components/ProcessoCard/ProcessoCard';
import processosDataOriginal from '../../data/processos-data.json';
import Spotlight from '../../components/Spotlight/Spotlight';
import IAChatModal from '../../components/IAChatModal/IAChatModal';

export default function AreaDeTrabalhoPage() {
  const router = useRouter();
  const [processosData, setProcessosData] = useState(processosDataOriginal);
  const [activeTab, setActiveTab] = useState('intimacoes');
  const [filterDefensoria, setFilterDefensoria] = useState('');
  const [filterGeral, setFilterGeral] = useState('');
  const [selectedProcessos, setSelectedProcessos] = useState([]);
  const [acoesSelecionadas, setAcoesSelecionadas] = useState([]);
  const [isLoadingTriagem, setIsLoadingTriagem] = useState(false);
  const [triagemResultados, setTriagemResultados] = useState({});
  const [triagemManualResultados, setTriagemManualResultados] = useState({});
  const [spotlightOpened, setSpotlightOpened] = useState(false);
  const [iaChatOpened, setIAChatOpened] = useState(false);
  const [selectedTool, setSelectedTool] = useState('criar-tarefa');
  const [processoTarefas, setProcessoTarefas] = useState({});
  const [autoCriarTarefas, setAutoCriarTarefas] = useState(false);

  // Função para gerar intimações dinamicamente
  const generateIntimacoes = (count) => {
    const categorias = ['Justiça Gratuita - Requerida', 'Criminal', 'Família', 'Cível', 'Tributário'];
    const classes = ['Ação Civil Pública', 'Inquérito Policial', 'Ação de Divórcio', 'Ação de Alimentos', 'Ação Penal', 'Execução Fiscal', 'Embargos de Terceiro'];
    const orgaos = [
      'Juízo da Vara Judicial da Comarca de Herval',
      '2ª Vara Criminal da Comarca de Porto Alegre',
      'Vara de Família da Comarca de Porto Alegre',
      'Juízo da Vara Judicial da Comarca de Caxias do Sul',
      '3ª Vara Criminal da Comarca de Porto Alegre'
    ];
    const nomes = ['JOANA TESTE NOME SOCIAL', 'Maria Oliveira Costa', 'Pedro Santos Lima', 'ANA CAROLINA SILVA', 'CARLOS EDUARDO MENDES', 'Roberto Silva Pereira', 'Lucia Maria Santos'];
    const prazos = ['5 dias', '8 dias', '10 dias', '12 dias', '15 dias', '20 dias'];

    const intimacoes = [];
    
    for (let i = 0; i < count; i++) {
      const today = new Date();
      today.setDate(today.getDate() + Math.floor(Math.random() * 30));
      const disponibilizacao = today.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }) + ' às ' + String(Math.floor(Math.random() * 12) + 9).padStart(2, '0') + ':' + String(Math.floor(Math.random() * 60)).padStart(2, '0');

      intimacoes.push({
        id: i + 1,
        categoria: categorias[Math.floor(Math.random() * categorias.length)],
        processo: `${5000000 + Math.floor(Math.random() * 9000000)}-${String(Math.floor(Math.random() * 100)).padStart(2, '0')}.${2022 + Math.floor(Math.random() * 4)}.8.21.${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
        orgaoJulgador: orgaos[Math.floor(Math.random() * orgaos.length)],
        disponibilizacao: disponibilizacao,
        classe: classes[Math.floor(Math.random() * classes.length)],
        intimado: nomes[Math.floor(Math.random() * nomes.length)] + (Math.random() > 0.7 ? ' (POLO ATIVO)' : ''),
        status: 'Pendente',
        prazo: prazos[Math.floor(Math.random() * prazos.length)],
        corBorda: 'red'
      });
    }
    
    return intimacoes;
  };

  // Carrega os dados no cliente após o mount
  useEffect(() => {
    const intimacoesCount = localStorage.getItem('intimacoesCount');
    if (intimacoesCount) {
      setProcessosData(generateIntimacoes(parseInt(intimacoesCount)));
    }
  }, []);

  const acoesDisponiveis = [
    { id: 'ocultar', label: 'Ocultar' },
    { id: 'renunciar', label: 'Renunciar em Lote' },
    { id: 'encaminhar', label: 'Encaminhar em Lote' },
    { id: 'triagem', label: 'Triagem por IA em lote' }
  ];

  const handleAcaoChange = (acaoId, checked) => {
    if (checked) {
      setAcoesSelecionadas([...acoesSelecionadas, acaoId]);
    } else {
      setAcoesSelecionadas(acoesSelecionadas.filter(id => id !== acaoId));
    }
  };

  const handleTriagemManual = (processoId, resultado) => {
    setTriagemManualResultados(prev => ({
      ...prev,
      [processoId]: resultado
    }));
    
    notifications.show({
      title: 'Triagem Manual Aplicada',
      message: `Resultado "${resultado}" aplicado ao processo`,
      color: 'blue',
      autoClose: 3000,
    });
  };

  const handleSalvarAcoes = () => {
    console.log('Ações selecionadas:', acoesSelecionadas);
    console.log('Processos selecionados:', selectedProcessos);
    
    // Verifica se tem triagem por IA
    if (acoesSelecionadas.includes('triagem')) {
      setIsLoadingTriagem(true);
      
      // Simula o processamento da IA por 3 segundos
      setTimeout(() => {
        setIsLoadingTriagem(false);
        
        // Simula resultados de triagem para os processos selecionados
        const novosResultados = {};
        const tarefasParaAdicionar = {};
        
        selectedProcessos.forEach(processoId => {
          // Simula resultado aleatório: 30% "Elaborar peça", 30% "Elaborar Peça - fazer memoriais", 40% "Renunciar ao prazo"
          const random = Math.random();
          const resultado = random < 0.3 ? 'Elaborar peça' : random < 0.6 ? 'Elaborar Peça - fazer memoriais' : 'Renunciar ao prazo';
          novosResultados[processoId] = resultado;

          // Se o modo automático estiver ativo e o resultado for "Elaborar Peça - fazer memoriais", cria a tarefa
          if (autoCriarTarefas && resultado === 'Elaborar Peça - fazer memoriais') {
            tarefasParaAdicionar[processoId] = [{
              descricao: `Fazer memoriais (em andamento por Humberto Borges Ribeiro) Peça`
            }];
          }
        });
        
        setTriagemResultados(prev => ({ ...prev, ...novosResultados }));
        setProcessoTarefas(prev => ({ ...prev, ...tarefasParaAdicionar }));
        
        const mensagemFinal = autoCriarTarefas && Object.keys(tarefasParaAdicionar).length > 0
          ? `${selectedProcessos.length} processo(s) processado(s). Tarefas criadas automaticamente para processos com "Elaborar Peça - fazer memoriais".`
          : `Aplicando ações: ${acoesSelecionadas.join(', ')} em ${selectedProcessos.length} processo(s)`;
        
        notifications.show({
          title: 'Triagem por IA Concluída!',
          message: mensagemFinal,
          color: 'green',
          autoClose: 5000,
          styles: {
            root: {
              backgroundColor: '#d4edda',
              border: '1px solid #155724',
              borderRadius: '6px',
            },
            title: {
              color: '#155724',
              fontWeight: 600,
            },
            body: {
              color: '#155724',
            },
            closeButton: {
              color: '#6c757d',
            },
          },
        });
        setAcoesSelecionadas([]);
        setSelectedProcessos([]);
      }, 3000);
    } else {
      // Ações normais sem loading
      notifications.show({
        title: 'Ações Aplicadas',
        message: `Aplicando ações: ${acoesSelecionadas.join(', ')} em ${selectedProcessos.length} processo(s)`,
        color: 'blue',
        icon: '✅',
        autoClose: 3000,
        styles: {
          root: {
            backgroundColor: '#d1ecf1',
            border: '1px solid #0c5460',
            borderRadius: '6px',
          },
          title: {
            color: '#0c5460',
            fontWeight: 600,
          },
          body: {
            color: '#0c5460',
          },
          closeButton: {
            color: '#6c757d',
          },
        },
      });
      setAcoesSelecionadas([]);
      setSelectedProcessos([]);
    }
  };


  const tabsData = [
    { value: 'tarefas', label: 'Tarefas', icon: IconCheck, count: 525, color: '#337ab7' },
    { value: 'pecas', label: 'Peças para aprovação', icon: IconFileText, count: 253, color: '#f0ad4e' },
    { value: 'atendimentos', label: 'Atendimentos para aprovação', icon: IconMessageCircle, count: '300+', color: '#5cb85c' },
    { value: 'agendamentos', label: 'Agendamentos', icon: IconCalendar, count: 0, color: '#003366' },
    { value: 'audiencias', label: 'Audiências', icon: IconGavel, count: 1, color: '#ba8759' },
    { value: 'peticionamentos', label: 'Peticionamentos eletrônicos', icon: IconCloudUpload, count: 179, color: '#da90aa' },
    { value: 'intimacoes', label: 'Intimações', icon: IconHourglass, count: 70, color: '#ff6a5b' }
  ];

  // Configuração do Spotlight - Ações disponíveis
  const spotlightActions = [
    // Ações de IA (Prioritárias)
    {
      id: 'criar-tarefa-ia',
      label: 'Criar Tarefa com IA',
      description: 'Gerar nova tarefa usando inteligência artificial',
      icon: IconCheck,
      color: '#228be6',
      keywords: ['tarefa', 'ia', 'criar', 'gerar', 'nova'],
      onClick: () => {
        setSelectedTool('criar-tarefa');
        setSpotlightOpened(false);
        setTimeout(() => setIAChatOpened(true), 100);
      },
    },
    {
      id: 'criar-cota-ia',
      label: 'Criar Cota com IA',
      description: 'Gerar cota automatizada usando IA',
      icon: IconClock,
      color: '#f0ad4e',
      keywords: ['cota', 'ia', 'criar', 'gerar', 'prazo'],
      onClick: () => {
        setSelectedTool('criar-cota');
        setSpotlightOpened(false);
        setTimeout(() => setIAChatOpened(true), 100);
      },
    },
    {
      id: 'registrar-audiencia-ia',
      label: 'Registrar Audiência com IA',
      description: 'Registrar nova audiência usando IA',
      icon: IconGavel,
      color: '#5cb85c',
      keywords: ['audiência', 'ia', 'registrar', 'criar', 'agendar'],
      onClick: () => {
        setSelectedTool('registrar-audiencia');
        setSpotlightOpened(false);
        setTimeout(() => setIAChatOpened(true), 100);
      },
    },
    // Navegação Rápida
    {
      id: 'area-trabalho',
      label: 'Área de Trabalho',
      description: 'Ir para a página principal de trabalho',
      icon: IconBriefcase,
      color: '#6f42c1',
      keywords: ['área', 'trabalho', 'principal', 'dashboard'],
      onClick: () => {
        setActiveTab('intimacoes');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'busca-assistidos',
      label: 'Buscar Assistidos',
      description: 'Pesquisar assistidos no sistema',
      icon: IconUserSearch,
      color: '#17a2b8',
      keywords: ['buscar', 'assistido', 'pessoa', 'cliente', 'pesquisar'],
      onClick: () => {
        notifications.show({
          title: 'Busca de Assistidos',
          message: 'Funcionalidade em desenvolvimento',
          color: 'cyan',
        });
        // Aqui você pode implementar a lógica real
      },
    },
    {
      id: 'busca-pastas',
      label: 'Buscar Pastas',
      description: 'Pesquisar pastas no sistema',
      icon: IconFiles,
      color: '#e83e8c',
      keywords: ['buscar', 'pasta', 'processo', 'caso', 'pesquisar'],
      onClick: () => {
        router.push('/listadepastas-v4');
      },
    },
    // Ações da Área de Trabalho
    {
      id: 'abrir-tarefas',
      label: 'Abrir Tarefas',
      description: 'Navegar para a aba de Tarefas',
      icon: IconCheck,
      color: '#337ab7',
      onClick: () => setActiveTab('tarefas'),
    },
    {
      id: 'abrir-pecas',
      label: 'Abrir Peças para Aprovação',
      description: 'Navegar para a aba de Peças',
      icon: IconFileText,
      color: '#f0ad4e',
      onClick: () => setActiveTab('pecas'),
    },
    {
      id: 'abrir-intimacoes',
      label: 'Abrir Intimações',
      description: 'Navegar para a aba de Intimações',
      icon: IconHourglass,
      color: '#ff6a5b',
      onClick: () => setActiveTab('intimacoes'),
    },
    // Navegação Geral
    {
      id: 'home',
      label: 'Central de Protótipos',
      description: 'Voltar para a página inicial',
      icon: IconHome,
      color: '#228be6',
      onClick: () => router.push('/'),
    },
    {
      id: 'minha-defensoria',
      label: 'Minha Defensoria',
      description: 'Gerenciar equipe e recursos',
      icon: IconUsers,
      color: '#20c997',
      onClick: () => router.push('/minha-defensoria'),
    },
    {
      id: 'ia',
      label: 'Inteligência Artificial',
      description: 'Regras e automações de IA',
      icon: IconBrain,
      color: '#e83e8c',
      onClick: () => router.push('/inteligencia-artificial'),
    },
    {
      id: 'contatos',
      label: 'Contatos',
      description: 'Gerenciar contatos e mensagens',
      icon: IconMessageChatbot,
      color: '#17a2b8',
      onClick: () => router.push('/contatos'),
    },
    {
      id: 'limpar-filtros',
      label: 'Limpar Filtros',
      description: 'Remover todos os filtros ativos',
      icon: IconRefresh,
      color: '#868e96',
      onClick: () => {
        setFilterDefensoria('');
        setFilterGeral('');
        notifications.show({
          title: 'Filtros Limpos',
          message: 'Todos os filtros foram removidos',
          color: 'gray',
        });
      },
    },
  ];

  // Atalho de teclado: Ctrl + Alt + T
  useHotkeys([
    ['ctrl+alt+T', () => setSpotlightOpened(true)],
    ['ctrl+shift+H', () => setAutoCriarTarefas(!autoCriarTarefas)],
  ]);

  return (
    <>
      {/* Spotlight Command Palette */}
      <Spotlight
        opened={spotlightOpened}
        onClose={() => setSpotlightOpened(false)}
        actions={spotlightActions}
      />

      {/* Modal de Chat com IA */}
      <IAChatModal
        opened={iaChatOpened}
        onClose={() => setIAChatOpened(false)}
        defaultTool={selectedTool}
        onCriarTarefa={(usuario, tipo) => {
          // Busca processos com triagem "Elaborar Peça - fazer memoriais" (tanto manual quanto por IA)
          let processosComElaborarPeca = processosData.filter(p => {
            const triagemManual = triagemManualResultados[p.id];
            const triagemIA = triagemResultados[p.id];
            return triagemManual === 'Elaborar Peça - fazer memoriais' || triagemIA === 'Elaborar Peça - fazer memoriais';
          });

          // Adiciona tarefa aos processos
          processosComElaborarPeca.forEach(processo => {
            const novaTarefa = {
              descricao: `Fazer memoriais (em andamento por ${usuario}) ${tipo}`
            };
            
            setProcessoTarefas(prev => ({
              ...prev,
              [processo.id]: [...(prev[processo.id] || []), novaTarefa]
            }));
          });

          if (processosComElaborarPeca.length > 0) {
            notifications.show({
              title: 'Tarefas Criadas!',
              message: `${processosComElaborarPeca.length} tarefa(s) criada(s) para ${usuario}`,
              color: 'green',
            });
          }
        }}
      />

      <Flex gap={0} pb="xl" style={{ overflowX: 'hidden' }}>
        {/* MENU LATERAL */}
        <Box style={{ 
          width: 250, 
          height: '100vh', 
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'flex-start'
        }}>
          <a href="/historico-atividades" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <Image
              src="/menuia.png"
              alt="Menu Lateral"
              height="100%"
              fit="contain"
              style={{ 
                width: '100%',
                objectPosition: 'top'
              }}
            />
          </a>
        </Box>

        <Box style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          marginLeft: '250px', // Espaço para o menu fixo
          overflowX: 'hidden',
          maxWidth: 'calc(100vw - 250px)'
        }}>

          {/* Abas de Navegação - Estilo da página de IA */}
          <Box p="lg" style={{ backgroundColor: '#f8f9fa', overflowX: 'hidden' }}>
            <Group gap="xs" wrap="nowrap" style={{ width: '100%', overflowX: 'hidden' }}>
              {tabsData.map((tab) => (
                <Button
                  key={tab.value}
                  variant={activeTab === tab.value ? 'filled' : 'outline'}
                  leftSection={<tab.icon size={16} />}
                  onClick={() => setActiveTab(tab.value)}
                  style={{
                    height: '45px',
                    borderRadius: '6px',
                    borderWidth: '2px',
                    transition: '0.4s',
                    backgroundColor: activeTab === tab.value ? tab.color : 'white',
                    color: activeTab === tab.value ? 'white' : tab.color,
                    borderColor: activeTab === tab.value ? tab.color : '#e5e7eb',
                    fontWeight: '500',
                    fontSize: '11px',
                    flex: 1,
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                    padding: '0 4px',
                    maxWidth: 'calc(100% / 7)'
                  }}
                >
                  <Text size="xs" fw={500} lineClamp={1} style={{ fontSize: '11px' }}>
                    {tab.label} ({tab.count})
                  </Text>
                </Button>
              ))}
            </Group>
          </Box>

                 {/* Barra de Filtros */}
                 <Box p="md" style={{ backgroundColor: '#f1f3f4', borderBottom: '1px solid #e9ecef' }}>
                   <Group justify="space-between" align="center">
                     <Group gap="md" style={{ flex: 1 }}>
                       {/* Checkbox Selecionar Todos */}
                       <Tooltip label="Selecionar todos os processos">
                         <Checkbox
                           checked={selectedProcessos.length === processosData.length && processosData.length > 0}
                           indeterminate={selectedProcessos.length > 0 && selectedProcessos.length < processosData.length}
                           onChange={(event) => {
                             if (event.currentTarget.checked) {
                               setSelectedProcessos(processosData.map(p => p.id));
                             } else {
                               setSelectedProcessos([]);
                             }
                           }}
                           size="md"
                         />
                       </Tooltip>

                       <Select
                         placeholder="Filtrar por defensoria..."
                         data={[
                           '1ª Defensoria Pública',
                           '2ª Defensoria Pública',
                           '3ª Defensoria Pública',
                           '4ª Defensoria Pública'
                         ]}
                         value={filterDefensoria}
                         onChange={setFilterDefensoria}
                         style={{ minWidth: 200 }}
                         rightSection={<IconSearch size={16} />}
                       />
                     </Group>
                     <Group gap="xs" align="center">
                       <TextInput
                         placeholder="Filtrar..."
                         value={filterGeral}
                         onChange={(e) => setFilterGeral(e.target.value)}
                         style={{ minWidth: 200 }}
                       />
                       <ActionIcon variant="light" size="lg">
                         <IconFilter size={16} />
                       </ActionIcon>
                       {selectedProcessos.length > 0 && (
                         <Menu 
                           shadow="md" 
                           width={280} 
                           position="bottom-end"
                           closeOnItemClick={false}
                         >
                           <Menu.Target>
                             <ActionIcon 
                               variant="light" 
                               size="lg"
                               title={`${selectedProcessos.length} processo(s) selecionado(s)`}
                               style={{ cursor: 'pointer' }}
                             >
                               <IconChecklist size={16} />
                             </ActionIcon>
                           </Menu.Target>

                           <Menu.Dropdown>
                             <Menu.Label c="dark" style={{ color: '#2d5a27', fontWeight: 600 }}>
                               Ação para o item selecionado
                             </Menu.Label>
                             <Menu.Label size="xs" c="dimmed">
                               {selectedProcessos.length} processo(s) selecionado(s)
                             </Menu.Label>
                             
                             <Menu.Divider />
                             
                             {acoesDisponiveis.map((acao) => (
                               <Menu.Item key={acao.id}>
                                 <Group>
                                   <Checkbox
                                     checked={acoesSelecionadas.includes(acao.id)}
                                     onChange={(event) => {
                                       event.stopPropagation();
                                       handleAcaoChange(acao.id, event.currentTarget.checked);
                                     }}
                                     size="sm"
                                   />
                                   <Text size="sm">{acao.label}</Text>
                                 </Group>
                               </Menu.Item>
                             ))}
                             
                             <Menu.Divider />
                             
                             <Menu.Item 
                               onClick={handleSalvarAcoes}
                               disabled={acoesSelecionadas.length === 0}
                               style={{ textAlign: 'center' }}
                             >
                               <Text size="sm" fw={500}>Salvar</Text>
                             </Menu.Item>
                           </Menu.Dropdown>
                         </Menu>
                       )}
                       <ActionIcon variant="light" size="lg">
                         <IconRefresh size={16} />
                       </ActionIcon>
                     </Group>
                   </Group>
                 </Box>

          {/* Lista de Processos */}
          <Box style={{ flex: 1, overflow: 'hidden' }}>
            <ScrollArea style={{ height: '100%' }}>
              <Box p="md">
                       <Stack gap="md">
                         {processosData.map((processo) => (
                           <ProcessoCard 
                             key={processo.id} 
                             processo={processo}
                             isSelected={selectedProcessos.includes(processo.id)}
                             triagemResultado={triagemResultados[processo.id] || null}
                             triagemManualResultado={triagemManualResultados[processo.id] || null}
                             tarefas={processoTarefas[processo.id] || []}
                             onToggleSelect={(id) => {
                               setSelectedProcessos(prev => 
                                 prev.includes(id) 
                                   ? prev.filter(p => p !== id)
                                   : [...prev, id]
                               );
                             }}
                             onTriagemManual={handleTriagemManual}
                           />
                         ))}
                       </Stack>
              </Box>
            </ScrollArea>
          </Box>
        </Box>
      </Flex>

      {/* Botão de Ação Flutuante */}
      <ActionIcon
        size="xl"
        radius="xl"
        color="blue"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000
        }}
      >
        <IconPlus size={24} />
      </ActionIcon>

             {/* Link discreto para voltar ao Hub */}
             <Group justify="center" mt="xl" pb="xl">
               <Link href="/">
                 <Text c="dimmed" size="sm">
                   Voltar para a Central
                 </Text>
               </Link>
             </Group>

             {/* Indicador de Modo Auto-Criar Tarefas */}
             {autoCriarTarefas && (
               <Paper
                 p="xs"
                 style={{
                   position: 'fixed',
                   bottom: '10px',
                   left: '10px',
                   zIndex: 99999,
                   backgroundColor: 'rgba(254, 243, 199, 0.3)',
                   border: '1px solid rgba(245, 158, 11, 0.3)',
                   opacity: 0.3,
                 }}
               >
                 <Group gap="xs">
                   <IconSparkles size={16} color="#d97706" />
                   <Text size="xs" fw={600} c="dark">
                     Auto-criar tarefas: ON
                   </Text>
                 </Group>
               </Paper>
             )}

             {/* Overlay de Loading para Triagem por IA */}
             {isLoadingTriagem && (
               <Overlay
                 color="#000"
                 backgroundOpacity={0.6}
                 blur={2}
                 style={{
                   position: 'fixed',
                   top: 0,
                   left: 0,
                   right: 0,
                   bottom: 0,
                   zIndex: 9999,
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center'
                 }}
               >
                 <Box
                   style={{
                     backgroundColor: 'white',
                     padding: '2rem',
                     borderRadius: '12px',
                     textAlign: 'center',
                     boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                     maxWidth: '400px',
                     width: '90%'
                   }}
                 >
                   <Loader size="xl" color="blue" style={{ marginBottom: '1rem' }} />
                   <Title order={3} mb="sm" c="dark">
                     Processando Triagem por IA
                   </Title>
                   <Text c="dimmed" size="sm">
                     Analisando {selectedProcessos.length} intimação(ões) selecionada(s)...
                   </Text>
                   <Text c="dimmed" size="xs" mt="xs">
                     Isso pode levar alguns segundos
                   </Text>
                 </Box>
               </Overlay>
             )}

           </>
         );
       }
