import { createContext, useContext, useState } from 'react'

const LeadContext = createContext(null)
const USE_MOCK = false
const MOCK_DATA = [
  {
    title: 'Clínica Odontológica Sorriso Perfeito',
    address: 'Rua XV de Novembro, 423 - Cornélio Procópio, PR',
    phone: '(43) 3524-1100',
    rating: 4.8,
    reviews: 112,
    website: 'https://sorrisoperfeito.com.br',
    place_id: 'mock_001',
  },
  {
    title: 'OdontoCenter Cornélio',
    address: 'Av. Minas Gerais, 1250 - Cornélio Procópio, PR',
    phone: '(43) 3524-2233',
    rating: 4.5,
    reviews: 87,
    website: null,
    place_id: 'mock_002',
  },
  {
    title: 'Studio Dental Clínica Odontológica',
    address: 'Rua Prefeito Hugo Cabral, 89 - Cornélio Procópio, PR',
    phone: '(43) 99801-3344',
    rating: 4.9,
    reviews: 203,
    website: 'https://studiodental.com',
    place_id: 'mock_003',
  },
  {
    title: 'Consultório Dra. Fernanda Lima',
    address: 'Rua Espírito Santo, 610 - Cornélio Procópio, PR',
    phone: '(43) 3524-9900',
    rating: 4.2,
    reviews: 41,
    website: null,
    place_id: 'mock_004',
  },
  {
    title: 'Espaço Oral Odontologia Avançada',
    address: 'Rua Amazonas, 77 - Cornélio Procópio, PR',
    phone: '(43) 98822-5566',
    rating: 3.9,
    reviews: 28,
    website: 'https://espacooral.com.br',
    place_id: 'mock_005',
  },
]

async function fetchLeads(nicho, cidade) {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    return MOCK_DATA
  }

  const params = new URLSearchParams({ nicho, cidade })
  const response = await fetch(`/api/buscar?${params}`)

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`)
  }

  return await response.json()
}

export function LeadProvider({ children }) {
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
      const resultado = await fetchLeads(nicho, cidade)
      setLeads(resultado)

      setHistorico((prev) => {
        const jaExiste = prev.some(
          (h) => h.nicho === nicho && h.cidade === cidade
        )
        if (jaExiste) return prev
        return [
          { nicho, cidade, total: resultado.length, data: new Date().toLocaleDateString('pt-BR') },
          ...prev,
        ].slice(0, 5)
      })
    } catch (err) {
      setErro('Erro ao buscar leads. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <LeadContext.Provider value={{ leads, loading, erro, buscaAtual, buscar, historico }}>
      {children}
    </LeadContext.Provider>
  )
}

export function useLeads() {
  return useContext(LeadContext)
}