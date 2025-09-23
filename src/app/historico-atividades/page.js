'use client';

import { 
  Flex, 
  Box, 
  Image, 
  Card, 
  Title, 
  Text, 
  Group, 
  Stack,
  TextInput,
  Select,
  Button
} from '@mantine/core';
import { IconCalendar, IconChevronDown } from '@tabler/icons-react';

export default function HistoricoAtividadesPage() {
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

        <Box style={{ flex: 1, padding: '24px', backgroundColor: '#f8f9fa' }}>
          {/* Header */}
          <Group align="center" mb="lg">
            <Title order={2} c="#1b7847">Histórico de Atividades</Title>
          </Group>

          {/* Content */}
          <Card withBorder radius="md" p="lg" style={{ backgroundColor: 'white' }}>
            <Stack gap="lg">
              {/* Período */}
              <div>
                <Text fw={600} mb="sm">Período</Text>
                <Group gap="md" align="center">
                  <TextInput
                    placeholder="22/09/2025"
                    rightSection={<IconCalendar size={16} />}
                    style={{ width: '150px' }}
                  />
                  <Text size="sm" c="dimmed">a</Text>
                  <TextInput
                    placeholder="23/09/2025"
                    rightSection={<IconCalendar size={16} />}
                    style={{ width: '150px' }}
                  />
                </Group>
              </div>

              {/* Atividade */}
              <div>
                <Text fw={600} mb="sm">Atividade</Text>
                <Select
                  placeholder="Selecione o tipo de atividade"
                  rightSection={<IconChevronDown size={16} />}
                  data={[
                    { value: 'triagem', label: 'Triagem de Intimações' },
                    { value: 'geracao', label: 'Geração de Petições' },
                    { value: 'regras', label: 'Criação de Regras IA' },
                    { value: 'todas', label: 'Todas as Atividades' }
                  ]}
                  style={{ maxWidth: '400px' }}
                />
              </div>

              {/* Botão Pesquisar */}
              <Button 
                style={{ 
                  backgroundColor: '#6c757d', 
                  color: 'white',
                  maxWidth: '120px'
                }}
              >
                Pesquisar
              </Button>
            </Stack>
          </Card>
        </Box>
      </Flex>
    </>
  );
}
