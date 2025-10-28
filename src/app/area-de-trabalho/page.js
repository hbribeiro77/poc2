'use client';

import { 
  Box, Flex, Card, Title, Text, Image, Group, ThemeIcon, Button, 
  Tabs, TextInput, ActionIcon, ScrollArea, Stack, Badge, Divider,
  Paper, Textarea, Select, Modal, Grid, Menu, Checkbox, Loader, Overlay
} from '@mantine/core';
import Link from 'next/link';
import { 
  IconCheck, IconFileText, IconMessageCircle, IconCalendar, 
  IconGavel, IconCloudUpload, IconHourglass, IconSearch, 
  IconRefresh, IconFilter, IconSparkles, IconPlus, IconClock, 
  IconRefresh as IconRefreshCycle, IconArrowsMaximize, IconX, 
  IconPlayerPlay, IconChecklist
} from '@tabler/icons-react';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import ProcessoCard from '../../components/ProcessoCard/ProcessoCard';
import processosData from '../../data/processos-data.json';

export default function AreaDeTrabalhoPage() {
  const [activeTab, setActiveTab] = useState('intimacoes');
  const [filterDefensoria, setFilterDefensoria] = useState('');
  const [filterGeral, setFilterGeral] = useState('');
  const [selectedProcessos, setSelectedProcessos] = useState([]);
  const [acoesSelecionadas, setAcoesSelecionadas] = useState([]);
  const [isLoadingTriagem, setIsLoadingTriagem] = useState(false);
  const [triagemResultados, setTriagemResultados] = useState({});
  const [triagemManualResultados, setTriagemManualResultados] = useState({});

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
        selectedProcessos.forEach(processoId => {
          // Simula resultado aleatório: 60% "Elaborar peça", 40% "Renunciar ao prazo"
          const resultado = Math.random() < 0.6 ? 'Elaborar peça' : 'Renunciar ao prazo';
          novosResultados[processoId] = resultado;
        });
        
        setTriagemResultados(prev => ({ ...prev, ...novosResultados }));
        
        notifications.show({
          title: 'Triagem por IA Concluída!',
          message: `Aplicando ações: ${acoesSelecionadas.join(', ')} em ${selectedProcessos.length} processo(s)`,
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

  return (
    <>
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
          <Image
            src="/menulateral.png"
            alt="Menu Lateral"
            height="100%"
            fit="contain"
            style={{ 
              width: '100%',
              objectPosition: 'top'
            }}
          />
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
