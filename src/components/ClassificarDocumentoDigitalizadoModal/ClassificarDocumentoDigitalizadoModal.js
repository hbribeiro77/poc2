import React, { useState } from 'react';
import {
  Modal,
  Stack,
  TextInput,
  Select,
  Group,
  Button,
  Box,
  Text,
  ThemeIcon,
  useMantineTheme,
  Table,
  ScrollArea,
  ActionIcon,
  Tooltip,
  Divider,
  Progress,
} from '@mantine/core';
import {
  IconScan,
  IconFile,
  IconCheck,
  IconEye,
  IconTrash,
  IconX,
  IconPlus,
  IconLoader2,
  IconCircleCheck,
} from '@tabler/icons-react';

const ClassificarDocumentoDigitalizadoModal = ({ opened, onClose, onSave }) => {
  const theme = useMantineTheme();
  
  // Lista de documentos digitalizados aguardando classificação
  const [documentosDigitalizados, setDocumentosDigitalizados] = useState([]);
  const [digitalizando, setDigitalizando] = useState(false);
  const [documentoSelecionado, setDocumentoSelecionado] = useState(null);
  const [enviandoArquivos, setEnviandoArquivos] = useState(false);
  const [progressoEnvio, setProgressoEnvio] = useState({});

  const modalStyles = {
    header: { backgroundColor: theme.colors.dark[6] },
    title: { color: theme.white, fontWeight: 700 },
    close: {
      color: theme.white,
      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
    },
  };

  const handleDigitalizar = async () => {
    setDigitalizando(true);
    
    // Simula processo de digitalização
    setTimeout(() => {
      const novoDocumento = {
        id: Date.now(),
        nome: `Documento_${documentosDigitalizados.length + 1}_${Date.now()}.pdf`,
        tipo: 'application/pdf',
        tamanho: '2.4 MB',
        dataDigitalizacao: new Date().toLocaleDateString('pt-BR'),
        preview: `Preview do Documento ${documentosDigitalizados.length + 1}`,
        // Campos de classificação (inicialmente vazios)
        tipoDocumento: '',
        nomeAssistido: '',
        numeroDocumento: '',
        descricaoDocumento: '', // Será preenchido automaticamente quando selecionar o tipo
        classificado: false,
      };
      
      setDocumentosDigitalizados(prev => [...prev, novoDocumento]);
      setDigitalizando(false);
    }, 2000);
  };

  const handleClassificar = (documento) => {
    setDocumentoSelecionado(documento);
  };

  const handleSalvarClassificacao = (dadosClassificacao) => {
    setDocumentosDigitalizados(prev => 
      prev.map(doc => 
        doc.id === documentoSelecionado.id 
          ? { ...doc, ...dadosClassificacao, classificado: true }
          : doc
      )
    );
    setDocumentoSelecionado(null);
  };

  const handleRemoverDocumento = (documentoId) => {
    setDocumentosDigitalizados(prev => prev.filter(doc => doc.id !== documentoId));
    if (documentoSelecionado?.id === documentoId) {
      setDocumentoSelecionado(null);
    }
  };

  const handleEnviarTodos = async () => {
    setEnviandoArquivos(true);
    
    // Envia cada documento com efeito visual progressivo
    for (let i = 0; i < documentosDigitalizados.length; i++) {
      const documento = documentosDigitalizados[i];
      
      // Inicia o progresso para este documento
      setProgressoEnvio(prev => ({
        ...prev,
        [documento.id]: { status: 'enviando', progresso: 0 }
      }));

      // Simula progresso de envio (0 a 100%)
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms por step
        setProgressoEnvio(prev => ({
          ...prev,
          [documento.id]: { status: 'enviando', progresso: progress }
        }));
      }

      // Marca como enviado
      setProgressoEnvio(prev => ({
        ...prev,
        [documento.id]: { status: 'enviado', progresso: 100 }
      }));

      // Pequena pausa antes do próximo arquivo
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Aguarda um pouco para mostrar todos "enviados"
    await new Promise(resolve => setTimeout(resolve, 800));

    // Envia todos os documentos classificados
    onSave?.(documentosDigitalizados);
    handleClose();
  };

  // Verifica se todos os documentos estão totalmente classificados
  const todosDocumentosClassificados = documentosDigitalizados.length > 0 && 
    documentosDigitalizados.every(doc => 
      doc.tipoDocumento && doc.nomeAssistido
    );

  const handleClose = () => {
    setDocumentosDigitalizados([]);
    setDocumentoSelecionado(null);
    setDigitalizando(false);
    setEnviandoArquivos(false);
    setProgressoEnvio({});
    onClose();
  };

  const FormularioClassificacao = ({ documento, onSalvar, onCancelar }) => {
    const [dados, setDados] = useState({
      tipoDocumento: documento.tipoDocumento || '',
      nomeAssistido: documento.nomeAssistido || '',
      numeroDocumento: documento.numeroDocumento || '',
      descricaoDocumento: documento.descricaoDocumento || '',
    });

    const handleSubmit = () => {
      if (!dados.tipoDocumento || !dados.nomeAssistido) {
        alert('Tipo do documento e nome do assistido são obrigatórios');
        return;
      }
      onSalvar(dados);
    };

    return (
      <Box p="md" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <Group mb="md">
          <IconFile size={20} />
          <Text fw={500}>Classificar: {documento.nome}</Text>
        </Group>
        
        <Stack gap="sm">
          <Group grow>
            <Select
              label="Tipo do Documento"
              placeholder="Selecione um tipo"
              value={dados.tipoDocumento}
              onChange={(value) => setDados(prev => ({ ...prev, tipoDocumento: value }))}
              data={[
                'Certidão de Nascimento',
                'Certidão de Casamento', 
                'RG',
                'CPF',
                'Comprovante de Renda',
                'Comprovante de Residência',
                'Petição',
                'Procuração',
                'Relatório',
                'Outros'
              ]}
            />
            <Select
              label="Nome do assistido"
              placeholder="Selecione o nome do assistido"
              value={dados.nomeAssistido}
              onChange={(value) => setDados(prev => ({ ...prev, nomeAssistido: value }))}
              data={[
                'HUMBERTO BORGES RIBEIRO',
                'LISA SIMPSON',
                'NED FLANDERS',
                'HOMER SIMPSON',
                'MARGE SIMPSON'
              ]}
              searchable
            />
          </Group>

          <Group grow>
            <TextInput
              label="Número do Documento"
              placeholder="Digite o número do documento"
              value={dados.numeroDocumento}
              onChange={(e) => setDados(prev => ({ ...prev, numeroDocumento: e.target.value }))}
            />
            <TextInput
              label="Descrição do Documento"
              placeholder="Descreva o documento"
              value={dados.descricaoDocumento}
              onChange={(e) => setDados(prev => ({ ...prev, descricaoDocumento: e.target.value }))}
            />
          </Group>

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onCancelar}>
              Cancelar
            </Button>
            <Button color="green" onClick={handleSubmit}>
              Salvar Classificação
            </Button>
          </Group>
        </Stack>
      </Box>
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Digitalizar e Classificar Documentos"
      size="90%"
      centered
      styles={modalStyles}
    >
      <Stack gap="lg">

        {/* Lista de Documentos Digitalizados */}
        {documentosDigitalizados.length > 0 && (
          <>
            <Divider label="Documentos Digitalizados" />
            <ScrollArea>
              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Arquivo</Table.Th>
                    <Table.Th>Tipo do Documento</Table.Th>
                    <Table.Th>Nome do assistido</Table.Th>
                    <Table.Th>Número do Documento</Table.Th>
                    <Table.Th>Descrição do Documento</Table.Th>
                    <Table.Th>Data</Table.Th>
                    <Table.Th>Ações</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {documentosDigitalizados.map((documento) => {
                    const progresso = progressoEnvio[documento.id];
                    const isEnviando = progresso?.status === 'enviando';
                    const isEnviado = progresso?.status === 'enviado';
                    
                    return (
                      <Table.Tr 
                        key={documento.id}
                        style={{
                          position: 'relative',
                          backgroundColor: isEnviando ? 'rgba(34, 139, 34, 0.05)' : 
                                          isEnviado ? 'rgba(34, 139, 34, 0.1)' : 'transparent',
                          backgroundImage: isEnviando 
                            ? `linear-gradient(to right, rgba(34, 139, 34, 0.15) ${progresso.progresso}%, transparent ${progresso.progresso}%)`
                            : 'none',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        
                        <Table.Td style={{ position: 'relative', zIndex: 1 }}>
                          <Group gap="xs">
                            {isEnviando ? (
                              <IconLoader2 size={16} style={{ color: '#228B22', animation: 'spin 1s linear infinite' }} />
                            ) : isEnviado ? (
                              <IconCircleCheck size={16} style={{ color: '#228B22' }} />
                            ) : (
                              <IconFile size={16} />
                            )}
                            <Text size="sm">{documento.nome}</Text>
                          </Group>
                        </Table.Td>
                      <Table.Td>
                        <Select
                          placeholder="Selecione um tipo"
                          size="xs"
                          value={documento.tipoDocumento}
                          onChange={(value) => {
                            setDocumentosDigitalizados(prev => 
                              prev.map(doc => 
                                doc.id === documento.id 
                                  ? { 
                                    ...doc, 
                                    tipoDocumento: value,
                                    // Atualiza automaticamente a descrição com o tipo selecionado
                                    descricaoDocumento: value ? `${value}` : doc.descricaoDocumento
                                  }
                                  : doc
                              )
                            );
                          }}
                          data={[
                            'Certidão de Nascimento',
                            'Certidão de Casamento', 
                            'RG',
                            'CPF',
                            'Comprovante de Renda',
                            'Comprovante de Residência',
                            'Petição',
                            'Procuração',
                            'Relatório',
                            'Outros'
                          ]}
                        />
                      </Table.Td>
                      <Table.Td>
                        <Select
                          placeholder="Selecione o nome do assistido"
                          size="xs"
                          value={documento.nomeAssistido}
                          onChange={(value) => {
                            setDocumentosDigitalizados(prev => 
                              prev.map(doc => 
                                doc.id === documento.id 
                                  ? { ...doc, nomeAssistido: value }
                                  : doc
                              )
                            );
                          }}
                          data={[
                            'HUMBERTO BORGES RIBEIRO',
                            'LISA SIMPSON',
                            'NED FLANDERS',
                            'HOMER SIMPSON',
                            'MARGE SIMPSON'
                          ]}
                          searchable
                        />
                      </Table.Td>
                      <Table.Td>
                        <TextInput
                          placeholder="Número do documento"
                          size="xs"
                          value={documento.numeroDocumento}
                          onChange={(e) => {
                            setDocumentosDigitalizados(prev => 
                              prev.map(doc => 
                                doc.id === documento.id 
                                  ? { ...doc, numeroDocumento: e.target.value }
                                  : doc
                              )
                            );
                          }}
                        />
                      </Table.Td>
                      <Table.Td>
                        <TextInput
                          placeholder={documento.tipoDocumento ? `${documento.tipoDocumento}` : "Descrição do documento"}
                          size="xs"
                          value={documento.descricaoDocumento}
                          onChange={(e) => {
                            setDocumentosDigitalizados(prev => 
                              prev.map(doc => 
                                doc.id === documento.id 
                                  ? { ...doc, descricaoDocumento: e.target.value }
                                  : doc
                              )
                            );
                          }}
                        />
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{documento.dataDigitalizacao}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs" wrap="nowrap">
                          <Tooltip label="Visualizar documento">
                            <ActionIcon variant="subtle" color="blue" size="sm">
                              <IconEye size={14} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Remover documento">
                            <ActionIcon 
                              variant="subtle" 
                              color="red" 
                              size="sm"
                              onClick={() => handleRemoverDocumento(documento.id)}
                            >
                              <IconX size={14} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </>
        )}

        {/* Botões de ação finais */}
        <Group justify="space-between" mt="xl">
          <Group>
            <Text size="sm" c="dimmed">
              {documentosDigitalizados.length > 0 ? (
                <>
                  {documentosDigitalizados.length} documento(s) digitalizado(s)
                  {documentosDigitalizados.length > 0 && (
                    <> • {documentosDigitalizados.filter(d => d.tipoDocumento && d.nomeAssistido).length} classificado(s)</>
                  )}
                  {todosDocumentosClassificados && (
                    <> ✓ Pronto para enviar</>
                  )}
                </>
              ) : (
                "Nenhum documento digitalizado ainda"
              )}
            </Text>
          </Group>
          
          <Group>
            <Button
              color="blue"
              leftSection={<IconScan size={16} />}
              onClick={handleDigitalizar}
              loading={digitalizando}
              disabled={digitalizando}
            >
              {digitalizando ? "Digitalizando..." : "Digitalizar documento"}
            </Button>
            <Button color="gray" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              color="teal"
              onClick={handleEnviarTodos}
              disabled={!todosDocumentosClassificados || enviandoArquivos}
              loading={enviandoArquivos}
              leftSection={enviandoArquivos ? <IconLoader2 size={16} /> : <IconCheck size={16} />}
            >
              {enviandoArquivos ? "Enviando arquivos..." : "Enviar arquivos"}
            </Button>
          </Group>
        </Group>
      </Stack>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Modal>
  );
};

export default ClassificarDocumentoDigitalizadoModal; 