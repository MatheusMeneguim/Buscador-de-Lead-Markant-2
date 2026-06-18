const { subscriber } = require('../config/redis')

async function iniciarConsumidor(wss) {
  await subscriber.subscribe('leads', (mensagem) => {
    const evento = JSON.parse(mensagem)
    console.log(`[notification-service] Evento recebido: ${evento.tipo}`)

    // Envia para todos os clientes WebSocket conectados
    wss.clients.forEach((cliente) => {
      if (cliente.readyState === 1) {
        cliente.send(JSON.stringify(evento))
      }
    })
  })

  console.log('[notification-service] Ouvindo eventos do Redis...')
}

module.exports = iniciarConsumidor