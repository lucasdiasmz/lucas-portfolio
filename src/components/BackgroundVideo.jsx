import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../motion/env.js'

const VIDEO = '/media/fundo.mp4'
const POSTER = '/media/fundo-poster.jpg'
const FRAME_MS = 48 // no máximo ~20 quadros por segundo: é textura, não filme

/*
 * Fundo fixo. Começa pelo quadro parado (leve, já desfocado). Depois que a
 * página termina de carregar, o vídeo é baixado e desenhado num canvas pequeno
 * (256 × 144), que o CSS amplia para a tela toda. Ampliar já desfoca, então
 * não existe filtro de blur em tela cheia recalculado a cada quadro, e o que
 * fica por cima (vidro com backdrop-filter) trabalha bem menos.
 *
 * Com "reduzir movimento" ou economia de dados ativos, fica só o quadro parado.
 */
export default function BackgroundVideo() {
  const calm = useReducedMotion()
  const wrap = useRef(null)
  const canvas = useRef(null)

  useEffect(() => {
    const cv = canvas.current
    if (calm || !cv || navigator.connection?.saveData) return

    const ctx = cv.getContext('2d', { alpha: false })
    ctx.imageSmoothingQuality = 'high'
    // desfoque barato: aplicado no canvas pequeno, não na tela inteira
    if ('filter' in ctx) ctx.filter = 'blur(1.6px)'
    const video = document.createElement('video')
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.preload = 'auto'

    let alive = true
    let last = 0
    let live = false

    const queue = () => {
      if (!alive) return
      if ('requestVideoFrameCallback' in video) video.requestVideoFrameCallback(draw)
      else requestAnimationFrame(draw)
    }
    const draw = (now) => {
      if (!alive) return
      if (now - last >= FRAME_MS && video.readyState >= 2) {
        last = now
        ctx.drawImage(video, 0, 0, cv.width, cv.height)
        if (!live) {
          live = true
          cv.dataset.live = ''
          wrap.current.dataset.live = ''
        }
      }
      queue()
    }

    const play = () => video.play().catch(() => {})
    const start = () => {
      if (!alive) return
      video.src = VIDEO
      play()
      queue()
    }
    // só depois do carregamento da página: o vídeo não disputa banda com o que importa
    const idle = () => (window.requestIdleCallback ? window.requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 400))
    if (document.readyState === 'complete') idle()
    else window.addEventListener('load', idle, { once: true })

    const onVisibility = () => (document.hidden ? video.pause() : play())
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      alive = false
      window.removeEventListener('load', idle)
      document.removeEventListener('visibilitychange', onVisibility)
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [calm])

  return (
    <div ref={wrap} aria-hidden="true" className="site-bg">
      <img className="site-bg__video" src={POSTER} alt="" decoding="async" />
      {!calm && <canvas ref={canvas} className="site-bg__video" width="256" height="144" />}
    </div>
  )
}
