const express = require('express')
const jwt = require('jsonwebtoken')
const Lead = require('../models/Lead')
const { client } = require('../config/redis')

const router = express.Router()

// ─── MIDDLEWARE — verifica se o token JWT é válido ───────────────────────────
function autenticar(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' })
  }
}

// ─── GET /leads — busca leads do usuário ─────────────────────────────────────
router.get('/', autenticar, async (req, res) => {
  try {
    const { nicho, cidade } = req.query
    const cacheKey = `leads:${nicho}:${cidade}`

    // Tenta buscar do cache primeiro
    const cache = await client.get(cacheKey)
    if (cache) {
      console.log(`[resource-service] Cache hit: ${cacheKey}`)
      return res.status(200).json(JSON.parse(cache))
    }

    // Monta o filtro
    const filtro = {}
    if (nicho) filtro.nicho = { $regex: nicho, $options: 'i' }
    if (cidade) filtro.cidade = { $regex: cidade, $options: 'i' }

    const leads = await Lead.find(filtro).sort({ createdAt: -1 })

    // Salva no cache por 5 minutos
    await client.setEx(cacheKey, 300, JSON.stringify(leads))

    console.log(`[resource-service] Busca: ${nicho} em ${cidade}`)
    res.status(200).json(leads)
  } catch (err) {
    console.error('[resource-service] Erro na busca:', err.message)
    res.status(500).json({ error: 'Erro ao buscar leads.' })
  }
})

// ─── POST /leads — cria um novo lead ─────────────────────────────────────────
router.post('/', autenticar, async (req, res) => {
  try {
    const { title, address, phone, rating, reviews, website, nicho, cidade } = req.body

    // Validação
    if (!title || !address || !nicho || !cidade) {
      return res.status(400).json({ error: 'Nome, endereço, nicho e cidade são obrigatórios.' })
    }

    const lead = await Lead.create({
      title,
      address,
      phone: phone || null,
      rating: rating || null,
      reviews: reviews || 0,
      website: website || null,
      nicho,
      cidade,
      owner: req.usuario.id,
      ownerUsername: req.usuario.username,
    })

    // Publica evento na fila Redis
    await client.publish('leads', JSON.stringify({
      tipo: 'lead.criado',
      lead,
      usuario: req.usuario.username,
    }))

    // Limpa o cache
    await client.del(`leads:${nicho}:${cidade}`)

    console.log(`[resource-service] Lead criado: ${title} por ${req.usuario.username}`)
    res.status(201).json(lead)
  } catch (err) {
    console.error('[resource-service] Erro ao criar lead:', err.message)
    res.status(500).json({ error: 'Erro ao criar lead.' })
  }
})

// ─── PUT /leads/:id — atualiza um lead ───────────────────────────────────────
router.put('/:id', autenticar, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)

    if (!lead) {
      return res.status(404).json({ error: 'Lead não encontrado.' })
    }

    // Verifica se o usuário é o dono
    if (lead.owner.toString() !== req.usuario.id) {
      return res.status(403).json({ error: 'Você não tem permissão para editar este lead.' })
    }

const { title, address, phone, rating, reviews, website, nicho, cidade } = req.body

if (!title || !address) {
  return res.status(400).json({ error: 'Nome e endereço são obrigatórios.' })
}

lead.title = title
lead.address = address
lead.phone = phone || null
lead.rating = rating || null
lead.reviews = reviews || 0
lead.website = website || null
if (nicho) lead.nicho = nicho
if (cidade) lead.cidade = cidade

    await lead.save()

    // Publica evento na fila Redis
    await client.publish('leads', JSON.stringify({
      tipo: 'lead.atualizado',
      lead,
      usuario: req.usuario.username,
    }))

    // Limpa o cache
    await client.del(`leads:${lead.nicho}:${lead.cidade}`)

    console.log(`[resource-service] Lead atualizado: ${lead.title} por ${req.usuario.username}`)
    res.status(200).json(lead)
  } catch (err) {
    console.error('[resource-service] Erro ao atualizar lead:', err.message)
    res.status(500).json({ error: 'Erro ao atualizar lead.' })
  }
})

// ─── DELETE /leads/:id — deleta um lead ──────────────────────────────────────
router.delete('/:id', autenticar, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)

    if (!lead) {
      return res.status(404).json({ error: 'Lead não encontrado.' })
    }

    // Verifica se o usuário é o dono
    if (lead.owner.toString() !== req.usuario.id) {
      return res.status(403).json({ error: 'Você não tem permissão para deletar este lead.' })
    }

    await lead.deleteOne()

    // Publica evento na fila Redis
    await client.publish('leads', JSON.stringify({
      tipo: 'lead.deletado',
      leadId: req.params.id,
      usuario: req.usuario.username,
    }))

    // Limpa o cache
    await client.del(`leads:${lead.nicho}:${lead.cidade}`)

    console.log(`[resource-service] Lead deletado: ${lead.title} por ${req.usuario.username}`)
    res.status(200).json({ message: 'Lead deletado com sucesso.' })
  } catch (err) {
    console.error('[resource-service] Erro ao deletar lead:', err.message)
    res.status(500).json({ error: 'Erro ao deletar lead.' })
  }
})

module.exports = router