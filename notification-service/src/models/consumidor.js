const { subscriber } = require('../config/redis')
const log = require('../config/logger')

async function iniciarConsumidor(wss) {
  await subscriber.subscribe('leads', (mensagem) => {
    const evento = JSON.parse(mensagem)
    log('EVENTO_RECEBIDO', `Tipo: ${evento.tipo}, Usuário: ${evento.usuario}`)

    // Envia para todos os clientes WebSocket conectados
    let clientesNotificados = 0
    wss.clients.forEach((cliente) => {
      if (cliente.readyState === 1) {
        cliente.send(JSON.stringify(evento))
        clientesNotificados++
      }
    })

    log('NOTIFICACAO_ENVIADA', `${clientesNotificados} clientes notificados`)
  })

  log('CONSUMIDOR_INICIADO', 'Ouvindo eventos do Redis')
}

module.exports = iniciarConsumidor