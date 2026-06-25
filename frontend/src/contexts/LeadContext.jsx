import { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthContext'
import { useWebSocket } from './useWebSocket'

const LeadContext = createContext(null)

const RESOURCE_URL = 'http://localhost:3002/leads'

export function LeadProvider({ children }) {
  const { token } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)
  const [buscaAtual, setBuscaAtual] = useState({ nicho: '', cidade: '' })
  const [historico, setHistorico] = useState([])

  // Conecta ao WebSocket e escuta eventos em tempo real
  useWebSocket((evento) => {
    if (evento.tipo === 'lead.criado') {
      setLeads((prev) => {
        const jaExiste = prev.some((l) => String(l._id) === String(evento.lead._id))
        if (jaExiste) return prev
        return [evento.lead, ...prev]
      })
    }

    if (evento.tipo === 'lead.atualizado') {
      setLeads((prev) => prev.map((l) => (String(l._id) === String(evento.lead._id) ? evento.lead : l)))
    }

    if (evento.tipo === 'lead.deletado') {
      setLeads((prev) => prev.filter((l) => String(l._id) !== String(evento.leadId)))
    }
  })

  async function buscar(nicho, cidade) {
    setLoading(true)
    setErro(null)
    setLeads([])
    setBuscaAtual({ nicho, cidade })

    try {
      const params = new URLSearchParams({ nicho, cidade })
      const response = await fetch(`${RESOURCE_URL}?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro na busca')
      }

      const resultado = await response.json()
      setLeads(resultado)

      setHistorico((prev) => {
        const jaExiste = prev.some((h) => h.nicho === nicho && h.cidade === cidade)
        if (jaExiste) return prev
        return [
          { nicho, cidade, total: resultado.length, data: new Date().toLocaleDateString('pt-BR') },
          ...prev,
        ].slice(0, 5)
      })
    } catch (err) {
      setErro(err.message || 'Erro ao buscar leads. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function criarLead(dadosLead) {
    try {
      const response = await fetch(RESOURCE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dadosLead),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao criar lead')
      }

      // Não adiciona aqui — o WebSocket vai adicionar quando o evento chegar
      return { sucesso: true }
    } catch (err) {
      return { sucesso: false, erro: err.message }
    }
  }

  async function editarLead(id, dadosLead) {
    try {
      const response = await fetch(`${RESOURCE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dadosLead),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao editar lead')
      }

      // Não atualiza aqui — o WebSocket vai atualizar quando o evento chegar
      return { sucesso: true }
    } catch (err) {
      return { sucesso: false, erro: err.message }
    }
  }

  async function deletarLead(id) {
    try {
      const response = await fetch(`${RESOURCE_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao deletar lead')
      }

      // Não remove aqui — o WebSocket vai remover quando o evento chegar
      return { sucesso: true }
    } catch (err) {
      return { sucesso: false, erro: err.message }
    }
  }

  return (
    <LeadContext.Provider
      value={{
        leads,
        loading,
        erro,
        buscaAtual,
        buscar,
        historico,
        criarLead,
        editarLead,
        deletarLead,
      }}
    >
      {children}
    </LeadContext.Provider>
  )
}

export function useLeads() {
  return useContext(LeadContext)
}