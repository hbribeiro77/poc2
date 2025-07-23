import React, { useState, Fragment } from 'react';
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
  const [visualizandoDocumento, setVisualizandoDocumento] = useState(null);

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
        // Campos de classificação vazios - usuário classifica DEPOIS de visualizar
        tipoDocumento: '',
        nomeAssistido: '',
        numeroDocumento: '',
        descricaoDocumento: '',
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
    setVisualizandoDocumento(null);
    onClose();
  };

  const handleVisualizarDocumento = (documento) => {
    const posicao = documentosDigitalizados.indexOf(documento);
    // Permite visualizar primeiro documento (contrato), segundo documento (laudo) e terceiro documento (orçamento)
    const podeVisualizar = documento.tipoDocumento === 'Contrato' || documento.tipoDocumento === 'Laudo' || documento.tipoDocumento === 'Orçamento' || posicao === 0 || posicao === 1 || posicao === 2;
    
    if (podeVisualizar) {
      setVisualizandoDocumento(documento);
      
      // Scroll suave para a linha do documento após um pequeno delay
      setTimeout(() => {
        const documentoRow = document.querySelector(`[data-documento-id="${documento.id}"]`);
        if (documentoRow) {
          documentoRow.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100); // Pequeno delay para garantir que o DOM foi atualizado
    } else {
      alert('Visualização disponível apenas para documentos dos tipos "Contrato", "Laudo" e "Orçamento"');
    }
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
                'Laudo',
                'Orçamento',
                'Contrato',
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
      styles={{
        ...modalStyles,
        body: {
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
          height: '80vh',
        }
      }}
    >
      {/* ÁREA DE CONTEÚDO COM ROLAGEM */}
      <ScrollArea style={{ flex: 1 }}>
        <Stack gap="lg" p="md">

        {/* Lista de Documentos Digitalizados */}
        {documentosDigitalizados.length > 0 && (
          <>
            <Divider label="Documentos Digitalizados" />
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
                    const isVisualizando = visualizandoDocumento?.id === documento.id;
                    
                    return (
                      <Fragment key={documento.id}>
                        <Table.Tr 
                          data-documento-id={documento.id}
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
                              <Text 
                                size="sm"
                                                              style={{
                                textDecoration: (() => {
                                  const posicao = documentosDigitalizados.indexOf(documento);
                                  return (documento.tipoDocumento === 'Contrato' || documento.tipoDocumento === 'Laudo' || documento.tipoDocumento === 'Orçamento' || posicao === 0 || posicao === 1 || posicao === 2) ? 'underline' : 'none';
                                })(),
                                cursor: (() => {
                                  const posicao = documentosDigitalizados.indexOf(documento);
                                  return (documento.tipoDocumento === 'Contrato' || documento.tipoDocumento === 'Laudo' || documento.tipoDocumento === 'Orçamento' || posicao === 0 || posicao === 1 || posicao === 2) ? 'pointer' : 'default';
                                })(),
                                color: (() => {
                                  const posicao = documentosDigitalizados.indexOf(documento);
                                  return (documento.tipoDocumento === 'Contrato' || documento.tipoDocumento === 'Laudo' || documento.tipoDocumento === 'Orçamento' || posicao === 0 || posicao === 1 || posicao === 2) ? '#228be6' : 'inherit';
                                })(),
                                transition: 'color 0.15s ease'
                              }}
                                                              onClick={() => {
                                const posicao = documentosDigitalizados.indexOf(documento);
                                const podeVisualizar = documento.tipoDocumento === 'Contrato' || documento.tipoDocumento === 'Laudo' || documento.tipoDocumento === 'Orçamento' || posicao === 0 || posicao === 1 || posicao === 2;
                                if (podeVisualizar) {
                                  handleVisualizarDocumento(documento);
                                }
                              }}
                              onMouseEnter={(e) => {
                                const posicao = documentosDigitalizados.indexOf(documento);
                                const podeVisualizar = documento.tipoDocumento === 'Contrato' || documento.tipoDocumento === 'Laudo' || documento.tipoDocumento === 'Orçamento' || posicao === 0 || posicao === 1 || posicao === 2;
                                if (podeVisualizar) {
                                  e.target.style.color = '#1864ab';
                                }
                              }}
                              onMouseLeave={(e) => {
                                const posicao = documentosDigitalizados.indexOf(documento);
                                const podeVisualizar = documento.tipoDocumento === 'Contrato' || documento.tipoDocumento === 'Laudo' || documento.tipoDocumento === 'Orçamento' || posicao === 0 || posicao === 1 || posicao === 2;
                                if (podeVisualizar) {
                                  e.target.style.color = '#228be6';
                                }
                              }}
                              >
                                {documento.nome}
                              </Text>
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
                                'Laudo',
                                'Orçamento',
                                'Contrato',
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
                                                        <Tooltip label={(() => {
                            const posicao = documentosDigitalizados.indexOf(documento);
                            const podeVisualizar = documento.tipoDocumento === 'Contrato' || documento.tipoDocumento === 'Laudo' || documento.tipoDocumento === 'Orçamento' || posicao === 0 || posicao === 1 || posicao === 2;
                            if (podeVisualizar) {
                              if (documento.tipoDocumento === 'Laudo' || posicao === 1) {
                                return "Visualizar PDF do laudo";
                              } else if (documento.tipoDocumento === 'Orçamento' || posicao === 2) {
                                return "Visualizar PDF do orçamento";
                              } else {
                                return "Visualizar PDF do contrato";
                              }
                            } else {
                              return "Visualizar documento (apenas para Contratos, Laudos e Orçamentos)";
                            }
                          })()}>
                                                            <ActionIcon 
                              variant="subtle" 
                              color={(() => {
                                const posicao = documentosDigitalizados.indexOf(documento);
                                return (documento.tipoDocumento === 'Contrato' || documento.tipoDocumento === 'Laudo' || documento.tipoDocumento === 'Orçamento' || posicao === 0 || posicao === 1 || posicao === 2) ? "blue" : "gray";
                              })()} 
                              size="sm"
                              onClick={() => handleVisualizarDocumento(documento)}
                              style={{
                                opacity: (() => {
                                  const posicao = documentosDigitalizados.indexOf(documento);
                                  return (documento.tipoDocumento === 'Contrato' || documento.tipoDocumento === 'Laudo' || documento.tipoDocumento === 'Orçamento' || posicao === 0 || posicao === 1 || posicao === 2) ? 1 : 0.5;
                                })(),
                                cursor: (() => {
                                  const posicao = documentosDigitalizados.indexOf(documento);
                                  return (documento.tipoDocumento === 'Contrato' || documento.tipoDocumento === 'Laudo' || documento.tipoDocumento === 'Orçamento' || posicao === 0 || posicao === 1 || posicao === 2) ? 'pointer' : 'not-allowed';
                                })()
                              }}
                                >
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
                        
                        {/* Linha do visualizador inline - aparece logo abaixo do documento clicado */}
                        {isVisualizando && (
                          <Table.Tr>
                            <Table.Td colSpan={7} style={{ padding: 0, backgroundColor: '#f8f9fa' }}>
                              <Box p="md">
                                <Group justify="space-between" mb="sm">
                                  <Text fw={500} size="sm" c="blue">
                                    {documento.nome}
                                  </Text>
                                  <ActionIcon 
                                    variant="subtle" 
                                    color="gray" 
                                    size="sm"
                                    onClick={() => {
                                      setVisualizandoDocumento(null);
                                      
                                      // Scroll suave para o topo da lista após fechar o PDF
                                      setTimeout(() => {
                                        const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
                                        if (scrollArea) {
                                          scrollArea.scrollTo({ 
                                            top: 0, 
                                            behavior: 'smooth' 
                                          });
                                        }
                                      }, 100);
                                    }}
                                  >
                                    <IconX size={14} />
                                  </ActionIcon>
                                </Group>
                                
                                <Box
                                  style={{
                                    border: '1px solid #ced4da',
                                    borderRadius: '8px',
                                    backgroundColor: '#fff',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <iframe
                                    src={(() => {
                                      const posicao = documentosDigitalizados.indexOf(documento);
                                      // Determina qual PDF carregar baseado na posição ou tipo
                                      if (documento.tipoDocumento === 'Laudo' || posicao === 1) {
                                        return '/laudo.pdf#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH';
                                      } else if (documento.tipoDocumento === 'Orçamento' || posicao === 2) {
                                        return '/orcamento.pdf#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH';
                                      } else {
                                        return '/contrato.pdf#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH';
                                      }
                                    })()}
                                    style={{
                                      width: '100%',
                                      height: '400px',
                                      border: 'none',
                                    }}
                                    title="Visualizador de PDF"
                                    loading="lazy"
                                  />
                                </Box>
                              </Box>
                            </Table.Td>
                          </Table.Tr>
                        )}
                      </Fragment>
                    );
                  })}
                                </Table.Tbody>
              </Table>
                      </>
        )}
        </Stack>
      </ScrollArea>

      {/* BOTÕES FIXOS NO RODAPÉ */}
      <Box p="md" style={{ borderTop: '1px solid #dee2e6' }}>
        <Group justify="space-between">
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
      </Box>

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