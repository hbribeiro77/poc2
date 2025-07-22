'use client';

import React, { useState } from 'react';
import { Box, Title, Text, Button, Divider, Flex, Stack, Paper, TextInput, Grid, Checkbox, Radio, Group } from '@mantine/core';
import Link from 'next/link';
import ModalConfirmacaoAssustadora from '../../components/ConfirmActionModal/ModalConfirmacaoAssustadora';
import SendMessageModal from '../../components/SendMessageModal/SendMessageModal';
import AtendimentoChatModal from '../../components/AtendimentoChatModal/AtendimentoChatModal';
import EquipeTrabalhoTable from '../../components/EquipeTrabalhoTable/EquipeTrabalhoTable';
import dadosEquipe from '../../data/dadosEquipesDefensorias.json';
import AtendimentosPastaTable from '../../components/AtendimentosPastaTable/AtendimentosPastaTable';
import AtendimentosTable from '../../components/AtendimentosTable/AtendimentosTable';
import NovoAtendimentoModal from '../../components/NovoAtendimentoModal/NovoAtendimentoModal';
import NovoAtendimentoInline from '../../components/NovoAtendimentoInline/NovoAtendimentoInline';
import DocumentosTable from '../../components/DocumentosTable/DocumentosTable';
import ClassificarDocumentoDigitalizadoModal from '../../components/ClassificarDocumentoDigitalizadoModal/ClassificarDocumentoDigitalizadoModal';
import PecaParaAprovarCard from '../../components/PecaParaAprovarCard/PecaParaAprovarCard';
import dadosPecas from '../../data/pecas-para-aprovar-data.json';
import { useChatManager } from '../../hooks/useChatManager';
import ArchivePastaModal from '../../components/ArchivePastaModal/ArchivePastaModal';

export default function ComponentGalleryPage() {
  const { openChat } = useChatManager();
  const [modalAssustadoraOpened, setModalAssustadoraOpened] = useState(false);
  const [modalAssustadoraTitle, setModalAssustadoraTitle] = useState('Confirmar Ação Crítica');
  const [modalAssustadoraMessage, setModalAssustadoraMessage] = useState('Você tem certeza de que deseja executar esta ação? Ela não poderá ser desfeita e terá consequências permanentes no sistema.');
  const [modalAssustadoraCheckboxLabel, setModalAssustadoraCheckboxLabel] = useState('Estou ciente das consequências e desejo prosseguir.');
  const [modalSendMessageOpened, setModalSendMessageOpened] = useState(false);
  const [modalAtendimentoOpened, setModalAtendimentoOpened] = useState(false);
  const [novoAtendimentoModalOpened, setNovoAtendimentoModalOpened] = useState(false);
  const [showNovoAtendimentoInline, setShowNovoAtendimentoInline] = useState(false);
  const [archiveModalOpened, setArchiveModalOpened] = useState(false);

  const [mockContact, setMockContact] = useState({
    nome: 'Marge Simpson',
    contato: '(51) 98765-4321',
  });
  const [atendimentoPastaProcesso, setAtendimentoPastaProcesso] = useState('0010998-63.2024.8.21.7000');

  const [teamData] = useState(dadosEquipe['1ª DEFENSORIA PÚBLICA ESPECIALIZADA DO JÚRI DO FORO CENTRAL'] || []);
  const [teamCurrentPage, setTeamCurrentPage] = useState(1);
  const [teamItemsPerPage, setTeamItemsPerPage] = useState('5');
  const [acoesHabilitadas, setAcoesHabilitadas] = useState(true);

  const [atendimentosData] = useState([
    { id: 'atd-1', data: '25/06/2024', situacao: 'Aprovado', relato: 'Assistido relata problemas com vizinhos barulhentos...', providencia: 'Notificação extrajudicial', assistido: 'Homer Simpson', defensoria: '1ª DPE JÚRI', formaAtendimento: 'Presencial' },
    { id: 'atd-2', data: '24/06/2024', situacao: 'Rascunho', relato: 'Dúvidas sobre o andamento do processo de divórcio.', providencia: 'Orientação jurídica', assistido: 'Marge Simpson', defensoria: '1ª DPE JÚRI', formaAtendimento: 'WhatsApp' },
    { id: 'atd-3', data: '23/06/2024', situacao: 'Aprovado', relato: 'Solicitação de segunda via de certidão de nascimento.', providencia: 'Ofício ao cartório', assistido: 'Bart Simpson', defensoria: '2ª DPE CÍVEL', formaAtendimento: 'Telefone' },
    { id: 'atd-4', data: '22/06/2024', situacao: 'Aprovado', relato: 'Problemas com bullying na escola, buscando orientação.', providencia: 'Mediação escolar', assistido: 'Lisa Simpson', defensoria: 'NUDIJ', formaAtendimento: 'Presencial' },
    { id: 'atd-5', data: '21/06/2024', situacao: 'Aprovado', relato: 'Questões sobre direito de imagem por uso indevido de foto.', providencia: 'Análise de Contrato', assistido: 'Krusty, O Palhaço', defensoria: '1ª DPE JÚRI', formaAtendimento: 'Outro' },
  ]);
  const [atendimentosCurrentPage, setAtendimentosCurrentPage] = useState(1);
  const [atendimentosItemsPerPage, setAtendimentosItemsPerPage] = useState('5');
  
  // Estados para o novo componente AtendimentosTable
  const [newAtendimentosCurrentPage, setNewAtendimentosCurrentPage] = useState(1);
  const [newAtendimentosItemsPerPage, setNewAtendimentosItemsPerPage] = useState('5');

  // Estados para DocumentosTable
  const [documentosCurrentPage, setDocumentosCurrentPage] = useState(1);
  const [documentosItemsPerPage, setDocumentosItemsPerPage] = useState('5');
  const [documentosData] = useState([
    { id: 1, data: '03/07/2025', descricao: 'CAPTURA DE TELA - TENTATIVA DE CONTATO PELO WHATS', usuario: 'Guilherme Machado Moraes' },
    { id: 2, data: '13/06/2025', descricao: 'E-mail encaminhado', usuario: 'Nathalia de Quevedo Barbosa' },
    { id: 3, data: '30/05/2025', descricao: 'Comprovante CORREIO', usuario: 'Nathalia de Quevedo Barbosa' },
    { id: 4, data: '22/05/2025', descricao: 'Acordo', usuario: 'Nathalia de Quevedo Barbosa' },
    { id: 5, data: '22/05/2025', descricao: 'Acórdão', usuario: 'Nathalia de Quevedo Barbosa' },
    { id: 6, data: '22/05/2025', descricao: 'Comprovante de pagamento (destinatária Geovana Bet)', usuario: 'Nathalia de Quevedo Barbosa' },
    { id: 7, data: '22/05/2025', descricao: 'Relatório - Voto', usuario: 'Nathalia de Quevedo Barbosa' },
  ]);
  const [classificarDocModalOpened, setClassificarDocModalOpened] = useState(false);

  // --- Estados do Card ---
  const [pecaRascunho] = useState(dadosPecas.find(p => p.status === 'Rascunho'));
  const [pecaAprovada] = useState(dadosPecas.find(p => p.status === 'Aprovada'));
  const [cardStatus, setCardStatus] = useState('Rascunho');

  const handleOpenDemoChat = () => {
    const mockPasta = {
      id: 'demo-chat-1',
      assistido: 'Homer Simpson',
      telefone: '(99) 95555-1234',
      processoPrincipal: 'DEMO-001-2025',
      assunto: 'Demonstração de Componente',
      descricao: 'Este é um chat de demonstração aberto a partir da galeria de componentes.',
    };
    
    openChat(mockPasta, { initialAlignment: 'right' });
  };

  const handleArchiveConfirm = (data) => {
    console.log('Dados do arquivamento recebidos:', data);
    setArchiveModalOpened(false);
  };

  const handleNovoAtendimentoSave = (dados) => {
    console.log('Novo atendimento salvo:', dados);
    if (dados.rascunho) {
      console.log('Salvo como rascunho');
    } else {
      console.log('Salvo como atendimento final');
    }
    setNovoAtendimentoModalOpened(false);
  };

  return (
    <Box p="xl">
      <Title order={1} mb="md">Galeria de Componentes</Title>
      <Text c="dimmed" mb="xl">
        Esta página demonstra os componentes reutilizáveis disponíveis neste projeto.
      </Text>

      <Divider my="xl" label={<Title order={3}>Configurações Gerais</Title>} labelPosition="center" />
      <Paper withBorder shadow="sm" p="lg" mb="xl">
        <Title order={4} mb="sm">Dados do Contato (Mock)</Title>
        <Text size="sm" c="dimmed" mb="md">
          Altere os dados abaixo para ver como eles se refletem nas modais que utilizam um contato.
        </Text>
        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="Nome do Contato"
              value={mockContact.nome}
              onChange={(e) => setMockContact(prev => ({ ...prev, nome: e.currentTarget.value }))}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Telefone/ID do Contato"
              value={mockContact.contato}
              onChange={(e) => setMockContact(prev => ({ ...prev, contato: e.currentTarget.value }))}
            />
          </Grid.Col>
        </Grid>
      </Paper>

      <Divider my="xl" label={<Title order={3}>Modais</Title>} labelPosition="center" />

      <Stack>
        <Paper withBorder shadow="sm" p="lg">
            <Title order={4} mb="sm">Modal de Confirmação (Assustadora)</Title>
            <Text mb="md">
                Usada para ações destrutivas ou que requerem atenção máxima do usuário. Exige a marcação de uma caixa de seleção para habilitar o botão de confirmação.
            </Text>
            
            <Divider my="md" label="Configurações Interativas" />
            <Stack>
                <TextInput
                    label="Título da Modal"
                    value={modalAssustadoraTitle}
                    onChange={(event) => setModalAssustadoraTitle(event.currentTarget.value)}
                />
                <TextInput
                    label="Mensagem Principal"
                    value={modalAssustadoraMessage}
                    onChange={(event) => setModalAssustadoraMessage(event.currentTarget.value)}
                />
                <TextInput
                    label="Texto do Checkbox"
                    value={modalAssustadoraCheckboxLabel}
                    onChange={(event) => setModalAssustadoraCheckboxLabel(event.currentTarget.value)}
                />
            </Stack>
            
            <Button onClick={() => setModalAssustadoraOpened(true)} mt="lg">Abrir Modal de Confirmação</Button>
        </Paper>

        <Paper withBorder shadow="sm" p="lg">
            <Title order={4} mb="sm">Modal de Envio de Mensagem</Title>
            <Text mb="md">
                Usada para enviar uma mensagem padronizada para um contato. Permite selecionar um modelo de mensagem e a defensoria de origem.
            </Text>
            <Button onClick={() => setModalSendMessageOpened(true)}>Abrir Modal de Envio de Mensagem</Button>
        </Paper>

        <Paper withBorder shadow="sm" p="lg">
            <Title order={4} mb="sm">Modal de Arquivamento de Pasta</Title>
            <Text mb="md">
                Componente reutilizável para arquivar uma pasta. Coleta o motivo, uma observação opcional e exige confirmação.
            </Text>
            <Button onClick={() => setArchiveModalOpened(true)}>Abrir Modal de Arquivamento</Button>
        </Paper>

        <Paper withBorder shadow="sm" p="lg">
            <Title order={4} mb="sm">Sistema de Chat Flutuante</Title>
            <Text mb="md">
                Demonstra o sistema de chat reutilizável. Clicar no botão abaixo usará o 
                <code>useChatManager</code> para abrir uma nova janela de chat. A janela é arrastável, 
                minimizável e o histórico persiste no localStorage.
            </Text>
            <Button onClick={handleOpenDemoChat}>Abrir Chat de Demonstração</Button>
        </Paper>

        <Paper withBorder shadow="sm" p="lg">
            <Title order={4} mb="sm">Modal de Registro de Atendimento</Title>
            <Text mb="md">
              Modal completa para registrar um novo atendimento. Inclui chat com o assistido, formulário detalhado e resumo por IA (simulado).
            </Text>
            <Divider my="md" label="Configurações Interativas" />
            <TextInput
                label="Número do Processo"
                value={atendimentoPastaProcesso}
                onChange={(event) => setAtendimentoPastaProcesso(event.currentTarget.value)}
            />
            <Button onClick={() => setModalAtendimentoOpened(true)} mt="lg">Abrir Modal de Atendimento</Button>
        </Paper>

        <Paper withBorder shadow="sm" p="lg">
            <Title order={4} mb="sm">Modal de Novo Atendimento</Title>
            <Text mb="md">
              Modal específica para cadastro de novo atendimento com formulário completo baseado na interface de referência. 
              Inclui campos para data, defensoria, pessoa, processo, relato, providência, detalhes, forma de atendimento, 
              checkbox urgente e upload de documentos.
            </Text>
            <Button onClick={() => setNovoAtendimentoModalOpened(true)}>Abrir Nova Modal de Atendimento</Button>
        </Paper>

        <Paper withBorder shadow="sm" p="lg">
            <Title order={4} mb="sm">Formulário de Novo Atendimento Inline</Title>
            <Text mb="md">
              Versão inline do formulário de novo atendimento. Mesmo conteúdo da modal mas como um componente 
              que pode ser inserido direto na página sem necessidade de modal. Perfeito para páginas dedicadas 
              ao cadastro ou quando você quer manter o formulário sempre visível.
            </Text>
            <Group>
              <Button 
                onClick={() => setShowNovoAtendimentoInline(!showNovoAtendimentoInline)}
                variant={showNovoAtendimentoInline ? "filled" : "light"}
                color="teal"
              >
                {showNovoAtendimentoInline ? "Ocultar" : "Mostrar"} Formulário Inline
              </Button>
            </Group>
            
            {showNovoAtendimentoInline && (
              <Box mt="lg">
                <NovoAtendimentoInline
                  onSave={(dados) => {
                    console.log('Dados salvos do formulário inline:', dados);
                    if (dados.rascunho) {
                      console.log('Salvo como rascunho');
                    } else {
                      console.log('Salvo como atendimento final');
                    }
                  }}
                  onCancel={() => {
                    console.log('Formulário cancelado');
                    setShowNovoAtendimentoInline(false);
                  }}
                />
              </Box>
            )}
        </Paper>
      </Stack>

      <Divider my="xl" label={<Title order={3}>Tabelas</Title>} labelPosition="center" />

      <Stack>
        <Paper withBorder shadow="sm" p="lg">
            <Title order={4} mb="sm">Tabela de Equipe de Trabalho</Title>
            <Text mb="md">
                Tabela paginada para exibir membros de uma equipe, com ações e tooltips.
            </Text>
            
            <Divider my="md" label="Configurações Interativas" />
            <Checkbox
                checked={acoesHabilitadas}
                onChange={(event) => setAcoesHabilitadas(event.currentTarget.checked)}
                label="Habilitar ações na tabela (Adicionar/Remover)"
                mb="lg"
            />
            
            <EquipeTrabalhoTable
                teamMembers={teamData}
                currentPage={teamCurrentPage}
                onPageChange={setTeamCurrentPage}
                itemsPerPage={parseInt(teamItemsPerPage, 10)}
                onItemsPerPageChange={(value) => {
                    setTeamItemsPerPage(String(value));
                    setTeamCurrentPage(1); // Resetar para a primeira página ao mudar itens por pág.
                }}
                totalItems={teamData.length}
                acoesHabilitadas={acoesHabilitadas}
                onShowUserInfo={(id) => console.log(`Clicou em Info para usuário ID: ${id}`)}
                onAddFuncao={(id) => console.log(`Clicou em Add Função para usuário ID: ${id}`)}
                onRemoveFuncao={(userId, funcao) => console.log(`Clicou em Remover Função &quot;${funcao}&quot; para usuário ID: ${userId}`)}
                onRemoveUsuario={(id) => console.log(`Clicou em Remover Usuário ID: ${id}`)}
            />
        </Paper>

        <Paper withBorder shadow="sm" p="lg">
            <Title order={4} mb="sm">Tabela de Atendimentos da Pasta</Title>
            <Text mb="md">
                Tabela paginada para listar os atendimentos realizados em uma pasta, com ícones e ações.
            </Text>
            <AtendimentosPastaTable
                atendimentos={atendimentosData}
                atendimentosActivePage={atendimentosCurrentPage}
                setAtendimentosActivePage={setAtendimentosCurrentPage}
                atendimentosItemsPerPage={atendimentosItemsPerPage}
                setAtendimentosItemsPerPage={setAtendimentosItemsPerPage}
                onNewWhatsapp={() => console.log('Clicou em Novo WhatsApp')}
                onEdit={(item) => console.log('Clicou em Editar Item:', item)}
            />
        </Paper>

        <Paper withBorder shadow="sm" p="lg">
            <Title order={4} mb="sm">Nova Tabela de Atendimentos</Title>
            <Text mb="md">
                Versão nova da tabela de atendimentos com design mais limpo, baseada na referência visual fornecida. 
                Inclui emoji no cabeçalho e layout otimizado das ações.
            </Text>
            <AtendimentosTable
                atendimentos={atendimentosData}
                currentPage={newAtendimentosCurrentPage}
                onPageChange={setNewAtendimentosCurrentPage}
                itemsPerPage={newAtendimentosItemsPerPage}
                onItemsPerPageChange={(value) => {
                    setNewAtendimentosItemsPerPage(value);
                    setNewAtendimentosCurrentPage(1); // Resetar para a primeira página ao mudar itens por página
                }}
                onNewAtendimento={() => console.log('Clicou em Novo Atendimento')}
                onEdit={(item) => console.log('Clicou em Editar:', item)}
                onDelete={(item) => console.log('Clicou em Excluir:', item)}
                onView={(item) => console.log('Clicou em Visualizar:', item)}
                         />
         </Paper>

         <Paper withBorder shadow="sm" p="lg">
             <Title order={4} mb="sm">Tabela de Documentos</Title>
             <Text mb="md">
                 Tabela para listagem e gerenciamento de documentos com upload integrado e funcionalidade de scanner. 
                 Inclui área de dropzone destacada, botão para digitalização de documentos, visualização de arquivos 
                 adicionados e ações para cada documento (visualizar, download, editar, excluir).
             </Text>
             <DocumentosTable
                 documentos={documentosData}
                 currentPage={documentosCurrentPage}
                 onPageChange={setDocumentosCurrentPage}
                 itemsPerPage={documentosItemsPerPage}
                 onItemsPerPageChange={(value) => {
                     setDocumentosItemsPerPage(value);
                     setDocumentosCurrentPage(1); // Reset para primeira página
                 }}
                 onView={(documento) => console.log('Visualizar documento:', documento)}
                 onDownload={(documento) => console.log('Download documento:', documento)}
                 onEdit={(documento) => console.log('Editar documento:', documento)}
                 onDelete={(documento) => console.log('Excluir documento:', documento)}
                 onUpload={(files) => console.log('Arquivos enviados:', files)}
                 onScan={(documentosClassificados) => console.log('Documentos digitalizados e classificados:', documentosClassificados)}
             />
         </Paper>

         <Paper withBorder shadow="sm" p="lg">
             <Title order={4} mb="sm">Modal de Classificação de Documento Digitalizado</Title>
             <Text mb="md">
                 Modal para classificar documentos após digitalização. Contém formulário completo com campos para 
                 tipo do documento, assistido, número, descrição e área para simulação de digitalização com 
                 feedback visual e estados de carregamento.
             </Text>
             <Button 
                 variant="outline" 
                 onClick={() => setClassificarDocModalOpened(true)}
             >
                 Testar Modal de Classificação
             </Button>
         </Paper>
      </Stack>

      <Divider my="xl" label={<Title order={3}>Cards e Itens de Lista</Title>} labelPosition="center" />

      <Stack>
        <Paper withBorder shadow="sm" p="lg">
            <Title order={4} mb="sm">Card de Peça para Aprovar</Title>
            <Text mb="md">
                Card para exibir uma peça processual, com variações de layout para os status &quot;Rascunho&quot; e &quot;Aprovada&quot;.
            </Text>
            
            <Divider my="md" label="Configurações Interativas" />
            <Radio.Group
                value={cardStatus}
                onChange={setCardStatus}
                name="cardStatus"
                label="Selecione o estado do card para visualizar"
                mb="lg"
            >
                <Group mt="xs">
                    <Radio value="Rascunho" label="Rascunho" />
                    <Radio value="Aprovada" label="Aprovada" />
                </Group>
            </Radio.Group>
            
            <PecaParaAprovarCard peca={cardStatus === 'Rascunho' ? pecaRascunho : pecaAprovada} />

        </Paper>
      </Stack>

      <ModalConfirmacaoAssustadora
        opened={modalAssustadoraOpened}
        onClose={() => setModalAssustadoraOpened(false)}
        onConfirm={() => {
          console.log('Ação confirmada!');
          setModalAssustadoraOpened(false);
        }}
        title={modalAssustadoraTitle}
        message={modalAssustadoraMessage}
        checkboxLabel={modalAssustadoraCheckboxLabel}
      >
        <Text c="dimmed" size="sm" mt="md">
            Este é um espaço para conteúdo adicional, se necessário. Pode ser um alerta, um campo de texto, etc.
        </Text>
      </ModalConfirmacaoAssustadora>

      <SendMessageModal
        opened={modalSendMessageOpened}
        onClose={() => setModalSendMessageOpened(false)}
        contact={mockContact}
        templateLabel="Envio de Documento"
      />

      <AtendimentoChatModal
        opened={modalAtendimentoOpened}
        onClose={() => setModalAtendimentoOpened(false)}
        pastaProcesso={atendimentoPastaProcesso}
        contact={mockContact}
      />

      <NovoAtendimentoModal
        opened={novoAtendimentoModalOpened}
        onClose={() => setNovoAtendimentoModalOpened(false)}
        onSave={handleNovoAtendimentoSave}
      />

      <ArchivePastaModal
        opened={archiveModalOpened}
        onClose={() => setArchiveModalOpened(false)}
        onConfirm={handleArchiveConfirm}
      />

      <ClassificarDocumentoDigitalizadoModal
        opened={classificarDocModalOpened}
        onClose={() => setClassificarDocModalOpened(false)}
        onSave={(documentosClassificados) => {
          console.log('Documentos classificados na galeria:', documentosClassificados);
          const totalDocs = documentosClassificados.length;
          const descricoes = documentosClassificados.map(doc => 
            doc.descricaoDocumento || doc.tipoDocumento || 'Sem descrição'
          ).join(', ');
          alert(`${totalDocs} documento(s) enviado(s): ${descricoes}`);
        }}
      />

      <Divider my="xl" />
      <Flex justify="center">
        <Button component={Link} href="/" variant="subtle">
          Voltar à Central de Protótipos
        </Button>
      </Flex>
    </Box>
  );
} 