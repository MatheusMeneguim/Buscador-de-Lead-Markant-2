require('dotenv').config()
const express = require('express')
const cors = require('cors')
const compression = require('compression')
const conectarBanco = require('./src/config/db')
const { conectarRedis } = require('./src/config/redis')
const leadsRoutes = require('./src/routes/leads')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')

const app = express()
const PORT = process.env.PORT || 3002

// Middlewares
app.use(cors())
app.use(compression())
app.use(express.json())
app.use(mongoSanitize())
app.use(xss())

// Rotas
app.use('/leads', leadsRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'resource-service' })
})

// Inicia o servidor
async function iniciar() {
  await conectarBanco()
  await conectarRedis()
  app.listen(PORT, () => {
    console.log(`resource-service rodando na porta ${PORT}`)
  })
}

iniciar()