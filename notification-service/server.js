require('dotenv').config()
const http = require('http')
const express = require('express')
const cors = require('cors')
const { conectarRedis } = require('./src/config/redis')
const iniciarWebSocket = require('./src/routes/ws')
const iniciarConsumidor = require('./src/models/consumidor')

const app = express()
const PORT = process.env.PORT || 3003

app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'notification-service' })
})

// Cria servidor HTTP
const server = http.createServer(app)

// Inicia tudo
async function iniciar() {
  await conectarRedis()
  const wss = iniciarWebSocket(server)
  await iniciarConsumidor(wss)

  server.listen(PORT, () => {
    console.log(`notification-service rodando na porta ${PORT}`)
  })
}

iniciar()