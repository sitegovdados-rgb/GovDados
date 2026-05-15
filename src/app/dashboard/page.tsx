'use client'
import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts'

// ── Social Data ──────────────────────────────────────────────────────────────
const socialData = [
  { tarefa: "Parceria SESC/SENAC", regiao: "Jacarezinho e Manguinhos", responsavel: "SESC/SENAC", tipo: "Temporária", status: "Concluída", media: 0, total: 360 },
  { tarefa: "Ballet E-Florescer", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "E-Florescer", tipo: "Contínua", status: "Em execução", media: 25, total: 950 },
  { tarefa: "Desenvolve Mulher (2022)", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "Secretaria da Mulher (SEM)", tipo: "Temporária", status: "Concluída", media: 80, total: 723 },
  { tarefa: "Desenvolve Mulher (2022)", regiao: "Jacarezinho e Manguinhos", responsavel: "SEDSODH", tipo: "Temporária", status: "Concluída", media: 130, total: 1300 },
  { tarefa: "Desenvolve Mulher (2022)", regiao: "PPG", responsavel: "SEDSODH", tipo: "Temporária", status: "Concluída", media: 73, total: 733 },
  { tarefa: "Posto da AgeRio", regiao: "Jacarezinho e Manguinhos", responsavel: "SEDEICS", tipo: "Contínua", status: "Aguardando Informação", media: 0, total: 6000 },
  { tarefa: "Afrogames", regiao: "PPG", responsavel: "AfroReggae", tipo: "Contínua", status: "Em execução", media: 67, total: 0 },
  { tarefa: "SAMU - Atendimento do Posto", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SAMU", tipo: "Contínua", status: "Em execução", media: 0, total: 5000 },
  { tarefa: "Posto do Detran", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "Detran", tipo: "Contínua", status: "Em execução", media: 357, total: 16780 },
  { tarefa: "Passaporte Cultural", regiao: "Jacarezinho e Manguinhos", responsavel: "Secretaria de Cultura", tipo: "Contínua", status: "Em execução", media: 80, total: 2400 },
  { tarefa: "Cine Pipoca FUNARJ", regiao: "PPG", responsavel: "SECEC", tipo: "Esporádica", status: "Em execução", media: 0, total: 0 },
  { tarefa: "Programa Educação em Tempo Integral", regiao: "PPG", responsavel: "SEEDUC", tipo: "Contínua", status: "Em execução", media: 200, total: 4800 },
  { tarefa: "CAPSi", regiao: "Jacarezinho e Manguinhos", responsavel: "SMS", tipo: "Contínua", status: "Em execução", media: 150, total: 3600 },
  { tarefa: "UPA 24h Manguinhos", regiao: "Jacarezinho e Manguinhos", responsavel: "SMS", tipo: "Contínua", status: "Em execução", media: 800, total: 19200 },
  { tarefa: "CRAS Manguinhos", regiao: "Jacarezinho e Manguinhos", responsavel: "SMAS", tipo: "Contínua", status: "Em execução", media: 300, total: 7200 },
  { tarefa: "Reabilita 60+", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SES", tipo: "Temporária", status: "Concluída", media: 60, total: 480 },
  { tarefa: "Curso de Informática", regiao: "PPG", responsavel: "FAETEC", tipo: "Contínua", status: "Em execução", media: 40, total: 960 },
  { tarefa: "Bolsa Família Estadual", regiao: "PPG", responsavel: "SEDSODH", tipo: "Contínua", status: "Em execução", media: 500, total: 12000 },
  { tarefa: "Programa Mãe Coruja", regiao: "Jacarezinho e Manguinhos", responsavel: "SES", tipo: "Contínua", status: "Em execução", media: 120, total: 2880 },
  { tarefa: "Curso de Gastronomia", regiao: "PPG", responsavel: "SENAC", tipo: "Temporária", status: "Em execução", media: 30, total: 360 },
  { tarefa: "Projeto Esporte e Vida", regiao: "PPG", responsavel: "SEEC", tipo: "Contínua", status: "Em execução", media: 120, total: 2880 },
  { tarefa: "Ação de Saúde Mental", regiao: "PPG", responsavel: "SES", tipo: "Contínua", status: "Em execução", media: 85, total: 2040 },
  { tarefa: "Capacitação Profissional", regiao: "PPG", responsavel: "SEDSODH", tipo: "Contínua", status: "Em execução", media: 60, total: 1440 },
  { tarefa: "Atendimento Jurídico", regiao: "PPG", responsavel: "DPGE", tipo: "Contínua", status: "Em execução", media: 40, total: 960 },
  { tarefa: "Programa de Habitação", regiao: "PPG", responsavel: "SEHABEG", tipo: "Contínua", status: "Em execução", media: 75, total: 1800 },
  { tarefa: "Triagem Nutricional", regiao: "PPG", responsavel: "SES", tipo: "Esporádica", status: "Em execução", media: 0, total: 0 },
  { tarefa: "Oficina de Teatro", regiao: "PPG", responsavel: "SECEC", tipo: "Esporádica", status: "Em execução", media: 0, total: 0 },
  { tarefa: "Mutirão de Documentação", regiao: "PPG", responsavel: "DETRAN/SEDSODH", tipo: "Esporádica", status: "Em execução", media: 0, total: 0 },
  { tarefa: "UBS Móvel", regiao: "PPG", responsavel: "SES", tipo: "Contínua", status: "Em execução", media: 200, total: 4800 },
  { tarefa: "Programa Jovem Aprendiz", regiao: "PPG", responsavel: "SEDSODH", tipo: "Contínua", status: "Em execução", media: 45, total: 1080 },
  { tarefa: "Biblioteca Comunitária", regiao: "PPG", responsavel: "SECEC", tipo: "Contínua", status: "Em execução", media: 90, total: 2160 },
  { tarefa: "Atendimento Psicossocial", regiao: "PPG", responsavel: "SES", tipo: "Contínua", status: "Em execução", media: 55, total: 1320 },
  { tarefa: "Projeto Arte em Movimento", regiao: "PPG", responsavel: "SECEC", tipo: "Contínua", status: "Em execução", media: 70, total: 1680 },
  { tarefa: "CREAS PPG", regiao: "PPG", responsavel: "SMAS", tipo: "Contínua", status: "Em execução", media: 180, total: 4320 },
  { tarefa: "Saúde da Mulher", regiao: "PPG", responsavel: "SES", tipo: "Contínua", status: "Em execução", media: 95, total: 2280 },
  { tarefa: "Escola de Música", regiao: "PPG", responsavel: "SECEC", tipo: "Contínua", status: "Em execução", media: 50, total: 1200 },
  { tarefa: "Pré-Vestibular", regiao: "PPG", responsavel: "SEEDUC", tipo: "Contínua", status: "Em execução", media: 80, total: 1920 },
  { tarefa: "Projeto Ação Solidária", regiao: "PPG", responsavel: "SEDSODH", tipo: "Contínua", status: "Em execução", media: 110, total: 2640 },
  { tarefa: "Apoio a Microempreendedores", regiao: "PPG", responsavel: "SEDEICS", tipo: "Contínua", status: "Em execução", media: 30, total: 720 },
  { tarefa: "Serviço de Convivência", regiao: "PPG", responsavel: "SMAS", tipo: "Contínua", status: "Em execução", media: 130, total: 3120 },
  { tarefa: "Atendimento Odontológico", regiao: "PPG", responsavel: "SES", tipo: "Contínua", status: "Em execução", media: 120, total: 2880 },
  { tarefa: "Cursos Técnicos FAETEC", regiao: "PPG", responsavel: "FAETEC", tipo: "Contínua", status: "Em execução", media: 55, total: 1320 },
  { tarefa: "Projeto Inclusão Digital", regiao: "PPG", responsavel: "SEDEICS", tipo: "Contínua", status: "Em execução", media: 40, total: 960 },
  { tarefa: "Ação Cultural Itinerante", regiao: "PPG", responsavel: "SECEC", tipo: "Esporádica", status: "Em execução", media: 0, total: 0 },
  { tarefa: "Vigilância em Saúde", regiao: "PPG", responsavel: "SES", tipo: "Contínua", status: "Em execução", media: 150, total: 3600 },
  { tarefa: "Feirão de Empregos", regiao: "PPG", responsavel: "SEDEICS", tipo: "Esporádica", status: "Concluída", media: 0, total: 500 },
  { tarefa: "Programa Criança Feliz", regiao: "PPG", responsavel: "SMAS", tipo: "Contínua", status: "Em execução", media: 75, total: 1800 },
  { tarefa: "Acupuntura e Práticas Integrativas", regiao: "PPG", responsavel: "SES", tipo: "Contínua", status: "Em execução", media: 35, total: 840 },
  { tarefa: "Atendimento Veterinário", regiao: "PPG", responsavel: "SEAPPA", tipo: "Esporádica", status: "Em execução", media: 0, total: 0 },
  { tarefa: "Formação de Agentes Comunitários", regiao: "PPG", responsavel: "SES", tipo: "Temporária", status: "Concluída", media: 40, total: 120 },
  { tarefa: "Programa Recomeço", regiao: "PPG", responsavel: "SEDSODH", tipo: "Contínua", status: "Bloqueada", media: 0, total: 0 },
  { tarefa: "Abastecimento Alimentar", regiao: "PPG", responsavel: "SEAPPA", tipo: "Contínua", status: "Em execução", media: 200, total: 4800 },
  { tarefa: "Posto Banco do Povo", regiao: "PPG", responsavel: "SEDEICS", tipo: "Contínua", status: "Em execução", media: 60, total: 1440 },
  { tarefa: "Programa Acesso ao Esporte", regiao: "PPG", responsavel: "SEEC", tipo: "Contínua", status: "Em execução", media: 90, total: 2160 },
  { tarefa: "Oficina de Artesanato", regiao: "PPG", responsavel: "SMAS", tipo: "Contínua", status: "Em execução", media: 45, total: 1080 },
  { tarefa: "Projeto Dança Contemporânea", regiao: "PPG", responsavel: "SECEC", tipo: "Contínua", status: "Em execução", media: 30, total: 720 },
  { tarefa: "Regularização Fundiária", regiao: "PPG", responsavel: "SEHABEG", tipo: "Contínua", status: "Bloqueada", media: 0, total: 0 },
  { tarefa: "Acompanhamento de Beneficiários", regiao: "PPG", responsavel: "SEDSODH", tipo: "Contínua", status: "Em execução", media: 250, total: 6000 },
  { tarefa: "Capacitação de Professores", regiao: "PPG", responsavel: "SEEDUC", tipo: "Temporária", status: "Concluída", media: 80, total: 240 },
  { tarefa: "Distribuição de Cestas Básicas", regiao: "PPG", responsavel: "SEDSODH", tipo: "Esporádica", status: "Em execução", media: 0, total: 0 },
  { tarefa: "CAPS AD", regiao: "Jacarezinho e Manguinhos", responsavel: "SMS", tipo: "Contínua", status: "Em execução", media: 180, total: 4320 },
  { tarefa: "Escola de Futebol", regiao: "Jacarezinho e Manguinhos", responsavel: "SEEC", tipo: "Contínua", status: "Em execução", media: 60, total: 1440 },
  { tarefa: "Projeto Leitura Comunitária", regiao: "Jacarezinho e Manguinhos", responsavel: "SECEC", tipo: "Contínua", status: "Em execução", media: 40, total: 960 },
  { tarefa: "Centro de Referência da Mulher", regiao: "Jacarezinho e Manguinhos", responsavel: "SEM", tipo: "Contínua", status: "Em execução", media: 90, total: 2160 },
  { tarefa: "Ação de Vacinação", regiao: "Jacarezinho e Manguinhos", responsavel: "SMS", tipo: "Esporádica", status: "Em execução", media: 0, total: 0 },
  { tarefa: "Oficina de Computação", regiao: "Jacarezinho e Manguinhos", responsavel: "FAETEC", tipo: "Contínua", status: "Em execução", media: 35, total: 840 },
  { tarefa: "Acompanhamento Escolar", regiao: "Jacarezinho e Manguinhos", responsavel: "SEEDUC", tipo: "Contínua", status: "Em execução", media: 120, total: 2880 },
  { tarefa: "Atendimento Jurídico Manguinhos", regiao: "Jacarezinho e Manguinhos", responsavel: "DPGE", tipo: "Contínua", status: "Em execução", media: 50, total: 1200 },
  { tarefa: "Projeto Manguinhos em Ação", regiao: "Jacarezinho e Manguinhos", responsavel: "SEDSODH", tipo: "Contínua", status: "Em execução", media: 100, total: 2400 },
  { tarefa: "UBS Jacarezinho", regiao: "Jacarezinho e Manguinhos", responsavel: "SMS", tipo: "Contínua", status: "Em execução", media: 350, total: 8400 },
  { tarefa: "Programa Renda Minha", regiao: "Jacarezinho e Manguinhos", responsavel: "SEDSODH", tipo: "Contínua", status: "Em execução", media: 200, total: 4800 },
  { tarefa: "Creche Comunitária Apoiada", regiao: "Jacarezinho e Manguinhos", responsavel: "SEEDUC", tipo: "Contínua", status: "Em execução", media: 80, total: 1920 },
  { tarefa: "CRAS Jacarezinho", regiao: "Jacarezinho e Manguinhos", responsavel: "SMAS", tipo: "Contínua", status: "Em execução", media: 250, total: 6000 },
  { tarefa: "Centro de Saúde Mental", regiao: "Jacarezinho e Manguinhos", responsavel: "SMS", tipo: "Contínua", status: "Em execução", media: 100, total: 2400 },
  { tarefa: "Projeto Emprego Já", regiao: "Jacarezinho e Manguinhos", responsavel: "SEDEICS", tipo: "Temporária", status: "Concluída", media: 70, total: 420 },
  { tarefa: "Ação de Regularização de Documentos", regiao: "Jacarezinho e Manguinhos", responsavel: "DETRAN", tipo: "Esporádica", status: "Em execução", media: 0, total: 0 },
  { tarefa: "Vigilância Epidemiológica", regiao: "Jacarezinho e Manguinhos", responsavel: "SMS", tipo: "Contínua", status: "Em execução", media: 120, total: 2880 },
  { tarefa: "Programa Saúde na Escola", regiao: "Jacarezinho e Manguinhos", responsavel: "SES/SEEDUC", tipo: "Contínua", status: "Em execução", media: 90, total: 2160 },
  { tarefa: "Oficina de Costura", regiao: "Jacarezinho e Manguinhos", responsavel: "SMAS", tipo: "Contínua", status: "Em execução", media: 30, total: 720 },
  { tarefa: "Projeto Comunidade Digital", regiao: "Jacarezinho e Manguinhos", responsavel: "SEDEICS", tipo: "Contínua", status: "Bloqueada", media: 0, total: 0 },
  { tarefa: "Ação de Prevenção às Drogas", regiao: "Jacarezinho e Manguinhos", responsavel: "SEDSODH", tipo: "Contínua", status: "Em execução", media: 80, total: 1920 },
  { tarefa: "Projeto Arte Jovem", regiao: "Jacarezinho e Manguinhos", responsavel: "SECEC", tipo: "Contínua", status: "Em execução", media: 55, total: 1320 },
  { tarefa: "Atenção Básica Itinerante", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SES", tipo: "Contínua", status: "Em execução", media: 150, total: 3600 },
  { tarefa: "Programa Família Saudável", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SES", tipo: "Contínua", status: "Em execução", media: 120, total: 2880 },
  { tarefa: "Cursinho Pré-ENEM", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SEEDUC", tipo: "Temporária", status: "Concluída", media: 60, total: 360 },
  { tarefa: "Atendimento de Assistência Social", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SMAS", tipo: "Contínua", status: "Em execução", media: 90, total: 2160 },
  { tarefa: "Projeto Empreender", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SEDEICS", tipo: "Contínua", status: "Em execução", media: 40, total: 960 },
  { tarefa: "Centro de Convivência do Idoso", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SMAS", tipo: "Contínua", status: "Em execução", media: 70, total: 1680 },
  { tarefa: "Distribuição de Medicamentos", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SES", tipo: "Contínua", status: "Em execução", media: 200, total: 4800 },
  { tarefa: "CRAS Rio das Pedras", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SMAS", tipo: "Contínua", status: "Em execução", media: 220, total: 5280 },
  { tarefa: "Programa Rio Sem Fome", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SEDSODH", tipo: "Contínua", status: "Aguardando Informação", media: 0, total: 0 },
  { tarefa: "Ação de Prevenção ao Câncer", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SES", tipo: "Esporádica", status: "Em execução", media: 0, total: 0 },
  { tarefa: "Oficina de Culinária", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SENAC", tipo: "Temporária", status: "Em execução", media: 25, total: 300 },
  { tarefa: "Programa Jovem do Futuro", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SEEDUC", tipo: "Contínua", status: "Em execução", media: 80, total: 1920 },
  { tarefa: "Atendimento de Saúde Bucal", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SES", tipo: "Contínua", status: "Em execução", media: 100, total: 2400 },
  { tarefa: "Projeto Esporte Comunitário", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SEEC", tipo: "Contínua", status: "Em execução", media: 60, total: 1440 },
  { tarefa: "Núcleo de Cidadania", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SEDSODH", tipo: "Contínua", status: "Em execução", media: 45, total: 1080 },
  { tarefa: "Vacinação Itinerante", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SES", tipo: "Esporádica", status: "Em execução", media: 0, total: 0 },
  { tarefa: "Apoio à Primeira Infância", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SMAS", tipo: "Contínua", status: "Em execução", media: 55, total: 1320 },
  { tarefa: "Projeto Inclusão Financeira", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SEDEICS", tipo: "Contínua", status: "Em execução", media: 30, total: 720 },
  { tarefa: "Saúde do Trabalhador", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SES", tipo: "Contínua", status: "Em execução", media: 70, total: 1680 },
  { tarefa: "Atendimento de Habitação", regiao: "Corredor Itanhangá / Rio das Pedras", responsavel: "SEHABEG", tipo: "Contínua", status: "Em execução", media: 40, total: 960 },
]

// ── Urbanismo table data ──────────────────────────────────────────────────────
const urbanismoRows = [
  { projeto: "Centro de Monitoramento PPG", demandante: "SEOP", territorio: "PPG", tipologia: "Corporativo ou Administrativo", status: "Concluído", inicio: "2022-03", fim: "2023-06" },
  { projeto: "Reforma da Praça Saens Peña", demandante: "SEOP", territorio: "PPG", tipologia: "Urbanismo", status: "Concluído", inicio: "2022-06", fim: "2023-09" },
  { projeto: "Batalhão PM Jacarezinho", demandante: "SEOP", territorio: "Jacarezinho e Manguinhos", tipologia: "Corporativo ou Administrativo", status: "Concluído", inicio: "2022-04", fim: "2023-08" },
  { projeto: "Centro Cultural Manguinhos", demandante: "SECEC", territorio: "Jacarezinho e Manguinhos", tipologia: "Cultural", status: "Em execução", inicio: "2023-01", fim: "2025-12" },
  { projeto: "UPA Rio das Pedras", demandante: "SES", territorio: "Corredor Itanhangá / Rio das Pedras", tipologia: "Hospitalar", status: "Em execução", inicio: "2023-03", fim: "2025-06" },
  { projeto: "Escola Municipal Itanhangá", demandante: "SEEDUC", territorio: "Corredor Itanhangá / Rio das Pedras", tipologia: "Educacional", status: "Concluído", inicio: "2022-08", fim: "2023-12" },
  { projeto: "Praça da Paz - Manguinhos", demandante: "SEOP", territorio: "Jacarezinho e Manguinhos", tipologia: "Urbanismo", status: "Concluído", inicio: "2022-05", fim: "2023-07" },
  { projeto: "CRAS Rio das Pedras", demandante: "SMAS", territorio: "Corredor Itanhangá / Rio das Pedras", tipologia: "Assistencial", status: "Concluído", inicio: "2022-09", fim: "2023-11" },
  { projeto: "Centro Administrativo PPG", demandante: "SEOP", territorio: "PPG", tipologia: "Corporativo ou Administrativo", status: "Aguardando Aprovação", inicio: "2024-01", fim: "2025-06" },
  { projeto: "Quadra Poliesportiva Jacarezinho", demandante: "SEEC", territorio: "Jacarezinho e Manguinhos", tipologia: "Esportivo", status: "Em execução", inicio: "2023-06", fim: "2025-03" },
  { projeto: "Biblioteca Comunitária PPG", demandante: "SECEC", territorio: "PPG", tipologia: "Cultural", status: "Concluído", inicio: "2022-11", fim: "2024-02" },
  { projeto: "Centro de Saúde Mental Manguinhos", demandante: "SMS", territorio: "Jacarezinho e Manguinhos", tipologia: "Hospitalar", status: "Aguardando Revisão", inicio: "2024-02", fim: "2025-08" },
  { projeto: "Requalificação Viária Rio das Pedras", demandante: "SEOP", territorio: "Corredor Itanhangá / Rio das Pedras", tipologia: "Urbanismo", status: "Em execução", inicio: "2023-07", fim: "2026-01" },
  { projeto: "Centro de Formação Profissional PPG", demandante: "FAETEC", territorio: "PPG", tipologia: "Educacional", status: "Concluído", inicio: "2022-10", fim: "2024-03" },
  { projeto: "Unidade Habitacional Jacarezinho", demandante: "SEHABEG", territorio: "Jacarezinho e Manguinhos", tipologia: "Institucional", status: "Em execução", inicio: "2023-05", fim: "2026-06" },
  { projeto: "Parque Linear Itanhangá", demandante: "SEOP", territorio: "Corredor Itanhangá / Rio das Pedras", tipologia: "Recreativo", status: "Aguardando Aprovação", inicio: "2024-03", fim: "2026-09" },
  { projeto: "Centro Comunitário Manguinhos", demandante: "SMAS", territorio: "Jacarezinho e Manguinhos", tipologia: "Assistencial", status: "Concluído", inicio: "2022-07", fim: "2023-10" },
  { projeto: "Posto Policial PPG", demandante: "SEOP", territorio: "PPG", tipologia: "Corporativo ou Administrativo", status: "Concluído", inicio: "2022-03", fim: "2023-05" },
  { projeto: "Academia ao Ar Livre Rio das Pedras", demandante: "SEEC", territorio: "Corredor Itanhangá / Rio das Pedras", tipologia: "Esportivo", status: "Concluído", inicio: "2022-12", fim: "2024-01" },
  { projeto: "CRAS Jacarezinho Ampliação", demandante: "SMAS", territorio: "Jacarezinho e Manguinhos", tipologia: "Assistencial", status: "Suspenso", inicio: "2023-09", fim: "2025-12" },
]

// ── Chart data constants ──────────────────────────────────────────────────────
const statusUrbData = [
  { name: "Concluído", value: 121, color: "#22c55e" },
  { name: "Aguardando Aprovação", value: 42, color: "#60a5fa" },
  { name: "Em execução", value: 29, color: "#2563a8" },
  { name: "Cancelado", value: 12, color: "#ef4444" },
  { name: "Aguardando Revisão", value: 11, color: "#a78bfa" },
  { name: "Suspenso", value: 8, color: "#94a3b8" },
  { name: "Não iniciado", value: 8, color: "#cbd5e1" },
]

const tipologiaUrbData = [
  { name: "Corporativo ou Administrativo", value: 65 },
  { name: "Institucional", value: 39 },
  { name: "Urbanismo", value: 32 },
  { name: "Cultural", value: 30 },
  { name: "Assistencial", value: 17 },
  { name: "Educacional", value: 11 },
  { name: "Esportivo", value: 9 },
  { name: "Recreativo", value: 7 },
  { name: "Hospitalar", value: 6 },
  { name: "Outros", value: 15 },
]

const territorioUrbData = [
  { name: "Outros", value: 141 },
  { name: "PPG", value: 40 },
  { name: "Corredor Itanhangá / Rio das Pedras", value: 25 },
  { name: "Jacarezinho e Manguinhos", value: 25 },
]

const grauUrbData = [
  { name: "Reabilitação/Reforma Parcial", value: 88 },
  { name: "Nova Edificação", value: 75 },
  { name: "Remodelação/Reforma Total", value: 49 },
  { name: "Outros", value: 19 },
]

const subtipologiaData = [
  { name: "Centro de Monitoramento", value: 65 },
  { name: "Outros", value: 77 },
  { name: "Centro Cultural", value: 23 },
  { name: "Praça", value: 17 },
  { name: "Batalhão", value: 16 },
  { name: "Centro Assistencial", value: 12 },
  { name: "Centro Administrativo", value: 11 },
  { name: "Centro Comunitário", value: 10 },
].sort((a, b) => b.value - a.value).slice(0, 8)

const PIE_COLORS = ['#1a2a5e','#2563a8','#00a8cc','#3b82f6','#7c3aed','#0891b2','#0284c7','#1d4ed8','#4338ca','#6366f1']

const customTooltipStyle = {
  backgroundColor: '#1a2a5e',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 8,
  color: 'white',
  fontFamily: 'Plus Jakarta Sans',
  fontSize: '0.8rem',
  padding: '8px 12px',
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={customTooltipStyle}>
      {label && <p style={{ marginBottom: 4, fontWeight: 600 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || '#00a8cc' }}>{p.name}: <strong>{p.value.toLocaleString('pt-BR')}</strong></p>
      ))}
    </div>
  )
}

// ── Status badge colors ───────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    'Em execução':         { bg: '#dbeafe', color: '#1d4ed8' },
    'Concluída':           { bg: '#dcfce7', color: '#15803d' },
    'Concluído':           { bg: '#dcfce7', color: '#15803d' },
    'Bloqueada':           { bg: '#fee2e2', color: '#b91c1c' },
    'Aguardando Informação':{ bg: '#fef3c7', color: '#92400e' },
    'Aguardando Aprovação':{ bg: '#e0f2fe', color: '#0369a1' },
    'Aguardando Revisão':  { bg: '#ede9fe', color: '#6d28d9' },
    'Suspenso':            { bg: '#f1f5f9', color: '#475569' },
    'Cancelado':           { bg: '#fee2e2', color: '#b91c1c' },
    'Não iniciado':        { bg: '#f8fafc', color: '#94a3b8' },
  }
  const s = map[status] || { bg: '#f1f5f9', color: '#64748b' }
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontFamily: 'JetBrains Mono', fontSize: '0.6rem',
      textTransform: 'uppercase', letterSpacing: '0.06em',
      padding: '3px 8px', borderRadius: 4, display: 'inline-block',
    }}>{status}</span>
  )
}

// ── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{
      background: '#1a2a5e', borderRadius: 12, padding: '20px 24px',
      color: 'white', flex: 1, minWidth: 160,
    }}>
      <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{label}</p>
      <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 500, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#00a8cc', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>{sub}</p>}
    </div>
  )
}

// ── Dropdown filter ───────────────────────────────────────────────────────────
function FilterSelect({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void
}) {
  return (
    <div>
      <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4a5f8a', display: 'block', marginBottom: 4 }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem',
          padding: '8px 12px', borderRadius: 8,
          border: '1px solid #d4dff0', background: 'white', color: '#0f1d3d',
          minWidth: 200, cursor: 'pointer',
        }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

// ── Chart section wrapper ─────────────────────────────────────────────────────
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', borderRadius: 12, border: '1px solid #d4dff0', padding: '20px 24px' }}>
      <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: '#0f1d3d', marginBottom: 16 }}>{title}</p>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD SOCIAL
// ─────────────────────────────────────────────────────────────────────────────
function DashboardSocial() {
  const [territorio, setTerritorio] = useState('Todos')
  const [statusFiltro, setStatusFiltro] = useState('Todos')
  const [busca, setBusca] = useState('')
  const [pagina, setPagina] = useState(1)

  const filtered = useMemo(() => {
    return socialData.filter(d => {
      if (territorio !== 'Todos' && d.regiao !== territorio) return false
      if (statusFiltro !== 'Todos' && d.status !== statusFiltro) return false
      if (busca && !d.tarefa.toLowerCase().includes(busca.toLowerCase()) &&
          !d.responsavel.toLowerCase().includes(busca.toLowerCase())) return false
      return true
    })
  }, [territorio, statusFiltro, busca])

  const statusChart = useMemo(() => {
    const map: Record<string, number> = {}
    filtered.forEach(d => { map[d.status] = (map[d.status] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [filtered])

  const tipoChart = useMemo(() => {
    const map: Record<string, number> = {}
    filtered.forEach(d => { map[d.tipo] = (map[d.tipo] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [filtered])

  const regiaoChart = useMemo(() => {
    const map: Record<string, number> = {}
    filtered.forEach(d => { map[d.regiao] = (map[d.regiao] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [filtered])

  const statusColors: Record<string, string> = {
    'Em execução': '#2563a8',
    'Concluída': '#00a8cc',
    'Bloqueada': '#e53e3e',
    'Aguardando Informação': '#ed8936',
  }

  const POR_PAGINA = 10
  const totalPaginas = Math.ceil(filtered.length / POR_PAGINA)
  const paginated = filtered.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPIs */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <KpiCard label="Total de Ações" value="115" sub="ações mapeadas no PCI" />
        <KpiCard label="Em Execução" value="100" sub="ações ativas" />
        <KpiCard label="Pessoas Atendidas" value="224.572" sub="total acumulado" />
        <KpiCard label="Média Mensal" value="7.441" sub="atendimentos/mês" />
      </div>

      {/* Filtros */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #d4dff0', padding: '16px 24px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <FilterSelect
          label="Território"
          value={territorio}
          options={['Todos', 'PPG', 'Jacarezinho e Manguinhos', 'Corredor Itanhangá / Rio das Pedras']}
          onChange={v => { setTerritorio(v); setPagina(1) }}
        />
        <FilterSelect
          label="Status"
          value={statusFiltro}
          options={['Todos', 'Em execução', 'Concluída', 'Bloqueada', 'Aguardando Informação']}
          onChange={v => { setStatusFiltro(v); setPagina(1) }}
        />
        <div>
          <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4a5f8a', display: 'block', marginBottom: 4 }}>Busca</label>
          <input
            value={busca}
            onChange={e => { setBusca(e.target.value); setPagina(1) }}
            placeholder="Ação ou responsável..."
            style={{
              fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem',
              padding: '8px 12px', borderRadius: 8,
              border: '1px solid #d4dff0', outline: 'none', minWidth: 220, color: '#0f1d3d',
            }}
          />
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <ChartCard title="Status das Ações">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusChart} layout="vertical" margin={{ left: 8, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis type="number" tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#8fa3c8' }} />
              <YAxis dataKey="name" type="category" width={160} tick={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fill: '#4a5f8a' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Ações" radius={[0, 4, 4, 0]}>
                {statusChart.map((entry, i) => (
                  <Cell key={i} fill={statusColors[entry.name] || '#8fa3c8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tipo de Ação">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={tipoChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {tipoChart.map((_, i) => (
                  <Cell key={i} fill={['#1a2a5e','#2563a8','#00a8cc'][i % 3]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Por Território">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regiaoChart} layout="vertical" margin={{ left: 8, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis type="number" tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#8fa3c8' }} />
              <YAxis dataKey="name" type="category" width={190} tick={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fill: '#4a5f8a' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Ações" radius={[0, 4, 4, 0]}>
                {regiaoChart.map((_, i) => (
                  <Cell key={i} fill={['#1a2a5e','#2563a8','#00a8cc'][i % 3]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tabela */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #d4dff0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #d4dff0' }}>
          <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: '#0f1d3d' }}>
            Ações Sociais
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#8fa3c8', marginLeft: 8 }}>({filtered.length} registros)</span>
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f7fc' }}>
                {['Ação', 'Território', 'Responsável', 'Tipo', 'Status', 'Total Atendidos'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4a5f8a', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((d, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f0f4f8' }}>
                  <td style={{ padding: '10px 16px', fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', color: '#0f1d3d', maxWidth: 240 }}>{d.tarefa}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: '#4a5f8a', whiteSpace: 'nowrap' }}>{d.regiao}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: '#4a5f8a' }}>{d.responsavel}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '3px 8px', borderRadius: 4, background: '#e8f4fa', color: '#2563a8' }}>{d.tipo}</span>
                  </td>
                  <td style={{ padding: '10px 16px' }}><StatusBadge status={d.status} /></td>
                  <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: '#0f1d3d', textAlign: 'right' }}>{d.total > 0 ? d.total.toLocaleString('pt-BR') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPaginas > 1 && (
          <div style={{ padding: '12px 24px', borderTop: '1px solid #f0f4f8', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #d4dff0', background: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', cursor: pagina === 1 ? 'not-allowed' : 'pointer', color: '#4a5f8a', opacity: pagina === 1 ? 0.4 : 1 }}>‹ Anterior</button>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#8fa3c8' }}>{pagina} / {totalPaginas}</span>
            <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #d4dff0', background: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', cursor: pagina === totalPaginas ? 'not-allowed' : 'pointer', color: '#4a5f8a', opacity: pagina === totalPaginas ? 0.4 : 1 }}>Próxima ›</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD URBANISMO
// ─────────────────────────────────────────────────────────────────────────────
function DashboardUrbanismo() {
  const [territorio, setTerritorio] = useState('Todos')
  const [tipologia, setTipologia] = useState('Todos')
  const [statusFiltro, setStatusFiltro] = useState('Todos')
  const [busca, setBusca] = useState('')
  const [pagina, setPagina] = useState(1)

  const filteredRows = useMemo(() => {
    return urbanismoRows.filter(d => {
      if (territorio !== 'Todos' && d.territorio !== territorio) return false
      if (tipologia !== 'Todos' && d.tipologia !== tipologia) return false
      if (statusFiltro !== 'Todos' && d.status !== statusFiltro) return false
      if (busca && !d.projeto.toLowerCase().includes(busca.toLowerCase()) &&
          !d.demandante.toLowerCase().includes(busca.toLowerCase())) return false
      return true
    })
  }, [territorio, tipologia, statusFiltro, busca])

  const POR_PAGINA = 10
  const totalPaginas = Math.ceil(filteredRows.length / POR_PAGINA)
  const paginated = filteredRows.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPIs */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <KpiCard label="Total de Projetos" value="231" sub="intervenções registradas" />
        <KpiCard label="Concluídos" value="121" sub="projetos entregues" />
        <KpiCard label="Em Execução" value="29" sub="obras ativas" />
        <KpiCard label="Municípios Atendidos" value="40" sub="municípios do RJ" />
      </div>

      {/* Filtros */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #d4dff0', padding: '16px 24px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <FilterSelect
          label="Território"
          value={territorio}
          options={['Todos', 'PPG', 'Jacarezinho e Manguinhos', 'Corredor Itanhangá / Rio das Pedras', 'Outros']}
          onChange={v => { setTerritorio(v); setPagina(1) }}
        />
        <FilterSelect
          label="Tipologia"
          value={tipologia}
          options={['Todos', 'Corporativo ou Administrativo', 'Institucional', 'Urbanismo', 'Cultural', 'Assistencial', 'Educacional', 'Esportivo', 'Recreativo', 'Hospitalar', 'Outros']}
          onChange={v => { setTipologia(v); setPagina(1) }}
        />
        <FilterSelect
          label="Status"
          value={statusFiltro}
          options={['Todos', 'Concluído', 'Em execução', 'Aguardando Aprovação', 'Aguardando Revisão', 'Suspenso', 'Cancelado', 'Não iniciado']}
          onChange={v => { setStatusFiltro(v); setPagina(1) }}
        />
        <div>
          <label style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4a5f8a', display: 'block', marginBottom: 4 }}>Busca</label>
          <input
            value={busca}
            onChange={e => { setBusca(e.target.value); setPagina(1) }}
            placeholder="Projeto ou demandante..."
            style={{
              fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem',
              padding: '8px 12px', borderRadius: 8,
              border: '1px solid #d4dff0', outline: 'none', minWidth: 220, color: '#0f1d3d',
            }}
          />
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <ChartCard title="Status dos Projetos">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusUrbData} margin={{ left: 8, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis dataKey="name" tick={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fill: '#4a5f8a' }} angle={-30} textAnchor="end" interval={0} height={70} />
              <YAxis tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#8fa3c8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Projetos" radius={[4, 4, 0, 0]}>
                {statusUrbData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tipologia do Projeto">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={tipologiaUrbData} dataKey="value" nameKey="name" cx="40%" cy="50%" innerRadius={55} outerRadius={100}>
                {tipologiaUrbData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" iconSize={8}
                formatter={(value) => <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.72rem', color: '#4a5f8a' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Grau de Intervenção">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={grauUrbData} margin={{ left: 8, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis dataKey="name" tick={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fill: '#4a5f8a' }} angle={-20} textAnchor="end" interval={0} height={60} />
              <YAxis tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#8fa3c8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Projetos" fill="#2563a8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Subtipologias">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subtipologiaData} layout="vertical" margin={{ left: 8, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis type="number" tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: '#8fa3c8' }} />
              <YAxis dataKey="name" type="category" width={170} tick={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fill: '#4a5f8a' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Projetos" fill="#00a8cc" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tabela */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #d4dff0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #d4dff0' }}>
          <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '0.9rem', color: '#0f1d3d' }}>
            Projetos Urbanísticos
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#8fa3c8', marginLeft: 8 }}>({filteredRows.length} registros)</span>
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f7fc' }}>
                {['Projeto', 'Demandante', 'Território', 'Tipologia', 'Status', 'Início', 'Fim'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4a5f8a', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((d, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f0f4f8' }}>
                  <td style={{ padding: '10px 16px', fontFamily: 'Plus Jakarta Sans', fontSize: '0.82rem', color: '#0f1d3d', maxWidth: 240 }}>{d.projeto}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: '#4a5f8a' }}>{d.demandante}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', color: '#4a5f8a', whiteSpace: 'nowrap' }}>{d.territorio}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '3px 8px', borderRadius: 4, background: '#e8f4fa', color: '#2563a8' }}>{d.tipologia}</span>
                  </td>
                  <td style={{ padding: '10px 16px' }}><StatusBadge status={d.status} /></td>
                  <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#4a5f8a' }}>{d.inicio}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#4a5f8a' }}>{d.fim}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPaginas > 1 && (
          <div style={{ padding: '12px 24px', borderTop: '1px solid #f0f4f8', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #d4dff0', background: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', cursor: pagina === 1 ? 'not-allowed' : 'pointer', color: '#4a5f8a', opacity: pagina === 1 ? 0.4 : 1 }}>‹ Anterior</button>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#8fa3c8' }}>{pagina} / {totalPaginas}</span>
            <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #d4dff0', background: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: '0.78rem', cursor: pagina === totalPaginas ? 'not-allowed' : 'pointer', color: '#4a5f8a', opacity: pagina === totalPaginas ? 0.4 : 1 }}>Próxima ›</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [aba, setAba] = useState<'social' | 'urbanismo'>('social')

  return (
    <div style={{ background: '#f5f7fc', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, #1a2a5e 0%, #1e3a8a 100%)', color: 'white', borderBottom: '3px solid #00a8cc' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '3px 10px', borderRadius: 4, display: 'inline-block', marginBottom: 12 }}>
            Dashboard · PCI
          </span>
          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', lineHeight: 1.1, marginBottom: 8 }}>
            Painel de Dados — PCI
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', maxWidth: 560, lineHeight: 1.7, marginBottom: 4 }}>
            Ações sociais e projetos de urbanismo do Programa Cidade Integrada
          </p>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Última atualização: 15 de maio de 2026
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid #d4dff0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ display: 'flex', gap: 0 }}>
            {(['social', 'urbanismo'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setAba(tab)}
                style={{
                  fontFamily: 'Plus Jakarta Sans', fontWeight: aba === tab ? 700 : 500,
                  fontSize: '0.9rem', padding: '14px 28px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: aba === tab ? '#1a2a5e' : '#8fa3c8',
                  borderBottom: aba === tab ? '3px solid #00a8cc' : '3px solid transparent',
                  transition: 'all 0.15s',
                  textTransform: 'capitalize',
                }}
              >
                {tab === 'social' ? '📊 Social' : '🏗️ Urbanismo'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {aba === 'social' ? <DashboardSocial /> : <DashboardUrbanismo />}
      </div>
    </div>
  )
}
