/*
 * Um único requestAnimationFrame para o site inteiro.
 * Cada quadro roda primeiro as leituras do DOM e depois as escritas, então
 * ninguém força layout no meio do quadro. A mesma função agendada duas vezes
 * roda uma vez só. Sem tarefa na fila, não há quadro pedido: parado, custa zero.
 */
const reads = new Set()
const writes = new Set()
let id = 0
let reading = false

function flush(now) {
  id = 0
  reading = true
  const r = [...reads]
  reads.clear()
  try {
    for (const fn of r) fn(now)
  } finally {
    reading = false
  }
  // escritas pedidas durante as leituras saem neste mesmo quadro
  const w = [...writes]
  writes.clear()
  for (const fn of w) fn(now)
}

function request() {
  if (!id && !reading) id = requestAnimationFrame(flush)
}

export const frame = {
  read(fn) {
    reads.add(fn)
    if (reading) id ||= requestAnimationFrame(flush)
    else request()
  },
  write(fn) {
    writes.add(fn)
    request()
  },
  cancel(fn) {
    reads.delete(fn)
    writes.delete(fn)
  },
}

/*
 * Laço que se desliga sozinho: roda a cada quadro enquanto `fn` não devolver
 * false. start() em laço já ligado não faz nada.
 */
export function loop(fn) {
  let alive = false
  const tick = (now) => {
    if (!alive) return
    if (fn(now) === false) alive = false
    else frame.write(tick)
  }
  return {
    start() {
      if (alive) return
      alive = true
      frame.write(tick)
    },
    stop() {
      alive = false
      frame.cancel(tick)
    },
  }
}
