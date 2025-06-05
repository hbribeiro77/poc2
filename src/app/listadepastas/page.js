'use client';

import React, { useState, useEffect } from 'react'; // Adicionado useState, useEffect
import { Box, Flex, Card, Title, Text, Image, Group, ThemeIcon, Alert, Stack, Button, Select, ActionIcon, Badge, Tabs, Divider } from '@mantine/core';
import { IconFolders, IconInfoCircle, IconFolderPlus, IconPlus, IconTag, IconFolder, IconSettings, IconArrowUp, IconSortAscending, IconFolderCheck, IconArchive, IconSortDescending } from '@tabler/icons-react';
import Link from 'next/link';
import PastaListItem from '../../components/PastaListItem/PastaListItem'; // Importa o novo componente
import pastasDataFromJson from '../../data/pastas-data.json'; // Renomeado para clareza
// Importar apenas os ícones necessários se houver algum elemento visual específico aqui,
// por enquanto, apenas a Image é usada na coluna esquerda.
// Importa useSearchParams para ler parâmetros da URL
import { useSearchParams } from 'next/navigation';

// --- Função para Gerar Dados Fictícios ---
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
  const statuses = ['Ativa', 'Arquivada']; // Adiciona lista de status

  for (let i = 1; i <= count; i++) {
    const hasTags = Math.random() > 0.7; // 30% chance de ter tag "Réu preso"
    const processoNum = 8000000 + Math.floor(Math.random() * 100000);
    const ano = 2020 + Math.floor(Math.random() * 5);
    const comarcaIndex = Math.floor(Math.random() * comarcas.length);
    const status = statuses[Math.floor(Math.random() * statuses.length)]; // Pega status aleatório

    generatedPastas.push({
      id: `gen-${i}`, // ID único para itens gerados
      processoPrincipal: `${processoNum}-47.${ano}.8.21.${String(comarcaIndex + 1).padStart(4, '0')}`,
      tags: hasTags ? ['Réu preso'] : [],
      status: status, // <<< Adiciona Status aleatório
      ultimoAtendimento: `01/0${Math.floor(Math.random() * 9) + 1}/2024`, // Data aleatória
      comarca: comarcas[comarcaIndex],
      orgaoJulgador: `Vara Genérica ${i} da ${comarcas[comarcaIndex]}`,
      area: areas[Math.floor(Math.random() * areas.length)],
      classe: `Classe Genérica ${i}`,
      assunto: assuntos[Math.floor(Math.random() * assuntos.length)],
      descricao: `Descrição automática para pasta gerada número ${i}.`,
      processosAssociados: [`${processoNum}-47.${ano}.8.21.${String(comarcaIndex + 1).padStart(4, '0')}`] // Começa só com o principal
    });
  }
  return generatedPastas;
}
// --- Fim da Função Geradora ---

export default function PastasPage() {
  const searchParams = useSearchParams();

  // Estado para armazenar as pastas a serem exibidas.
  // OBS: A inicialização com JSON foi movida para dentro do useEffect
  // para garantir que a lógica de geração funcione corretamente na hidratação.
  const [pastasToDisplay, setPastasToDisplay] = useState([]); // Inicializa vazio
  // Estado para rastrear se o componente já montou no cliente.
  const [isMounted, setIsMounted] = useState(false);
  // NOVO ESTADO: para controlar a aba ativa
  const [activeTab, setActiveTab] = useState('ativas');

  useEffect(() => {
    // Este código só roda no cliente, após a montagem inicial.
    setIsMounted(true);

    const generateParam = searchParams.get('generate');
    const generateCount = parseInt(generateParam, 10);

    if (!isNaN(generateCount) && generateCount > 0) {
      // Se o parâmetro 'generate' for válido, gera dados FAKE no cliente.
      setPastasToDisplay(generateFakePastas(generateCount));
    } else {
      // Garante que os dados do JSON sejam usados se não houver parâmetro válido.
      // (Pode ser redundante devido ao estado inicial, mas seguro)
      setPastasToDisplay(pastasDataFromJson);
    }
    // A dependência [searchParams] garante que isso re-execute se a URL mudar.
  }, [searchParams]);

  // Função para ARQUIVAR uma pasta
  const handleArchivePasta = (pastaId, reason, observation) => {
    setPastasToDisplay(currentPastas =>
      currentPastas.map(pasta =>
        pasta.id === pastaId
          ? { ...pasta, status: 'Arquivada', motivoArquivamento: reason, observacaoArquivamento: observation }
          : pasta
      )
    );
  };

  // Função para DESARQUIVAR uma pasta
  const handleUnarchivePasta = (pastaId) => {
    setPastasToDisplay(currentPastas =>
      currentPastas.map(pasta =>
        pasta.id === pastaId
          ? { ...pasta, status: 'Ativa', motivoArquivamento: undefined, observacaoArquivamento: undefined } // Limpa motivo/obs ao desarquivar
          : pasta
      )
    );
  };

  // Calcula as contagens DEPOIS de carregar os dados (gerados ou JSON)
  const countAtivas = pastasToDisplay.filter(p => p.status === 'Ativa').length;
  const countArquivadas = pastasToDisplay.filter(p => p.status === 'Arquivada').length;
  const countTodas = pastasToDisplay.length; // << Nova contagem para todas as pastas

  // Filtra as pastas com base na aba ativa
  const filteredPastas = pastasToDisplay.filter(pasta => {
    if (activeTab === 'ativas') {
      return pasta.status === 'Ativa';
    }
    if (activeTab === 'arquivadas') {
      return pasta.status === 'Arquivada';
    }
    if (activeTab === 'todas') { // << Novo caso para todas as pastas
      return true; // Retorna todas as pastas sem filtro de status
    }
    return false;
  });

  // Estilo comum para as abas
  const tabStyle = {
    fontFamily: 'Open Sans, sans-serif',
    fontWeight: 700,
    fontSize: '12px',
    lineHeight: '155%',
    letterSpacing: '0%',
    color: '#0d99ff'
  };

  // const theme = useMantineTheme(); // Descomentar se precisar do tema

  return (
    <>
      <Flex gap={0} pb="xl"> 

        {/* Coluna Esquerda (Imagem - igual à de Notificações) */}
        <Box style={{ maxWidth: 250, height: '100%' }}> 
          <Image
              src="/menulateral.png" 
              alt="Menu Lateral"
              height="70%"
              fit="contain"
          />
        </Box>

        {/* Coluna Direita (Conteúdo Pastas) */}
        <Box style={{ flex: 1 }}> 
          {/* Manter Card externo sem padding */}
          <Card shadow="sm" padding={0} radius="md" withBorder>
            {/* Box interno com padding ajustado (sem top padding) */}
            <Box pt={0} px="lg" pb="lg">
              {/* Adicionar Imagem do Menu Fake Acima */}
              <Image 
                src="/menucadastro.png"
                alt="Menu de Cadastro"
                width="100%" // Ocupar largura
                mb="lg" // Margem abaixo da imagem
              />

              {/* NOVA SEÇÃO DE ABAS E BARRA DE FERRAMENTAS */}
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

                  {/* Nova Aba - Todas as Pastas */}
                  <Tabs.Tab
                    value="todas"
                    leftSection={<IconFolders size={14} />} // Ícone para todas as pastas
                    style={tabStyle}
                  >
                    Todas as Pastas ({countTodas})
                  </Tabs.Tab>

                  {/* Barra de Ferramentas/Filtros movida para dentro do Tabs.List para alinhar à direita */}
                  <Group justify="flex-end" gap="xs" wrap="nowrap" style={{ flexGrow: 1, marginRight: 'var(--mantine-spacing-md)' }}>
                     {/* Ajustes na barra de ferramentas */}
                <Button 
                  variant="subtle" 
                  size="xs" 
                  leftSection={<IconSettings size={14}/>} 
                       style={tabStyle}
                >
                   Configurações de exibição
                </Button>
                <Button 
                  variant="subtle" 
                  size="xs" 
                       leftSection={<IconSortDescending size={14}/>}
                       style={tabStyle}
                >
                        Remover destaque
                </Button>
                     <Badge color="orange" variant="light">RÉU PRESO</Badge> {/* Cor pode ser 'orange' ou 'yellow' */}
                <Select 
                  placeholder="Último atendimento" 
                  data={[]} 
                  size="xs"
                       style={{ minWidth: 150 }} // Ajuste a largura
                  rightSectionWidth={20}
                />
                <ActionIcon variant="filled" color="green" size="lg">
                        {/* Ícone alterado */}
                        <IconSortDescending size={18}/>
                </ActionIcon>
                   </Group>
                </Tabs.List>
              </Tabs>

              {/* Título movido para baixo das abas com fundo cinza */}
              <Group align="center" mb="lg" bg="gray.1" p="sm">
                <ThemeIcon variant="light" size="lg">
                    <IconFolders stroke={1.5} /> {/* Ícone para Pastas do Assistido */}
                </ThemeIcon>
                <Text fw={500} size="lg">Pastas do Assistido</Text> {/* Texto do Título */}
              </Group>

              {/* Área para a lista de pastas */}
              <Stack>
                {/* Renderiza o conteúdo da lista APENAS após a montagem no cliente */}
                {isMounted ? (
                  filteredPastas.length === 0 ? (
                  <Alert 
                    variant="light" 
                    color="blue" 
                    title="Nenhuma pasta encontrada." 
                    icon={<IconInfoCircle />}
                  >
                      {/* Mensagem ajustada para refletir o carregamento inicial */}
                      Não há pastas para exibir (verifique o filtro aplicado ou aguarde o carregamento).
                  </Alert>
                ) : (
                    // Renderiza a lista usando os dados FILTRADOS e passa handlers
                    filteredPastas.map(pasta => (
                      <PastaListItem 
                         key={pasta.id} 
                         pasta={pasta} 
                         onArchive={handleArchivePasta} // << Passando handler de arquivar
                         onUnarchive={handleUnarchivePasta} // << Passando handler de desarquivar
                      />
                  ))
                  )
                ) : (
                  // Mostra um placeholder durante a renderização inicial no servidor e primeira hidratação
                  <Text ta="center" c="dimmed">Carregando pastas...</Text>
                )}
              </Stack>

              {/* Remover texto placeholder antigo */}
              {/* 
              <Text>
                Conteúdo da página de listagem de pastas virá aqui...
              </Text>
              */}
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
    </>
  );
} 