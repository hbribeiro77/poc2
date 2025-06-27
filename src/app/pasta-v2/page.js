'use client';

import React, { useState } from 'react';
import { Box, Flex, Image } from '@mantine/core';
import PastaHeader from '../../components/PastaHeader/PastaHeader';
import AtendimentosPastaTable from '../../components/AtendimentosPastaTable/AtendimentosPastaTable';

// Dados de exemplo (pode ser ajustado depois)
const initialPastaData = {
  area: "Cível",
  assistido: "BART SIMPSON",
  assunto: "DIREITO DA SAÚDE / Mental / Internação compulsória",
  descricao: "",
  status: "Ativa",
  motivoArquivamento: null,
  lastStatusChangeBy: null,
  lastStatusChangeAt: null,
  processo: "5000260-33.2019.8.21.0109",
  comarca: "Marau",
  orgaoJulgador: "Juízo da 2ª Vara Judicial da Comarca de Marau",
  classe: "Procedimento Comum",
  contatos: [
    { id: 'assistido_principal', nome: "BART SIMPSON", relacao: "Assistido Principal", telefone: "(55) 9 9988-7766", hasWhatsapp: true },
    { id: 'contato_secundario_1', nome: "HOMER SIMPSON", relacao: "Pai", telefone: "(55) 9 8877-6655", hasWhatsapp: false },
    { id: 'contato_secundario_2', nome: "MARGE SIMPSON", relacao: "Mãe", telefone: "(55) 9 9911-2233", hasWhatsapp: true },
  ],
  counts: {
      atendimentos: 2,
      pecas: 1,
      documentos: 0,
      observacoes: 0,
      assistidos: null,
      certidoes: null,
      processos: null,
      dadosPasta: null,
  }
};

export default function PastaV2Page() {
  const [pastaData] = useState(initialPastaData);
  const [selectedLayout, setSelectedLayout] = useState('atual');
  const [activePastaSection, setActivePastaSection] = useState('atendimentos');
  const [showVisaoGeral, setShowVisaoGeral] = useState(false);

  // Dados mockados para atendimentos
  const [atendimentos, setAtendimentos] = useState([
    { id: 1, data: '14/10/2021', situacao: 'Finalizado', relato: 'Est et aut dolor. Quibusdam un...', providencia: 'Petição inicial', assistido: 'BART SIMPSON', defensoria: '1ª DEFENSORIA PÚBLICA DE BAGÉ', formaAtendimento: 'Presencial' },
    { id: 2, data: '13/10/2021', situacao: 'Rascunho', relato: 'Quod quia sit. Ratione consequ...', providencia: 'Petição inicial', assistido: 'BART SIMPSON', defensoria: '1ª DEFENSORIA PÚBLICA DE BAGÉ', formaAtendimento: 'WhatsApp' }
  ]);
  const [atendimentosActivePage, setAtendimentosActivePage] = useState(1);
  const [atendimentosItemsPerPage, setAtendimentosItemsPerPage] = useState('5');

  return (
    <Flex gap={0} pb="xl">
      {/* Menu lateral */}
      <Box style={{ maxWidth: 250, height: '100%' }}>
        <Image
          src="/menulateral.png"
          alt="Menu Lateral"
          fit="contain"
          style={{ height: 'calc(100vh - 40px)', position: 'sticky', top: '20px' }}
        />
      </Box>

      {/* Conteúdo principal */}
      <Box style={{ flex: 1, paddingLeft: 24, paddingRight: 24 }}>
        <PastaHeader
          pastaData={pastaData}
          dadosLayout={selectedLayout}
          onSectionSelect={setActivePastaSection}
          showVisaoGeralButton={showVisaoGeral}
        />
        {/* Tabela de atendimentos reutilizada */}
        <AtendimentosPastaTable
          atendimentos={atendimentos}
          atendimentosActivePage={atendimentosActivePage}
          setAtendimentosActivePage={setAtendimentosActivePage}
          atendimentosItemsPerPage={atendimentosItemsPerPage}
          setAtendimentosItemsPerPage={setAtendimentosItemsPerPage}
          onEdit={() => {}}
        />
      </Box>
    </Flex>
  );
} 