import { useEffect, useRef } from 'react'

// Canvas-based particle system — lightweight, no external deps
export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Initialise particles
    const PARTICLE_COUNT = 80
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.25,
        dy: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        // Move
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1

        // Draw particle dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 229, 255, ${p.opacity})`
        ctx.fill()

        // Draw connecting lines to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dist = Math.hypot(p.x - q.x, p.y - q.y)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            const alpha = (1 - dist / 120) * 0.08
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}
