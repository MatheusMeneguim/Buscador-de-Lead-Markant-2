import { Box, Typography, Chip } from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import SearchIcon from '@mui/icons-material/Search'
import { useLeads } from '../contexts/LeadContext'

function Historico() {
  const { historico, buscar } = useLeads()

  if (historico.length === 0) return null

  return (
    <Box sx={{ mt: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <HistoryIcon sx={{ fontSize: 16, color: '#5D5E5D' }} />
        <Typography sx={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: '#5D5E5D' }}>
          BUSCAS RECENTES
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {historico.map((h, i) => (
          <Box
            key={i}
            onClick={() => buscar(h.nicho, h.cidade)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              backgroundColor: '#2B2A29',
              border: '1px solid rgba(249,249,249,0.08)',
              borderRadius: 2,
              padding: '10px 16px',
              cursor: 'pointer',
              transition: 'border-color 0.2s, background-color 0.2s',
              '&:hover': {
                borderColor: '#D9E021',
                backgroundColor: '#333230',
              },
            }}
          >
            <SearchIcon sx={{ fontSize: 14, color: '#5D5E5D' }} />
            <Box>
              <Typography sx={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#F9F9F9', lineHeight: 1.2 }}>
                {h.nicho} em {h.cidade}
              </Typography>
              <Typography sx={{ fontFamily: 'Lexend, sans-serif', fontSize: 11, color: '#5D5E5D', mt: 0.3 }}>
                {h.data}
              </Typography>
            </Box>
            <Chip
              label={`${h.total} leads`}
              size="small"
              sx={{
                backgroundColor: 'rgba(217,224,33,0.1)',
                color: '#D9E021',
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 11,
                fontWeight: 700,
                border: '1px solid rgba(217,224,33,0.2)',
                height: 22,
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default Historico