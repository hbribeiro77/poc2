'use client';

import React, { useState } from 'react';
import {
  Modal,
  Box,
  Group,
  Text,
  Title,
  ActionIcon,
  Stack,
  Paper,
  ThemeIcon,
  Button,
  Accordion,
  Alert,
  useMantineTheme,
  Table,
  Checkbox,
  ScrollArea,
  Badge,
} from '@mantine/core';
import {
  IconX,
  IconSparkles,
  IconFileText,
  IconUser,
  IconMessageCircle,
  IconFiles,
  IconInfoCircle,
  IconEye,
} from '@tabler/icons-react';
import SimpleConfirmModal from './SimpleConfirmModal';

const PortalIaModal = ({ opened, onClose }) => {
  const theme = useMantineTheme();
  const [accordionValue, setAccordionValue] = useState(['documentos-pasta', 'documentos-cadastro', 'atendimentos', 'pecas']);
  const [confirmModalOpened, setConfirmModalOpened] = useState(false);
  
  // Estados para controlar os checkboxes selecionados
  const [selectedDocumentosPasta, setSelectedDocumentosPasta] = useState(new Set());
  const [selectedDocumentosCadastro, setSelectedDocumentosCadastro] = useState(new Set());
  const [selectedAtendimentos, setSelectedAtendimentos] = useState(new Set());
  const [selectedPecas, setSelectedPecas] = useState(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Função para alternar seleção de item
  const toggleSelection = (setSelected, itemId) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };
  
  // Função para contar total de itens selecionados
  const getTotalSelected = () => {
    return selectedDocumentosPasta.size + selectedDocumentosCadastro.size + selectedAtendimentos.size + selectedPecas.size;
  };
  
  // Função para obter detalhes dos itens selecionados
  const getSelectedDetails = () => {
    const details = [];
    if (selectedDocumentosPasta.size > 0) details.push(`${selectedDocumentosPasta.size} documento(s) da pasta`);
    if (selectedDocumentosCadastro.size > 0) details.push(`${selectedDocumentosCadastro.size} documento(s) do cadastro`);
    if (selectedAtendimentos.size > 0) details.push(`${selectedAtendimentos.size} atendimento(s)`);
    if (selectedPecas.size > 0) details.push(`${selectedPecas.size} peça(s)`);
    return details;
  };
  
  // Função para confirmar envio
  const handleConfirmSend = () => {
    console.log('Enviando para o Portal-IA:', {
      documentosPasta: Array.from(selectedDocumentosPasta),
      documentosCadastro: Array.from(selectedDocumentosCadastro),
      atendimentos: Array.from(selectedAtendimentos),
      pecas: Array.from(selectedPecas)
    });
    setConfirmModalOpened(false);
    onClose();
  };

  const modalStyles = {
    header: { backgroundColor: theme.colors.dark[6] },
    title: { color: theme.white, fontWeight: 700 },
    close: {
      color: theme.white,
      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
    },
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Portal-IA - Geração de Minutas"
      size="95%"
      centered
      styles={{
          ...modalStyles,
          content: {
            height: '95vh',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '1400px'
          },
          body: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            position: 'relative'
          }
        }}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box style={{ flex: 1, overflow: 'hidden' }}>
          <ScrollArea style={{ height: '100%' }} offsetScrollbars>
            <Stack gap="md" px="sm" pb="80px" pt="md" align="center">
              <Paper p="lg" bg="blue.0" radius="md" withBorder style={{ width: '100%', maxWidth: '1200px' }}>
                <Group gap="sm" align="center">
                  <ThemeIcon variant="light" size="md" color="blue">
                    <IconSparkles style={{ width: '70%', height: '70%' }} />
                  </ThemeIcon>
                  <Box>
                    <Text size="sm" c="blue.7">
                       Selecione os itens que deseja incluir como contexto na geração da minuta com inteligência artificial.
                     </Text>
                  </Box>
                </Group>
              </Paper>

        <Accordion
          value={accordionValue}
          onChange={setAccordionValue}
          variant="separated"
          radius="md"
          multiple
          style={{ width: '100%', maxWidth: '1200px' }}
        >
          <Accordion.Item value="documentos-pasta">
            <Accordion.Control
              icon={
                <ThemeIcon variant="light" size="sm" color="blue">
                  <IconFileText style={{ width: '70%', height: '70%' }} />
                </ThemeIcon>
              }
            >
              <Text fw={500}>Documentos da Pasta</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Paper p="md" bg="gray.0" radius="sm">
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th width={50}></Table.Th>
                      <Table.Th>Data</Table.Th>
                      <Table.Th>Descrição</Table.Th>
                      <Table.Th width={100}>Ações</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox 
                          size="sm" 
                          checked={selectedDocumentosPasta.has('certidao-negativa')}
                          onChange={() => toggleSelection(setSelectedDocumentosPasta, 'certidao-negativa')}
                        />
                      </Table.Td>
                      <Table.Td>17/06/2022</Table.Td>
                      <Table.Td>Certidão negativa</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="subtle" size="sm" color="blue">
                            <IconEye size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox 
                          size="sm" 
                          checked={selectedDocumentosPasta.has('laudo')}
                          onChange={() => toggleSelection(setSelectedDocumentosPasta, 'laudo')}
                        />
                      </Table.Td>
                      <Table.Td>17/06/2022</Table.Td>
                      <Table.Td>laudo</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="subtle" size="sm" color="blue">
                            <IconEye size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox 
                          size="sm" 
                          checked={selectedDocumentosPasta.has('orcamento')}
                          onChange={() => toggleSelection(setSelectedDocumentosPasta, 'orcamento')}
                        />
                      </Table.Td>
                      <Table.Td>17/06/2022</Table.Td>
                      <Table.Td>orçamento</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="subtle" size="sm" color="blue">
                            <IconEye size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox 
                          size="sm" 
                          checked={selectedDocumentosPasta.has('contrato')}
                          onChange={() => toggleSelection(setSelectedDocumentosPasta, 'contrato')}
                        />
                      </Table.Td>
                      <Table.Td>17/06/2022</Table.Td>
                      <Table.Td>contrato de compra e venda</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="subtle" size="sm" color="blue">
                            <IconEye size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox 
                          size="sm" 
                          checked={selectedDocumentosPasta.has('matricula')}
                          onChange={() => toggleSelection(setSelectedDocumentosPasta, 'matricula')}
                        />
                      </Table.Td>
                      <Table.Td>20/06/2022</Table.Td>
                      <Table.Td>matrícula do imóvel</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="subtle" size="sm" color="blue">
                            <IconEye size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Paper>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="documentos-cadastro">
            <Accordion.Control
              icon={
                <ThemeIcon variant="light" size="sm" color="green">
                  <IconUser style={{ width: '70%', height: '70%' }} />
                </ThemeIcon>
              }
            >
              <Text fw={500}>Documentos do Cadastro</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Paper p="md" bg="gray.0" radius="sm">
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th width={50}></Table.Th>
                      <Table.Th>Data</Table.Th>
                      <Table.Th>Descrição</Table.Th>
                      <Table.Th width={100}>Ações</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox 
                          size="sm" 
                          checked={selectedDocumentosCadastro.has('cpf-homer')}
                          onChange={() => toggleSelection(setSelectedDocumentosCadastro, 'cpf-homer')}
                        />
                      </Table.Td>
                      <Table.Td>Não informada.</Table.Td>
                      <Table.Td>CPF - Homer Simpson</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="subtle" size="sm" color="blue">
                            <IconEye size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox 
                          size="sm" 
                          checked={selectedDocumentosCadastro.has('rg-homer')}
                          onChange={() => toggleSelection(setSelectedDocumentosCadastro, 'rg-homer')}
                        />
                      </Table.Td>
                      <Table.Td>Não informada.</Table.Td>
                      <Table.Td>RG - Homer Simpson</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="subtle" size="sm" color="blue">
                            <IconEye size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox 
                          size="sm" 
                          checked={selectedDocumentosCadastro.has('cnh-bart')}
                          onChange={() => toggleSelection(setSelectedDocumentosCadastro, 'cnh-bart')}
                        />
                      </Table.Td>
                      <Table.Td>Não informada.</Table.Td>
                      <Table.Td>CNH - Bart Simpson</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="subtle" size="sm" color="blue">
                            <IconEye size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox 
                          size="sm" 
                          checked={selectedDocumentosCadastro.has('comprovante-marge')}
                          onChange={() => toggleSelection(setSelectedDocumentosCadastro, 'comprovante-marge')}
                        />
                      </Table.Td>
                      <Table.Td>Não informada.</Table.Td>
                      <Table.Td>Comprovante de Residência - Marge Simpson</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="subtle" size="sm" color="blue">
                            <IconEye size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox 
                          size="sm" 
                          checked={selectedDocumentosCadastro.has('contracheque-homer')}
                          onChange={() => toggleSelection(setSelectedDocumentosCadastro, 'contracheque-homer')}
                        />
                      </Table.Td>
                      <Table.Td>Não informada.</Table.Td>
                      <Table.Td>Contracheque - Homer Simpson</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="subtle" size="sm" color="blue">
                            <IconEye size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Paper>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="atendimentos">
            <Accordion.Control
              icon={
                <ThemeIcon variant="light" size="sm" color="orange">
                  <IconMessageCircle style={{ width: '70%', height: '70%' }} />
                </ThemeIcon>
              }
            >
              <Text fw={500}>Atendimentos</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Paper p="md" bg="gray.0" radius="sm">
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th width={50}></Table.Th>
                      <Table.Th>Data</Table.Th>
                      <Table.Th>Situação</Table.Th>
                      <Table.Th>Relato do assistido</Table.Th>
                      <Table.Th>Providência</Table.Th>
                      <Table.Th>Assistido</Table.Th>
                      <Table.Th>Defensoria</Table.Th>
                      <Table.Th width={100}>Ações</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox 
                          size="sm" 
                          checked={selectedAtendimentos.has('atendimento-1')}
                          onChange={() => toggleSelection(setSelectedAtendimentos, 'atendimento-1')}
                        />
                      </Table.Td>
                      <Table.Td>18/07/2025</Table.Td>
                      <Table.Td>
                        <Badge color="green" size="sm">Aprovado</Badge>
                      </Table.Td>
                      <Table.Td>Orientado sobre andamento do p...</Table.Td>
                      <Table.Td>Orientação jurídica</Table.Td>
                      <Table.Td>Homer Simpson</Table.Td>
                      <Table.Td>3ª DEFENSORIA PÚBLICA DE PELOTAS</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="subtle" size="sm" color="blue">
                            <IconEye size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox 
                          size="sm" 
                          checked={selectedAtendimentos.has('atendimento-2')}
                          onChange={() => toggleSelection(setSelectedAtendimentos, 'atendimento-2')}
                        />
                      </Table.Td>
                      <Table.Td>16/07/2025</Table.Td>
                      <Table.Td>
                        <Badge color="green" size="sm">Aprovado</Badge>
                      </Table.Td>
                      <Table.Td>Assistido compareceu à sede da...</Table.Td>
                      <Table.Td>Orientação jurídica</Table.Td>
                      <Table.Td>Bart Simpson</Table.Td>
                      <Table.Td>3ª DEFENSORIA PÚBLICA DE PELOTAS</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="subtle" size="sm" color="blue">
                            <IconEye size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox 
                          size="sm" 
                          checked={selectedAtendimentos.has('atendimento-3')}
                          onChange={() => toggleSelection(setSelectedAtendimentos, 'atendimento-3')}
                        />
                      </Table.Td>
                      <Table.Td>10/06/2025</Table.Td>
                      <Table.Td>
                        <Badge color="green" size="sm">Aprovado</Badge>
                      </Table.Td>
                      <Table.Td>Assistido compareceu à Defenso...</Table.Td>
                      <Table.Td>Petição</Table.Td>
                      <Table.Td>Marge Simpson</Table.Td>
                      <Table.Td>3ª DEFENSORIA PÚBLICA DE PELOTAS</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="subtle" size="sm" color="blue">
                            <IconEye size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox 
                          size="sm" 
                          checked={selectedAtendimentos.has('atendimento-4')}
                          onChange={() => toggleSelection(setSelectedAtendimentos, 'atendimento-4')}
                        />
                      </Table.Td>
                      <Table.Td>22/04/2025</Table.Td>
                      <Table.Td>
                        <Badge color="green" size="sm">Aprovado</Badge>
                      </Table.Td>
                      <Table.Td>Assistido compareceu à sede da...</Table.Td>
                      <Table.Td>Petição</Table.Td>
                      <Table.Td>Homer Simpson</Table.Td>
                      <Table.Td>3ª DEFENSORIA PÚBLICA DE PELOTAS</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="subtle" size="sm" color="blue">
                            <IconEye size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox 
                          size="sm" 
                          checked={selectedAtendimentos.has('atendimento-5')}
                          onChange={() => toggleSelection(setSelectedAtendimentos, 'atendimento-5')}
                        />
                      </Table.Td>
                      <Table.Td>14/04/2025</Table.Td>
                      <Table.Td>
                        <Badge color="green" size="sm">Aprovado</Badge>
                      </Table.Td>
                      <Table.Td>O assistido compareceu na DPE,...</Table.Td>
                      <Table.Td>Mera informação</Table.Td>
                      <Table.Td>Bart Simpson</Table.Td>
                      <Table.Td>3ª DEFENSORIA PÚBLICA DE PELOTAS</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon variant="subtle" size="sm" color="blue">
                            <IconEye size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Paper>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="pecas">
            <Accordion.Control
              icon={
                <ThemeIcon variant="light" size="sm" color="teal">
                  <IconFiles style={{ width: '70%', height: '70%' }} />
                </ThemeIcon>
              }
            >
              <Text fw={500}>Peças</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Paper p="md" bg="gray.0" radius="sm">
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th width={40}>
                        <Checkbox size="sm" />
                      </Table.Th>
                      <Table.Th width={100}>Data</Table.Th>
                      <Table.Th width={100}>Situação</Table.Th>
                      <Table.Th width={150}>Tipo</Table.Th>
                      <Table.Th>Processo</Table.Th>
                      <Table.Th>Observação</Table.Th>
                      <Table.Th width={200}>Defensoria</Table.Th>
                      <Table.Th width={80}>Ações</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                     <Table.Tr>
                       <Table.Td>
                         <Checkbox 
                           size="sm" 
                           checked={selectedPecas.has('peca-1')}
                           onChange={() => toggleSelection(setSelectedPecas, 'peca-1')}
                         />
                       </Table.Td>
                       <Table.Td>22/04/2025</Table.Td>
                       <Table.Td>
                         <Badge color="orange" size="sm">Rascunho</Badge>
                       </Table.Td>
                       <Table.Td>Petição diversa</Table.Td>
                       <Table.Td>5000036-49.2012.8.21.0139</Table.Td>
                       <Table.Td>Petição automatizada</Table.Td>
                       <Table.Td>3ª DEFENSORIA PÚBLICA DE PELOTAS</Table.Td>
                       <Table.Td>
                         <Group gap="xs">
                           <ActionIcon variant="subtle" size="sm" color="blue">
                             <IconEye size={14} />
                           </ActionIcon>
                         </Group>
                       </Table.Td>
                     </Table.Tr>
                     <Table.Tr>
                       <Table.Td>
                         <Checkbox 
                           size="sm" 
                           checked={selectedPecas.has('peca-2')}
                           onChange={() => toggleSelection(setSelectedPecas, 'peca-2')}
                         />
                       </Table.Td>
                       <Table.Td>18/05/2025</Table.Td>
                       <Table.Td>
                         <Badge color="green" size="sm">Aprovada</Badge>
                         <Badge color="blue" size="sm" ml="xs">Protocolada</Badge>
                       </Table.Td>
                       <Table.Td>Petição de alteração de medicamento/dosagem</Table.Td>
                       <Table.Td>5000036-49.2012.8.21.0139</Table.Td>
                       <Table.Td>Cota</Table.Td>
                       <Table.Td>DEFENSORIA PÚBLICA DE SOBRADINHO</Table.Td>
                       <Table.Td>
                         <Group gap="xs">
                           <ActionIcon variant="subtle" size="sm" color="blue">
                             <IconEye size={14} />
                           </ActionIcon>
                         </Group>
                       </Table.Td>
                     </Table.Tr>
                     <Table.Tr>
                       <Table.Td>
                         <Checkbox 
                           size="sm" 
                           checked={selectedPecas.has('peca-3')}
                           onChange={() => toggleSelection(setSelectedPecas, 'peca-3')}
                         />
                       </Table.Td>
                       <Table.Td>10/06/2025</Table.Td>
                       <Table.Td>
                         <Badge color="green" size="sm">Aprovada</Badge>
                         <Badge color="blue" size="sm" ml="xs">Protocolada</Badge>
                       </Table.Td>
                       <Table.Td>Pedido de Bloqueio</Table.Td>
                       <Table.Td>5000036-49.2012.8.21.0139</Table.Td>
                       <Table.Td></Table.Td>
                       <Table.Td>3ª DEFENSORIA PÚBLICA DE PELOTAS</Table.Td>
                       <Table.Td>
                         <Group gap="xs">
                           <ActionIcon variant="subtle" size="sm" color="blue">
                             <IconEye size={14} />
                           </ActionIcon>
                         </Group>
                       </Table.Td>
                     </Table.Tr>
                     <Table.Tr>
                       <Table.Td>
                         <Checkbox 
                           size="sm" 
                           checked={selectedPecas.has('peca-4')}
                           onChange={() => toggleSelection(setSelectedPecas, 'peca-4')}
                         />
                       </Table.Td>
                       <Table.Td>19/08/2025</Table.Td>
                       <Table.Td>
                         <Badge color="green" size="sm">Aprovada</Badge>
                         <Badge color="blue" size="sm" ml="xs">Protocolada</Badge>
                       </Table.Td>
                       <Table.Td>Inicial - Processo de conhecimento</Table.Td>
                       <Table.Td>5000036-49.2012.8.21.0139</Table.Td>
                       <Table.Td></Table.Td>
                       <Table.Td>DEFENSORIA PÚBLICA DE TRIUNFO (DESLOCAMENTO)</Table.Td>
                       <Table.Td>
                         <Group gap="xs">
                           <ActionIcon variant="subtle" size="sm" color="blue">
                             <IconEye size={14} />
                           </ActionIcon>
                         </Group>
                       </Table.Td>
                     </Table.Tr>
                   </Table.Tbody>
                </Table>
              </Paper>
            </Accordion.Panel>
          </Accordion.Item>
            </Accordion>
            </Stack>
          </ScrollArea>
        </Box>
      </Box>
      
      <Box 
        style={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          borderTop: '1px solid #e9ecef', 
          padding: '12px 24px', 
          backgroundColor: 'white',
          zIndex: 1000,
          margin: 0
        }}
      >
        <Group justify="flex-end">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            leftSection={<IconSparkles size={16} />}
            onClick={() => setShowConfirmModal(true)}
          >
            Enviar para o Portal-IA
          </Button>
        </Group>
      </Box>
      
      <SimpleConfirmModal
        opened={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSend}
        selectedCounts={{
          documentosPasta: selectedDocumentosPasta.size,
          documentosCadastro: selectedDocumentosCadastro.size,
          atendimentos: selectedAtendimentos.size,
          pecas: selectedPecas.size
        }}
      />
    </Modal>
  );
};

export default PortalIaModal;