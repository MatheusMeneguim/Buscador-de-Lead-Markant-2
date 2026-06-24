import { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthContext'

const LeadContext = createContext(null)

const RESOURCE_URL = 'http://localhost:3002/leads'

export function LeadProvider({ children }) {
  const { token } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)
  const [buscaAtual, setBuscaAtual] = useState({ nicho: '', cidade: '' })
  const [historico, setHistorico] = useState([])

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

      const novoLead = await response.json()
      setLeads((prev) => [novoLead, ...prev])
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

      const leadAtualizado = await response.json()
      setLeads((prev) => prev.map((l) => (l._id === id ? leadAtualizado : l)))
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

      setLeads((prev) => prev.filter((l) => l._id !== id))
      return { sucesso: true }
    } catch (err) {
      return { sucesso: false, erro: err.message }
    }
  }

  // Atualiza um lead na tela quando chega notificação via WebSocket
  function atualizarLeadLocal(lead) {
    setLeads((prev) => {
      const existe = prev.some((l) => l._id === lead._id)
      if (existe) {
        return prev.map((l) => (l._id === lead._id ? lead : l))
      }
      return prev
    })
  }

  function removerLeadLocal(leadId) {
    setLeads((prev) => prev.filter((l) => l._id !== leadId))
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
        atualizarLeadLocal,
        removerLeadLocal,
      }}
    >
      {children}
    </LeadContext.Provider>
  )
}

export function useLeads() {
  return useContext(LeadContext)
}