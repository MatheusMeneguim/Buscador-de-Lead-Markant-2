const redis = require('redis')

const subscriber = redis.createClient({
  url: process.env.REDIS_URL
})

subscriber.on('error', (err) => {
  console.error('[notification-service] Erro Redis:', err.message)
})

subscriber.on('connect', () => {
  console.log('Redis conectado — notification-service')
})

async function conectarRedis() {
  await subscriber.connect()
}

module.exports = { subscriber, conectarRedis }