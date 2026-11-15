// Vídeo de fundo fixo e desfocado. Com "reduzir movimento" ativo, fica só o
// quadro estático (poster), com o mesmo desfoque.
const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function BackgroundVideo() {
  return (
    <div aria-hidden="true" className="site-bg">
      {calm ? (
        <img className="site-bg__video" src="/media/fundo-poster.jpg" alt="" />
      ) : (
        <video
          className="site-bg__video"
          src="/media/fundo.mp4"
          poster="/media/fundo-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
        />
      )}
    </div>
  )
}
