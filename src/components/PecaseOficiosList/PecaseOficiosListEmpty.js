'use client';

import React, { useState } from 'react';
import { Box, Title, Text, Group, ThemeIcon, Button, Menu, Alert } from '@mantine/core';
import { IconFileText, IconPlus, IconEdit, IconUpload, IconStar, IconFiles, IconInfoCircle, IconSparkles } from '@tabler/icons-react';
import PortalIaModal from '../PortalIaModal/PortalIaModal';

export default function PecaseOficiosListEmpty() {
  const [portalIaModalOpened, setPortalIaModalOpened] = useState(false);

  return (
    <Box mt="xl" p="md" bg="white" style={{ borderRadius: '8px', border: '1px solid #e9ecef' }}>
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
            <Menu.Item 
              leftSection={<IconSparkles size={14} />}
              onClick={() => setPortalIaModalOpened(true)}
            >
              Nova usando Portal-IA
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

      <Alert variant="light" color="blue" icon={<IconInfoCircle size={16} />} mt="md">
        Ainda não há peças para esta pasta.
      </Alert>

      <PortalIaModal
        opened={portalIaModalOpened}
        onClose={() => setPortalIaModalOpened(false)}
      />
    </Box>
  );
}