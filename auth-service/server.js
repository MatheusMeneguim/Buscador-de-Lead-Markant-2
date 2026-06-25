require('dotenv').config()
const express = require('express')
const cors = require('cors')
const conectarBanco = require('./src/config/db')
const { router: authRoutes } = require('./src/routes/auth')

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors())
app.use(express.json())

// Sanitização contra NoSQL Injection — remove operadores MongoDB do body
function sanitizarBody(req, res, next) {
  function limpar(obj) {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key]
        } else if (typeof obj[key] === 'object') {
          limpar(obj[key])
        }
      }
    }
  }
  limpar(req.body)
  next()
}

app.use(sanitizarBody)

// Rotas
app.use('/auth', authRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' })
})

// Inicia o servidor
conectarBanco().then(() => {
  app.listen(PORT, () => {
    console.log(`auth-service rodando na porta ${PORT}`)
  })
})