import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Modal,
  Box,
  Group,
  Text,
  Title,
  ActionIcon,
  Stack,
  Avatar,
  ScrollArea,
  Paper,
  ThemeIcon,
  Textarea,
  Button,
  Accordion,
  TextInput,
  Select,
  Checkbox,
  Skeleton,
  useMantineTheme,
  Tooltip,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Dropzone, PDF_MIME_TYPE } from '@mantine/dropzone';
import {
  IconX,
  IconBrandWhatsapp,
  IconMessageCircle,
  IconMessageChatbot,
  IconSend,
  IconCalendar,
  IconDoorExit,
  IconSparkles,
  IconFileTypePdf,
  IconCheck,
  IconInfoCircle,
} from '@tabler/icons-react';
import ChatUI from '../ChatUI/ChatUI';

const ATENDENTE_NOME_COMPLETO = 'Humberto Borges Ribeiro (3925811)';

const AtendimentoChatModal = ({
  opened,
  onClose,
  contact,
  pastaProcesso,
  onSave,
  initialData,
}) => {
  const theme = useMantineTheme();
  
  const initialState = useMemo(() => ({
    data: new Date(),
    defensoria: '',
    pessoa: '',
    processo: '',
    relato: '',
    providencia: '',
    detalhesProvidencia: '',
    formaAtendimento: 'WhatsApp',
    urgente: false,
    documentos: [],
    propriedadesDefensoria: 'Unidade de Sistemas',
    propriedadesDefensor: 'TESTE-DEFENSOR',
  }), []);

  // Estados movidos para dentro do componente
  const [whatsappChatHistory, setWhatsappChatHistory] = useState([]);
  const [whatsappMessageContent, setWhatsappMessageContent] = useState('');
  const [isChatActive, setIsChatActive] = useState(true);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [atendimentoFormData, setAtendimentoFormData] = useState(initialState);
  const [activeAccordionItems, setActiveAccordionItems] = useState(['chat-whatsapp']);
  
  // Refs movidos para dentro do componente
  const assistidoWhatsappResponseTimeoutRef = useRef(null);
  const viewportRef = useRef(null);
  
  // Efeitos movidos para dentro do componente
  useEffect(() => {
    // Efeito para popular dados iniciais quando o modal abre
    if (opened) {
      if (initialData) {
        // MODO DE EDIÇÃO: Carrega dados existentes
        const dataParts = initialData.data.split('/');
        const isoDate = new Date(dataParts[2], dataParts[1] - 1, dataParts[0]);
        
        setAtendimentoFormData({
          ...initialData,
          data: isoDate, // Converte a data de string para Date object
        });
        setWhatsappChatHistory(initialData.chatHistory || []);
        setIsChatActive(initialData.isChatActive !== undefined ? initialData.isChatActive : true);
      } else {
        // MODO DE CRIAÇÃO: Reseta para o estado inicial
        setAtendimentoFormData({
          ...initialState,
          pessoa: contact?.nome || '',
          processo: pastaProcesso,
          data: new Date(),
        });
        setWhatsappChatHistory([]);
        setIsChatActive(true);
        setActiveAccordionItems(['chat-whatsapp']);
      }
      
      // Garante a rolagem para o final ao abrir o modal (especialmente em modo de edição)
      setTimeout(() => {
        if (viewportRef.current) {
          viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'auto' });
        }
      }, 100);

    } else {
        // Limpa o timeout se o modal for fechado
        if (assistidoWhatsappResponseTimeoutRef.current) {
            clearTimeout(assistidoWhatsappResponseTimeoutRef.current);
        }
    }
  }, [opened, initialData, contact, pastaProcesso, initialState]);

  useEffect(() => {
    // Efeito para rolar o chat para a última mensagem
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [whatsappChatHistory]);
  
  // Funções de manipulação movidas para dentro do componente
  const handleAtendimentoFormChange = (field, value) => {
    setAtendimentoFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDropzoneDrop = (files) => {
    handleAtendimentoFormChange('documentos', [...atendimentoFormData.documentos, ...files]);
  };

  const handleEndChat = () => {
    const endMessage = {
      id: `system-end-${Date.now()}`,
      sender: 'defensor',
      name: 'Sistema',
      text: `Conversa encerrada pelo atendente ${ATENDENTE_NOME_COMPLETO}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setWhatsappChatHistory(prev => [...prev, endMessage]);
    setIsChatActive(false);
  };
  
  const handleContinueChat = () => {
    setIsChatActive(true);
  };

  const handleSendWhatsappMessage = () => {
    if (!whatsappMessageContent.trim()) return;
    const newMessage = {
      id: `defensor-wp-${Date.now()}`,
      sender: 'defensor',
      name: ATENDENTE_NOME_COMPLETO,
      text: whatsappMessageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setWhatsappChatHistory(prev => [...prev, newMessage]);
    setWhatsappMessageContent('');

    if (assistidoWhatsappResponseTimeoutRef.current) {
        clearTimeout(assistidoWhatsappResponseTimeoutRef.current);
    }
    
    assistidoWhatsappResponseTimeoutRef.current = setTimeout(() => {
        const contactName = contact?.nome || '';
        const isFemale = contactName.toUpperCase().includes('MARGE');
        const replyText = `Sim, obrigad${isFemale ? 'a' : 'o'}.`;

        const assistidoResponse = {
            id: `assistido-wp-reply-${Date.now()}`,
            sender: 'assistido',
            name: contact?.nome || 'Assistido',
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setWhatsappChatHistory(prev => [...prev, assistidoResponse]);
    }, 2000);
  };
  
  const handleGenerateSummary = () => {
    setIsSummaryLoading(true);
    const fullChatText = whatsappChatHistory.map(m => `${m.name}: ${m.text}`).join('\\n');
    
    const contactName = contact?.nome || '';
    // Lógica simples para o protótipo: assume feminino se o nome contém "Marge"
    const isFemale = contactName.toUpperCase().includes('MARGE');

    const article = isFemale ? 'A' : 'O';
    const pronoun = isFemale ? 'assistida' : 'assistido';

    // Simula um resumo da IA baseado no contato atual e no gênero inferido
    const summaryText = `${article} ${pronoun}, ${contactName || 'a pessoa contatada'}, relata uma situação complexa de superendividamento. A dívida foi originada pela compra impulsiva de 72 caixas de 'Krusty Cereal' e um elefante de estimação chamado Stampy, tudo financiado no cartão de crédito em 36 parcelas. O problema se intensificou quando ${article.toLowerCase()} ${pronoun} investiu e perdeu todas as economias da família em um aplicativo de especulação de nabos. Busca-se orientação jurídica para renegociar as dívidas, potencialmente anular os contratos por vício de consentimento (considerando a impulsividade e a natureza inusitada das compras) e, se possível, organizar a devolução do elefante, que se tornou uma despesa insustentável. O ambiente familiar está tenso, e há relatos de que o pai, Homer, cogita medidas drásticas, como a venda da usina nuclear, para quitar os débitos.`;

    setTimeout(() => {
        handleAtendimentoFormChange('relato', summaryText);
        setIsSummaryLoading(false);
    }, 2000);
  };
  
  const handleAccordionChange = (newValue) => {
    const newlyOpenedItem = newValue.find(item => !(activeAccordionItems || []).includes(item));
    setActiveAccordionItems(newValue);

    if (newlyOpenedItem) {
      setTimeout(() => {
        const element = document.getElementById(`accordion-item-${newlyOpenedItem}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };
  
  const handleInternalSave = (isRascunho) => {
    const situacao = isRascunho ? 'Rascunho' : 'Finalizado';
    
    // Mantém o ID se estiver editando, cria um novo se não estiver
    const id = initialData?.id || `atd-${Date.now()}`;
    
    const atendimentoSalvo = {
        ...atendimentoFormData,
        id: id,
        situacao: situacao,
        data: new Date(atendimentoFormData.data).toLocaleDateString('pt-BR'), // formata a data para a tabela
        assistido: atendimentoFormData.pessoa,
        defensoria: atendimentoFormData.propriedadesDefensoria, // Mapeia para a coluna certa da tabela
        relato: atendimentoFormData.relato.substring(0, 35) + '...',
        // Salva o estado completo para futura edição
        fullRelato: atendimentoFormData.relato, 
        chatHistory: whatsappChatHistory,
        isChatActive: isChatActive,
    };
    onSave(atendimentoSalvo);
    onClose();
  };

  // Esta parte é puramente visual e pode ser derivada diretamente
  const filesList = atendimentoFormData.documentos.map((file) => (
    <Text key={file.path}>
      {file.path} - {(file.size / 1024).toFixed(2)} KB
    </Text>
  ));

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconBrandWhatsapp size={24} />
          <Title order={4}>Conversa com {contact?.nome || 'Contato'}</Title>
        </Group>
      }
      size="xl"
      centered
      radius="md"
      styles={{
        header: { backgroundColor: theme.colors.dark[6] },
        title: { color: theme.white, fontWeight: 700 },
        close: {
          color: theme.white,
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
        },
        body: {
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
          height: '80vh',
        }
      }}
    >
      {/* CABEÇALHO FIXO */}
      <Box p="md" style={{ borderBottom: `1px solid ${theme.colors.gray[2]}` }}>
        <Group justify="space-between" align="flex-end">
          <Text size="sm" mb={5}><Text span fw={500}>Atendente:</Text> {ATENDENTE_NOME_COMPLETO}</Text>
          <Group gap="xs" align="center">
            <Text size="sm" fw={500}>Data:</Text>
            <DatePickerInput
              withAsterisk
              placeholder="Selecione a data"
              value={atendimentoFormData.data}
              onChange={(value) => handleAtendimentoFormChange('data', value)}
              valueFormat="DD/MM/YYYY"
              rightSection={<IconCalendar size={18} />}
              style={{ width: '160px' }}
            />
          </Group>
        </Group>
      </Box>

      {/* ÁREA DE CONTEÚDO COM ROLAGEM */}
      <ScrollArea style={{ flex: 1 }}>
        <Box p="md">
          <Accordion
            multiple
            value={activeAccordionItems}
            onChange={handleAccordionChange}
            variant="contained"
          >
            <Accordion.Item value="chat-whatsapp" id="accordion-item-chat-whatsapp">
              <Accordion.Control>Atendimento por Chat</Accordion.Control>
              <Accordion.Panel>
                <ChatUI
                  chatHistory={whatsappChatHistory}
                  viewportRef={viewportRef}
                  messageContent={whatsappMessageContent}
                  onMessageChange={(event) => setWhatsappMessageContent(event.currentTarget.value)}
                  isChatActive={isChatActive}
                  contactName={contact?.nome}
                  actionButtons={
                    <Group justify="space-between" mt={0}>
                      <Group gap="xs">
                          <Button
                            color="red"
                            leftSection={<IconDoorExit size={16} />}
                            onClick={handleEndChat}
                            disabled={!isChatActive}
                          >
                            Encerrar conversa
                          </Button>
                          <Tooltip 
                              label="Caso encerre a conversa, você não receberá novas respostas do assistido e precisará continuar a conversa para reativá-la."
                              withArrow
                              multiline
                              w={220}
                          >
                              <ThemeIcon variant="subtle" color="gray" radius="xl">
                                  <IconInfoCircle size={20} />
                              </ThemeIcon>
                          </Tooltip>
                      </Group>
                      <Group>
                        {!isChatActive ? (
                            <Button color="green" onClick={handleContinueChat}>
                                Continuar Conversa
                            </Button>
                        ) : (
                            <Button 
                                leftSection={<IconSend size={16}/>} 
                                onClick={handleSendWhatsappMessage}
                                disabled={!whatsappMessageContent.trim()}
                            >
                                Enviar Mensagem
                            </Button>
                        )}
                      </Group>
                    </Group>
                  }
                />
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="registro-detalhado" id="accordion-item-registro-detalhado">
              <Accordion.Control>Propriedades do atendimento</Accordion.Control>
              <Accordion.Panel>
                <Stack gap="xs">
                  <Select
                    label="Defensoria"
                    placeholder="Selecione a defensoria"
                    data={['Unidade de Sistemas', '1ª Defensoria de Porto Alegre', '2ª Defensoria de Caxias do Sul']}
                    value={atendimentoFormData.propriedadesDefensoria}
                    onChange={(value) => handleAtendimentoFormChange('propriedadesDefensoria', value)}
                  />
                  <Select
                    label="Defensor"
                    placeholder="Selecione o defensor"
                    data={['TESTE-DEFENSOR', 'Fulano de Tal', 'Beltrano de Tal']}
                    value={atendimentoFormData.propriedadesDefensor}
                    onChange={(value) => handleAtendimentoFormChange('propriedadesDefensor', value)}
                  />
                  {isSummaryLoading ? (
                    <Stack gap="xs" mt="sm">
                      <Skeleton height={8} radius="xl" />
                      <Skeleton height={8} radius="xl" />
                      <Skeleton height={8} width="70%" radius="xl" />
                    </Stack>
                  ) : (
                    <Textarea
                      label={
                        <Group gap="xs">
                          <Text>Relato</Text>
                          <Tooltip label="Resumir conversa do chat (IA)" withArrow position="top-start">
                            <ActionIcon onClick={handleGenerateSummary} variant="subtle" size="sm">
                              <IconSparkles size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      }
                      placeholder="O histórico da conversa será automaticamente preenchido aqui."
                      value={atendimentoFormData.relato}
                      onChange={(event) => handleAtendimentoFormChange('relato', event.currentTarget.value)}
                      autosize
                      minRows={4}
                    />
                  )}
                  <Select
                    label="Providência"
                    placeholder="Selecione a providência"
                    data={['Petição inicial', 'Contestação', 'Recurso', 'Orientação', 'Ofício']}
                    value={atendimentoFormData.providencia}
                    onChange={(value) => handleAtendimentoFormChange('providencia', value)}
                  />
                  <Textarea
                    label="Detalhes da providência"
                    placeholder="Detalhes sobre a providência adotada"
                    value={atendimentoFormData.detalhesProvidencia}
                    onChange={(event) => handleAtendimentoFormChange('detalhesProvidencia', event.currentTarget.value)}
                    autosize
                    minRows={3}
                  />
                  <Select
                    label="Forma de atendimento"
                    placeholder="Selecione a forma"
                    data={['WhatsApp', 'Telefone', 'Presencial', 'E-mail']}
                    value={atendimentoFormData.formaAtendimento}
                    onChange={(value) => handleAtendimentoFormChange('formaAtendimento', value)}
                    readOnly
                  />
                  <Checkbox
                    label="É urgente?"
                    checked={atendimentoFormData.urgente}
                    onChange={(event) => handleAtendimentoFormChange('urgente', event.currentTarget.checked)}
                  />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="documentos" id="accordion-item-documentos">
              <Accordion.Control>Documentos Entregues Durante o Atendimento</Accordion.Control>
              <Accordion.Panel>
                <Stack gap="xs">
                  <Dropzone
                    onDrop={handleDropzoneDrop}
                    onReject={(files) => console.log('rejected files', files)}
                    maxSize={5 * 1024 ** 2}
                    accept={PDF_MIME_TYPE}
                  >
                    <Group justify="center" gap="xl" mih={150} style={{ pointerEvents: 'none' }}>
                      <Dropzone.Accept>
                        <IconCheck style={{ width: 50, height: 50, color: theme.colors.blue[6] }} />
                      </Dropzone.Accept>
                      <Dropzone.Reject>
                        <IconX style={{ width: 50, height: 50, color: theme.colors.red[6] }} />
                      </Dropzone.Reject>
                      <Dropzone.Idle>
                        <IconFileTypePdf style={{ width: 50, height: 50 }} />
                      </Dropzone.Idle>
                      <div>
                        <Text size="xl" inline>
                          Arraste arquivos PDF aqui ou clique para selecionar
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                          Anexe documentos relevantes (limite de 5MB por arquivo)
                        </Text>
                      </div>
                    </Group>
                  </Dropzone>
                  {atendimentoFormData.documentos.length > 0 && (
                    <Stack mt="md">
                      <Text size="sm" fw={500}>Documentos Selecionados:</Text>
                      {atendimentoFormData.documentos.map((file, index) => (
                        <Paper key={index} p="xs" withBorder shadow="xs">
                          <Group justify="space-between">
                            <Text size="sm" truncate>{file.name} ({(file.size / 1024).toFixed(2)} KB)</Text>
                            <ActionIcon
                              color="red"
                              size="sm"
                              onClick={() => {
                                const newFiles = [...atendimentoFormData.documentos];
                                newFiles.splice(index, 1);
                                handleAtendimentoFormChange('documentos', newFiles);
                              }}
                            >
                              <IconX size={14} />
                            </ActionIcon>
                          </Group>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Box>
      </ScrollArea>
      {/* RODAPÉ FIXO */}
      <Group justify="flex-end" p="md" style={{ borderTop: `1px solid ${theme.colors.gray[2]}` }}>
        <Button
          variant="default"
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button
          variant="default"
          onClick={() => handleInternalSave(true)}
          disabled={!atendimentoFormData.relato.trim()}
        >
          Salvar rascunho
        </Button>
        <Button
          onClick={() => handleInternalSave(false)}
          disabled={!atendimentoFormData.relato.trim()}
        >
          Salvar
        </Button>
      </Group>
    </Modal>
  );
};

export default AtendimentoChatModal; 