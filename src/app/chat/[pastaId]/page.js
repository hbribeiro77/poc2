'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Paper, Title, Text, Center, Loader, Alert, Flex, Image, Card, Group, ThemeIcon, Divider, Button, Stack } from '@mantine/core';
import { IconInfoCircle, IconMessageCircle } from '@tabler/icons-react';
import WhatsappChatModal from '../../../components/WhatsappChatModal/WhatsappChatModal';
import Link from 'next/link';

export default function ChatPage() {
  const params = useParams();
  const { pastaId } = params;
  
  const [pasta, setPasta] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para garantir que a página não tenha scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Efeito para carregar os dados da pasta do localStorage
  useEffect(() => {
    if (!pastaId) {
      setError('ID da pasta não fornecido na URL.');
      setIsLoading(false);
      return;
    }
    
    try {
      const storedPastaData = localStorage.getItem(`chatPastaData-${pastaId}`);
      if (storedPastaData) {
        const parsedData = JSON.parse(storedPastaData);
        setPasta(parsedData);
        
        // Carrega o histórico de chat se existir, senão inicia vazio
        const storedHistory = localStorage.getItem(`chatHistory-${pastaId}`);
        if (storedHistory) {
          setChatHistory(JSON.parse(storedHistory));
        }

      } else {
        setError('Não foi possível encontrar os dados da pasta. Por favor, inicie o chat a partir da lista de pastas.');
      }
    } catch (e) {
      console.error("Erro ao carregar dados do localStorage:", e);
      setError('Ocorreu um erro ao carregar os dados da conversa.');
    } finally {
      setIsLoading(false);
    }
  }, [pastaId]);

  // Efeito para salvar o histórico de chat no localStorage sempre que ele mudar
  useEffect(() => {
    if (pastaId && chatHistory.length > 0) {
      localStorage.setItem(`chatHistory-${pastaId}`, JSON.stringify(chatHistory));
    }
  }, [chatHistory, pastaId]);

  if (isLoading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader />
        <Text ml="md">Carregando conversa...</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center style={{ height: '100vh', flexDirection: 'column' }}>
        <Alert icon={<IconInfoCircle size="1rem" />} title="Erro!" color="red" variant="light">
          {error}
        </Alert>
        <Button component={Link} href="/" variant="subtle" mt="xl">
            Voltar à Central de Protótipos
        </Button>
      </Center>
    );
  }

  return (
    <Box style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Flex style={{ flexGrow: 1, height: '100%' }}>
            {/* Coluna da Esquerda (Menu Lateral Fixo) */}
            <Box style={{ width: 250, flexShrink: 0, height: '100%' }}>
                <Image
                    src="/menulateral.png" 
                    alt="Menu Lateral"
                    fit="contain"
                    style={{ height: '100%' }}
                />
            </Box>

            {/* Coluna da Direita (Conteúdo Principal) */}
            <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    marginLeft: '1rem',
                    overflowY: 'auto'
                }}
            >
                <Stack gap="xs" mb="md">
                    <Title order={5}>Contato com Marta Wayne (51) 99238-7768</Title>
                    <Text size="xs">
                        <Text span fw={700}>Processo:</Text> {pasta.processoPrincipal} | <Text span fw={700}>PID:</Text> {pasta.id}
                    </Text>
                    <Text size="xs">
                        <Text span fw={700}>Assunto:</Text> {pasta.assunto} | <Text span fw={700}>Descrição:</Text> {pasta.descricao}
                    </Text>
                </Stack>
                <Divider mb="sm" />
                
                {/* O chat ocupa o espaço restante */}
                <Box style={{ flex: 1, minHeight: 0 }}>
                    <WhatsappChatModal
                        pasta={pasta}
                        chatHistory={chatHistory}
                        onChatUpdate={setChatHistory}
                        templateId={null}
                    />
                </Box>
            </Card>
        </Flex>
    </Box>
  );
} 