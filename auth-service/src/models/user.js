const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true })

// Antes de salvar, criptografa a senha
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Método para comparar senha digitada com a senha criptografada
userSchema.methods.compararSenha = async function (senha) {
  return bcrypt.compare(senha, this.password)
}

module.exports = mongoose.model('User', userSchema)