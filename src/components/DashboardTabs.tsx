'use client'

import { useState } from 'react'
import DashboardEmbed from './DashboardEmbed'

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<'social' | 'urbanismo'>('social')

  const tabs = [
    {
      id: 'social',
      label: 'Programas Sociais',
      icon: '👥',
      description: 'Ações e serviços sociais do Programa Cidade Integrada nos territórios do Rio de Janeiro.',
    },
    {
      id: 'urbanismo' as const,
      label: 'Urbanismo',
      icon: '🏗️',
      description: 'Projetos arquitetônicos e intervenções urbanísticas do Programa Cidade Integrada.',
    },
  ]

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
          {activeTab === 'social' && <DashboardEmbed tipo="social" />}
          {activeTab === 'urbanismo' && <DashboardEmbed tipo="urbanismo" />}
        </div>
      </div>
    </section>
  )
}
