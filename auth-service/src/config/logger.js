function log(acao, detalhes = '') {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] [auth-service] [${acao}] ${detalhes}`)
}

module.exports = log