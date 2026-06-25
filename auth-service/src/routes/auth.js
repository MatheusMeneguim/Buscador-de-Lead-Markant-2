const express = require('express')
const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')
const User = require('../models/User')
const log = require('../config/logger')

const router = express.Router()

// Lista de tokens inválidos (logout)
const tokensBloqueados = new Set()

// Rate limiting — máximo 10 tentativas de login por 15 minutos
const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Muitas tentativas. Tente novamente em 15 minutos.' }
})

// POST /auth/login
router.post('/login', limiteLogin, async (req, res) => {
  try {
    const { username, password } = req.body

    // Validação dos campos
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' })
    }

    // Busca o usuário no banco
    const usuario = await User.findOne({ username })
    if (!usuario) {
  log('LOGIN_FALHOU', `Usuário não encontrado: ${username}`)
  return res.status(401).json({ error: 'Usuário ou senha inválidos.' })
}

    // Verifica a senha
    const senhaCorreta = await usuario.compararSenha(password)
    if (!senhaCorreta) {
  log('LOGIN_FALHOU', `Senha incorreta para: ${username}`)
  return res.status(401).json({ error: 'Usuário ou senha inválidos.' })
}

    // Gera o token JWT
    const token = jwt.sign(
      { id: usuario._id, username: usuario.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    log('LOGIN', `Usuário: ${username}`)

    res.status(200).json({ token, username: usuario.username })
  } catch (err) {
    console.error('[auth-service] Erro no login:', err.message)
    res.status(500).json({ error: 'Erro interno do servidor.' })
  }
})

// POST /auth/logout
router.post('/logout', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (token) {
    tokensBloqueados.add(token)
    log('LOGOUT', `Token invalidado`)
  }
  res.status(200).json({ message: 'Logout realizado com sucesso.' })
})

// GET /auth/verificar — verifica se o token é válido
router.get('/verificar', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' })
  }

  if (tokensBloqueados.has(token)) {
    return res.status(401).json({ error: 'Token inválido.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.status(200).json({ valido: true, usuario: decoded })
  } catch (err) {
    res.status(401).json({ error: 'Token inválido ou expirado.' })
  }
})

module.exports = { router, tokensBloqueados }