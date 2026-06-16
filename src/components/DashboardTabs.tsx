'use client'

import { useState } from 'react'
import DashboardEmbed from './DashboardEmbed'
import type { DashboardUrls } from '@/config/dashboards'

type Aba = 'monitoramentoJunho' | 'social' | 'urbanismo' | 'sociograficos' | 'diagnostico'

interface Props {
  abas?: Aba[]
  urls?: DashboardUrls
}

const allTabs = [
  {
    id: 'monitoramentoJunho' as Aba,
    label: 'Monitoramento Junho',
    icon: '📅',
    description: 'Painel de monitoramento do mês de junho do Programa Cidade Integrada.',
  },
  {
    id: 'social' as Aba,
    label: 'Programas Sociais',
    icon: '👥',
    description: 'Ações e serviços sociais do Programa Cidade Integrada nos territórios do Rio de Janeiro.',
  },
  {
    id: 'urbanismo' as Aba,
    label: 'Urbanismo',
    icon: '🏗️',
    description: 'Projetos arquitetônicos e intervenções urbanísticas do Programa Cidade Integrada.',
  },
  {
    id: 'sociograficos' as Aba,
    label: 'Dados Sociográficos',
    icon: '📊',
    description: 'Indicadores sociográficos e dados demográficos dos territórios do Programa Cidade Integrada.',
  },
  {
    id: 'diagnostico' as Aba,
    label: 'Diagnóstico',
    icon: '📋',
    description: 'Diagnóstico territorial do Cinturão de Jacarepaguá.',
  },
]

export default function DashboardTabs({ abas, urls }: Props) {
  const tabs = (abas ? allTabs.filter(t => abas.includes(t.id)) : allTabs)
    .filter(t => t.id !== 'monitoramentoJunho' || !!urls?.monitoramentoJunho)
    .filter(t => t.id !== 'diagnostico' || !!urls?.diagnostico)
  const [activeTab, setActiveTab] = useState<Aba>(tabs[0].id)

  return (
    <section style={{ background: 'var(--pci-light)', borderTop: '1px solid var(--pci-border)', borderBottom: '1px solid var(--pci-border)' }}>
      <style>{`
        .dashboard-tabs-container {
          padding-top: 56px;
          padding-bottom: 56px;
        }
        .dashboard-tabs-header {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          margin-bottom: 32px;
        }
        .dashboard-tabs-list {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid var(--pci-border);
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .dashboard-tab-button {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          padding: 16px 24px;
          border: none;
          background: transparent;
          color: var(--pci-dim);
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 3px solid transparent;
          margin-bottom: -1px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }
        .dashboard-tab-button:hover {
          color: var(--pci-navy);
        }
        .dashboard-tab-button.active {
          color: var(--pci-navy);
          border-bottom-color: var(--pci-cyan);
        }
        .dashboard-tab-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0.7; }
          to { opacity: 1; }
        }
      `}</style>

      <div className="dashboard-tabs-container">
        <div className="dashboard-tabs-header">
          <div className="pci-accent-line" />
          <ul className="dashboard-tabs-list">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`dashboard-tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  aria-selected={activeTab === tab.id}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 16 }}>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.88rem', color: 'var(--pci-dim)', margin: 0 }}>
              {tabs.find((t) => t.id === activeTab)?.description}
            </p>
          </div>
        </div>

        <div className="dashboard-tab-content">
          {activeTab === 'monitoramentoJunho' && <DashboardEmbed tipo="social" src={urls?.monitoramentoJunho} />}
          {activeTab === 'social' && <DashboardEmbed tipo="social" src={urls?.social} />}
          {activeTab === 'urbanismo' && <DashboardEmbed tipo="urbanismo" src={urls?.urbanismo} />}
          {activeTab === 'sociograficos' && <DashboardEmbed tipo="social" src={urls?.sociograficos} />}
          {activeTab === 'diagnostico' && urls?.diagnostico && (
            <div>
              <DashboardEmbed tipo="social" src={urls.diagnostico.visualizar} />
              <div className="mt-3 flex justify-end">
                <a
                  href={urls.diagnostico.download}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pci-btn inline-flex items-center gap-2 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Baixar versão completa (PDF, ~125 MB)
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
