'use client';

import React from 'react';
import { Group } from '@mantine/core';
import PastaActionButton from '../PastaActionButton/PastaActionButton'; // Importa o componente reutilizável
import {
  IconLayoutDashboard,
  IconStar,
  IconMail,
  IconFileDownload,
  IconCertificate,
  IconListCheck
} from '@tabler/icons-react';

const DefensoriaActionButtons = () => {
  const buttonsData = [
    {
      title: "Visão Geral",
      icon: IconLayoutDashboard,
      onClick: () => console.log("Visão Geral clicado")
    },
    {
      title: "Modelos e Favoritos",
      icon: IconStar,
      onClick: () => console.log("Modelos e Favoritos clicado")
    },
    {
      title: "Mensagens recebidas",
      icon: IconMail,
      onClick: () => console.log("Mensagens recebidas clicado")
    },
    {
      title: "Documentos recebidos",
      icon: IconFileDownload,
      onClick: () => console.log("Documentos recebidos clicado")
    },
    {
      title: "Certidões recebidas",
      icon: IconCertificate,
      onClick: () => console.log("Certidões recebidas clicado")
    },
    {
      title: "Assistidos atendidos",
      icon: IconListCheck,
      onClick: () => console.log("Assistidos atendidos clicado")
    }
  ];

  return (
    <Group justify="flex-start" gap="md" mb="xl" mt="md">
      {buttonsData.map((button) => (
        <PastaActionButton
          key={button.title}
          title={button.title}
          icon={button.icon}
          onClick={button.onClick}
          isActive={button.title === "Visão Geral"}
          // count e alert podem ser adicionados aqui se necessário no futuro
        />
      ))}
    </Group>
  );
};

export default DefensoriaActionButtons; 