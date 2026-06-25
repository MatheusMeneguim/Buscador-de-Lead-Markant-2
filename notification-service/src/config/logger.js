function log(acao, detalhes = '') {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] [notification-service] [${acao}] ${detalhes}`)
}

module.exports = log