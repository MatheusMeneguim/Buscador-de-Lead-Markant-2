const redis = require('redis')

const client = redis.createClient({
  url: process.env.REDIS_URL
})

client.on('error', (err) => {
  console.error('[resource-service] Erro Redis:', err.message)
})

client.on('connect', () => {
  console.log('Redis conectado — resource-service')
})

async function conectarRedis() {
  await client.connect()
}

module.exports = { client, conectarRedis }