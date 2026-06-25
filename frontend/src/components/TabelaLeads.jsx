import { useMemo, useState } from 'react'
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, MenuItem, TextField, Chip, Link, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useLeads } from '../contexts/LeadContext'

function TabelaLeads() {
  const { leads, loading, buscaAtual, editarLead, deletarLead } = useLeads()
  const [filtroAvaliacao, setFiltroAvaliacao] = useState(0)

  const [leadEditando, setLeadEditando] = useState(null)
  const [campos, setCampos] = useState({})
  const [erroEdicao, setErroEdicao] = useState(null)

  const [leadDeletando, setLeadDeletando] = useState(null)

  const leadsFiltrados = useMemo(() => {
    if (filtroAvaliacao === 0) return leads
    return leads.filter((lead) => (lead.rating || 0) >= filtroAvaliacao)
  }, [leads, filtroAvaliacao])

  function abrirEdicao(lead) {
    setLeadEditando(lead)
    setCampos({
      title: lead.title,
      address: lead.address,
      phone: lead.phone || '',
      rating: lead.rating || '',
      website: lead.website || '',
      nicho: lead.nicho || '',
      cidade: lead.cidade || '',
    })
    setErroEdicao(null)
  }

  async function salvarEdicao() {
    if (!campos.title.trim() || !campos.address.trim()) {
      setErroEdicao('Nome e endereço são obrigatórios.')
      return
    }

    const resultado = await editarLead(leadEditando._id, {
      title: campos.title,
      address: campos.address,
      phone: campos.phone || null,
      rating: campos.rating ? Number(campos.rating) : null,
      website: campos.website || null,
      nicho: campos.nicho,
      cidade: campos.cidade,
    })

    if (resultado.sucesso) {
      setLeadEditando(null)
    } else {
      setErroEdicao(resultado.erro)
    }
  }

  async function confirmarExclusao() {
    await deletarLead(leadDeletando._id)
    setLeadDeletando(null)
  }

  if (loading) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography>Buscando leads...</Typography>
      </Box>
    )
  }

  if (leads.length === 0) return null

  return (
    <Box sx={{ padding: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Resultados para "{buscaAtual.nicho}" em {buscaAtual.cidade}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {leadsFiltrados.length} de {leads.length} leads encontrados
          </Typography>
        </Box>

        <TextField
          select
          label="Avaliação mínima"
          value={filtroAvaliacao}
          onChange={(e) => setFiltroAvaliacao(Number(e.target.value))}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value={0}>Todos</MenuItem>
          <MenuItem value={3.5}>3.5+</MenuItem>
          <MenuItem value={4.0}>4.0+</MenuItem>
          <MenuItem value={4.5}>4.5+</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Endereço</strong></TableCell>
              <TableCell><strong>Telefone</strong></TableCell>
              <TableCell><strong>Avaliação</strong></TableCell>
              <TableCell><strong>Site</strong></TableCell>
              <TableCell><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leadsFiltrados.map((lead) => (
              <TableRow key={lead._id || lead.place_id} hover>
                <TableCell>{lead.title}</TableCell>
                <TableCell>{lead.address}</TableCell>
                <TableCell>
                  {lead.phone ? (
                    <Chip label={lead.phone} size="small" variant="outlined" />
                  ) : '—'}
                </TableCell>
                <TableCell>
                  {lead.rating ? `⭐ ${lead.rating}` : '—'}
                </TableCell>
                <TableCell>
                  {lead.website ? (
                    <Link href={lead.website} target="_blank" rel="noopener noreferrer">
                      Acessar
                    </Link>
                  ) : '—'}
                </TableCell>
                <TableCell>
                  {lead._id && (
                    <>
                      <IconButton size="small" onClick={() => abrirEdicao(lead)}>
                        <EditIcon fontSize="small" sx={{ color: '#D9E021' }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => setLeadDeletando(lead)}>
                        <DeleteIcon fontSize="small" sx={{ color: '#e57373' }} />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de Edição — RF4 */}
      <Dialog open={!!leadEditando} onClose={() => setLeadEditando(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Lead</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Nicho" value={campos.nicho || ''} onChange={(e) => setCampos((p) => ({ ...p, nicho: e.target.value }))} fullWidth size="small" />
              <TextField label="Cidade" value={campos.cidade || ''} onChange={(e) => setCampos((p) => ({ ...p, cidade: e.target.value }))} fullWidth size="small" />
            </Box>
            <TextField label="Nome" value={campos.title || ''} onChange={(e) => setCampos((p) => ({ ...p, title: e.target.value }))} fullWidth size="small" />
            <TextField label="Endereço" value={campos.address || ''} onChange={(e) => setCampos((p) => ({ ...p, address: e.target.value }))} fullWidth size="small" />
            <TextField label="Telefone" value={campos.phone || ''} onChange={(e) => setCampos((p) => ({ ...p, phone: e.target.value }))} fullWidth size="small" />
            <TextField label="Avaliação" type="number" value={campos.rating || ''} onChange={(e) => setCampos((p) => ({ ...p, rating: e.target.value }))} fullWidth size="small" />
            <TextField label="Site" value={campos.website || ''} onChange={(e) => setCampos((p) => ({ ...p, website: e.target.value }))} fullWidth size="small" />
            {erroEdicao && <Alert severity="error">{erroEdicao}</Alert>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeadEditando(null)}>Cancelar</Button>
          <Button onClick={salvarEdicao} variant="contained" sx={{ backgroundColor: '#D9E021', color: '#2B2A29' }}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão — RF5 */}
      <Dialog open={!!leadDeletando} onClose={() => setLeadDeletando(null)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o lead <strong>{leadDeletando?.title}</strong>? Essa ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeadDeletando(null)}>Cancelar</Button>
          <Button onClick={confirmarExclusao} variant="contained" color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TabelaLeads