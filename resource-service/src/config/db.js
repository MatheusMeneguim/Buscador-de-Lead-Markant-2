const mongoose = require('mongoose')

async function conectarBanco() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
    })
    console.log('MongoDB conectado — resource-service (pool: 2-10 conexões)')
  } catch (err) {
    console.error('Erro ao conectar MongoDB:', err.message)
    process.exit(1)
  }
}

module.exports = conectarBanco