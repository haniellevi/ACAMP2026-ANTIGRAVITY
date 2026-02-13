import React, { useState, useEffect, useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement
} from 'chart.js'
import { Bar, Pie, Radar } from 'react-chartjs-2'
import { Users, Target, Activity, MapPin, RefreshCcw } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxmQJeAuf-7dYByCXk91yrQoeixft88EIW5IAfVgg9y2__Kd0QJ0mi8NLqOn5pLfdOQkQ/exec'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterChurch, setFilterChurch] = useState('Todas')

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL)
      const json = await response.json()
      setData(json)
      setError(null)
    } catch (err) {
      console.error("Erro ao buscar dados:", err)
      setError("Não foi possível carregar os dados. Verifique o Script do Google.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const churches = useMemo(() => {
    const list = [...new Set(data.map(item => item.Igreja))].filter(Boolean)
    return ['Todas', ...list]
  }, [data])

  const filteredData = useMemo(() => {
    if (filterChurch === 'Todas') return data
    return data.filter(item => item.Igreja === filterChurch)
  }, [data, filterChurch])

  // KPIs
  const totalDisciples = filteredData.length
  const avgMaturity = totalDisciples > 0
    ? (filteredData.reduce((acc, curr) => acc + (Number(curr["Total (/100)"]) || 0), 0) / totalDisciples).toFixed(1)
    : 0

  // Perfil Distribution Data
  const profileDistribution = useMemo(() => {
    const counts = { SEMENTE: 0, MUDA: 0, ÁRVORE: 0, RADICAL: 0 }
    filteredData.forEach(item => {
      const p = (item.Perfil || '').toUpperCase()
      if (p.includes('SEMENTE')) counts.SEMENTE++
      else if (p.includes('MUDA')) counts.MUDA++
      else if (p.includes('ÁRVORE')) counts.ÁRVORE++
      else if (p.includes('RADICAL')) counts.RADICAL++
    })
    return {
      labels: ['Semente', 'Muda', 'Árvore', 'Radical'],
      datasets: [{
        data: [counts.SEMENTE, counts.MUDA, counts.ÁRVORE, counts.RADICAL],
        backgroundColor: ['#22c55e', '#f59e0b', '#6366f1', '#ef4444'],
        borderWidth: 0
      }]
    }
  }, [filteredData])

  // Radial Chart Data (Categories)
  const categoriesData = useMemo(() => {
    const cats = ["Renúncia", "Mente", "Comunhão", "Honra", "Serviço"]
    const averages = cats.map(cat => {
      if (totalDisciples === 0) return 0
      return (filteredData.reduce((acc, curr) => acc + (Number(curr[cat]) || 0), 0) / totalDisciples).toFixed(1)
    })

    return {
      labels: cats,
      datasets: [{
        label: 'Média das Categorias',
        data: averages,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366f1',
        pointBackgroundColor: '#6366f1',
        borderWidth: 2
      }]
    }
  }, [filteredData, totalDisciples])

  // Weakness Analysis
  const topWeaknesses = useMemo(() => {
    const cats = ["Renúncia", "Mente", "Comunhão", "Honra", "Serviço"]
    const averages = cats.map(cat => {
      if (totalDisciples === 0) return { name: cat, avg: 0 }
      const avg = filteredData.reduce((acc, curr) => acc + (Number(curr[cat]) || 0), 0) / totalDisciples
      return { name: cat, avg }
    })
    return averages.sort((a, b) => a.avg - b.avg).slice(0, 3)
  }, [filteredData, totalDisciples])

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
      <RefreshCcw className="animate-spin" size={48} color="#6366f1" />
      <p style={{ color: 'var(--text-muted)' }}>Buscando dados na nuvem...</p>
    </div>
  )

  return (
    <div className="dashboard">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px' }}><Activity size={24} /></span>
              BI | Diagnóstico do Discípulo
            </h1>
            <p>Acampamento Discípulo Radical 2026</p>
          </div>
          <button
            onClick={fetchData}
            className="refresh-btn"
          >
            <RefreshCcw size={18} /> Sincronizar Agora
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="grid-layout">
          {/* KPI Cards */}
          <div className="glass-card kpi-card">
            <div className="kpi-label"><Users size={14} /> Total Avaliados</div>
            <div className="kpi-value">{totalDisciples}</div>
          </div>
          <div className="glass-card kpi-card">
            <div className="kpi-label"><Target size={14} /> Média Geral</div>
            <div className="kpi-value">{avgMaturity}%</div>
          </div>
          <div className="glass-card kpi-card">
            <div className="kpi-label"><MapPin size={14} /> Filtrar por Igreja</div>
            <select value={filterChurch} onChange={(e) => setFilterChurch(e.target.value)} style={{ marginTop: '10px', width: '100%' }}>
              {churches.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
          {/* Radar Chart: Categories */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div className="kpi-label">Equilíbrio Espiritual</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cat. (0-20 pts)</div>
            </div>
            <div className="chart-container">
              <Radar
                data={categoriesData}
                options={{
                  scales: {
                    r: {
                      min: 0, max: 20,
                      grid: { color: 'rgba(255,255,255,0.05)' },
                      angleLines: { color: 'rgba(255,255,255,0.05)' },
                      ticks: { display: false },
                      pointLabels: { color: '#94a3b8', font: { size: 12, weight: '600' } }
                    }
                  },
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false
                }}
              />
            </div>
          </div>

          {/* Weaknesses List */}
          <div className="glass-card">
            <div className="kpi-label" style={{ marginBottom: '20px' }}>Principais Fraquezas (Prioridade)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {topWeaknesses.map((w, i) => (
                <div key={i} style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{i + 1}. {w.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Média: {Number(w.avg).toFixed(1)} / 20</div>
                </div>
              ))}
              {totalDisciples === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Aguardando dados...</p>}
            </div>
          </div>
        </div>

        <div className="grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
          {/* Pie Chart: Profiles */}
          <div className="glass-card">
            <div className="kpi-label" style={{ marginBottom: '20px' }}>Distribuição de Perfis</div>
            <div className="chart-container">
              <Pie
                data={profileDistribution}
                options={{
                  plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 20 } } },
                  maintainAspectRatio: false
                }}
              />
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="grid-layout">
          <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div className="kpi-label">Histórico de Diagnósticos</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mostrando últimos 50 registros</div>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Igreja</th>
                    <th>Pontuação</th>
                    <th>Perfil</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice().reverse().slice(0, 50).map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 500 }}>{item.Nome}</td>
                      <td>{item.Igreja}</td>
                      <td><span style={{ color: Number(item["Total (/100)"]) >= 70 ? '#4ade80' : '#f87171' }}>{item["Total (/100)"]}%</span></td>
                      <td>
                        <span className={`badge badge-${(item.Perfil || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ')[0]}`}>
                          {item.Perfil}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{new Date(item["Data/Hora"]).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .refresh-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s;
        }
        .refresh-btn:hover { background: var(--primary-hover); transform: translateY(-2px); }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .kpi-card .kpi-label { display: flex; alignItems: center; gap: 6px; }
      `}} />
    </div>
  )
}

export default App
