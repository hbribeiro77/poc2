import React, { useState } from 'react';
import {
  Paper,
  Group,
  Title,
  ScrollArea,
  Table,
  Text,
  ActionIcon,
  Tooltip,
  Button,
  Pagination,
  Select,
  ThemeIcon,
  Box,
  Stack,
  Grid,
} from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import {
  IconEye,
  IconDownload,
  IconPencil,
  IconTrash,
  IconFile,
  IconUpload,
  IconX,
  IconPlus,
  IconScan,
} from '@tabler/icons-react';
import ClassificarDocumentoDigitalizadoModal from '../ClassificarDocumentoDigitalizadoModal/ClassificarDocumentoDigitalizadoModal';

const DocumentosTable = ({
  documentos = [],
  currentPage = 1,
  onPageChange,
  itemsPerPage = '10',
  onItemsPerPageChange,
  onView,
  onDownload,
  onEdit,
  onDelete,
  onUpload,
  onScan,
  showUploadArea = true,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadHover, setUploadHover] = useState(false);
  const [scannerHover, setScannerHover] = useState(false);
  const [classificarModalOpened, setClassificarModalOpened] = useState(false);

  const totalPages = Math.ceil(documentos.length / parseInt(itemsPerPage, 10));

  const paginatedDocumentos = documentos.slice(
    (currentPage - 1) * parseInt(itemsPerPage, 10),
    currentPage * parseInt(itemsPerPage, 10)
  );

  const handleFileDrop = (files) => {
    setUploadedFiles(prev => [...prev, ...files]);
    onUpload && onUpload(files);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleScan = () => {
    setClassificarModalOpened(true);
  };

  const handleClassificarSave = (documentoClassificado) => {
    // Chama o callback onScan do componente pai com o documento classificado
    if (onScan) {
      onScan(documentoClassificado);
    }
  };

  return (
    <Paper p="md" mt="lg" shadow="sm" withBorder>
      {/* Cabeçalho */}
      <Group mb="md" gap="xs">
        <ThemeIcon variant="light" size="xl" color="blue">
          <IconFile style={{ width: '70%', height: '70%' }} />
        </ThemeIcon>
        <Title order={3} c="blue.7">Documentos</Title>
      </Group>

      <ScrollArea>
        <Table striped highlightOnHover withColumnBorders verticalSpacing="xs" miw={800}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Data</Table.Th>
              <Table.Th>Descrição</Table.Th>
              <Table.Th>Usuário</Table.Th>
              <Table.Th style={{ textAlign: 'center', width: 150 }}>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedDocumentos.map((documento) => (
              <Table.Tr key={documento.id}>
                <Table.Td>
                  <Text size="sm">{documento.data}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{documento.descricao}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{documento.usuario}</Text>
                </Table.Td>
                                 <Table.Td>
                   <Group gap={4} justify="center" wrap="nowrap">
                     <Tooltip label="Visualizar" withArrow>
                       <ActionIcon 
                         variant="subtle" 
                         color="gray" 
                         size="sm"
                         onClick={() => onView && onView(documento)}
                       >
                         <IconEye size={14} />
                       </ActionIcon>
                     </Tooltip>
                     
                     <Tooltip label="Download" withArrow>
                       <ActionIcon 
                         variant="subtle" 
                         color="gray" 
                         size="sm"
                         onClick={() => onDownload && onDownload(documento)}
                       >
                         <IconDownload size={14} />
                       </ActionIcon>
                     </Tooltip>
                     
                     <Tooltip label="Editar" withArrow>
                       <ActionIcon 
                         variant="subtle" 
                         color="gray" 
                         size="sm"
                         onClick={() => onEdit && onEdit(documento)}
                       >
                         <IconPencil size={14} />
                       </ActionIcon>
                     </Tooltip>
                     
                     <Tooltip label="Excluir" withArrow>
                       <ActionIcon 
                         variant="subtle" 
                         color="gray" 
                         size="sm"
                         onClick={() => onDelete && onDelete(documento)}
                       >
                         <IconTrash size={14} />
                       </ActionIcon>
                     </Tooltip>
                   </Group>
                 </Table.Td>
              </Table.Tr>
            ))}
            {paginatedDocumentos.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={4} style={{ textAlign: 'center' }}>
                  <Text c="dimmed" size="sm">Nenhum documento encontrado.</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {/* Paginação */}
      {totalPages > 0 && (
        <Group justify="space-between" mt="md">
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={onPageChange}
          />
          <Select
            style={{ width: '120px' }}
            value={itemsPerPage}
            onChange={(value) => {
              onItemsPerPageChange && onItemsPerPageChange(value || '10');
            }}
            data={['5', '10', '20', '50']}
          />
        </Group>
      )}

      {/* Área de Upload */}
      {showUploadArea && (
        <Box 
          mt="xl"
          style={{
            border: '2px dashed #ced4da',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa',
            overflow: 'hidden',
          }}
        >
          <Grid gutter={0} style={{ minHeight: 140 }}>
            {/* Área de Upload */}
            <Grid.Col span={6}>
              <Box
                p="md"
                style={{
                  height: '100%',
                  borderRight: '1px solid #ced4da',
                  cursor: 'pointer',
                  backgroundColor: uploadHover ? '#e9ecef' : 'transparent',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={() => setUploadHover(true)}
                onMouseLeave={() => setUploadHover(false)}
              >
                <Dropzone
                  onDrop={handleFileDrop}
                  onReject={(files) => console.log('Arquivos rejeitados:', files)}
                  accept={[MIME_TYPES.pdf, MIME_TYPES.doc, MIME_TYPES.docx, 'image/*']}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    padding: 0,
                    minHeight: 'auto',
                  }}
                >
                  <Stack align="center" gap="xs" justify="center" style={{ pointerEvents: 'none', textAlign: 'center', height: '100%' }}>
                    <Dropzone.Accept>
                      <IconUpload
                        style={{ width: 40, height: 40, color: 'var(--mantine-color-blue-6)' }}
                        stroke={1.5}
                      />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX
                        style={{ width: 40, height: 40, color: 'var(--mantine-color-red-6)' }}
                        stroke={1.5}
                      />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <IconUpload
                        style={{ width: 40, height: 40, color: 'var(--mantine-color-gray-6)' }}
                        stroke={1.5}
                      />
                    </Dropzone.Idle>

                    <div>
                      <Text size="sm" fw={500} ta="center">
                        Arrastar arquivos
                      </Text>
                      <Text size="xs" c="dimmed" ta="center" mt={4}>
                        ou clique para selecionar
                      </Text>
                    </div>
                  </Stack>
                </Dropzone>
              </Box>
            </Grid.Col>

            {/* Área de Scanner */}
            <Grid.Col span={6}>
              <Box
                p="md"
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '8px',
                  cursor: onScan ? 'pointer' : 'not-allowed',
                  opacity: onScan ? 1 : 0.5,
                  backgroundColor: (onScan && scannerHover) ? '#e9ecef' : 'transparent',
                  transition: 'background-color 0.15s ease',
                }}
                onClick={handleScan}
                onMouseEnter={() => onScan && setScannerHover(true)}
                onMouseLeave={() => setScannerHover(false)}
              >
                <IconScan
                  style={{ 
                    width: 40, 
                    height: 40, 
                    color: onScan ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-gray-5)'
                  }}
                  stroke={1.5}
                />
                <div style={{ textAlign: 'center' }}>
                  <Text size="sm" fw={500} ta="center" c={onScan ? 'dark' : 'dimmed'}>
                    Digitalizar documento
                  </Text>
                  <Text size="xs" c="dimmed" ta="center" mt={4}>
                    usar scanner/câmera
                  </Text>
                </div>
              </Box>
            </Grid.Col>
          </Grid>

          {/* Lista de arquivos recém-adicionados */}
          {uploadedFiles.length > 0 && (
            <Box mt="md">
              <Text fw={500} size="sm" mb="xs">Arquivos adicionados:</Text>
              <Stack gap="xs">
                {uploadedFiles.map((file, index) => (
                  <Group key={index} justify="space-between">
                    <Group gap="xs">
                      <IconFile size={16} />
                      <Text size="sm">{file.name}</Text>
                      <Text size="xs" c="dimmed">({Math.round(file.size / 1024)} KB)</Text>
                    </Group>
                    <Button
                      variant="subtle"
                      size="xs"
                      color="red"
                      onClick={() => handleRemoveFile(index)}
                    >
                      Remover
                    </Button>
                  </Group>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      )}

      {/* Modal de Classificação de Documento Digitalizado */}
      <ClassificarDocumentoDigitalizadoModal
        opened={classificarModalOpened}
        onClose={() => setClassificarModalOpened(false)}
        onSave={handleClassificarSave}
      />
    </Paper>
  );
};

export default DocumentosTable; 