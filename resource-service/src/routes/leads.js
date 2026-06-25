const express = require('express')
const jwt = require('jsonwebtoken')
const Lead = require('../models/Lead')
const { client } = require('../config/redis')
const log = require('../config/logger')

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

// ─── Busca na Google Places API e salva os resultados no MongoDB ────────────
async function buscarNaGoogleEPersistir(nicho, cidade, usuario) {
  const query = `${nicho} em ${cidade} Brasil`
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&language=pt-BR&region=br&key=${process.env.GOOGLE_PLACES_API_KEY}`

  const response = await fetch(url)
  const data = await response.json()

  if (!data.results || data.results.length === 0) {
    return []
  }

  // Busca telefone e site de cada resultado em paralelo
  const leadsParaSalvar = await Promise.all(
    data.results.map(async (item) => {
      let phone = null
      let website = null

      try {
        const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&fields=formatted_phone_number,website&language=pt-BR&key=${process.env.GOOGLE_PLACES_API_KEY}`
        const detailRes = await fetch(detailUrl)
        const detailData = await detailRes.json()
        phone = detailData.result?.formatted_phone_number || null
        website = detailData.result?.website || null
      } catch {
        // Se falhar, deixa null
      }

      return {
        title: item.name || 'Sem nome',
        address: item.formatted_address || 'Endereço não disponível',
        phone,
        rating: item.rating || null,
        reviews: item.user_ratings_total || 0,
        website,
        nicho,
        cidade,
        owner: usuario.id,
        ownerUsername: usuario.username,
      }
    })
  )

  // Salva todos no MongoDB de uma vez
  const leadsSalvos = await Lead.insertMany(leadsParaSalvar)
  log('LEADS_SALVOS', `${leadsSalvos.length} leads inseridos no banco a partir do Google`)

  return leadsSalvos
}

// ─── GET /leads — busca leads do usuário ─────────────────────────────────────
router.get('/', autenticar, async (req, res) => {
  try {
    const { nicho, cidade } = req.query

    if (!nicho || !cidade) {
      return res.status(400).json({ error: 'Nicho e cidade são obrigatórios' })
    }

    // 1. Tenta buscar do cache Redis primeiro
    const cacheKey = `leads:${nicho}:${cidade}`
    const cache = await client.get(cacheKey)
    if (cache) {
      log('CACHE_HIT', cacheKey)
      return res.status(200).json(JSON.parse(cache))
    }

    // 2. Busca no banco de dados (já populado anteriormente)
    const filtro = {
      nicho: { $regex: nicho, $options: 'i' },
      cidade: { $regex: cidade, $options: 'i' },
    }
    let leads = await Lead.find(filtro).sort({ createdAt: -1 })

    // 3. Se não encontrou nada no banco, busca na Google Places API
    if (leads.length === 0) {
      log('BUSCA_GOOGLE', `Nicho: ${nicho}, Cidade: ${cidade}`)
      leads = await buscarNaGoogleEPersistir(nicho, cidade, req.usuario)
    }

    // 4. Salva no cache por 5 minutos
    await client.setEx(cacheKey, 300, JSON.stringify(leads))

    log('BUSCA', `Nicho: ${nicho}, Cidade: ${cidade}, Resultados: ${leads.length}, Usuário: ${req.usuario.username}`)
    res.status(200).json(leads)
  } catch (err) {
    log('ERRO_BUSCA', err.message)
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

    log('LEAD_CRIADO', `${title} por ${req.usuario.username}`)
    res.status(201).json(lead)
  } catch (err) {
    log('ERRO_CRIAR', err.message)
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
      log('ACESSO_NEGADO', `${req.usuario.username} tentou editar lead de outro usuário`)
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

    log('LEAD_ATUALIZADO', `${lead.title} por ${req.usuario.username}`)
    res.status(200).json(lead)
  } catch (err) {
    log('ERRO_ATUALIZAR', err.message)
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
      log('ACESSO_NEGADO', `${req.usuario.username} tentou deletar lead de outro usuário`)
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

    log('LEAD_DELETADO', `${lead.title} por ${req.usuario.username}`)
    res.status(200).json({ message: 'Lead deletado com sucesso.' })
  } catch (err) {
    log('ERRO_DELETAR', err.message)
    res.status(500).json({ error: 'Erro ao deletar lead.' })
  }
})

module.exports = router