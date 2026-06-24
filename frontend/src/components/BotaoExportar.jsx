import { Button } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import { useLeads } from '../contexts/LeadContext'

function BotaoExportar() {
  const { leads } = useLeads()

  function escaparCSV(valor) {
    if (valor === null || valor === undefined || valor === '') return '""'
    return `"${String(valor).replace(/"/g, '""')}"`
  }

  function exportarCSV() {
    const cabecalho = ['Nome', 'Endereço', 'Telefone', 'Avaliação', 'Avaliações', 'Site']
    const linhas = leads.map((lead) => [
      escaparCSV(lead.title),
      escaparCSV(lead.address),
      escaparCSV(lead.phone),
      escaparCSV(lead.rating),
      escaparCSV(lead.reviews),
      escaparCSV(lead.website),
    ])
    const csv = [cabecalho.join(';'), ...linhas.map((l) => l.join(';'))].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (leads.length === 0) return null

  return (
    <Button
      variant="outlined"
      startIcon={<DownloadIcon />}
      onClick={exportarCSV}
      sx={{
        borderColor: 'rgba(217,224,33,0.4)',
        color: '#D9E021',
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: 0.5,
        padding: '8px 20px',
        '&:hover': {
          borderColor: '#D9E021',
          backgroundColor: 'rgba(217,224,33,0.08)',
        },
      }}
    >
      Exportar CSV
    </Button>
  )
}

export default BotaoExportar