import { useMemo, useState } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  MenuItem,
  TextField,
  Chip,
  Link,
} from '@mui/material'
import { useLeads } from '../contexts/LeadContext'

function TabelaLeads() {
  const { leads, loading, buscaAtual } = useLeads()
  const [filtroAvaliacao, setFiltroAvaliacao] = useState(0)

  // useMemo: só recalcula quando leads ou filtroAvaliacao mudam
  const leadsFiltrados = useMemo(() => {
    if (filtroAvaliacao === 0) return leads
    return leads.filter((lead) => (lead.rating || 0) >= filtroAvaliacao)
  }, [leads, filtroAvaliacao])

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {leadsFiltrados.map((lead) => (
              <TableRow key={lead.place_id} hover>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default TabelaLeads