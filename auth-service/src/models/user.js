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
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
})

// Método para comparar senha digitada com a senha criptografada
userSchema.methods.compararSenha = async function (senha) {
  return bcrypt.compare(senha, this.password)
}

module.exports = mongoose.model('User', userSchema)