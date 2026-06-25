import { useEffect, useRef } from 'react'

const WS_URL = 'ws://localhost:3003'

export function useWebSocket(onMensagem) {
  const wsRef = useRef(null)

  useEffect(() => {
    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('[WebSocket] Conectado ao notification-service')
    }

    ws.onmessage = (event) => {
      try {
        const evento = JSON.parse(event.data)
        console.log('[WebSocket] Evento recebido:', evento.tipo)
        onMensagem(evento)
      } catch (err) {
        console.error('[WebSocket] Erro ao processar mensagem:', err)
      }
    }

    ws.onerror = (err) => {
      console.error('[WebSocket] Erro de conexão:', err)
    }

    ws.onclose = () => {
      console.log('[WebSocket] Desconectado')
    }

    return () => {
      ws.close()
    }
  }, [])
}