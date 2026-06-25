function log(acao, detalhes = '') {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] [resource-service] [${acao}] ${detalhes}`)
}

module.exports = log