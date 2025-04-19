"use client";

import { useState } from 'react';
import {
  Container,
  Card,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Pagination,
  Collapse,
  ActionIcon,
  Tooltip,
  useMantineTheme,
  Box,
  Flex,
  Grid,
  Paper,
  Avatar,
  Indicator,
  NavLink,
  ThemeIcon,
  ScrollArea,
  UnstyledButton,
  Center,
  Image,
  Anchor,
} from '@mantine/core';
import {
  IconBell,
  IconEyeOff,
  IconEye,
  IconClock,
  IconMinus,
  IconPlus,
  IconHome,
  IconUsers,
  IconFolder,
  IconScale,
  IconArrowsLeftRight,
  IconClipboardText,
  IconGavel,
  IconBook,
  IconCalendar,
  IconHistory,
  IconDatabase,
  IconCheck,
  IconFileText,
  IconChevronLeft,
  IconCirclesRelation,
  IconBuildingArch,
} from '@tabler/icons-react';
import Link from 'next/link';

// Dados de exemplo extraídos do HTML (simplificado)
const sampleNotificationsData = [
  {
    id: 'tarefas29252',
    dataCriacao: '2025-03-21T19:00:04Z',
    descricao: 'Em 21/03/2025 às 19:00, esgotou o prazo da tarefa "Complementar os dados do cadastro".',
    ocultado: false,
    agrupadas: [
      { id: 'ag1', dataCriacao: '2025-03-10T17:23:10Z', texto: 'Teste Defensor - Portal Defensor O prazo da tarefa "Complementar os dados do cadastro" foi alterado de 20/03/2025 às 19:00 para 21/03/2025 às 19:00.' },
      { id: 'ag2', dataCriacao: '2025-03-10T17:23:00Z', texto: 'Teste Defensor - Portal Defensor adicionou prazo à tarefa "Complementar os dados do cadastro" que se encerra em 20/03/2025 às 19:00.' },
      { id: 'ag3', dataCriacao: '2025-03-10T17:22:47Z', texto: 'Teste Defensor - Portal Defensor alterou o responsável da tarefa "Complementar os dados do cadastro" de Humberto Borges Ribeiro para Teste Defensor - Portal Defensor.' },
    ]
  },
  {
    id: 'tarefas9954',
    dataCriacao: '2025-03-18T14:11:05Z',
    descricao: 'Teste Servidor - Portal Defensor desinscreveu Humberto Borges Ribeiro da tarefa. "TsT".',
    ocultado: false,
    agrupadas: [
      { id: 'ag4', dataCriacao: '2025-03-18T14:11:02Z', texto: 'Teste Servidor - Portal Defensor desinscreveu Teste Defensor Terceiro da tarefa. "TsT".' },
      { id: 'ag5', dataCriacao: '2025-03-18T14:11:01Z', texto: 'Teste Servidor - Portal Defensor desinscreveu Teste Defensor Segundo - Portal Defensor da tarefa. "TsT".' },
      // Adicione mais itens agrupados se necessário, o HTML original tinha 37
    ]
  },
   {
    id: 'tarefas31153',
    dataCriacao: '2025-02-05T15:26:23Z',
    descricao: 'Teste Defensor - Portal Defensor inscreveu Marcio Zaiosc Almeida na tarefa. "tarefa para teste defensor".',
    ocultado: false,
    agrupadas: [
        { id: 'ag6', dataCriacao: '2025-02-05T15:26:13Z', texto: 'Teste Defensor - Portal Defensor inscreveu-se na tarefa. "tarefa para teste defensor".' },
        { id: 'ag7', dataCriacao: '2025-02-05T15:25:52Z', texto: 'Teste Defensor - Portal Defensor alterou o responsável da tarefa "tarefa para teste defensor" de Teste Defensor - Portal Defensor para Humberto Borges Ribeiro.' },
    ]
   },
   {
    id: 'notif-sem-grupo-1',
    dataCriacao: '2025-02-28T10:51:00Z',
    descricao: 'Teste Defensor - Portal Defensor criou a tarefa "corrigir".',
    ocultado: false,
    agrupadas: []
   },
   {
    id: 'notif-sem-grupo-2',
    dataCriacao: '2025-02-25T14:25:04Z',
    descricao: 'Teste Defensor - Portal Defensor criou a tarefa "teste".',
    ocultado: true, // Exemplo de notificação ocultada
    agrupadas: []
   },
  // Adicionar mais notificações do exemplo HTML conforme necessário
];

// Componente para formatar data relativa (muito simplificado)
// Em um projeto real, usaríamos uma lib como date-fns ou dayjs
function formatRelativeTime(isoDateString) {
  try {
    const date = new Date(isoDateString);
    const now = new Date();
    // Check for invalid date
    if (isNaN(date.getTime())) {
      return "Data inválida";
    }

    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);

    if (diffDays <= 1) return 'hoje'; // Including today
    if (diffDays < 7) return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
    if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
    if (diffMonths < 12) return `há ${diffMonths} mês${diffMonths > 1 ? 'es' : ''}`;
    return `há mais de um ano`;
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Data inválida";
  }
}

function NotificationItem({ notification, onToggleOcultar }) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const temAgrupadas = notification.agrupadas && notification.agrupadas.length > 0;

  const handleOcultarClick = (e) => {
    e.preventDefault(); // Previne navegação se estiver dentro de um Link
    onToggleOcultar(notification.id);
  };

  const formattedDate = new Date(notification.dataCriacao).toLocaleString('pt-BR');

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      mb="md"
      style={{ opacity: notification.ocultado ? 0.6 : 1 }}
    >
      <Flex justify="space-between" align="flex-start" wrap="wrap">
        {/* Coluna Esquerda */}
        <Box style={{ flexBasis: '60%', flexGrow: 1, minWidth: '250px' }} pr="md">
          <Group gap="xs" mb={5}>
            <IconClock size={16} color={theme.colors.gray[6]} />
            <Tooltip label={formattedDate}>
              <Text size="xs" c="dimmed">
                {formatRelativeTime(notification.dataCriacao)}
              </Text>
            </Tooltip>
          </Group>
          <Text size="sm" mb={temAgrupadas ? 'xs' : 0}>
            {notification.descricao}
          </Text>

          {temAgrupadas && (
             <>
               <Collapse in={opened}>
                 <Stack gap="xs" mt="xs" pl="lg" style={{ borderLeft: `1px solid ${theme.colors.gray[3]}` }}>
                   {notification.agrupadas.map(agrupada => {
                     const formattedAgrupadaDate = new Date(agrupada.dataCriacao).toLocaleString('pt-BR');
                     return (
                       <Box key={agrupada.id}>
                          <Group gap="xs">
                              <IconClock size={14} color={theme.colors.gray[6]} />
                              <Tooltip label={formattedAgrupadaDate}>
                              <Text size="xs" c="dimmed">
                                  {formatRelativeTime(agrupada.dataCriacao)}
                              </Text>
                              </Tooltip>
                          </Group>
                          <Text size="xs" ml={20}>{agrupada.texto}</Text>
                       </Box>
                     );
                   })}
                 </Stack>
               </Collapse>
               <Button
                  variant="subtle"
                  size="xs"
                  onClick={() => setOpened((o) => !o)}
                  leftSection={opened ? <IconMinus size={14} /> : <IconPlus size={14} />}
                  color="gray"
                  mt="xs"
                >
                  {`${notification.agrupadas.length} notificaç${notification.agrupadas.length > 1 ? 'ões' : 'ão'} anterior${notification.agrupadas.length > 1 ? 'es' : ''}`}
                </Button>
             </>
          )}
        </Box>

        {/* Coluna Direita */}
        <Box style={{ flexBasis: '35%', flexGrow: 1, minWidth: '150px' }} mt={{ base: 'md', sm: 0 }}>
           <Group justify="flex-end">
             <Tooltip label={notification.ocultado ? "Desocultar" : "Ocultar"}>
               <ActionIcon
                 variant="default"
                 size="lg"
                 onClick={handleOcultarClick}
                 aria-label={notification.ocultado ? "Desocultar notificação" : "Ocultar notificação"}
               >
                 <IconEyeOff size={18} />
               </ActionIcon>
             </Tooltip>
            <Tooltip label="Visualizar (não implementado)">
                <ActionIcon
                    variant="filled"
                    color="blue"
                    size="lg"
                    aria-label="Visualizar notificação"
                    // onClick={() => console.log('Visualizar', notification.id)} // Adicionar lógica depois
                >
                    <IconEye size={18} />
                </ActionIcon>
            </Tooltip>
           </Group>
        </Box>
      </Flex>
    </Card>
  );
}


export default function NotificacoesPage() {
  const theme = useMantineTheme();
  const [activePage, setPage] = useState(1);
  const [notifications, setNotifications] = useState(sampleNotificationsData);
  const itemsPerPage = 5; // Ajuste conforme necessário

  // Lógica de paginação
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = notifications.slice(startIndex, endIndex);

  // Função para ocultar/desocultar (atualiza estado localmente)
  const toggleOcultar = (id) => {
    setNotifications(current =>
      current.map(notif =>
        notif.id === id ? { ...notif, ocultado: !notif.ocultado } : notif
      )
    );
  };

  // Função para ocultar todas (simulada)
  const hideAll = () => {
     setNotifications(current =>
        current.map(notif => ({ ...notif, ocultado: true }))
     );
     console.log("Ocultar todas (simulado)");
  }

  // Idealmente, buscaria dados reais aqui com useEffect

  const menuItems = [
    { icon: IconHome, label: 'Área de Trabalho', href: '#' },
    { icon: IconUsers, label: 'Busca de Assistidos', href: '#' },
    { icon: IconFolder, label: 'Busca de Pastas', href: '#' },
    { icon: IconScale, label: 'Processos', href: '#' },
    { icon: IconArrowsLeftRight, label: 'Carga e Devolução', href: '#' },
    { icon: IconClipboardText, label: 'Controle de Protocolo', href: '#' },
    { icon: IconGavel, label: 'Audiências e Sessões', href: '#' },
    { icon: IconBook, label: 'Banco de Peças', href: '#' },
    { icon: IconCalendar, label: 'Consultar Agenda', href: '#' },
    { icon: IconHistory, label: 'Histórico de Atividades', href: '#' },
    { icon: IconDatabase, label: 'Administração de Dados', href: '#' },
    { icon: IconCheck, label: 'Gestão de Tarefas', href: '#' },
    { icon: IconFileText, label: 'Gestão de Ofícios', href: '#' },
  ];

  return (
    <>
      <Flex gap={0} py="xl">
        {/* Coluna Esquerda (Imagem) */}
        <Box style={{ maxWidth: 250, height: '100%' }}>
          <Image
              src="/menulateral.png" 
              alt="Menu Lateral"
              height="70%"
              fit="contain"
          />
        </Box>

        {/* Coluna Direita (Notificações) */}
        <Box style={{ flex: 1 }}>
          <Card shadow="sm" padding={0} radius="md" withBorder>
            <Box p="lg">
              <Group justify="space-between" mb="lg">
                <Title order={2}>
                  <Group gap="xs">
                    <IconBell size={28} />
                    Notificações ({notifications.length})
                  </Group>
                </Title>
                <Group>
                  <Button variant="default" disabled>
                    Ver Ocultadas
                  </Button>
                  <Button onClick={hideAll} color="red">
                    Ocultar Todas
                  </Button>
                </Group>
              </Group>

              {currentNotifications.length > 0 ? (
                currentNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onToggleOcultar={toggleOcultar}
                  />
                ))
              ) : (
                <Text>Nenhuma notificação para exibir.</Text>
              )}

              {totalPages > 1 && (
                <Group justify="center" mt="xl">
                  <Pagination
                    total={totalPages}
                    value={activePage}
                    onChange={setPage}
                  />
                </Group>
              )}
            </Box>
          </Card>
        </Box>
      </Flex>

      {/* Link discreto para voltar ao Hub (atualizado) */}
      <Group justify="center" mt="xl" pb="xl">
        <Link href="/">
          <Text c="dimmed" size="sm">
            Voltar para a Central
          </Text>
        </Link>
      </Group>
    </>
  );
} 