'use client';

import { Box, Image } from '@mantine/core';

export default function IntimacoesPage() {
  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '20px'
      }}
    >
      <a href="/historico-atividades" style={{ textDecoration: 'none' }}>
        <Image
          src="/atintimacoes.jpg"
          alt="Página de Intimações"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer'
          }}
        />
      </a>
    </Box>
  );
}
