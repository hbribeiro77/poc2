import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Grid,
  TextInput,
  Select,
  Textarea,
  Checkbox,
  Button,
  Group,
  Text,
  Divider,
  Box,
  Title,
  ThemeIcon,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import {
  IconCalendar,
  IconUpload,
  IconFile,
  IconX,
  IconMessageChatbot,
} from '@tabler/icons-react';

const NovoAtendimentoInline = ({ onSave, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    data: initialData.data || new Date(),
    defensoria: initialData.defensoria || '2ª DEFENSORIA PÚBLICA ESPECIALIZADA CÍVEL DO FORO CENTRAL',
    pessoa: initialData.pessoa || 'HUMBERTO BORGES RIBEIRO',
    processo: initialData.processo || '',
    relato: initialData.relato || 'não estou recebendo o medicamento na secretária de saúde. Me informaram que o remédio está em falta e sem previsão de chegar.',
    providencia: initialData.providencia || 'Retorno',
    detalhesProvidencia: initialData.detalhesProvidencia || 'deve retornar com lista padrão de documentos',
    formaAtendimento: initialData.formaAtendimento || 'Atendimento presencial na sede da Defensoria',
    isUrgente: initialData.isUrgente || false,
  });

  const [documentos, setDocumentos] = useState(initialData.documentos || []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileDrop = (files) => {
    setDocumentos(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setDocumentos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = (isDraft = false) => {
    const dadosAtendimento = {
      ...formData,
      documentos,
      rascunho: isDraft,
    };
    onSave && onSave(dadosAtendimento);
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      data: new Date(),
      defensoria: '2ª DEFENSORIA PÚBLICA ESPECIALIZADA CÍVEL DO FORO CENTRAL',
      pessoa: 'HUMBERTO BORGES RIBEIRO',
      processo: '',
      relato: '',
      providencia: '',
      detalhesProvidencia: '',
      formaAtendimento: '',
      isUrgente: false,
    });
    setDocumentos([]);
    onCancel && onCancel();
  };

  return (
    <Paper p="lg" shadow="sm" withBorder>
      {/* Cabeçalho */}
      <Group mb="lg" gap="xs">
        <ThemeIcon variant="light" size="xl" color="teal">
          <IconMessageChatbot style={{ width: '70%', height: '70%' }} />
        </ThemeIcon>
        <Title order={3} c="teal.7">Novo Atendimento</Title>
      </Group>

      <Stack gap="md">
        {/* Linha 1: Data, Defensoria, Pessoa */}
        <Grid>
          <Grid.Col span={4}>
            <DatePickerInput
              label="Data"
              placeholder="Selecione a data"
              value={formData.data}
              onChange={(value) => handleInputChange('data', value)}
              leftSection={<IconCalendar size={16} />}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              label="Defensoria"
              placeholder="Selecione a defensoria"
              value={formData.defensoria}
              onChange={(value) => handleInputChange('defensoria', value)}
              data={[
                '1ª DEFENSORIA PÚBLICA ESPECIALIZADA CÍVEL DO FORO CENTRAL',
                '2ª DEFENSORIA PÚBLICA ESPECIALIZADA CÍVEL DO FORO CENTRAL',
                '1ª DEFENSORIA PÚBLICA ESPECIALIZADA DO JÚRI DO FORO CENTRAL',
                '2ª DEFENSORIA PÚBLICA ESPECIALIZADA DO JÚRI DO FORO CENTRAL',
              ]}
              searchable
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              label="Pessoa"
              placeholder="Selecione a pessoa"
              value={formData.pessoa}
              onChange={(value) => handleInputChange('pessoa', value)}
              data={[
                'HUMBERTO BORGES RIBEIRO',
                'MARTA WAYNE',
                'BART SIMPSON',
                'LISA SIMPSON',
                'HOMER SIMPSON',
              ]}
              searchable
              required
            />
          </Grid.Col>
        </Grid>

        {/* Linha 2: Processo */}
        <Select
          label="Processo"
          placeholder="Selecione o processo"
          value={formData.processo}
          onChange={(value) => handleInputChange('processo', value)}
          data={[
            '8001482-47.2021.8.21.0001',
            '5000260-33.2019.8.21.0109',
            '9012345-12.2023.8.21.0010',
          ]}
          searchable
        />

        {/* Relato */}
        <Textarea
          label="Relato"
          placeholder="Descreva o relato do assistido"
          value={formData.relato}
          onChange={(event) => handleInputChange('relato', event.currentTarget.value)}
          minRows={4}
          required
        />

        {/* Providência */}
        <Select
          label="Providência"
          placeholder="Selecione a providência"
          value={formData.providencia}
          onChange={(value) => handleInputChange('providencia', value)}
          data={[
            'Retorno',
            'Petição inicial',
            'Orientação',
            'Notificação extrajudicial',
            'Ofício ao cartório',
            'Mediação escolar',
            'Análise de Contrato',
          ]}
          required
        />

        {/* Detalhes da Providência */}
        <Textarea
          label="Detalhes da Providência"
          placeholder="Descreva os detalhes da providência"
          value={formData.detalhesProvidencia}
          onChange={(event) => handleInputChange('detalhesProvidencia', event.currentTarget.value)}
          minRows={3}
        />

        {/* Forma de Atendimento e É urgente */}
        <Grid>
          <Grid.Col span={8}>
            <Select
              label="Forma de Atendimento"
              placeholder="Selecione a forma de atendimento"
              value={formData.formaAtendimento}
              onChange={(value) => handleInputChange('formaAtendimento', value)}
              data={[
                'Atendimento presencial na sede da Defensoria',
                'Atendimento por telefone',
                'Atendimento por WhatsApp',
                'Atendimento por e-mail',
                'Atendimento externo',
              ]}
              required
            />
          </Grid.Col>
          <Grid.Col span={4} style={{ display: 'flex', alignItems: 'end' }}>
            <Checkbox
              label="É urgente"
              checked={formData.isUrgente}
              onChange={(event) => handleInputChange('isUrgente', event.currentTarget.checked)}
              mt="md"
            />
          </Grid.Col>
        </Grid>

        <Divider />

        {/* Documentos */}
        <Box>
          <Text fw={500} mb="xs">Documentos entregues durante o atendimento</Text>
          
          <Dropzone
            onDrop={handleFileDrop}
            onReject={(files) => console.log('Arquivos rejeitados:', files)}
            accept={[MIME_TYPES.pdf, MIME_TYPES.doc, MIME_TYPES.docx, 'image/*']}
            mb="md"
          >
            <Group justify="center" gap="xl" mih={100} style={{ pointerEvents: 'none' }}>
              <Dropzone.Accept>
                <IconUpload
                  style={{ width: 52, height: 52, color: 'var(--mantine-color-blue-6)' }}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{ width: 52, height: 52, color: 'var(--mantine-color-red-6)' }}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconFile
                  style={{ width: 52, height: 52, color: 'var(--mantine-color-gray-6)' }}
                  stroke={1.5}
                />
              </Dropzone.Idle>

              <div>
                <Text size="md" inline>
                  Solte arquivos aqui ou clique para selecionar
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Anexe quantos arquivos desejar (PDF, DOC, DOCX, imagens)
                </Text>
              </div>
            </Group>
          </Dropzone>

          {documentos.length > 0 ? (
            <Stack gap="xs">
              {documentos.map((file, index) => (
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
          ) : (
            <Text c="dimmed" size="sm" ta="center">
              Nenhum documento foi cadastrado
            </Text>
          )}
        </Box>

        {/* Botões */}
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="outline" color="teal" onClick={() => handleSave(true)}>
            Salvar rascunho
          </Button>
          <Button color="teal" onClick={() => handleSave(false)}>
            Salvar
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};

export default NovoAtendimentoInline; 