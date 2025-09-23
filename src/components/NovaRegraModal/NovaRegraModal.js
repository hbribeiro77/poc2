'use client';

import { 
  Modal, 
  Stack, 
  Select, 
  Textarea, 
  Group, 
  Text, 
  Button,
  Checkbox,
  TextInput,
  Divider,
  Paper,
  Title,
  ScrollArea,
  Box
} from '@mantine/core';
import { useState, useEffect, useRef } from 'react';

export default function NovaRegraModal({ 
  opened, 
  onClose, 
  onSubmit,
  editingRule = null
}) {
  const [tipo, setTipo] = useState('triagem');
  const [descricao, setDescricao] = useState('');
  const [regra, setRegra] = useState('');
  const [ativa, setAtiva] = useState(true);
  
  // Estados para ferramentas
  const [mostrarFerramentas, setMostrarFerramentas] = useState(false);
  const [ferramentas, setFerramentas] = useState({
    criarTarefa: false,
    criarCota: false,
    criarAudiencia: false
  });
  
  // Configurações específicas das ferramentas (apenas para Cota)
  
  const [configCota, setConfigCota] = useState({
    tipo: 'mensal',
    quantidade: '',
    observacoes: ''
  });

  // Ref para controlar o scroll
  const scrollAreaRef = useRef(null);
  const ferramentasSectionRef = useRef(null);
  const configCotaRef = useRef(null);

  // Função para rolar suavemente para o conteúdo das ferramentas
  const scrollToFerramentas = () => {
    console.log('scrollToFerramentas chamada');
    // Aguardar um pouco para o conteúdo aparecer
    setTimeout(() => {
      console.log('Timeout executado, tentando rolar...');
      // Tentar diferentes formas de acessar o scroll
      const scrollElement = scrollAreaRef.current?.viewport || scrollAreaRef.current;
      console.log('Scroll element:', scrollElement);
      
      if (scrollElement) {
        // Encontrar o elemento da seção de ferramentas
        const ferramentasSection = scrollElement.querySelector('[data-ferramentas-section]');
        console.log('Seção de ferramentas encontrada:', ferramentasSection);
        if (ferramentasSection) {
          // Calcular posição para rolar
          const containerRect = scrollElement.getBoundingClientRect();
          const sectionRect = ferramentasSection.getBoundingClientRect();
          const scrollTop = scrollElement.scrollTop + (sectionRect.top - containerRect.top) - 20;
          
          console.log('Rolando para posição:', scrollTop);
          // Rolar suavemente
          scrollElement.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        }
      } else {
        console.log('Tentando fallback...');
        // Fallback: usar scrollIntoView no elemento da seção
        const ferramentasSection = document.querySelector('[data-ferramentas-section]');
        console.log('Seção de ferramentas (fallback):', ferramentasSection);
        if (ferramentasSection) {
          ferramentasSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    }, 200);
  };

  // Atualizar campos quando editingRule mudar
  useEffect(() => {
    if (editingRule) {
      setTipo(editingRule.tipo === 'TRIAGEM DE INTIMAÇÃO' ? 'triagem' : 'geracao');
      setDescricao(editingRule.descricao || '');
      setRegra(editingRule.regra || '');
      setAtiva(editingRule.status === 'ATIVA');
      
      // Carregar ferramentas se existirem
      if (editingRule.ferramentas) {
        setFerramentas(editingRule.ferramentas);
        // Mostrar seção se alguma ferramenta estiver ativa
        const temFerramentaAtiva = Object.values(editingRule.ferramentas).some(ativa => ativa);
        setMostrarFerramentas(temFerramentaAtiva);
      }
      // configTarefa removido - não há mais campos de configuração
      if (editingRule.configCota) {
        setConfigCota(editingRule.configCota);
      }
    } else {
      // Reset para valores padrão quando não está editando
      setTipo('triagem');
      setDescricao('');
      setRegra('');
      setAtiva(true);
      setMostrarFerramentas(false);
      setFerramentas({
        criarTarefa: false,
        criarCota: false,
        criarAudiencia: false
      });
      // configTarefa removido - não há mais campos de configuração
      setConfigCota({
        tipo: 'mensal',
        quantidade: '',
        observacoes: ''
      });
    }
  }, [editingRule]);

  // Effect para rolar quando ferramentas aparecem
  useEffect(() => {
    if (mostrarFerramentas && ferramentasSectionRef.current) {
      console.log('Ferramentas apareceram, rolando...');
      setTimeout(() => {
        if (ferramentasSectionRef.current) {
          ferramentasSectionRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }, [mostrarFerramentas]);

  // Função para rolar para configurações específicas
  const scrollToConfig = (configRef) => {
    console.log('scrollToConfig chamada para:', configRef.current);
    
    // Aguardar o elemento ser renderizado
    const waitForElement = (ref, maxAttempts = 10) => {
      return new Promise((resolve) => {
        let attempts = 0;
        const checkElement = () => {
          attempts++;
          if (ref.current) {
            console.log('Elemento encontrado após', attempts, 'tentativas');
            resolve(ref.current);
          } else if (attempts < maxAttempts) {
            setTimeout(checkElement, 50);
          } else {
            console.log('Elemento não encontrado após', maxAttempts, 'tentativas');
            resolve(null);
          }
        };
        checkElement();
      });
    };
    
    waitForElement(configRef).then((element) => {
      if (element) {
        console.log('Tentando rolar para elemento:', element);
        
        // Usar scrollIntoView direto com opções específicas
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
        
        // Também tentar rolar dentro do ScrollArea se disponível
        const scrollElement = scrollAreaRef.current?.viewport;
        if (scrollElement) {
          setTimeout(() => {
            const containerRect = scrollElement.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            const scrollTop = scrollElement.scrollTop + (elementRect.top - containerRect.top) - 50;
            
            console.log('Ajustando posição no ScrollArea:', scrollTop);
            scrollElement.scrollTo({
              top: Math.max(0, scrollTop),
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    });
  };

  const handleSubmit = () => {
    const newRuleData = {
      tipo,
      descricao,
      regra,
      ativa,
      ferramentas,
      configTarefa: null, // Removido - não há mais campos de configuração
      configCota: ferramentas.criarCota ? configCota : null
    };
    
    if (onSubmit) {
      onSubmit(newRuleData);
    }
    
    // Reset form
    setTipo('triagem');
    setDescricao('');
    setRegra('');
    setAtiva(true);
    setMostrarFerramentas(false);
    setFerramentas({
      criarTarefa: false,
      criarCota: false,
      criarAudiencia: false
    });
    setConfigTarefa({
      titulo: '',
      descricao: '',
      prioridade: 'normal',
      prazo: ''
    });
    setConfigCota({
      tipo: 'mensal',
      quantidade: '',
      observacoes: ''
    });
  };

  const handleClose = () => {
    // Reset form ao fechar
    setTipo('triagem');
    setDescricao('');
    setRegra('');
    setAtiva(true);
    setMostrarFerramentas(false);
    setFerramentas({
      criarTarefa: false,
      criarCota: false,
      criarAudiencia: false
    });
    setConfigTarefa({
      titulo: '',
      descricao: '',
      prioridade: 'normal',
      prazo: ''
    });
    setConfigCota({
      tipo: 'mensal',
      quantidade: '',
      observacoes: ''
    });
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={editingRule ? "Editar Regra" : "Nova Regra"}
      size="lg"
      styles={{
        header: {
          backgroundColor: '#2c2c2c',
          color: 'white',
          padding: '16px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 10
        },
        title: {
          color: 'white',
          fontWeight: '600'
        },
        body: {
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '70vh'
        }
      }}
    >
      {/* Conteúdo com scroll */}
      <ScrollArea ref={scrollAreaRef} style={{ flex: 1, padding: '24px' }}>
        <Stack gap="md">
        <Select
          label="Tipo de Inferência *"
          placeholder="Selecione o tipo"
          data={[
            { value: 'triagem', label: 'Triagem de intimação' },
            { value: 'geracao', label: 'Geração de petição' }
          ]}
          value={tipo}
          onChange={setTipo}
          required
        />
        
        <Textarea
          label="Descrição"
          placeholder="Digite uma descrição opcional"
          value={descricao}
          onChange={(e) => setDescricao(e.currentTarget?.value || '')}
          minRows={3}
        />
        
        <Textarea
          label="Regra"
          placeholder="Digite o prompt que será usado pela IA para processar este tipo de inferência. Use variáveis e instruções claras."
          value={regra}
          onChange={(e) => setRegra(e.currentTarget?.value || '')}
          minRows={6}
        />

        <Divider my="md" label="Ferramentas" labelPosition="left" />
        
        <Paper withBorder p="md" style={{ backgroundColor: '#f8f9fa' }}>
          <Group justify="space-between" mb="md">
            <div>
              <Group gap="md" align="center">
                <Title order={5} c="#126A3D">Usar ferramentas</Title>
                <Checkbox
                  checked={mostrarFerramentas}
                  onChange={(e) => {
                    const isChecked = e.currentTarget?.checked || false;
                    setMostrarFerramentas(isChecked);
                    
                    // O scroll será feito automaticamente pelo useEffect
                    
                    // Limpar todas as ferramentas se desmarcar
                    if (!isChecked) {
                      setFerramentas({
                        criarTarefa: false,
                        criarCota: false,
                        criarAudiencia: false
                      });
      // configTarefa removido - não há mais campos de configuração
                      setConfigCota({
                        tipo: 'mensal',
                        quantidade: '',
                        observacoes: ''
                      });
                    }
                  }}
                />
              </Group>
              <Text size="sm" c="dimmed" mt="xs">
                Configure ferramentas que serão executadas automaticamente quando esta regra for aplicada.
              </Text>
            </div>
          </Group>
          
          {mostrarFerramentas && (
            <Stack gap="md" data-ferramentas-section ref={ferramentasSectionRef}>
            {/* Criar Tarefa */}
            <Paper withBorder p="sm" style={{ backgroundColor: 'white' }}>
              <Checkbox
                label="Criar Tarefa"
                checked={ferramentas.criarTarefa}
                onChange={(e) => {
                  const isChecked = e.currentTarget?.checked || false;
                  setFerramentas(prev => ({ ...prev, criarTarefa: isChecked }));
                  
                  // Não precisa mais rolar, não há campos de configuração
                  
                  // Não precisa limpar configurações, não há campos
                }}
                mb={ferramentas.criarTarefa ? "sm" : 0}
              />
              {ferramentas.criarTarefa && (
                <Text size="sm" c="dimmed" ml="xl" mt="sm">
                  A tarefa será criada com base nos dados da triagem.
                </Text>
              )}
            </Paper>

            {/* Criar Cota */}
            <Paper withBorder p="sm" style={{ backgroundColor: 'white' }}>
              <Checkbox
                label="Criar Cota"
                checked={ferramentas.criarCota}
                onChange={(e) => {
                  const isChecked = e.currentTarget?.checked || false;
                  setFerramentas(prev => ({ ...prev, criarCota: isChecked }));
                  
                  // Rolar para configurações se estiver marcando
                  if (isChecked) {
                    console.log('Checkbox Criar Cota marcado, chamando scroll...');
                    scrollToConfig(configCotaRef);
                  }
                  
                  // Limpar configurações se desmarcar
                  if (!isChecked) {
                    setConfigCota({
                      tipo: 'mensal',
                      quantidade: '',
                      observacoes: ''
                    });
                  }
                }}
                mb={ferramentas.criarCota ? "sm" : 0}
              />
              {ferramentas.criarCota && (
                <Stack gap="sm" ml="xl" mt="sm" ref={configCotaRef}>
                  <Group grow>
                    <Select
                      label="Tipo de Cota"
                      value={configCota.tipo}
                      onChange={(value) => setConfigCota(prev => ({ ...prev, tipo: value }))}
                      data={[
                        { value: 'mensal', label: 'Mensal' },
                        { value: 'trimestral', label: 'Trimestral' },
                        { value: 'semestral', label: 'Semestral' },
                        { value: 'anual', label: 'Anual' }
                      ]}
                    />
                    <TextInput
                      label="Quantidade"
                      placeholder="Ex: 10"
                      value={configCota.quantidade}
                      onChange={(e) => setConfigCota(prev => ({ ...prev, quantidade: e.currentTarget?.value || '' }))}
                    />
                  </Group>
                  <Textarea
                    label="Observações"
                    placeholder="Observações sobre a cota..."
                    value={configCota.observacoes}
                    onChange={(e) => setConfigCota(prev => ({ ...prev, observacoes: e.currentTarget?.value || '' }))}
                    minRows={2}
                  />
                </Stack>
              )}
            </Paper>

            {/* Criar Audiência */}
            <Paper withBorder p="sm" style={{ backgroundColor: 'white' }}>
              <Checkbox
                label="Criar Audiência"
                checked={ferramentas.criarAudiencia}
                onChange={(e) => {
                  const isChecked = e.currentTarget?.checked || false;
                  setFerramentas(prev => ({ ...prev, criarAudiencia: isChecked }));
                }}
                mb={ferramentas.criarAudiencia ? "sm" : 0}
              />
              {ferramentas.criarAudiencia && (
                <Text size="sm" c="dimmed" ml="xl" mt="sm">
                  A audiência será criada automaticamente com base nos dados do processo.
                </Text>
              )}
            </Paper>
            </Stack>
          )}
        </Paper>
        </Stack>
      </ScrollArea>

      {/* Área fixa dos botões */}
      <Box 
        style={{ 
          padding: '16px 24px', 
          borderTop: '1px solid #e9ecef',
          backgroundColor: '#f8f9fa',
          position: 'sticky',
          bottom: 0,
          zIndex: 10
        }}
      >
        <Group justify="space-between">
          <Stack gap="xs">
            <Group gap="sm">
              <Text size="sm" fw={500}>Ativa</Text>
              <div 
                style={{
                  width: '40px',
                  height: '20px',
                  backgroundColor: ativa ? '#1b7847' : '#ccc',
                  borderRadius: '10px',
                  position: 'relative',
                  cursor: 'pointer'
                }}
                onClick={() => setAtiva(!ativa)}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  [ativa ? 'right' : 'left']: '2px',
                  transition: 'all 0.2s'
                }} />
              </div>
            </Group>
            <Text size="xs" c="dimmed">
              Define se a regra está ativa para execução
            </Text>
          </Stack>
          
          <Group gap="sm">
            <Button 
              variant="default" 
              onClick={handleClose}
              style={{ backgroundColor: '#6c757d', color: 'white', border: 'none' }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!regra.trim()} // Desabilitar se regra estiver vazia
              style={{ 
                backgroundColor: '#1b7847', 
                color: 'white', 
                border: 'none' 
              }}
            >
              {editingRule ? 'Salvar' : 'Criar'}
            </Button>
          </Group>
        </Group>
      </Box>
    </Modal>
  );
}
