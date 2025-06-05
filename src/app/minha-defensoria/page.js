"use client";

import React, { useState, useEffect } from 'react';
import {
  Group,
  Text,
  Box,
  Title,
  ThemeIcon,
  Image,
  Card,
  Flex,
  useMantineTheme,
  Select,
  Table,
  Badge,
  ActionIcon,
  Stack,
  Button,
  Tooltip,
  Divider,
  Alert,
  Skeleton,
  Modal,
  Select as MantineSelect,
  Switch,
} from '@mantine/core';
import Link from 'next/link';
import {
  IconUserCircle,
  IconX,
  IconPlus,
  IconPlaylistAdd,
  IconUserOff,
  IconUsers,
  IconAlertTriangle,
  IconChevronDown,
  IconChevronUp,
  IconInfoCircle,
} from '@tabler/icons-react';

// Importa os dados das equipes do arquivo JSON
import equipesData from '../../data/dadosEquipesDefensorias.json';
// Importa o novo componente da tabela
import EquipeTrabalhoTable from '../../components/EquipeTrabalhoTable/EquipeTrabalhoTable';
// IMPORTA o novo componente de botões de ação
import DefensoriaActionButtons from '../../components/DefensoriaActionButtons/DefensoriaActionButtons';

// Definição das descrições das funções para o tooltip do cabeçalho da seção
const funcoesDescricoes = {
  "Gerente de Defensoria": "Pode adicionar/remover usuários, adicionar/remover suas funções e gerenciar a defensoria.",
  "Revisor de Atendimento": "Pode revisar os atendimentos registrados.",
  "Revisor de Peça": "Pode revisar as peças processuais elaboradas.",
  "Administrador de agenda": "Pode configurar e gerenciar a agenda de atendimentos da defensoria."
};

// Clonar os dados importados para evitar mutação direta do objeto importado
const equipesPorDefensoria = JSON.parse(JSON.stringify(equipesData));

// Preenche as equipes para as defensorias 3ª a 8ª com a equipe genérica, APENAS SE NÃO EXISTIREM NO JSON
for (let i = 3; i <= 8; i++) {
  const defensoriaName = `${i}ª DEFENSORIA PÚBLICA ESPECIALIZADA DO JÚRI DO FORO CENTRAL`;
  if (!equipesPorDefensoria[defensoriaName]) { // Só preenche se a defensoria não vier do JSON
    equipesPorDefensoria[defensoriaName] = equipesPorDefensoria._genericTeam.map(member => ({...member, id: `${member.id}_${i}`})); // Adiciona sufixo ao ID para unicidade
  }
}

// Informações do usuário logado (Humberto)
const loggedUser = {
  id: 'tecHumberto', // CORRIGIDO: ID correspondente ao JSON
  nome: "Humberto Borges Ribeiro",
  matricula: "3925811",
  defensoriaOriginal: "1ª DEFENSORIA PÚBLICA ESPECIALIZADA DO JÚRI DO FORO CENTRAL"
};

export default function MinhaDefensoriaPage() {
  const theme = useMantineTheme();
  
  const defensoriasOptions = Array.from({ length: 8 }, (_, i) => ({
    value: `${i + 1}ª DEFENSORIA PÚBLICA ESPECIALIZADA DO JÚRI DO FORO CENTRAL`,
    label: `${i + 1}ª DEFENSORIA PÚBLICA ESPECIALIZADA DO JÚRI DO FORO CENTRAL`,
  }));

  const [selectedDefensoria, setSelectedDefensoria] = useState(defensoriasOptions[0].value);
  const [teamMembers, setTeamMembers] = useState(equipesPorDefensoria[selectedDefensoria] || []);
  const [showNotInTeamAlert, setShowNotInTeamAlert] = useState(false); // Estado para o alerta
  const [isLoading, setIsLoading] = useState(true); // Estado para o Skeleton
  const [isTeamSectionCollapsed, setIsTeamSectionCollapsed] = useState(false); // Estado para colapso da seção

  // Estados para paginação da tabela
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Valor padrão de itens por pagina

  // Estados para o Modal de Adicionar Função
  const [isAddFuncaoModalOpen, setIsAddFuncaoModalOpen] = useState(false);
  const [selectedMemberIdForFuncao, setSelectedMemberIdForFuncao] = useState(null);
  const [funcaoSelecionadaParaAdicionar, setFuncaoSelecionadaParaAdicionar] = useState('');
  const [isUserGerenteNaDefensoriaSelecionada, setIsUserGerenteNaDefensoriaSelecionada] = useState(false);

  // Estados para a Modal de Informações do Usuário
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [selectedUserForInfo, setSelectedUserForInfo] = useState(null);

  // Estado para controlar a visibilidade dos botões de ação do módulo
  const [mostrarBotoesAcao, setMostrarBotoesAcao] = useState(false); 

  const funcoesDisponiveisParaAdicao = ["Gerente de Defensoria", "Revisor de Atendimento", "Revisor de Peça", "Administrador de agenda"];

  // Efeito para simular o carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 segundo de delay
    return () => clearTimeout(timer); // Limpa o timer se o componente desmontar
  }, []);

  // Efeito para atualizar a equipe e controlar o Skeleton ao mudar a defensoria
  useEffect(() => {
    // Não aciona o skeleton de mudança se for o carregamento inicial ainda acontecendo
    // Ou se não houver selectedDefensoria (caso extremo)
    if (!selectedDefensoria) return;

    // Define isLoading como true para mostrar o Skeleton
    setIsLoading(true);

    const timer = setTimeout(() => {
      const newTeamMembers = equipesPorDefensoria[selectedDefensoria] || equipesPorDefensoria._genericTeam.map(member => ({...member, id: `${member.id}_genericFallback`})); // Fallback com ID único se defensoria não existir
      setTeamMembers(newTeamMembers);
      setCurrentPage(1); // Reseta para a primeira página ao mudar a equipe
      
      // Lógica para exibir o alerta: verifica se o usuário logado está na equipe da defensoria selecionada
      const isUserInSelectedTeam = newTeamMembers.some(member => member.id === loggedUser.id);
      if (!isUserInSelectedTeam) {
        setShowNotInTeamAlert(true);
        setIsUserGerenteNaDefensoriaSelecionada(false); // Se não está na equipe, não é gerente lá
      } else {
        setShowNotInTeamAlert(false);
        // Verifica se o usuário logado é Gerente de Defensoria na equipe selecionada
        const loggedUserDetailsInTeam = newTeamMembers.find(member => member.id === loggedUser.id);
        const isGerente = loggedUserDetailsInTeam?.funcoes.some(funcao => funcao.nome === "Gerente de Defensoria");
        setIsUserGerenteNaDefensoriaSelecionada(isGerente || false);
      }
      setIsLoading(false); // Esconde o Skeleton após atualizar os dados
    }, 700); // Delay um pouco menor para trocas, pode ser ajustado

    return () => clearTimeout(timer); // Limpa o timer se o componente desmontar ou selectedDefensoria mudar novamente

  }, [selectedDefensoria]); // Dependência principal é selectedDefensoria

  const handleRemoveFuncao = (memberId, funcaoNameToRemove) => {
    setTeamMembers((currentMembers) =>
      currentMembers.map((member) => {
        if (member.id === memberId) {
          return {
            ...member,
            funcoes: member.funcoes.filter(
              (funcao) => funcao.nome !== funcaoNameToRemove
            ),
          };
        }
        return member;
      })
    );
  };

  const handleAddFuncao = (memberId) => {
    console.log("Adicionar função para o membro:", memberId);
  };

  const handleAddUsuario = () => {
    console.log("Adicionar novo usuário");
  };

  const handleRemoveUsuario = (memberId) => {
    console.log("Remover usuário:", memberId);
  };

  // Lógica para abrir o modal de adicionar função
  const handleOpenAddFuncaoModal = (memberId) => {
    setSelectedMemberIdForFuncao(memberId);
    setIsAddFuncaoModalOpen(true);
    setFuncaoSelecionadaParaAdicionar(''); // Reseta a seleção ao abrir
  };

  // Lógica para confirmar a adição da função
  const handleConfirmAddFuncao = () => {
    if (!selectedMemberIdForFuncao || !funcaoSelecionadaParaAdicionar) return;

    setTeamMembers(currentMembers =>
      currentMembers.map(member => {
        if (member.id === selectedMemberIdForFuncao) {
          // Verifica se a função já existe para não duplicar
          const funcaoJaExiste = member.funcoes.some(f => f.nome === funcaoSelecionadaParaAdicionar);
          if (!funcaoJaExiste) {
            return {
              ...member,
              funcoes: [...member.funcoes, { nome: funcaoSelecionadaParaAdicionar, removivel: true }],
            };
          }
        }
        return member;
      })
    );
    setIsAddFuncaoModalOpen(false);
    setSelectedMemberIdForFuncao(null);
    setFuncaoSelecionadaParaAdicionar('');
  };

  // Função para gerar uma data de entrada fictícia (para a modal de informações)
  const generateRandomEntryDate = () => {
    const year = 2020 + Math.floor(Math.random() * 5); // Entre 2020 e 2024
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1; // Simples, para evitar problemas com meses
    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
  };

  // Lógica para buscar e mostrar informações do usuário
  const handleShowUserInfo = (memberId) => {
    let userInfo = null;
    const userTeamsDetails = [];

    // Primeiro, encontrar os dados básicos do usuário (nome, matrícula, cargo)
    // Procuramos em todas as equipes, pois o memberId é único globalmente (ou deveria ser)
    Object.values(equipesPorDefensoria).flat().forEach(member => {
      if (member.id === memberId && !userInfo) {
        userInfo = { nome: member.nome, matricula: member.matricula, cargo: member.cargo };
      }
    });

    if (!userInfo) return; // Usuário não encontrado, embora improvável

    // Agora, encontrar todas as equipes e funções do usuário
    for (const defensoriaName in equipesPorDefensoria) {
      if (defensoriaName === '_genericTeam') continue; // Ignora a equipe genérica modelo

      const equipe = equipesPorDefensoria[defensoriaName];
      const memberInTeam = equipe.find(m => m.id === memberId);

      if (memberInTeam) {
        let adicionadoPor = "Sistema"; // Padrão

        if (memberInTeam.cargo !== "Defensor(a) Público(a)") {
          const gerenteDaEquipe = equipe.find(m => 
            m.funcoes.some(f => f.nome === "Gerente de Defensoria")
          );
          if (gerenteDaEquipe) {
            adicionadoPor = `${gerenteDaEquipe.nome} (${gerenteDaEquipe.matricula})`;
          } 
          // Se não encontrar gerente específico, mantém "Sistema" ou poderia ser outro placeholder
        }

        userTeamsDetails.push({
          defensoria: defensoriaName,
          funcoes: memberInTeam.funcoes, 
          dataEntrada: generateRandomEntryDate(), 
          adicionadoPor: adicionadoPor, // <<< NOVA INFORMAÇÃO
        });
      }
    }
    setSelectedUserForInfo({ ...userInfo, equipes: userTeamsDetails });
    setIsUserInfoModalOpen(true);
  };

  return (
    <>
      <Flex gap={0} pb="xl">
        {/* Coluna Esquerda (Imagem Lateral Estática) */}
        <Box style={{ maxWidth: 250, height: '100%' }}>
          <Link href="/minha-defensoria" passHref>
            <Image
              src="/menulateralminhadefensoria.png"
              alt="Menu Lateral Minha Defensoria"
              height="70%"
              fit="contain"
              style={{ cursor: 'pointer' }}
            />
          </Link>
        </Box>

        {/* Coluna Direita (Conteúdo da Nova Página) */}
        <Box style={{ flex: 1 }}>
          <Card shadow="sm" padding={0} radius="md" withBorder>
            <Box p="lg">
              <Group justify="space-between" align="center" mb="xl">
                <Title order={2} style={{ display: 'flex', alignItems: 'center' }}>
                  <IconUserCircle size={28} style={{ marginRight: 'var(--mantine-spacing-xs)' }} />
                  Minha Defensoria
                </Title>
              </Group>

              <Select
                label="Selecione a Defensoria"
                placeholder="Escolha uma defensoria"
                data={defensoriasOptions}
                value={selectedDefensoria}
                onChange={setSelectedDefensoria}
                mb="xl"
              />

              {/* Adiciona o novo grupo de botões de ação aqui, condicionalmente */}
              {mostrarBotoesAcao && <DefensoriaActionButtons />}

              {showNotInTeamAlert && (
                <Alert
                  icon={<IconAlertTriangle size="1.2rem" />}
                  title="Atenção!"
                  color="yellow"
                  radius="md"
                  mb="xl"
                  withCloseButton
                  onClose={() => setShowNotInTeamAlert(false)}
                >
                  Você está visualizando uma Defensoria da qual não integra a equipe de trabalho. 
                  Para solicitar acesso e permissões de alteração, por favor, contate o Gerente desta Defensoria. 
                  A visualização dos membros está disponível.
                </Alert>
              )}

              {/* Conteúdo condicional: Skeleton ou Tabela da Equipe */}
              {isLoading ? (
                <>
                  {/* Skeleton para o Cabeçalho da Seção da Equipe */}
                  <Box mt="xl">
                    <Group 
                      justify="space-between" 
                      align="center" 
                      p="sm"
                      style={{ backgroundColor: '#f1f3f5', borderRadius: theme.radius.sm }}
                    >
                      <Skeleton height={24} width={300} radius="sm" />
                      <Skeleton height={36} width={150} radius="sm" /> 
                    </Group>
                    <Divider my="md" />
                  </Box>
                  {/* Skeleton para a Tabela */}
                  <Stack>
                    <Skeleton height={40} radius="sm" /> {/* Cabeçalho da tabela */}
                    <Skeleton height={30} radius="sm" /> {/* Linha 1 */}
                    <Skeleton height={30} radius="sm" /> {/* Linha 2 */}
                    <Skeleton height={30} radius="sm" /> {/* Linha 3 */}
                    <Skeleton height={30} radius="sm" /> {/* Linha 4 */}
                  </Stack>
                </>
              ) : (
                <>
                  {/* Seção Composição da Equipe de Trabalho - Cabeçalho Estilizado */}
                  <Box mt="xl">
                    <Group 
                      justify="space-between" 
                      align="center" 
                      p="sm"
                      style={{ backgroundColor: '#f1f3f5', borderRadius: theme.radius.sm, cursor: 'pointer' }}
                      onClick={() => setIsTeamSectionCollapsed(!isTeamSectionCollapsed)}
                    >
                      <Group gap="sm" align="center">
                        <ActionIcon variant="transparent" size="lg">
                          {isTeamSectionCollapsed ? <IconChevronDown size={20} /> : <IconChevronUp size={20} />}
                        </ActionIcon>
                        <ThemeIcon variant="light" size="lg" radius="md" style={{ backgroundColor: 'transparent' }}>
                          <IconUsers size={20} color='#1c7ed6' />
                        </ThemeIcon>
                        <Text fw={500} size="lg" style={{ color: '#1c7ed6', display: 'flex', alignItems: 'center' }}>
                          Equipe de Trabalho e suas Funções
                          <Tooltip 
                            label={(
                              <>
                                <Text fw={700} mb={5}>Funções disponíveis:</Text>
                                {Object.entries(funcoesDescricoes).map(([nome, desc]) => (
                                  <div key={nome} style={{ marginBottom: '0.5em' }}>
                                    <Text fw={700} component="span">{nome}:</Text>
                                    <Text component="span"> {desc}</Text>
                                  </div>
                                ))}
                              </>
                            )}
                            withArrow 
                            multiline
                            w={300} // Ajuste a largura conforme necessário
                            position="top-start"
                            events={{ hover: true, focus: true, touch: true }}
                          >
                            <ActionIcon variant="transparent" size="sm" radius="xl" style={{ marginLeft: '4px', marginBottom: '2px' }}> {/* Ajuste de margem para colar e alinhar */} 
                              <IconInfoCircle size={18} color='#1c7ed6' /> {/* Tamanho um pouco menor para não destoar */} 
                            </ActionIcon>
                          </Tooltip>
                        </Text>
                      </Group>
                      {!isTeamSectionCollapsed && isUserGerenteNaDefensoriaSelecionada && (
                        <Button 
                          leftSection={<IconPlus size={16} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddUsuario();
                          }}
                        >
                          Adicionar Usuário
                        </Button>
                      )}
                    </Group>
                    
                    {!isTeamSectionCollapsed && (
                      <>
                        <Divider my="md" />
                        {/* Tabela da Equipe agora como Componente */}
                        <EquipeTrabalhoTable 
                          teamMembers={teamMembers}
                          onRemoveFuncao={handleRemoveFuncao}
                          onAddFuncao={handleOpenAddFuncaoModal}
                          onRemoveUsuario={handleRemoveUsuario}
                          acoesHabilitadas={isUserGerenteNaDefensoriaSelecionada && !showNotInTeamAlert}
                          // Props de Paginação
                          currentPage={currentPage}
                          onPageChange={setCurrentPage}
                          itemsPerPage={itemsPerPage}
                          onItemsPerPageChange={(value) => {
                            setItemsPerPage(value);
                            setCurrentPage(1); // Volta para a primeira página ao mudar itens por página
                          }}
                          totalItems={teamMembers.length}
                          onShowUserInfo={handleShowUserInfo}
                        />
                      </>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Card>
        </Box>
      </Flex>

      {/* Link discreto para voltar ao Hub e Switch para mostrar botões */}
      <Group justify="center" mt="xl" pb="xl" gap="xl">
        <Link href="/">
          <Text c="dimmed" size="sm">
            Voltar para a Central
          </Text>
        </Link>
        <Switch
          label="Exibir botões do menu"
          checked={mostrarBotoesAcao}
          onChange={(event) => setMostrarBotoesAcao(event.currentTarget.checked)}
          color="blue"
        />
      </Group>

      {/* Modal para Adicionar Função */}
      <Modal
        opened={isAddFuncaoModalOpen}
        onClose={() => setIsAddFuncaoModalOpen(false)}
        withCloseButton={false}
        padding={0}
        radius="md"
        centered
        size="md"
      >
        <Box bg="dark.6" px="md" py="sm" style={{ borderTopLeftRadius: 'var(--mantine-radius-md)', borderTopRightRadius: 'var(--mantine-radius-md)' }}>
          <Group justify="space-between" align="center">
            <Group gap="xs" align="center">
              <IconPlaylistAdd size={20} color={theme.white} />
              <Text fw={500} c={theme.white}>Adicionar Função ao Membro</Text>
            </Group>
            <ActionIcon variant="transparent" onClick={() => setIsAddFuncaoModalOpen(false)} aria-label="Fechar modal">
              <IconX size={20} color={theme.white} />
            </ActionIcon>
          </Group>
        </Box>

        {selectedMemberIdForFuncao && (
          <Stack gap="lg" p="md">
            <MantineSelect
              label="Selecione a função para adicionar"
              description="Apenas funções que o membro ainda não possui são listadas."
              placeholder="Escolha uma função"
              data={funcoesDisponiveisParaAdicao
                .filter(funcao => {
                  const member = teamMembers.find(m => m.id === selectedMemberIdForFuncao);
                  return !member?.funcoes.some(f => f.nome === funcao);
                })
                .map(funcaoNome => ({ value: funcaoNome, label: funcaoNome }))
              }
              value={funcaoSelecionadaParaAdicionar}
              onChange={setFuncaoSelecionadaParaAdicionar}
              searchable
              nothingFoundMessage="Nenhuma função disponível ou todas já atribuídas"
            />
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => setIsAddFuncaoModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmAddFuncao} 
                disabled={!funcaoSelecionadaParaAdicionar || funcoesDisponiveisParaAdicao.filter(funcao => {
                  const member = teamMembers.find(m => m.id === selectedMemberIdForFuncao);
                  return !member?.funcoes.some(f => f.nome === funcao);
                }).length === 0}
              >
                Adicionar Função
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Modal para Informações do Usuário */}
      <Modal
        opened={isUserInfoModalOpen}
        onClose={() => setIsUserInfoModalOpen(false)}
        withCloseButton={false}
        padding={0}
        radius="md"
        size="lg"
        centered
      >
        <Box bg="dark.6" px="md" py="sm" style={{ borderTopLeftRadius: 'var(--mantine-radius-md)', borderTopRightRadius: 'var(--mantine-radius-md)' }}>
          <Group justify="space-between" align="center">
            <Group gap="xs" align="center">
              <IconInfoCircle size={20} color={theme.white} /> 
              <Text fw={500} c={theme.white}>Informações do Usuário</Text>
            </Group>
            <ActionIcon variant="transparent" onClick={() => setIsUserInfoModalOpen(false)} aria-label="Fechar modal">
              <IconX size={20} color={theme.white} />
            </ActionIcon>
          </Group>
        </Box>

        {selectedUserForInfo && (
          <Stack p="md">
            <Text><strong>Nome:</strong> {selectedUserForInfo.nome}</Text>
            <Text><strong>Matrícula:</strong> {selectedUserForInfo.matricula}</Text>
            <Text><strong>Cargo:</strong> {selectedUserForInfo.cargo}</Text>
            <Divider my="sm" label="Participação em Equipes" labelPosition="center" />
            {selectedUserForInfo.equipes.length > 0 ? (
              <Table highlightOnHover withTableBorder withRowBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Defensoria</Table.Th>
                    <Table.Th>Funções</Table.Th>
                    <Table.Th>Data de Entrada</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {selectedUserForInfo.equipes.map((equipe, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{equipe.defensoria}</Table.Td>
                      <Table.Td>
                        {equipe.funcoes && equipe.funcoes.length > 0 ? (
                          <Group gap="xs">
                            {equipe.funcoes.map((funcao, idx) => (
                              <Tooltip
                                key={`${equipe.defensoria}-${funcao.nome}-${idx}`}
                                label={funcoesDescricoes[funcao.nome] || funcao.nome}
                                withArrow
                                position="top"
                                offset={5}
                              >
                                <Badge
                                  variant="light"
                                  color={funcao.nome === "Gerente de Defensoria" && !funcao.removivel ? "pink" : "blue"}
                                >
                                  {funcao.nome}
                                </Badge>
                              </Tooltip>
                            ))}
                          </Group>
                        ) : (
                          <Text size="sm" c="dimmed">Nenhuma função específica</Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Tooltip label={`Adicionado por: ${equipe.adicionadoPor}`} withArrow position="top" offset={5}>
                          <span>{equipe.dataEntrada}</span>{/* Envolve com span para o tooltip funcionar corretamente em texto puro */}
                        </Tooltip>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <Text c="dimmed">Este usuário não foi encontrado em nenhuma equipe.</Text>
            )}
            <Button onClick={() => setIsUserInfoModalOpen(false)} mt="md">
              Fechar
            </Button>
          </Stack>
        )}
      </Modal>
    </>
  );
} 