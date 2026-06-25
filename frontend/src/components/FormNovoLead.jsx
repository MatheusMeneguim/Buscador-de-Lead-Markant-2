import { useState } from 'react'
import { Box, TextField, Button, Alert, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useLeads } from '../contexts/LeadContext'

function FormNovoLead({ nicho, cidade }) {
  const { criarLead } = useLeads()
  const [aberto, setAberto] = useState(false)
  const [campos, setCampos] = useState({
    title: '', address: '', phone: '', rating: '', website: '',
    nicho: nicho || '', cidade: cidade || '',
  })
  const [erro, setErro] = useState(null)
  const [salvando, setSalvando] = useState(false)

  function atualizarCampo(campo, valor) {
    setCampos((prev) => ({ ...prev, [campo]: valor }))
  }

  function abrir() {
    setCampos({
      title: '', address: '', phone: '', rating: '', website: '',
      nicho: nicho || '', cidade: cidade || '',
    })
    setAberto(true)
  }

  async function handleSalvar() {
    setErro(null)

    if (!campos.title.trim() || !campos.address.trim()) {
      setErro('Nome e endereço são obrigatórios.')
      return
    }

    if (!campos.nicho.trim() || !campos.cidade.trim()) {
      setErro('Nicho e cidade são obrigatórios.')
      return
    }

    setSalvando(true)

    const resultado = await criarLead({
      title: campos.title,
      address: campos.address,
      phone: campos.phone || null,
      rating: campos.rating ? Number(campos.rating) : null,
      website: campos.website || null,
      nicho: campos.nicho,
      cidade: campos.cidade,
    })

    setSalvando(false)

    if (resultado.sucesso) {
      setAberto(false)
    } else {
      setErro(resultado.erro)
    }
  }

  if (!aberto) {
    return (
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={abrir}
        sx={{
          borderColor: 'rgba(217,224,33,0.4)',
          color: '#D9E021',
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: 13,
        }}
      >
        Adicionar Lead Manualmente
      </Button>
    )
  }

  return (
    <Box
      sx={{
        backgroundColor: '#333230',
        border: '1px solid rgba(249,249,249,0.08)',
        borderRadius: 2,
        padding: 3,
        mt: 2,
      }}
    >
      <Typography sx={{ color: '#F9F9F9', fontWeight: 600, mb: 2 }}>
        Novo Lead
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <TextField
          label="Nicho"
          value={campos.nicho}
          onChange={(e) => atualizarCampo('nicho', e.target.value)}
          sx={{ flex: '1 1 150px' }}
          size="small"
        />
        <TextField
          label="Cidade"
          value={campos.cidade}
          onChange={(e) => atualizarCampo('cidade', e.target.value)}
          sx={{ flex: '1 1 150px' }}
          size="small"
        />
        <TextField
          label="Nome da empresa"
          value={campos.title}
          onChange={(e) => atualizarCampo('title', e.target.value)}
          sx={{ flex: '1 1 250px' }}
          size="small"
        />
        <TextField
          label="Endereço"
          value={campos.address}
          onChange={(e) => atualizarCampo('address', e.target.value)}
          sx={{ flex: '1 1 250px' }}
          size="small"
        />
        <TextField
          label="Telefone"
          value={campos.phone}
          onChange={(e) => atualizarCampo('phone', e.target.value)}
          sx={{ flex: '1 1 150px' }}
          size="small"
        />
        <TextField
          label="Avaliação (0-5)"
          type="number"
          value={campos.rating}
          onChange={(e) => atualizarCampo('rating', e.target.value)}
          sx={{ flex: '1 1 120px' }}
          size="small"
        />
        <TextField
          label="Site"
          value={campos.website}
          onChange={(e) => atualizarCampo('website', e.target.value)}
          sx={{ flex: '1 1 200px' }}
          size="small"
        />
      </Box>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          onClick={handleSalvar}
          disabled={salvando}
          sx={{ backgroundColor: '#D9E021', color: '#2B2A29', fontWeight: 700 }}
        >
          {salvando ? 'Salvando...' : 'Salvar Lead'}
        </Button>
        <Button variant="text" onClick={() => setAberto(false)} sx={{ color: '#5D5E5D' }}>
          Cancelar
        </Button>
      </Box>
    </Box>
  )
}

export default FormNovoLead