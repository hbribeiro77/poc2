'use client';

import React, { useState } from 'react';
import { Box, Flex, Card, Title, Text, Image, Group, ThemeIcon } from '@mantine/core';
import Link from 'next/link';
// Adicione imports de ícones específicos se necessário, ex:
// import { IconFileDescription } from '@tabler/icons-react'; // Exemplo de ícone para documentos
import CadastroHeader from '../../components/CadastroHeader/CadastroHeader';

// Dados de exemplo para o CadastroHeader (substituir por dados reais)
const dadosDoAssistido = {
  nomeRegistral: 'ASSISTIDO EXEMPLO REGISTRAL',
  nomeSocial: 'NOME SOCIAL EXEMPLO',
  telefone: '(00) 00000-0000',
  contagem: {
    documentos: 5, // Exemplo
    enderecos: 1,
    contatos: 2,
    observacoes: 0,
    agendamentos: 0,
    pastas: 1,
    solicitacoes: true, // Exemplo de alerta ativo
    tarefas: 4,
  },
};

// Nome da função atualizado
export default function DocumentosPage() {
  // const theme = useMantineTheme(); // Descomentar se precisar do tema
  // Estado para controlar o botão ativo no header
  const [botaoAtivo, setBotaoAtivo] = useState('Documentos');

  return (
    // Envolver com Fragmento para permitir o link "Voltar"
    <>
      <Flex gap={0} pb="xl"> {/* pb="xl" para dar espaço para o link "Voltar" */}

        {/* Coluna Esquerda (Imagem Lateral Estática) - Igual a Solicitacoes */}
        <Box style={{ maxWidth: 250, height: '100%' }}>
          <Image
              src="/menulateral.png"
              alt="Menu Lateral"
              height="70%"
              fit="contain"
          />
        </Box>

        {/* Coluna Direita (Conteúdo da Nova Página) - Igual a Solicitacoes */}
        <Box style={{ flex: 1 }}>
          {/* ADICIONADO o componente CadastroHeader */}
          <CadastroHeader
            assistidoData={dadosDoAssistido}
            activeButtonTitle={botaoAtivo}
            // Nota: A lógica de clique para MUDAR o estado 'botaoAtivo' não
            // foi implementada aqui, apenas a passagem do estado atual.
            // Conforme as instruções, seria necessário passar uma função onClick.
          />

          {/* O conteúdo específico da página de Documentos começa abaixo */}
          {/* O Card/Box interno foi removido pois o CadastroHeader já contém um Container */}
          {/* Ajustar o layout abaixo conforme necessário para encaixar com o header */}
          <Box p="lg"> {/* Adicionado padding para o conteúdo abaixo do header */}
            {/* Título da Página (Simplificado - pode ser removido se o header for suficiente) */}
            <Group align="center" mb="lg" bg="gray.1" p="sm">
              <ThemeIcon variant="light" size="lg">
                 <Text>?</Text> {/* Ícone placeholder */}
              </ThemeIcon>
              <Text fw={500} size="xl" c="blue">
                Documentos (Conteúdo da Página)
              </Text>
            </Group>

            {/* Conteúdo Principal */}
            <Text>
              Esta é a página de Documentos. O conteúdo específico será adicionado aqui, abaixo do cabeçalho de cadastro.
            </Text>
            {/* Adicione aqui os componentes Mantine para sua funcionalidade */}

          </Box>
        </Box>

      </Flex>

      {/* Link discreto para voltar ao Hub - Igual a Solicitacoes */}
      <Group justify="center" mt="xl" pb="xl">
        <Link href="/">
          <Text c="dimmed" size="sm">
            Voltar para a Central
          </Text>
        </Link>
      </Group>
    </>
  );
} 