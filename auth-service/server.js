require('dotenv').config()
const express = require('express')
const cors = require('cors')
const conectarBanco = require('./src/config/db')
const { router: authRoutes } = require('./src/routes/auth')
const mongoSanitize = require('express-mongo-sanitize')

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors())
app.use(express.json())
app.use(mongoSanitize())

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