'use client';

import React from 'react';
import { Box, Title, Text, Group, ThemeIcon, Button, Menu } from '@mantine/core';
import { IconFileText, IconPlus, IconEdit, IconUpload, IconStar, IconFiles } from '@tabler/icons-react';
import PecaParaAprovarCard from '../PecaParaAprovarCard/PecaParaAprovarCard';
import pecasData from '../../data/pecas-para-aprovar-data.json';

export default function PecaseOficiosList() {
  return (
    <Box mt="xl">
      <Group justify="space-between" mb="lg">
        <Group>
          <ThemeIcon variant="light" size="xl" color="#e67e22">
            <IconFileText style={{ width: '70%', height: '70%' }} />
          </ThemeIcon>
          <Title order={3} c="#e67e22">Peças</Title>
        </Group>
        
        <Menu shadow="md" width={320}>
          <Menu.Target>
            <Button color="teal.8" leftSection={<IconPlus size={16} />}>
              Nova peça
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item leftSection={<IconFileText size={14} />}>
              Nova usando Editor Online ou LibreOffice
            </Menu.Item>
            <Menu.Item leftSection={<IconEdit size={14} />}>
              Nova usando o assistente de criação de peça
            </Menu.Item>
            <Menu.Item leftSection={<IconEdit size={14} />}>
              Nova com edição integrada
            </Menu.Item>
            <Menu.Item leftSection={<IconUpload size={14} />}>
              A partir de arquivo
            </Menu.Item>
            <Menu.Item leftSection={<IconStar size={14} />}>
              A partir de favorita
            </Menu.Item>
            <Menu.Item leftSection={<IconFiles size={14} />}>
              A partir do banco de peças
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      {pecasData.length > 0 ? (
        pecasData.map((peca) => (
          <PecaParaAprovarCard key={peca.id} peca={peca} />
        ))
      ) : (
        <Text>Nenhuma peça ou ofício para aprovação no momento.</Text>
      )}
    </Box>
  );
} 