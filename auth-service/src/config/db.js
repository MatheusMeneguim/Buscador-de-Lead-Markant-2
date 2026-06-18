const mongoose = require('mongoose')

async function conectarBanco() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB conectado — auth-service')
  } catch (err) {
    console.error('Erro ao conectar MongoDB:', err.message)
    process.exit(1)
  }
}

module.exports = conectarBanco