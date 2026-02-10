'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Card,
  Image,
  Group,
  Text,
  ThemeIcon,
  TextInput,
  Select,
  Checkbox,
  Radio,
  Grid,
  Button,
  Tooltip,
  Stack,
  Popover,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import Link from 'next/link';
import {
  IconUser,
  IconCheck,
  IconCalendar,
  IconDeviceFloppy,
  IconHelp,
  IconAlertTriangleFilled,
  IconPencil,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import ModalValidacaoNomeSocial from '../../components/ModalValidacaoNomeSocial/ModalValidacaoNomeSocial';
import ModalEditarNomeSocial from '../../components/ModalEditarNomeSocial/ModalEditarNomeSocial';

const INITIAL_FORM = {
  nome: 'HUMBERTO BORGES RIBEIRO',
  nomeSocial: 'MARTHA WAYNE',
  genero: '',
  dataNascimento: new Date(1977, 11, 22),
  estadoCivil: '',
  viveUniaoEstavel: false,
  nacionalidade: 'Brasil',
  pessoaFalecida: false,
  pessoaDeficiencia: false,
  filhoIdadeEscolar: 'nao-informado',
  nomeMae: 'BEATRIZ BORGES RIBEIRO',
  nomePai: '',
  rendaFamiliar: '',
  profissao: '',
};

export default function DadosPessoaisPage() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [nomeSocialValidado, setNomeSocialValidado] = useState(false);
  const [nomeSocialSalvoEmBranco, setNomeSocialSalvoEmBranco] = useState(false);
  const [nomeSocialEmEdicao, setNomeSocialEmEdicao] = useState(false);
  const [modalValidacaoNomeSocialOpened, setModalValidacaoNomeSocialOpened] = useState(false);
  const [modalEditarNomeSocialOpened, setModalEditarNomeSocialOpened] = useState(false);
  const [popoverNomeSocialOpened, setPopoverNomeSocialOpened] = useState(false);
  const [popoverCheckValidadoOpened, setPopoverCheckValidadoOpened] = useState(false);
  const [validatedPorNomeSocial, setValidatedPorNomeSocial] = useState(null);

  const validadoPorTexto = validatedPorNomeSocial
    ? `Validado por ${validatedPorNomeSocial.nome} (${validatedPorNomeSocial.matricula}) em ${validatedPorNomeSocial.dataHora.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`
    : 'Validado';

  useEffect(() => {
    const temNomeSocial = formData.nomeSocial && formData.nomeSocial.trim() !== '';
    if (temNomeSocial && !nomeSocialValidado && !nomeSocialEmEdicao) {
      setModalValidacaoNomeSocialOpened(true);
    }
  }, [formData.nomeSocial, nomeSocialValidado, nomeSocialEmEdicao]);

  const handleConfirmarValidacaoNomeSocial = (acao) => {
    setNomeSocialValidado(true);
    setModalValidacaoNomeSocialOpened(false);
    if (acao === 'excluir') {
      setFormData((prev) => ({ ...prev, nomeSocial: '' }));
      setValidatedPorNomeSocial(null);
    }
    if (acao === 'confirmar' || acao === 'mover-observacoes') {
      setValidatedPorNomeSocial({
        nome: 'Humberto Borges Ribeiro',
        matricula: '3925811',
        dataHora: new Date(),
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDescartar = () => {
    setFormData({ ...INITIAL_FORM });
    setNomeSocialValidado(false);
    setNomeSocialSalvoEmBranco(false);
    setNomeSocialEmEdicao(false);
    setValidatedPorNomeSocial(null);
    notifications.show({
      title: 'Alterações descartadas',
      message: 'O formulário foi restaurado ao estado inicial.',
      color: 'gray',
    });
  };

  const handleSalvar = () => {
    setNomeSocialSalvoEmBranco(formData.nomeSocial.trim() === '');
    if (nomeSocialEmEdicao) {
      setNomeSocialValidado(true);
      setNomeSocialEmEdicao(false);
      setValidatedPorNomeSocial({
        nome: 'Humberto Borges Ribeiro',
        matricula: '3925811',
        dataHora: new Date(),
      });
    }
    console.log('Dados Pessoais (salvar):', formData);
    notifications.show({
      title: 'Salvo',
      message: 'Os dados pessoais foram salvos.',
      color: 'blue',
    });
  };

  return (
    <>
      <Flex gap={0} pb="xl">
        <Box style={{ maxWidth: 250, height: '100%' }}>
          <Image
            src="/menulateral.png"
            alt="Menu Lateral"
            height="70%"
            fit="contain"
          />
        </Box>

        <Box style={{ flex: 1 }}>
          <Card shadow="sm" padding={0} radius="md" withBorder>
            <Box pt={0} px="lg" pb="lg">
              <Image
                src="/header-dados-pessoais.jpg"
                alt="Menu Superior"
                width="100%"
                mb="lg"
              />

              <Group align="center" mb="lg" bg="gray.1" p="sm">
                <ThemeIcon variant="light" size="lg">
                  <IconUser stroke={1.5} />
                </ThemeIcon>
                <Text fw={500} size="xl" c="blue">
                  Dados Pessoais
                </Text>
              </Group>

              {/* Seção Dados Pessoais */}
              <Stack gap="md" mb="xl">
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Nome"
                      value={formData.nome}
                      onChange={(e) => handleChange('nome', e.target.value)}
                      rightSection={
                        formData.nome ? (
                          <IconCheck size={16} color="var(--mantine-color-green-6)" />
                        ) : null
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    {(nomeSocialValidado && !nomeSocialEmEdicao) ||
                    (nomeSocialSalvoEmBranco && formData.nomeSocial.trim() === '' && !nomeSocialEmEdicao) ||
                    (!nomeSocialValidado && formData.nomeSocial?.trim() && !nomeSocialEmEdicao) ? (
                      <TextInput
                        label="Nome Social"
                        placeholder="NOME SOCIAL"
                        value={formData.nomeSocial}
                        readOnly
                        styles={{
                          input: {
                            color: 'var(--mantine-color-gray-5)',
                            backgroundColor: 'var(--mantine-color-gray-0)',
                          },
                        }}
                        rightSection={
                          !nomeSocialValidado && formData.nomeSocial?.trim() ? (
                            <Box style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', paddingRight: 8 }}>
                              <Popover
                                position="bottom"
                                withArrow
                                shadow="md"
                                opened={popoverNomeSocialOpened}
                                onClose={() => setPopoverNomeSocialOpened(false)}
                              >
                                <Popover.Target>
                                  <Box
                                    component="span"
                                    onMouseEnter={() => setPopoverNomeSocialOpened(true)}
                                    onMouseLeave={() => setPopoverNomeSocialOpened(false)}
                                    style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                                  >
                                    <IconAlertTriangleFilled
                                      size={16}
                                      style={{
                                        color: 'var(--mantine-color-yellow-6)',
                                        filter: 'drop-shadow(0 0 2px rgba(250, 176, 5, 0.5))',
                                      }}
                                    />
                                  </Box>
                                </Popover.Target>
                              <Popover.Dropdown
                                style={{ pointerEvents: 'auto' }}
                                onMouseEnter={() => setPopoverNomeSocialOpened(true)}
                                onMouseLeave={() => setPopoverNomeSocialOpened(false)}
                              >
                                <Stack gap="sm">
                                  <Text size="sm">
                                    Este nome social ainda não foi validado pelo usuário.
                                  </Text>
                                  <Button
                                    size="xs"
                                    color="blue"
                                    variant="light"
                                    onClick={() => {
                                      setPopoverNomeSocialOpened(false);
                                      setModalValidacaoNomeSocialOpened(true);
                                    }}
                                  >
                                    Validar
                                  </Button>
                                </Stack>
                              </Popover.Dropdown>
                              </Popover>
                            </Box>
                          ) : (
                            <Group gap="xs" wrap="nowrap">
                              {formData.nomeSocial?.trim() ? (
                                <Popover
                                  position="bottom"
                                  withArrow
                                  shadow="md"
                                  opened={popoverCheckValidadoOpened}
                                  onClose={() => setPopoverCheckValidadoOpened(false)}
                                >
                                  <Popover.Target>
                                    <Box
                                      component="span"
                                      onMouseEnter={() => setPopoverCheckValidadoOpened(true)}
                                      onMouseLeave={() => setPopoverCheckValidadoOpened(false)}
                                      style={{ display: 'inline-flex', alignItems: 'center', cursor: 'default' }}
                                    >
                                      <IconCheck size={16} color="var(--mantine-color-green-6)" />
                                    </Box>
                                  </Popover.Target>
                                  <Popover.Dropdown>
                                    <Text size="sm">{validadoPorTexto}</Text>
                                  </Popover.Dropdown>
                                </Popover>
                              ) : null}
                              <Button
                                size="xs"
                                variant="light"
                                color="blue"
                                leftSection={<IconPencil size={14} />}
                                onClick={() => setModalEditarNomeSocialOpened(true)}
                              >
                                Editar
                              </Button>
                            </Group>
                          )
                        }
                        rightSectionWidth={
                          !nomeSocialValidado && formData.nomeSocial?.trim() ? 36 : 120
                        }
                      />
                    ) : (
                      <TextInput
                        label="Nome Social"
                        placeholder="NOME SOCIAL"
                        value={formData.nomeSocial}
                        onChange={(e) => handleChange('nomeSocial', e.target.value)}
                        rightSection={
                          formData.nomeSocial?.trim() ? (
                            nomeSocialValidado ? (
                              <Popover
                                position="bottom"
                                withArrow
                                shadow="md"
                                opened={popoverCheckValidadoOpened}
                                onClose={() => setPopoverCheckValidadoOpened(false)}
                              >
                                <Popover.Target>
                                  <Box
                                    component="span"
                                    onMouseEnter={() => setPopoverCheckValidadoOpened(true)}
                                    onMouseLeave={() => setPopoverCheckValidadoOpened(false)}
                                    style={{ display: 'inline-flex', alignItems: 'center', cursor: 'default' }}
                                  >
                                    <IconCheck size={16} color="var(--mantine-color-green-6)" />
                                  </Box>
                                </Popover.Target>
                                <Popover.Dropdown>
                                  <Text size="sm">{validadoPorTexto}</Text>
                                </Popover.Dropdown>
                              </Popover>
                            ) : nomeSocialEmEdicao ? null : (
                              <Popover
                                position="bottom"
                                withArrow
                                shadow="md"
                                opened={popoverNomeSocialOpened}
                                onClose={() => setPopoverNomeSocialOpened(false)}
                              >
                                <Popover.Target>
                                  <Box
                                    component="span"
                                    onMouseEnter={() => setPopoverNomeSocialOpened(true)}
                                    onMouseLeave={() => setPopoverNomeSocialOpened(false)}
                                    style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                                  >
                                    <IconAlertTriangleFilled
                                      size={16}
                                      style={{
                                        color: 'var(--mantine-color-yellow-6)',
                                        filter: 'drop-shadow(0 0 2px rgba(250, 176, 5, 0.5))',
                                      }}
                                    />
                                  </Box>
                                </Popover.Target>
                                <Popover.Dropdown
                                  style={{ pointerEvents: 'auto' }}
                                  onMouseEnter={() => setPopoverNomeSocialOpened(true)}
                                  onMouseLeave={() => setPopoverNomeSocialOpened(false)}
                                >
                                  <Stack gap="sm">
                                    <Text size="sm">
                                      Este nome social ainda não foi validado pelo usuário.
                                    </Text>
                                    <Button
                                      size="xs"
                                      color="blue"
                                      variant="light"
                                      onClick={() => {
                                        setPopoverNomeSocialOpened(false);
                                        setModalValidacaoNomeSocialOpened(true);
                                      }}
                                    >
                                      Validar
                                    </Button>
                                  </Stack>
                                </Popover.Dropdown>
                              </Popover>
                            )
                          ) : null
                        }
                      />
                    )}
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Gênero"
                      value={formData.genero}
                      onChange={(e) => handleChange('genero', e.target.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <DatePickerInput
                      label="Data de nascimento"
                      value={formData.dataNascimento}
                      onChange={(value) => handleChange('dataNascimento', value)}
                      locale="pt-BR"
                      leftSection={<IconCalendar size={16} />}
                      rightSection={
                        formData.dataNascimento ? (
                          <IconCheck size={16} color="var(--mantine-color-green-6)" />
                        ) : null
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                      label="Estado Civil"
                      placeholder="Escolha um estado civil"
                      value={formData.estadoCivil}
                      onChange={(value) => handleChange('estadoCivil', value)}
                      data={[
                        'Solteiro(a)',
                        'Casado(a)',
                        'Divorciado(a)',
                        'Viúvo(a)',
                        'União estável',
                        'Outro',
                      ]}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Checkbox
                      label="Vive em união estável"
                      checked={formData.viveUniaoEstavel}
                      onChange={(e) =>
                        handleChange('viveUniaoEstavel', e.currentTarget.checked)
                      }
                      mt="xl"
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Select
                      label="Nacionalidade"
                      value={formData.nacionalidade}
                      onChange={(value) => handleChange('nacionalidade', value)}
                      data={['Brasil', 'Outra']}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Group gap="lg">
                      <Checkbox
                        label="Pessoa falecida"
                        checked={formData.pessoaFalecida}
                        onChange={(e) =>
                          handleChange('pessoaFalecida', e.currentTarget.checked)
                        }
                      />
                      <Checkbox
                        label="Pessoa com deficiência"
                        checked={formData.pessoaDeficiencia}
                        onChange={(e) =>
                          handleChange('pessoaDeficiencia', e.currentTarget.checked)
                        }
                      />
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Group gap="xs" align="flex-start">
                      <Text size="sm" fw={500} component="label">
                        Possui filho em idade escolar?
                      </Text>
                      <Tooltip label="Informe se possui filho(s) em idade escolar">
                        <ThemeIcon size="sm" variant="light" color="gray">
                          <IconHelp size={14} />
                        </ThemeIcon>
                      </Tooltip>
                    </Group>
                    <Radio.Group
                      value={formData.filhoIdadeEscolar}
                      onChange={(value) => handleChange('filhoIdadeEscolar', value)}
                      mt="xs"
                    >
                      <Group mt="xs">
                        <Radio value="sim" label="Sim" />
                        <Radio value="nao" label="Não" />
                        <Radio value="nao-informado" label="Não informado" />
                      </Group>
                    </Radio.Group>
                  </Grid.Col>
                </Grid>
              </Stack>

              {/* Seção Filiação */}
              <Text fw={700} size="sm" mb="sm">
                Filiação
              </Text>
              <Grid mb="xl">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Nome da Mãe"
                    value={formData.nomeMae}
                    onChange={(e) => handleChange('nomeMae', e.target.value)}
                    rightSection={
                      formData.nomeMae ? (
                        <IconCheck size={16} color="var(--mantine-color-green-6)" />
                      ) : null
                    }
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Nome do Pai"
                    placeholder="NOME DO PAI"
                    value={formData.nomePai}
                    onChange={(e) => handleChange('nomePai', e.target.value)}
                  />
                </Grid.Col>
              </Grid>

              {/* Seção Dados Socioeconômicos */}
              <Text fw={700} size="sm" mb="sm">
                Dados Socioeconômicos
              </Text>
              <Grid mb="xl">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Select
                    label="Renda Familiar"
                    placeholder="Selecione"
                    value={formData.rendaFamiliar}
                    onChange={(value) => handleChange('rendaFamiliar', value)}
                    data={[
                      'Até 1 salário mínimo',
                      'De 1 a 2 salários',
                      'De 2 a 3 salários',
                      'Acima de 3 salários',
                      'Não informado',
                    ]}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Profissão"
                    placeholder="PROFISSÃO"
                    value={formData.profissao}
                    onChange={(e) => handleChange('profissao', e.target.value)}
                  />
                </Grid.Col>
              </Grid>

              {/* Botões de ação */}
              <Group justify="flex-end" mt="md">
                <Button variant="default" onClick={handleDescartar}>
                  Descartar alterações
                </Button>
                <Button
                  color="blue"
                  leftSection={<IconDeviceFloppy size={16} />}
                  onClick={handleSalvar}
                >
                  Salvar
                </Button>
              </Group>
            </Box>
          </Card>
        </Box>
      </Flex>

      <Group justify="center" mt="xl" pb="xl">
        <Link href="/">
          <Text c="dimmed" size="sm">
            Voltar para a Central
          </Text>
        </Link>
      </Group>

      <ModalValidacaoNomeSocial
        opened={modalValidacaoNomeSocialOpened}
        onClose={() => setModalValidacaoNomeSocialOpened(false)}
        nomeSocial={formData.nomeSocial}
        onConfirm={handleConfirmarValidacaoNomeSocial}
      />

      <ModalEditarNomeSocial
        opened={modalEditarNomeSocialOpened}
        onClose={() => setModalEditarNomeSocialOpened(false)}
        onConfirm={() => {
          setNomeSocialEmEdicao(true);
          setModalEditarNomeSocialOpened(false);
        }}
      />
    </>
  );
}
