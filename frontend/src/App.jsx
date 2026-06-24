import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { LeadProvider } from './contexts/LeadContext'
import FormBusca from './components/FormBusca'
import TabelaLeads from './components/TabelaLeads'
import Historico from './components/Historico'
import BotaoExportar from './components/BotaoExportar'

function ParticleCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const section = canvas.parentElement
    let particles = [], animId
    function resize() { canvas.width = section.offsetWidth; canvas.height = section.offsetHeight }
    function createParticles() {
      particles = []
      const count = Math.floor((canvas.width * canvas.height) / 12000)
      for (let i = 0; i < count; i++) {
        particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, r: Math.random() * 2 + 1 })
      }
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = '#D9E02199'; ctx.fill()
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = '#D9E021' + Math.floor((1 - dist / 120) * 60).toString(16).padStart(2, '0')
            ctx.lineWidth = 0.6; ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    resize(); createParticles(); draw()
    const handleResize = () => { resize(); createParticles() }
    window.addEventListener('resize', handleResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', handleResize) }
  }, [])
  return <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
}

const navLinks = [
  { label: 'Home', href: 'https://markant.com.br' },
  { label: 'Serviços', href: 'https://markant.com.br/servicos' },
  { label: 'Growth Lab', href: 'https://markant.com.br/growth-lab', active: true },
  { label: 'A Markant', href: 'https://markant.com.br/a-markant' },
  { label: 'Blog', href: 'https://markant.com.br/blog' },
]

const footerServicos = ['Growth Marketing', 'Tráfego Pago', 'Tráfego Orgânico', 'Sites & Landing Pages', 'CRM & Vendas']
const footerNav = [
  { label: 'Home', href: 'https://markant.com.br' },
  { label: 'Serviços', href: 'https://markant.com.br/servicos' },
  { label: 'Growth Lab', href: 'https://markant.com.br/growth-lab' },
  { label: 'A Markant', href: 'https://markant.com.br/a-markant' },
  { label: 'Blog', href: 'https://markant.com.br/blog' },
  { label: 'Contato', href: 'https://markant.com.br/#contato' },
]

const s = {
  linkNav: { color: '#5D5E5D', textDecoration: 'none', fontFamily: 'Lexend, sans-serif', fontSize: 14 },
  btnPrimary: { display: 'inline-block', backgroundColor: '#D9E021', color: '#2B2A29', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 6, textDecoration: 'none' },
  btnOutline: { display: 'inline-block', border: '1px solid rgba(249,249,249,0.2)', color: '#F9F9F9', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13, padding: '10px 20px', borderRadius: 6, textDecoration: 'none' },
  footerTitle: { fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#F9F9F9', marginBottom: 16, marginTop: 0 },
}

export default function App() {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <LeadProvider>

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(43,42,41,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(249,249,249,0.07)' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, maxWidth: 1280, margin: '0 auto', padding: '0 16px', gap: 16 }}>

          <a href="https://markant.com.br">
            <img src="/Logo_padrao_amarelo_branco.png" alt="Markant" style={{ width: 120, height: 'auto' }} />
          </a>

          <ul className="nav-desktop" style={{ display: 'flex', gap: 32, listStyle: 'none', margin: 0, padding: 0 }}>
            {navLinks.map(item => (
              <li key={item.label}>
                <a href={item.href} style={{ color: item.active ? '#D9E021' : '#F9F9F9', textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: 15 }}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="https://wa.me/5514998435234?text=Olá%2C%20vim%20pelo%20site%20da%20Markant%20e%20quero%20solicitar%20contato."
              target="_blank" rel="noopener noreferrer" className="nav-cta"
              style={{ backgroundColor: '#D9E021', color: '#2B2A29', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, padding: '10px 16px', borderRadius: 6, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Solicitar Contato
            </a>

            <button onClick={() => setMenuAberto(true)} className="nav-toggle"
              aria-label="Abrir menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ display: 'block', width: 24, height: 2, backgroundColor: '#F9F9F9' }} />
              <span style={{ display: 'block', width: 24, height: 2, backgroundColor: '#F9F9F9' }} />
              <span style={{ display: 'block', width: 24, height: 2, backgroundColor: '#F9F9F9' }} />
            </button>
          </div>
        </nav>
      </header>

      {/* MENU MOBILE OVERLAY */}
      {menuAberto && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          backgroundColor: '#2B2A29',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Topo do overlay */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 72, borderBottom: '1px solid rgba(249,249,249,0.07)' }}>
            <a href="https://markant.com.br" onClick={() => setMenuAberto(false)}>
              <img src="/Logo_padrao_amarelo_branco.png" alt="Markant" style={{ width: 120, height: 'auto' }} />
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <a href="https://wa.me/5514998435234?text=Olá%2C%20vim%20pelo%20site%20da%20Markant%20e%20quero%20solicitar%20contato."
                target="_blank" rel="noopener noreferrer"
                style={{ backgroundColor: '#D9E021', color: '#2B2A29', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, padding: '10px 16px', borderRadius: 6, textDecoration: 'none' }}>
                Solicitar Contato
              </a>
              <button onClick={() => setMenuAberto(false)} aria-label="Fechar menu"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F9F9F9', fontSize: 28, lineHeight: 1, padding: 4 }}>
                ✕
              </button>
            </div>
          </div>

          {/* Links */}
          <nav style={{ padding: '24px 0', flex: 1 }}>
            {navLinks.map(item => (
              <a key={item.label} href={item.href}
                onClick={() => setMenuAberto(false)}
                style={{
                  display: 'block', padding: '20px 24px',
                  color: item.active ? '#D9E021' : '#F9F9F9',
                  textDecoration: 'none',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600, fontSize: 22,
                  borderBottom: '1px solid rgba(249,249,249,0.05)',
                }}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* CSS responsivo */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-cta { display: none !important; }
          .nav-toggle { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-toggle { display: none !important; }
        }
      `}</style>
      
      {/* HERO */}
      <section style={{ position: 'relative', padding: 'clamp(40px, 6vw, 60px) 0 clamp(32px, 5vw, 48px)', overflow: 'hidden', borderBottom: '1px solid rgba(249,249,249,0.07)' }}>
        <ParticleCanvas />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '0 clamp(16px, 4vw, 32px)' }}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: 24, fontSize: 13, color: '#5D5E5D', fontFamily: 'Lexend, sans-serif', flexWrap: 'wrap', display: 'flex', gap: 4 }}>
            <a href="https://markant.com.br" style={{ color: '#5D5E5D', textDecoration: 'none' }}>Home</a>
            <span style={{ margin: '0 4px' }}>→</span>
            <a href="https://markant.com.br/growth-lab" style={{ color: '#5D5E5D', textDecoration: 'none' }}>Growth Lab</a>
            <span style={{ margin: '0 4px' }}>→</span>
            <span style={{ color: '#F9F9F9' }}>Buscador de Leads</span>
          </nav>
          <span style={{ display: 'inline-block', backgroundColor: '#D9E021', color: '#2B2A29', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, padding: '4px 10px', borderRadius: 4, marginBottom: 16, fontFamily: 'Space Grotesk, sans-serif' }}>
            FERRAMENTA
          </span>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 700, color: '#F9F9F9', margin: '0 0 12px', maxWidth: 600, lineHeight: 1.2 }}>
            Buscador de Leads Qualificados
          </h1>
          <p style={{ fontFamily: 'Lexend, sans-serif', fontSize: 'clamp(14px, 2vw, 16px)', color: '#5D5E5D', maxWidth: 500, margin: 0, lineHeight: 1.6 }}>
            Encontre empresas prontas para prospecção com dados direto do Google Maps — e exporte para o seu CRM em segundos.
          </p>
        </div>
      </section>

      {/* CONTEÚDO */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(24px, 4vw, 40px) clamp(16px, 4vw, 32px)' }}>
        <div style={{ backgroundColor: '#333230', border: '1px solid rgba(249,249,249,0.08)', borderRadius: 12, padding: 'clamp(20px, 4vw, 32px)', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(16px, 2vw, 18px)', fontWeight: 600, color: '#F9F9F9', margin: '0 0 24px' }}>
            Insira os dados da busca
          </h2>
          <FormBusca />
        </div>
        <Historico />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 1 }}>
          <BotaoExportar />
        </Box>
        <TabelaLeads />
      </main>

      {/* CTA FINAL */}
      <section style={{ borderTop: '1px solid rgba(249,249,249,0.07)', padding: 'clamp(40px, 6vw, 64px) clamp(16px, 4vw, 32px)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, color: '#F9F9F9', marginBottom: 12 }}>
          Seus leads podem ser melhores
        </h2>
        <p style={{ fontFamily: 'Lexend, sans-serif', color: '#5D5E5D', marginBottom: 32, fontSize: 'clamp(14px, 2vw, 16px)' }}>
          A ferramenta mostra os dados. A Mark<strong style={{ color: '#D9E021' }}>ant</strong> mostra como convertê-los.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://wa.me/5514998435234?text=Olá%2C%20quero%20solicitar%20meu%20diagnóstico%20gratuito%20com%20a%20Markant." target="_blank" rel="noopener noreferrer" style={s.btnPrimary}>
            Falar com um especialista
          </a>
          <a href="https://calendar.app.google/VhJwRPjMjvUfMiGB7" target="_blank" rel="noopener noreferrer" style={s.btnOutline}>
            Agendar reunião
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(249,249,249,0.07)', padding: 'clamp(32px, 5vw, 48px) clamp(16px, 4vw, 32px) 0', backgroundColor: '#2B2A29' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'clamp(24px, 4vw, 40px)', paddingBottom: 48 }}>

          <div>
            <a href="https://markant.com.br">
              <img src="/Logo_padrao_amarelo_branco.png" alt="Markant" style={{ width: 130, height: 'auto', marginBottom: 16 }} />
            </a>
            <p style={{ fontFamily: 'Lexend, sans-serif', fontSize: 13, color: '#5D5E5D', lineHeight: 1.6, marginBottom: 20 }}>
              Assessoria estratégica de Growth Marketing.<br />
              Pequenos passos para construir algo grande.
            </p>
            <a href="https://wa.me/5514998435234?text=Olá%2C%20vim%20pelo%20site%20da%20Markant%20e%20quero%20falar%20com%20um%20especialista." target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#D9E021', color: '#2B2A29', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, padding: '10px 16px', borderRadius: 6, textDecoration: 'none', marginBottom: 20 }}>
              <img src="/Icone_whatsapp.png" alt="" style={{ width: 18, height: 18 }} />
              Falar com um especialista
            </a>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href="https://www.instagram.com/markantgrowth/" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(249,249,249,0.06)', border: '1px solid rgba(249,249,249,0.1)', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#D9E021'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(249,249,249,0.1)'}>
                <img src="/Icone_instagram.png" alt="Instagram" style={{ width: 18, height: 18, filter: 'brightness(0) saturate(100%) invert(89%) sepia(44%) saturate(600%) hue-rotate(20deg) brightness(103%) contrast(97%)' }} />
              </a>
              <a href="https://www.linkedin.com/company/markantgrowth" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(249,249,249,0.06)', border: '1px solid rgba(249,249,249,0.1)', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#D9E021'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(249,249,249,0.1)'}>
                <img src="/Icone_linkedin.png" alt="LinkedIn" style={{ width: 18, height: 18, filter: 'brightness(0) saturate(100%) invert(89%) sepia(44%) saturate(600%) hue-rotate(20deg) brightness(103%) contrast(97%)' }} />
              </a>
            </div>
          </div>

          <div>
            <h4 style={s.footerTitle}>NAVEGAÇÃO</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {footerNav.map(item => (
                <li key={item.label}>
                  <a href={item.href} style={s.linkNav}
                    onMouseEnter={e => e.currentTarget.style.color = '#D9E021'}
                    onMouseLeave={e => e.currentTarget.style.color = '#5D5E5D'}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={s.footerTitle}>SERVIÇOS</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {footerServicos.map(sv => (
                <li key={sv}>
                  <a href="https://markant.com.br/servicos" style={s.linkNav}
                    onMouseEnter={e => e.currentTarget.style.color = '#D9E021'}
                    onMouseLeave={e => e.currentTarget.style.color = '#5D5E5D'}>
                    {sv}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={s.footerTitle}>CONTATO</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src="/Icone_email.png" alt="" style={{ width: 16, height: 16, flexShrink: 0, filter: 'brightness(0) saturate(100%) invert(89%) sepia(44%) saturate(600%) hue-rotate(20deg) brightness(103%) contrast(97%)' }} />
                <a href="mailto:markantofc@gmail.com" style={s.linkNav}
                  onMouseEnter={e => e.currentTarget.style.color = '#D9E021'}
                  onMouseLeave={e => e.currentTarget.style.color = '#5D5E5D'}>markantofc@gmail.com</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src="/Icone_whatsapp.png" alt="" style={{ width: 16, height: 16, flexShrink: 0, filter: 'brightness(0) saturate(100%) invert(89%) sepia(44%) saturate(600%) hue-rotate(20deg) brightness(103%) contrast(97%)' }} />
                <a href="https://wa.me/5514998435234" target="_blank" rel="noopener noreferrer" style={s.linkNav}
                  onMouseEnter={e => e.currentTarget.style.color = '#D9E021'}
                  onMouseLeave={e => e.currentTarget.style.color = '#5D5E5D'}>+55 (14) 9 9843-5234</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <img src="/Icone_localizacao.png" alt="" style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0, filter: 'brightness(0) saturate(100%) invert(89%) sepia(44%) saturate(600%) hue-rotate(20deg) brightness(103%) contrast(97%)' }} />
                <a href="https://maps.google.com/?q=Incubadora+Sprint-CP+Cornelio+Procopio+PR" target="_blank" rel="noopener noreferrer" style={s.linkNav}
                  onMouseEnter={e => e.currentTarget.style.color = '#D9E021'}
                  onMouseLeave={e => e.currentTarget.style.color = '#5D5E5D'}>
                  Incubadora Sprint-CP —<br />Cornélio Procópio, PR
                </a>
              </li>
            </ul>
            <a href="https://calendar.app.google/VhJwRPjMjvUfMiGB7" target="_blank" rel="noopener noreferrer"
              style={{ ...s.btnOutline, marginTop: 16, display: 'inline-block', transition: 'border-color 0.2s, color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#D9E021'; e.currentTarget.style.color = '#D9E021' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(249,249,249,0.2)'; e.currentTarget.style.color = '#F9F9F9' }}>
              Agendar reunião
            </a>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(249,249,249,0.07)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontFamily: 'Lexend, sans-serif', fontSize: 12, color: '#5D5E5D', margin: 0 }}>
            CNPJ: 64.988.570/0001-14 · MARKANT SOFTWARE LTDA · Fundada em 2025
          </p>
          <p style={{ fontFamily: 'Lexend, sans-serif', fontSize: 12, color: '#5D5E5D', margin: 0 }}>
            © 2025 Markant. Todos os direitos reservados. ·{' '}
            <a href="https://www.markant.com.br/termos-de-uso" style={{ color: '#5D5E5D', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = '#D9E021'}
              onMouseLeave={e => e.currentTarget.style.color = '#5D5E5D'}>Termos de uso</a> ·{' '}
            <a href="https://www.markant.com.br/politica-de-privacidade" style={{ color: '#5D5E5D', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = '#D9E021'}
              onMouseLeave={e => e.currentTarget.style.color = '#5D5E5D'}>Política de privacidade</a>
          </p>
        </div>
      </footer>

    </LeadProvider>
  )
}