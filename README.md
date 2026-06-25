# Buscador de Leads Qualificados — Projeto 2

Aplicação fullstack distribuída desenvolvida para a disciplina de Programação Web Fullstack (UTFPR — Campus Cornélio Procópio), estendendo o Projeto 1 com uma arquitetura de microsserviços.

Ferramenta real da [Markant Growth Marketing](https://markant.com.br) para prospecção de leads B2B via Google Places API, com persistência própria, autenticação JWT e notificações em tempo real.

---

## Arquitetura

| Componente | Tecnologia | Porta | Responsabilidade |
|---|---|---|---|
| `frontend/` | React.js + Vite | 5173 | Interface do usuário |
| `auth-service/` | Express.js + MongoDB | 3001 | Login, JWT, gerenciamento de usuários |
| `resource-service/` | Express.js + MongoDB + Redis | 3002 | CRUD de leads, cache, publicação de eventos |
| `notification-service/` | Express.js + WebSocket + Redis | 3003 | Consome eventos e notifica em tempo real |

**Fila de mensagens:** Redis Pub/Sub — comunicação assíncrona entre `resource-service` (produtor) e `notification-service` (consumidor).

**Banco de dados:** MongoDB — cada serviço com sua própria base (`auth-db` e `resource-db`), sem compartilhamento de coleções.

---

## Pré-requisitos

Antes de rodar o projeto, é necessário ter instalado:

- **Node.js** (v18 ou superior)
- **MongoDB** rodando localmente em `mongodb://localhost:27017`
- **Redis** rodando localmente em `localhost:6379` (recomendado via WSL no Windows: `redis-server`)
- **Chave da Google Places API** (para a busca de leads)

---

## Como rodar o projeto

O projeto precisa de **4 terminais abertos simultaneamente** (3 microsserviços + frontend), além do Redis e MongoDB já rodando em background.

### 1. Subir o Redis (se ainda não estiver rodando)

```bash
redis-server
```

### 2. Subir o auth-service

```bash
cd auth-service
npm install
npm run dev
```
Sobe em `http://localhost:3001`

### 3. Subir o resource-service

```bash
cd resource-service
npm install
npm run dev
```
Sobe em `http://localhost:3002`

### 4. Subir o notification-service

```bash
cd notification-service
npm install
npm run dev
```
Sobe em `http://localhost:3003` (WebSocket)

### 5. Subir o frontend

```bash
cd frontend
npm install
npm run dev
```
Sobe em `http://localhost:5173`

---

## Variáveis de ambiente

Cada serviço possui seu próprio arquivo `.env`. Exemplo de configuração:

**`auth-service/.env`**

PORT=3001

MONGODB_URI=mongodb://localhost:27017/auth-db

JWT_SECRET=markant_jwt_secret_2026

JWT_EXPIRES_IN=1h

**`resource-service/.env`**

PORT=3002

MONGODB_URI=mongodb://localhost:27017/resource-db

JWT_SECRET=markant_jwt_secret_2026

REDIS_URL=redis://localhost:6379

GOOGLE_PLACES_API_KEY=sua_chave_aqui

**`notification-service/.env`**

PORT=3003

REDIS_URL=redis://localhost:6379

> **Importante:** o `JWT_SECRET` deve ser **idêntico** entre `auth-service` e `resource-service` — é o segredo compartilhado usado para validar o token sem precisar de uma chamada HTTP extra entre os serviços.

---

## Usuário de teste

O banco é populado manualmente. Para criar o usuário de teste, rode (dentro de `auth-service`):

```bash
node -e "require('dotenv').config(); const mongoose = require('mongoose'); const User = require('./src/models/User'); mongoose.connect(process.env.MONGODB_URI).then(async () => { await User.create({ username: 'matheus', password: '123456' }); console.log('Usuário criado!'); process.exit(); });"
```

**Credenciais de acesso:**
- Usuário: `matheus`
- Senha: `123456`

---

## Funcionalidades

### RF1 — Login
Autenticação via `auth-service`, emissão de token JWT, invalidação no logout (lista de revogação em memória) e expiração automática em 1 hora.

### RF2 — Busca
Estratégia de cache em 3 camadas:
1. **Redis** (cache de 5 minutos) — resposta instantânea
2. **MongoDB** — dados já persistidos de buscas anteriores
3. **Google Places API** — só é consultada se as duas camadas anteriores não tiverem dados; os resultados são automaticamente salvos no MongoDB para uso futuro

### RF3 — Inserção
Criação de leads vinculados ao usuário autenticado (campo `owner`), com validação de campos obrigatórios e sanitização contra NoSQL Injection.

### RF4 — Atualização
Edição de leads via `PUT`, com verificação de propriedade (HTTP 403 se o usuário não for o dono).

### RF5 — Exclusão
Remoção de leads via `DELETE`, com confirmação obrigatória na interface e verificação de propriedade (HTTP 403).

### RF6 — Notificações em Tempo Real
Toda operação de escrita (criar/editar/deletar) publica um evento no Redis. O `notification-service` consome o evento e retransmite via WebSocket para todos os clientes conectados — a interface atualiza automaticamente, sem reload.

---

## Segurança implementada

- Senhas armazenadas com hash + salt (bcrypt)
- Sanitização de entradas contra NoSQL Injection
- Rate limiting no login (10 tentativas por 15 minutos)
- Invalidação de tokens no logout
- Verificação de proprietário em todas as operações de escrita (HTTP 403)
- Logs centralizados com timestamp e identificação do serviço de origem

---

## Performance implementada

- Compressão gzip dos arquivos estáticos do frontend (build de produção)
- Compressão das respostas HTTP via middleware `compression`
- Cache em Redis no `resource-service`
- Pool de conexões configurado no MongoDB (2 a 10 conexões simultâneas)

---

## Estrutura de pastas
projeto/

├── auth-service/

│   ├── package.json

│   ├── server.js

│   └── src/

│       ├── routes/

│       ├── models/

│       └── config/

├── resource-service/

│   ├── package.json

│   ├── server.js

│   └── src/

│       ├── routes/

│       ├── models/

│       └── config/

├── notification-service/

│   ├── package.json

│   ├── server.js

│   └── src/

│       ├── routes/

│       ├── models/

│       └── config/

├── frontend/

│   └── (mesma estrutura do Projeto 1)

└── README.md

---

## Autor

**Matheus F. Meneguim**
Fundador & Head of Growth — [Markant Growth Marketing](https://markant.com.br)
Estudante de Tecnologia da Informação — UTFPR Campus Cornélio Procópio

Disciplina: Programação Web Fullstack
Prof. Anderson Paulo Avila Santos