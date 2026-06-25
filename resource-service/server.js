require('dotenv').config()
const express = require('express')
const cors = require('cors')
const compression = require('compression')
const conectarBanco = require('./src/config/db')
const { conectarRedis } = require('./src/config/redis')
const leadsRoutes = require('./src/routes/leads')

const app = express()
const PORT = process.env.PORT || 3002

// Middlewares
app.use(cors())
app.use(compression())
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