const { WebSocketServer } = require('ws')

function iniciarWebSocket(server) {
  const wss = new WebSocketServer({ server })

  wss.on('connection', (ws) => {
    console.log('[notification-service] Cliente WebSocket conectado')

    ws.on('close', () => {
      console.log('[notification-service] Cliente WebSocket desconectado')
    })
  })

  console.log('[notification-service] WebSocket server iniciado')
  return wss
}

module.exports = iniciarWebSocket