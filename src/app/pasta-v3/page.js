'use client';

import React, { useState } from 'react';
import {
  Box, Flex, Image, Group, Text,
  useMantineTheme,
  Radio,
  Stack,
  Title,
  Button,
  ActionIcon,
  Tooltip,
  Affix,
  Modal,
  Checkbox,
} from '@mantine/core';
import { 
  IconAlertCircle, 
  IconPlus,
  IconBrandWhatsapp,
} from '@tabler/icons-react';
import Link from 'next/link';
import PastaHeader from '../../components/PastaHeader/PastaHeader';
import ModalConfirmacaoAssustadora from '../../components/ConfirmActionModal/ModalConfirmacaoAssustadora';
import ArchivePastaModal from '../../components/ArchivePastaModal/ArchivePastaModal';
import AtendimentosTable from '../../components/AtendimentosTable/AtendimentosTable';
import DocumentosTable from '../../components/DocumentosTable/DocumentosTable';
import AtendimentoChatModal from '../../components/AtendimentoChatModal/AtendimentoChatModal';
import PecaseOficiosList from '../../components/PecaseOficiosList/PecaseOficiosList';
import VisaoGeralTimeline from '../../components/VisaoGeralTimeline/VisaoGeralTimeline';

// Dados de Exemplo INICIAL para passar ao PastaHeader
const initialPastaData = {
  area: "Cível",
  assistido: "BART SIMPSON",
  assunto: "DIREITO DA SAÚDE / Mental / Internação compulsória",
  descricao: "",
  status: "Ativa",
  motivoArquivamento: null,
  lastStatusChangeBy: null,
  lastStatusChangeAt: null,
  processo: "5000260-33.2019.8.21.0109",
  comarca: "Marau",
  orgaoJulgador: "Juízo da 2ª Vara Judicial da Comarca de Marau",
  classe: "Procedimento Comum",
  contatos: [
    { id: 'assistido_principal', nome: "BART SIMPSON", relacao: "Assistido Principal", telefone: "(55) 9 9988-7766", hasWhatsapp: true },
    { id: 'contato_secundario_1', nome: "HOMER SIMPSON", relacao: "Pai", telefone: "(55) 9 8877-6655", hasWhatsapp: false },
    { id: 'contato_secundario_2', nome: "MARGE SIMPSON", relacao: "Mãe", telefone: "(55) 9 9911-2233", hasWhatsapp: true },
  ],
  counts: {
      atendimentos: 2, // Contagem inicial corrigida
      pecas: 1,
      documentos: 0,
      observacoes: 0,
      assistidos: null,
      certidoes: null,
      processos: null,
      dadosPasta: null,
  }
};

export default function PastaV3Page() {
  const [pastaData, setPastaData] = useState(initialPastaData);
  const theme = useMantineTheme();

  // Estados da página principal
  const [selectedLayout, setSelectedLayout] = useState('atual');
  const [archiveModalOpened, setArchiveModalOpened] = useState(false);
  const [reactivateModalOpened, setReactivateModalOpened] = useState(false);
  const [activePastaSection, setActivePastaSection] = useState('atendimentos'); // Inicia com atendimentos aberto
  const [showVisaoGeral, setShowVisaoGeral] = useState(false);

  // Estados para controle dos Modais de Chat
  const [isWhatsappChatModalOpen, setIsWhatsappChatModalOpen] = useState(false);
  const [isContactSelectModalOpen, setIsContactSelectModalOpen] = useState(false);
  const [selectedContactIdForChat, setSelectedContactIdForChat] = useState(null);
  const [editingAtendimento, setEditingAtendimento] = useState(null);
  
  // Estado para a tabela de atendimentos
  const [atendimentos, setAtendimentos] = useState([
    { id: 1, data: '22/07/2025', situacao: 'Rascunho', relato: 'não estou recebendo o medicamento', providencia: 'Retorno', assistido: 'HUMBERTO BORGES RIBE...', defensoria: '2ª DEFENSORIA PÚBLICA ESPECIALIZADA CÍVEL DO FORO CENTRAL', formaAtendimento: 'Presencial' },
    { id: 2, data: '14/10/2021', situacao: 'Aprovado', relato: 'Quod quia sit. Ratione consequ...', providencia: 'Petição inicial', assistido: 'MR. KELVIN KASSULKE ...', defensoria: '1ª DEFENSORIA PÚBLICA DE BAGÉ', formaAtendimento: 'Telefone' },
    { id: 3, data: '12/10/2021', situacao: 'Rascunho', relato: 'Atendimento presencial para coleta de documentos.', providencia: 'Orientação', assistido: 'LISA SIMPSON', defensoria: '2ª DEFENSORIA PÚBLICA DE BAGÉ', formaAtendimento: 'Presencial' },
    { id: 4, data: '11/10/2021', situacao: 'Aprovado', relato: 'Assistido compareceu para assinatura de procuração.', providencia: 'Retorno', assistido: 'NED FLANDERS', defensoria: '2ª DEFENSORIA PÚBLICA DE BAGÉ', formaAtendimento: 'Presencial' },
  ]);
  const [atendimentosActivePage, setAtendimentosActivePage] = useState(1);
  const [atendimentosItemsPerPage, setAtendimentosItemsPerPage] = useState('5');

  // Estado para a tabela de documentos
  const [documentos, setDocumentos] = useState([
    { id: 1, data: '03/07/2025', descricao: 'CAPTURA DE TELA - TENTATIVA DE CONTATO PELO WHATS', usuario: 'Guilherme Machado Moraes' },
    { id: 2, data: '13/06/2025', descricao: 'E-mail encaminhado', usuario: 'Nathalia de Quevedo Barbosa' },
    { id: 3, data: '30/05/2025', descricao: 'Comprovante CORREIO', usuario: 'Nathalia de Quevedo Barbosa' },
    { id: 4, data: '22/05/2025', descricao: 'Acordo', usuario: 'Nathalia de Quevedo Barbosa' },
    { id: 5, data: '22/05/2025', descricao: 'Acórdão', usuario: 'Nathalia de Quevedo Barbosa' },
    { id: 6, data: '22/05/2025', descricao: 'Comprovante de pagamento (destinatária Geovana Bet)', usuario: 'Nathalia de Quevedo Barbosa' },
    { id: 7, data: '22/05/2025', descricao: 'Relatório - Voto', usuario: 'Nathalia de Quevedo Barbosa' },
  ]);
  const [documentosActivePage, setDocumentosActivePage] = useState(1);
  const [documentosItemsPerPage, setDocumentosItemsPerPage] = useState('5');

  const handleOpenArchiveModal = () => setArchiveModalOpened(true);
  const handleCloseArchiveModal = () => setArchiveModalOpened(false);

  const handleOpenReactivateModal = () => setReactivateModalOpened(true);
  const handleCloseReactivateModal = () => setReactivateModalOpened(false);

  const handleConfirmArchive = ({ motivo, observacao }) => {
    const timestamp = new Date();
    const user = "Humberto Borges Ribeiro (3925811)";
    setPastaData({
      ...pastaData,
      status: 'Arquivada',
      motivoArquivamento: motivo,
      observacaoArquivamento: observacao,
      lastStatusChangeBy: user,
      lastStatusChangeAt: timestamp
    });
    handleCloseArchiveModal();
  };

  const handleConfirmReactivate = () => {
    const timestamp = new Date();
    const user = "Humberto Borges Ribeiro (3925811)";
    setPastaData({
      ...pastaData,
      status: 'Ativa',
      motivoArquivamento: null,
      lastStatusChangeBy: user,
      lastStatusChangeAt: timestamp
    });
    handleCloseReactivateModal();
  };

  const handleSectionSelect = (section) => {
    setActivePastaSection(prevSection => prevSection === section ? null : section);
  };

  const handleOpenContactSelectModal = () => {
    setSelectedContactIdForChat(pastaData.contatos[0]?.id || null);
    setIsContactSelectModalOpen(true);
  };

  const handleCloseContactSelectModal = () => {
    setIsContactSelectModalOpen(false);
  };

  const handleProceedToWhatsappChat = () => {
    if (selectedContactIdForChat) {
      setIsContactSelectModalOpen(false);
      setIsWhatsappChatModalOpen(true);
    }
  };

  const handleSaveAtendimentoCallback = (atendimentoData) => {
    setAtendimentos(prevAtendimentos => {
      const index = prevAtendimentos.findIndex(a => a.id === atendimentoData.id);

      // Se o atendimento já existe (está sendo editado)
      if (index > -1) {
        const newAtendimentos = [...prevAtendimentos];
        newAtendimentos[index] = atendimentoData;
        return newAtendimentos;
      }
      
      // Se for um novo atendimento
      setPastaData(prevPasta => ({
        ...prevPasta,
        counts: {
          ...prevPasta.counts,
          atendimentos: prevPasta.counts.atendimentos + 1
        }
      }));
      return [atendimentoData, ...prevAtendimentos];
    });

    // Limpa o estado de edição ao salvar
    if (editingAtendimento) {
      setEditingAtendimento(null);
    }
  };

  const handleEditAtendimento = (atendimento) => {
    // Encontra o contato associado para reabrir o chat corretamente
    const contactId = pastaData.contatos.find(c => c.nome === atendimento.assistido)?.id;
    setSelectedContactIdForChat(contactId || null);
    setEditingAtendimento(atendimento);
    setIsWhatsappChatModalOpen(true);
  };

  const handleCloseWhatsappModal = () => {
    setIsWhatsappChatModalOpen(false);
    setEditingAtendimento(null); // Garante que o modo de edição seja limpo ao fechar
  };

  const whatsappContacts = pastaData.contatos.filter(c => c.hasWhatsapp);

  return (
    <>
      <Flex gap={0} pb="xl">
        <Box style={{ maxWidth: 250, height: '100%' }}>
          <Image
            src="/menulateral.png"
            alt="Menu Lateral"
            fit="contain"
            style={{ 
              height: 'calc(100vh - 40px)',
              position: 'sticky',
              top: '20px'
            }}
          />
        </Box>

        <Box style={{ flex: 1, paddingLeft: theme.spacing.md, paddingRight: theme.spacing.md }}>
          <PastaHeader
            pastaData={pastaData}
            onOpenArchiveModal={handleOpenArchiveModal}
            onOpenReactivateConfirmModal={handleOpenReactivateModal}
            dadosLayout={selectedLayout}
            onSectionSelect={handleSectionSelect}
            showVisaoGeralButton={showVisaoGeral}
          />

          {activePastaSection === 'visaoGeral' && (
            <VisaoGeralTimeline />
          )}

          {activePastaSection === 'atendimentos' && (
            <AtendimentosTable
              atendimentos={atendimentos}
              currentPage={atendimentosActivePage}
              onPageChange={setAtendimentosActivePage}
              itemsPerPage={atendimentosItemsPerPage}
              onItemsPerPageChange={(value) => {
                setAtendimentosItemsPerPage(value);
                setAtendimentosActivePage(1); // Reset para primeira página
              }}
              onNewAtendimento={handleOpenContactSelectModal}
              onEdit={handleEditAtendimento}
              onDelete={(item) => console.log('Excluir atendimento:', item)}
              onView={(item) => console.log('Visualizar atendimento:', item)}
            />
          )}

          {activePastaSection === 'pecas' && (
            <PecaseOficiosList />
          )}

          {activePastaSection === 'documentos' && (
            <DocumentosTable
              documentos={documentos}
              currentPage={documentosActivePage}
              onPageChange={setDocumentosActivePage}
              itemsPerPage={documentosItemsPerPage}
              onItemsPerPageChange={(value) => {
                setDocumentosItemsPerPage(value);
                setDocumentosActivePage(1); // Reset para primeira página
              }}
              onView={(documento) => console.log('Visualizar documento:', documento)}
              onDownload={(documento) => console.log('Download documento:', documento)}
              onEdit={(documento) => console.log('Editar documento:', documento)}
              onDelete={(documento) => {
                console.log('Excluir documento:', documento);
                // Atualiza a lista removendo o documento
                setDocumentos(prev => prev.filter(doc => doc.id !== documento.id));
              }}
                             onUpload={(files) => {
                 console.log('Arquivos enviados:', files);
                 // Aqui você pode adicionar lógica para processar os arquivos
                 // Por exemplo, adicionar à lista de documentos
                 const novosDocumentos = files.map((file, index) => ({
                   id: Date.now() + index,
                   data: new Date().toLocaleDateString('pt-BR'),
                   descricao: file.name,
                   usuario: 'Humberto Borges Ribeiro'
                 }));
                 setDocumentos(prev => [...novosDocumentos, ...prev]);
               }}
                               onScan={(documentosClassificados) => {
                  console.log('Documentos digitalizados e classificados:', documentosClassificados);
                  // Adiciona todos os documentos classificados à lista
                  const novosDocumentos = documentosClassificados.map(doc => ({
                    id: doc.id,
                    data: doc.dataDigitalizacao,
                    descricao: doc.descricaoDocumento || doc.tipoDocumento || doc.nome,
                    usuario: doc.nomeAssistido || 'Humberto Borges Ribeiro'
                  }));
                  setDocumentos(prev => [...novosDocumentos, ...prev]);
                }}
            />
          )}
        </Box>
      </Flex>

      <Group justify="center" mt="xl">
         <Radio.Group
           name="layoutSelector"
           label={<Text fw={500} size="sm">Selecionar Layout para Dados da Pasta:</Text>}
           value={selectedLayout}
           onChange={setSelectedLayout}
         >
          <Group mt="xs">
            <Radio value="atual" label="Layout Atual" />
            <Radio value="colunas" label="Layout em Colunas" />
            <Radio value="agrupado" label="Layout Agrupado (com Divisor)" />
          </Group>
        </Radio.Group>
      </Group>

      <Group justify="center" mt="xl" pb="xl">
        <Link href="/">
          <Text c="dimmed" size="sm">Voltar para a Central</Text>
        </Link>
      </Group>

      <Group justify="center" mt="xl">
        <Checkbox
          label="Exibir botão 'Visão Geral'"
          checked={showVisaoGeral}
          onChange={(event) => setShowVisaoGeral(event.currentTarget.checked)}
        />
      </Group>

      <ArchivePastaModal
        opened={archiveModalOpened}
        onClose={handleCloseArchiveModal}
        onConfirm={handleConfirmArchive}
      />

      <ModalConfirmacaoAssustadora
        opened={reactivateModalOpened}
        onClose={handleCloseReactivateModal}
        onConfirm={handleConfirmReactivate}
        title="Confirmar Desarquivamento de Pasta"
        alertIcon={<IconAlertCircle size={16} style={{ color: theme.colors.yellow[8] }}/>}
        alertColor="yellow"
        alertMessage="Atenção: Desarquivar a pasta a torna visível na lista de pastas de seus assistidos e tem impacto direto nos relatórios de inteligência de negócio."
        bodyText={`A pasta foi arquivada pelo motivo: ${pastaData.motivoArquivamento || 'Não especificado'}. Confirma o desarquivamento?`}
        checkboxLabel="Declaro ciência das implicações e confirmo o desarquivamento desta pasta."
        confirmButtonLabel="Confirmar Desarquivamento"
      />

      {activePastaSection === 'atendimentos' && (
        <Affix position={{ bottom: theme.spacing.xl, right: theme.spacing.xl }}>
          <Tooltip label="Novo Atendimento" withArrow position="left">
            <ActionIcon size="xl" radius="xl" color="teal" variant="filled" onClick={() => console.log('FAB Novo Atendimento Clicado')}>
              <IconPlus style={{ width: '60%', height: '60%' }} />
            </ActionIcon>
          </Tooltip>
        </Affix>
      )}

      <AtendimentoChatModal
        opened={isWhatsappChatModalOpen}
        onClose={handleCloseWhatsappModal}
        contact={pastaData.contatos.find(c => c.id === selectedContactIdForChat)}
        pastaProcesso={pastaData.processo}
        onSave={handleSaveAtendimentoCallback}
        initialData={editingAtendimento}
      />

      <Modal
        opened={isContactSelectModalOpen}
        onClose={handleCloseContactSelectModal}
        title={
          <Group gap="xs">
            <IconBrandWhatsapp size={22} />
            <Text fw={700}>Iniciar Conversa no WhatsApp</Text>
          </Group>
        }
        centered
        size="md"
        radius="md"
        styles={{
            header: { backgroundColor: theme.colors.dark[6] },
            title: { color: theme.white },
            close: {
                color: theme.white,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            },
        }}
      >
        <Stack gap="md" pt="sm">
          <Text size="sm">Selecione com quem você deseja conversar:</Text>
          <Radio.Group
            value={selectedContactIdForChat}
            onChange={setSelectedContactIdForChat}
            name="contactSelectRadioGroup"
            label="Contatos da pasta com whatsapp"
            withAsterisk
          >
            <Stack mt="xs" gap="sm">
              {whatsappContacts && whatsappContacts.length > 0 ? (
                whatsappContacts.map((contato) => (
                  <Radio 
                    key={contato.id} 
                    value={contato.id} 
                    label={
                      <Flex justify="space-between" w="100%">
                        <Text>{contato.nome}</Text>
                        <Text c="dimmed">{contato.telefone}</Text>
                      </Flex>
                    }
                  />
                ))
              ) : (
                <Text c="dimmed" size="sm">Nenhum contato com WhatsApp disponível nesta pasta.</Text>
              )}
            </Stack>
          </Radio.Group>
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleCloseContactSelectModal}>Cancelar</Button>
            <Button 
              onClick={handleProceedToWhatsappChat}
              disabled={!selectedContactIdForChat}
              leftSection={<IconBrandWhatsapp size={18} />}
            >
              Iniciar Conversa
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}