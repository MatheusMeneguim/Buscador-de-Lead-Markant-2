import { useState } from 'react'
import { Box, TextField, Button, Alert, Typography, CircularProgress } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

function Login() {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const { login, erroLogin, loadingLogin } = useAuth()

  async function handleLogin(e) {
    e.preventDefault()
    if (!usuario.trim() || !senha.trim()) return
    await login(usuario, senha)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2B2A29',
        padding: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          backgroundColor: '#333230',
          border: '1px solid rgba(249,249,249,0.08)',
          borderRadius: 3,
          padding: 5,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ color: '#F9F9F9', fontFamily: 'Space Grotesk, sans-serif', mb: 1, textAlign: 'center' }}
        >
          Buscador de Leads
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: '#5D5E5D', textAlign: 'center', mb: 4 }}
        >
          Entre com sua conta para continuar
        </Typography>

        <TextField
          label="Usuário"
          fullWidth
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          sx={{ mb: 2 }}
          disabled={loadingLogin}
          autoFocus
        />

        <TextField
          label="Senha"
          type="password"
          fullWidth
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          sx={{ mb: 3 }}
          disabled={loadingLogin}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loadingLogin}
          startIcon={loadingLogin ? <CircularProgress size={18} color="inherit" /> : null}
          sx={{
            backgroundColor: '#D9E021',
            color: '#2B2A29',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            padding: '12px',
            '&:hover': { backgroundColor: '#c4ca1e' },
          }}
        >
          {loadingLogin ? 'Entrando...' : 'Entrar'}
        </Button>

        {erroLogin && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {erroLogin}
          </Alert>
        )}
      </Box>
    </Box>
  )
}

export default Login