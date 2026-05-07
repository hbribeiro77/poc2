"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import Link from 'next/link';
import {
  IconUserCircle,
  IconX,
  IconPlus,
  IconPlaylistAdd,
  IconUserOff,
  IconUsers,
  IconAlertTriangle,
  IconInfoCircle,
  IconCalendar,
} from '@tabler/icons-react';

// Importa os dados das equipes do arquivo JSON
import equipesData from '../../data/dadosEquipesDefensorias.json';
// Importa o novo componente da tabela
import EquipeTrabalhoTable from '../../components/EquipeTrabalhoTable/EquipeTrabalhoTable';
// IMPORTA o novo componente de botões de ação
import DefensoriaActionButtons from '../../components/DefensoriaActionButtons/DefensoriaActionButtons';
import MinhaDefensoriaNavegacaoSecoesEmCartoesComIconeEBadge, {
  CHAVES_SECOES_MINHA_DEFENSORIA,
} from '../../components/MinhaDefensoriaNavegacaoSecoesEmCartoesComIconesEBadge/MinhaDefensoriaNavegacaoSecoesEmCartoesComIconeEBadge';

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

const LABEL_GRUPO_SELECT_DEFENSORIAS_MINHAS_DO_USUARIO_LOGADO = 'Minhas defensorias';
const LABEL_GRUPO_SELECT_DEFENSORIAS_DEMAIS_SEM_VINCULO_DIRETO_NA_EQUIPE = 'Demais defensorias';

/** Nomes de defensoria (chaves do JSON) em que o usuário aparece como membro da equipe. */
function listaChavesDefensoriasOndeUsuarioConstaNaEquipe(mapaEquipesPorNomeDefensoria, idUsuarioLogado) {
  return Object.keys(mapaEquipesPorNomeDefensoria)
    .filter((nomeDefensoria) => nomeDefensoria !== '_genericTeam')
    .filter((nomeDefensoria) =>
      (mapaEquipesPorNomeDefensoria[nomeDefensoria] || []).some((membro) => membro.id === idUsuarioLogado)
    );
}

const MOTIVOS_INDISPONIBILIDADE_INTEGRANTE_MODAL_EQUIPE_SELECT_DATA = [
  { value: 'ferias', label: 'Férias' },
  { value: 'folga', label: 'Folga' },
  { value: 'licenca', label: 'Licença' },
  { value: 'afastamento', label: 'Afastamento' },
  { value: 'outro', label: 'Outro' },
];

function parseDataDdMmYyyyStringParaObjetoDateOuNullParaInputsDatePicker(textoDdMmYyyy) {
  if (!textoDdMmYyyy || typeof textoDdMmYyyy !== 'string') return null;
  const partes = textoDdMmYyyy.trim().split('/');
  if (partes.length !== 3) return null;
  const dd = parseInt(partes[0], 10);
  const mm = parseInt(partes[1], 10);
  const yyyy = parseInt(partes[2], 10);
  if (!yyyy || !mm || !dd) return null;
  const d = new Date(yyyy, mm - 1, dd);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formataObjetoDateParaStringDdMmYyyyBrasil(dateObjetoJavascriptNativo) {
  if (!dateObjetoJavascriptNativo || !(dateObjetoJavascriptNativo instanceof Date)) return '';
  if (Number.isNaN(dateObjetoJavascriptNativo.getTime())) return '';
  const d = String(dateObjetoJavascriptNativo.getDate()).padStart(2, '0');
  const m = String(dateObjetoJavascriptNativo.getMonth() + 1).padStart(2, '0');
  const y = dateObjetoJavascriptNativo.getFullYear();
  return `${d}/${m}/${y}`;
}

export default function MinhaDefensoriaPage() {
  const theme = useMantineTheme();

  const listaPlanaOitoDefensoriasValorELabelIdenticos = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const value = `${i + 1}ª DEFENSORIA PÚBLICA ESPECIALIZADA DO JÚRI DO FORO CENTRAL`;
        return { value, label: value };
      }),
    []
  );

  /** Select agrupado: defensorias em que Humberto está na equipe vs. as outras. */
  const dadosSelectDefensoriasAgrupadoMinhasVersusDemaisRestantes = useMemo(() => {
    const chavesMinhasSet = new Set(
      listaChavesDefensoriasOndeUsuarioConstaNaEquipe(equipesPorDefensoria, loggedUser.id)
    );
    const opcoesMinhas = listaPlanaOitoDefensoriasValorELabelIdenticos.filter((opt) =>
      chavesMinhasSet.has(opt.value)
    );
    const opcoesDemais = listaPlanaOitoDefensoriasValorELabelIdenticos.filter(
      (opt) => !chavesMinhasSet.has(opt.value)
    );
    const gruposComRotuloMantineSelect = [];
    if (opcoesMinhas.length > 0) {
      gruposComRotuloMantineSelect.push({
        group: LABEL_GRUPO_SELECT_DEFENSORIAS_MINHAS_DO_USUARIO_LOGADO,
        items: opcoesMinhas,
      });
    }
    if (opcoesDemais.length > 0) {
      gruposComRotuloMantineSelect.push({
        group: LABEL_GRUPO_SELECT_DEFENSORIAS_DEMAIS_SEM_VINCULO_DIRETO_NA_EQUIPE,
        items: opcoesDemais,
      });
    }
    return gruposComRotuloMantineSelect.length > 0
      ? gruposComRotuloMantineSelect
      : [{ group: 'Defensorias', items: listaPlanaOitoDefensoriasValorELabelIdenticos }];
  }, [listaPlanaOitoDefensoriasValorELabelIdenticos]);

  const [selectedDefensoria, setSelectedDefensoria] = useState(
    listaPlanaOitoDefensoriasValorELabelIdenticos[0].value
  );
  const [teamMembers, setTeamMembers] = useState(equipesPorDefensoria[selectedDefensoria] || []);
  const [showNotInTeamAlert, setShowNotInTeamAlert] = useState(false); // Estado para o alerta
  const [isLoading, setIsLoading] = useState(true); // Estado para o Skeleton (só na aba Equipe)
  const [secaoMinhaDefensoriaAtivaSlug, setSecaoMinhaDefensoriaAtivaSlug] = useState(
    CHAVES_SECOES_MINHA_DEFENSORIA.EQUIPE
  );

  // Estados para paginação da tabela
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Valor padrão de itens por pagina

  // Estados para o Modal de Adicionar Função
  const [isAddFuncaoModalOpen, setIsAddFuncaoModalOpen] = useState(false);
  const [selectedMemberIdForFuncao, setSelectedMemberIdForFuncao] = useState(null);
  const [funcaoSelecionadaParaAdicionar, setFuncaoSelecionadaParaAdicionar] = useState('');
  /** Ao abrir a modal: havia indisponível salvo pelo gerente OU só badge JSON de demo — usado para permitir “Salvar” só limpando indisponível. */
  const aoAbrirModalMemberEstavaIndisponivelOuComBadgeDemoRef = useRef(false);
  const [integranteMarcadoComoIndisponivelNoModal, setIntegranteMarcadoComoIndisponivelNoModal] = useState(false);
  const [dataInicioIndisponibilidadeModalDate, setDataInicioIndisponibilidadeModalDate] = useState(null);
  const [dataFimIndisponibilidadeModalDate, setDataFimIndisponibilidadeModalDate] = useState(null);
  const [motivoIndisponibilidadeChaveSelectModal, setMotivoIndisponibilidadeChaveSelectModal] = useState('ferias');
  const [textoMotivoOutroQuandoSelecionadoNoModal, setTextoMotivoOutroQuandoSelecionadoNoModal] = useState('');
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

  /** Contadores exibidos nos badges dos cartões (PoC: parte fixa / demonstração). */
  const mapaBadgesContagemSecoesMinhaDefensoriaParaCartoesNavegacao = useMemo(
    () => ({
      equipeCount: teamMembers.length,
      smsCount: 1,
      solicitacoesCount: 0,
      pecasCount: 0,
      promptsCount: 0,
      assistidosCount: 0,
    }),
    [teamMembers.length]
  );

  /** Humberto na equipe da defensoria atualmente carregada → pode ver SMS, favoritos etc.; senão só Equipe (leitura). */
  const usuarioLogadoFazParteDaEquipeNaDefensoriaSelecionada = useMemo(
    () => teamMembers.some((membro) => membro.id === loggedUser.id),
    [teamMembers]
  );

  useEffect(() => {
    if (!usuarioLogadoFazParteDaEquipeNaDefensoriaSelecionada) {
      setSecaoMinhaDefensoriaAtivaSlug(CHAVES_SECOES_MINHA_DEFENSORIA.EQUIPE);
    }
  }, [usuarioLogadoFazParteDaEquipeNaDefensoriaSelecionada]);

  const formularioIndisponibilidadeInvalidoModalAtual = useMemo(
    () =>
      integranteMarcadoComoIndisponivelNoModal &&
      (!dataInicioIndisponibilidadeModalDate ||
        !dataFimIndisponibilidadeModalDate ||
        !motivoIndisponibilidadeChaveSelectModal ||
        (motivoIndisponibilidadeChaveSelectModal === 'outro' &&
          !textoMotivoOutroQuandoSelecionadoNoModal.trim())),
    [
      integranteMarcadoComoIndisponivelNoModal,
      dataInicioIndisponibilidadeModalDate,
      dataFimIndisponibilidadeModalDate,
      motivoIndisponibilidadeChaveSelectModal,
      textoMotivoOutroQuandoSelecionadoNoModal,
    ]
  );

  /** ref não dispara re-render; lemos .current no render ao montar o botão (usuário já alterou o Switch). */
  const podeConfirmarSalvarModalFuncaoDisponibilidadeMembro =
    !formularioIndisponibilidadeInvalidoModalAtual &&
    (Boolean(funcaoSelecionadaParaAdicionar) ||
      integranteMarcadoComoIndisponivelNoModal ||
      (aoAbrirModalMemberEstavaIndisponivelOuComBadgeDemoRef.current && !integranteMarcadoComoIndisponivelNoModal));

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

  const resetarSomenteCamposDisponibilidadeModalAdicionarFuncaoAoMembro = () => {
    setIntegranteMarcadoComoIndisponivelNoModal(false);
    setDataInicioIndisponibilidadeModalDate(null);
    setDataFimIndisponibilidadeModalDate(null);
    setMotivoIndisponibilidadeChaveSelectModal('ferias');
    setTextoMotivoOutroQuandoSelecionadoNoModal('');
  };

  const fecharModalAdicionarFuncaoELimparEstadoCompletoDoFormularioInterno = () => {
    setIsAddFuncaoModalOpen(false);
    setSelectedMemberIdForFuncao(null);
    setFuncaoSelecionadaParaAdicionar('');
    resetarSomenteCamposDisponibilidadeModalAdicionarFuncaoAoMembro();
  };

  // Lógica para abrir o modal de adicionar função / disponibilidade
  const handleOpenAddFuncaoModal = (memberId) => {
    const membroAlvo = teamMembers.find((m) => m.id === memberId);
    setSelectedMemberIdForFuncao(memberId);
    setFuncaoSelecionadaParaAdicionar('');
    aoAbrirModalMemberEstavaIndisponivelOuComBadgeDemoRef.current = Boolean(
      membroAlvo?.registroDisponibilidadeGerenciadaNaModal?.indisponivel === true ||
        membroAlvo?.badgeIndisponibilidadeDemonstracaoUi?.label
    );
    const regDisponibilidadePersistidoNoMembro = membroAlvo?.registroDisponibilidadeGerenciadaNaModal;
    if (regDisponibilidadePersistidoNoMembro?.indisponivel === true) {
      setIntegranteMarcadoComoIndisponivelNoModal(true);
      setDataInicioIndisponibilidadeModalDate(
        parseDataDdMmYyyyStringParaObjetoDateOuNullParaInputsDatePicker(regDisponibilidadePersistidoNoMembro.dataInicioDdMmYyyy)
      );
      setDataFimIndisponibilidadeModalDate(
        parseDataDdMmYyyyStringParaObjetoDateOuNullParaInputsDatePicker(regDisponibilidadePersistidoNoMembro.dataFimDdMmYyyy)
      );
      setMotivoIndisponibilidadeChaveSelectModal(regDisponibilidadePersistidoNoMembro.motivoChave || 'ferias');
      setTextoMotivoOutroQuandoSelecionadoNoModal(regDisponibilidadePersistidoNoMembro.textoMotivoQuandoOutroOpcional || '');
    } else {
      resetarSomenteCamposDisponibilidadeModalAdicionarFuncaoAoMembro();
    }
    setIsAddFuncaoModalOpen(true);
  };

  // Confirma função nova e/ou disponibilidade do integrante (reflete na badge laranja da tabela).
  const handleConfirmAddFuncao = () => {
    if (!selectedMemberIdForFuncao) return;

    const formularioIndisponibilidadeInvalido =
      integranteMarcadoComoIndisponivelNoModal &&
      (!dataInicioIndisponibilidadeModalDate ||
        !dataFimIndisponibilidadeModalDate ||
        !motivoIndisponibilidadeChaveSelectModal ||
        (motivoIndisponibilidadeChaveSelectModal === 'outro' &&
          !textoMotivoOutroQuandoSelecionadoNoModal.trim()));

    if (formularioIndisponibilidadeInvalido) return;

    const vaiAdicionarFuncaoNovaNaEquipe = Boolean(funcaoSelecionadaParaAdicionar);
    const vaiRegistrarOuLimparIndisponibilidadeDoIntegrante =
      integranteMarcadoComoIndisponivelNoModal ||
      (aoAbrirModalMemberEstavaIndisponivelOuComBadgeDemoRef.current && !integranteMarcadoComoIndisponivelNoModal);

    if (!vaiAdicionarFuncaoNovaNaEquipe && !vaiRegistrarOuLimparIndisponibilidadeDoIntegrante) return;

    setTeamMembers((currentMembers) =>
      currentMembers.map((member) => {
        if (member.id !== selectedMemberIdForFuncao) return member;

        let atualizado = { ...member };

        if (vaiAdicionarFuncaoNovaNaEquipe) {
          const funcaoJaExiste = member.funcoes.some((f) => f.nome === funcaoSelecionadaParaAdicionar);
          if (!funcaoJaExiste) {
            atualizado.funcoes = [...atualizado.funcoes, { nome: funcaoSelecionadaParaAdicionar, removivel: true }];
          }
        }

        if (integranteMarcadoComoIndisponivelNoModal) {
          atualizado.registroDisponibilidadeGerenciadaNaModal = {
            indisponivel: true,
            dataInicioDdMmYyyy: formataObjetoDateParaStringDdMmYyyyBrasil(dataInicioIndisponibilidadeModalDate),
            dataFimDdMmYyyy: formataObjetoDateParaStringDdMmYyyyBrasil(dataFimIndisponibilidadeModalDate),
            motivoChave: motivoIndisponibilidadeChaveSelectModal,
            textoMotivoQuandoOutroOpcional:
              motivoIndisponibilidadeChaveSelectModal === 'outro'
                ? textoMotivoOutroQuandoSelecionadoNoModal.trim()
                : '',
          };
        } else if (aoAbrirModalMemberEstavaIndisponivelOuComBadgeDemoRef.current) {
          atualizado.registroDisponibilidadeGerenciadaNaModal = { indisponivel: false };
        }

        return atualizado;
      })
    );

    fecharModalAdicionarFuncaoELimparEstadoCompletoDoFormularioInterno();
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
                data={dadosSelectDefensoriasAgrupadoMinhasVersusDemaisRestantes}
                value={selectedDefensoria}
                onChange={setSelectedDefensoria}
                searchable
                nothingFoundMessage="Nenhuma defensoria encontrada"
                maxDropdownHeight={360}
                mb="lg"
              />

              <MinhaDefensoriaNavegacaoSecoesEmCartoesComIconeEBadge
                secaoAtivaChaveSlug={secaoMinhaDefensoriaAtivaSlug}
                aoAlterarSecaoAtivaSomenteCliente={setSecaoMinhaDefensoriaAtivaSlug}
                badgesNumerosPorPropriedadeNome={mapaBadgesContagemSecoesMinhaDefensoriaParaCartoesNavegacao}
                exibirTodasSecoesMinhaDefensoria={usuarioLogadoFazParteDaEquipeNaDefensoriaSelecionada}
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

              {secaoMinhaDefensoriaAtivaSlug === CHAVES_SECOES_MINHA_DEFENSORIA.EQUIPE &&
                (isLoading ? (
                  <>
                    <Group justify="space-between" align="center" mb="md">
                      <Skeleton height={28} width={280} radius="sm" />
                      <Skeleton height={36} width={140} radius="sm" />
                    </Group>
                    <Stack gap="xs">
                      <Skeleton height={40} radius="sm" />
                      <Skeleton height={30} radius="sm" />
                      <Skeleton height={30} radius="sm" />
                      <Skeleton height={30} radius="sm" />
                    </Stack>
                  </>
                ) : (
                  <Box mt="xs">
                    <Group justify="space-between" align="flex-start" mb="md" wrap="wrap">
                      <Group gap="sm" align="flex-start">
                        <ThemeIcon variant="light" size="lg" radius="md" style={{ backgroundColor: 'transparent' }}>
                          <IconUsers size={22} color="#1c7ed6" />
                        </ThemeIcon>
                        <Box>
                          <Group gap={6} align="center">
                            <Text fw={600} size="md" c="#1c7ed6">
                              Equipe de trabalho e suas funções
                            </Text>
                            <Tooltip
                              label={
                                <>
                                  <Text fw={700} mb={5}>
                                    Funções disponíveis:
                                  </Text>
                                  {Object.entries(funcoesDescricoes).map(([nome, desc]) => (
                                    <div key={nome} style={{ marginBottom: '0.5em' }}>
                                      <Text fw={700} component="span">
                                        {nome}:
                                      </Text>
                                      <Text component="span"> {desc}</Text>
                                    </div>
                                  ))}
                                </>
                              }
                              withArrow
                              multiline
                              w={300}
                              position="top-start"
                              events={{ hover: true, focus: true, touch: true }}
                            >
                              <ActionIcon variant="subtle" color="blue" size="sm" radius="xl" aria-label="Sobre as funções">
                                <IconInfoCircle size={18} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                          <Text size="xs" c="dimmed" mt={4}>
                            Membros e papéis na defensoria selecionada.
                          </Text>
                        </Box>
                      </Group>
                      {isUserGerenteNaDefensoriaSelecionada && !showNotInTeamAlert && (
                        <Button leftSection={<IconPlus size={16} />} onClick={handleAddUsuario}>
                          Adicionar usuário
                        </Button>
                      )}
                    </Group>
                    <Divider mb="md" />
                    <EquipeTrabalhoTable
                      teamMembers={teamMembers}
                      onRemoveFuncao={handleRemoveFuncao}
                      onAddFuncao={handleOpenAddFuncaoModal}
                      onRemoveUsuario={handleRemoveUsuario}
                      acoesHabilitadas={isUserGerenteNaDefensoriaSelecionada && !showNotInTeamAlert}
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                      itemsPerPage={itemsPerPage}
                      onItemsPerPageChange={(value) => {
                        setItemsPerPage(value);
                        setCurrentPage(1);
                      }}
                      totalItems={teamMembers.length}
                      onShowUserInfo={handleShowUserInfo}
                    />
                  </Box>
                ))}

              {usuarioLogadoFazParteDaEquipeNaDefensoriaSelecionada &&
                secaoMinhaDefensoriaAtivaSlug === CHAVES_SECOES_MINHA_DEFENSORIA.SMS && (
                  <Alert variant="light" color="gray" title="SMS recebidos">
                    Esta seção será integrada aos dados de SMS na PoC. Use os cartões acima para alternar entre módulos.
                  </Alert>
                )}

              {usuarioLogadoFazParteDaEquipeNaDefensoriaSelecionada &&
                secaoMinhaDefensoriaAtivaSlug === CHAVES_SECOES_MINHA_DEFENSORIA.SOLICITACOES_DOCUMENTO && (
                  <Alert variant="light" color="gray" title="Solicitações de documento">
                    Conteúdo em construção — placeholder para lista de solicitações vinculada à defensoria.
                  </Alert>
                )}

              {usuarioLogadoFazParteDaEquipeNaDefensoriaSelecionada &&
                secaoMinhaDefensoriaAtivaSlug === CHAVES_SECOES_MINHA_DEFENSORIA.PECAS_FAVORITAS && (
                  <Alert variant="light" color="gray" title="Peças favoritas">
                    Conteúdo em construção — aqui poderão aparecer atalhos às peças marcadas pelo usuário.
                  </Alert>
                )}

              {usuarioLogadoFazParteDaEquipeNaDefensoriaSelecionada &&
                secaoMinhaDefensoriaAtivaSlug === CHAVES_SECOES_MINHA_DEFENSORIA.PROMPTS_TRIAGEM && (
                  <Alert variant="light" color="gray" title="Prompts de triagem">
                    Conteúdo em construção — modelo de prompts usados na triagem da defensoria.
                  </Alert>
                )}

              {usuarioLogadoFazParteDaEquipeNaDefensoriaSelecionada &&
                secaoMinhaDefensoriaAtivaSlug === CHAVES_SECOES_MINHA_DEFENSORIA.ASSISTIDOS_ATENDIDOS && (
                  <Alert variant="light" color="gray" title="Assistidos atendidos">
                    Conteúdo em construção — visão de assistidos relacionados aos atendimentos desta equipe.
                  </Alert>
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

      {/* Modal: função + disponibilidade (badge na tabela) */}
      <Modal
        opened={isAddFuncaoModalOpen}
        onClose={fecharModalAdicionarFuncaoELimparEstadoCompletoDoFormularioInterno}
        withCloseButton={false}
        padding={0}
        radius="md"
        centered
        size="lg"
      >
        <Box bg="dark.6" px="md" py="sm" style={{ borderTopLeftRadius: 'var(--mantine-radius-md)', borderTopRightRadius: 'var(--mantine-radius-md)' }}>
          <Group justify="space-between" align="center">
            <Group gap="xs" align="center">
              <IconPlaylistAdd size={20} color={theme.white} />
              <Text fw={500} c={theme.white}>Função e disponibilidade do membro</Text>
            </Group>
            <ActionIcon
              variant="transparent"
              onClick={fecharModalAdicionarFuncaoELimparEstadoCompletoDoFormularioInterno}
              aria-label="Fechar modal"
            >
              <IconX size={20} color={theme.white} />
            </ActionIcon>
          </Group>
        </Box>

        {selectedMemberIdForFuncao && (
          <Stack gap="md" p="md">
            <MantineSelect
              label="Selecione a função para adicionar"
              description="Opcional se você só for atualizar disponibilidade. Apenas funções que o membro ainda não possui."
              placeholder="Escolha uma função (opcional)"
              clearable
              data={funcoesDisponiveisParaAdicao
                .filter((funcao) => {
                  const member = teamMembers.find((m) => m.id === selectedMemberIdForFuncao);
                  return !member?.funcoes.some((f) => f.nome === funcao);
                })
                .map((funcaoNome) => ({ value: funcaoNome, label: funcaoNome }))}
              value={funcaoSelecionadaParaAdicionar}
              onChange={(valorOuNull) => setFuncaoSelecionadaParaAdicionar(valorOuNull ?? '')}
              searchable
              nothingFoundMessage="Nenhuma função disponível ou todas já atribuídas"
            />

            <Divider label="Disponibilidade do integrante" labelPosition="center" />

            <Switch
              label="Integrante indisponível neste período"
              description="Ao marcar, informe período e motivo. Isso atualiza o selo laranja na tabela."
              checked={integranteMarcadoComoIndisponivelNoModal}
              onChange={(event) => setIntegranteMarcadoComoIndisponivelNoModal(event.currentTarget.checked)}
              color="orange"
            />

            {integranteMarcadoComoIndisponivelNoModal && (
              <>
                <Group grow align="flex-start">
                  <DatePickerInput
                    label="Início"
                    placeholder="dd/mm/aaaa"
                    value={dataInicioIndisponibilidadeModalDate}
                    onChange={setDataInicioIndisponibilidadeModalDate}
                    valueFormat="DD/MM/YYYY"
                    leftSection={<IconCalendar size={16} />}
                  />
                  <DatePickerInput
                    label="Fim"
                    placeholder="dd/mm/aaaa"
                    value={dataFimIndisponibilidadeModalDate}
                    onChange={setDataFimIndisponibilidadeModalDate}
                    valueFormat="DD/MM/YYYY"
                    leftSection={<IconCalendar size={16} />}
                  />
                </Group>
                <MantineSelect
                  label="Motivo"
                  placeholder="Selecione"
                  data={MOTIVOS_INDISPONIBILIDADE_INTEGRANTE_MODAL_EQUIPE_SELECT_DATA}
                  value={motivoIndisponibilidadeChaveSelectModal}
                  onChange={(v) => setMotivoIndisponibilidadeChaveSelectModal(v || 'ferias')}
                />
                {motivoIndisponibilidadeChaveSelectModal === 'outro' && (
                  <TextInput
                    label="Descreva o motivo"
                    placeholder="Ex.: consulta médica, curso externo…"
                    value={textoMotivoOutroQuandoSelecionadoNoModal}
                    onChange={(e) => setTextoMotivoOutroQuandoSelecionadoNoModal(e.currentTarget.value)}
                  />
                )}
              </>
            )}

            <Group justify="flex-end" mt="sm">
              <Button variant="default" onClick={fecharModalAdicionarFuncaoELimparEstadoCompletoDoFormularioInterno}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmAddFuncao} disabled={!podeConfirmarSalvarModalFuncaoDisponibilidadeMembro}>
                Salvar
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