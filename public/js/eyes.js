;(function () {
  const N = 8
  const makeEye = (x, y) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    const sclera = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'ellipse'
    )
    sclera.setAttribute('cx', x)
    sclera.setAttribute('cy', y)
    sclera.setAttribute('rx', 26)
    sclera.setAttribute('ry', 18)
    sclera.setAttribute('fill', 'url(#eyeGrad)')
    sclera.setAttribute('stroke', '#24262e')
    sclera.setAttribute('stroke-width', '1')
    const veins = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    veins.setAttribute(
      'd',
      `
      M ${x - 24} ${y - 6} C ${x - 12} ${y - 12}, ${x + 12} ${y - 12}, ${x + 24} ${y - 6}
      M ${x - 24} ${y}   C ${x - 10} ${y - 6},  ${x + 10} ${y - 6},  ${x + 24} ${y}
      M ${x - 24} ${y + 6} C ${x - 12} ${y + 12}, ${x + 12} ${y + 12}, ${x + 24} ${y + 6}
    `
    )
    veins.setAttribute('stroke', 'rgba(255,90,90,0.8)')
    veins.setAttribute('stroke-width', '0.8')
    veins.setAttribute('fill', 'none')
    veins.setAttribute('opacity', '0.7')
    const iris = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    )
    iris.setAttribute('cx', x)
    iris.setAttribute('cy', y)
    iris.setAttribute('r', 7)
    iris.setAttribute('fill', '#ff4d45')
    iris.classList.add('iris')
    const highlight = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    )
    highlight.setAttribute('cx', x - 3)
    highlight.setAttribute('cy', y - 3)
    highlight.setAttribute('r', 2)
    highlight.setAttribute('fill', '#fff')
    highlight.setAttribute('opacity', '0.75')
    highlight.classList.add('spec')
    const lid = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    lid.setAttribute('x', x - 28)
    lid.setAttribute('y', y - 20)
    lid.setAttribute('width', 56)
    lid.setAttribute('height', 40)
    lid.setAttribute('fill', '#0b0c10')
    lid.setAttribute('rx', 20)
    lid.setAttribute('ry', 20)
    lid.setAttribute('opacity', '0')
    lid.classList.add('lid')
    g.appendChild(sclera)
    g.appendChild(veins)
    g.appendChild(iris)
    g.appendChild(highlight)
    g.appendChild(lid)
    return g
  }
  const mount = (id, flip = false) => {
    const root = document.getElementById(id)
    if (!root) return []
    const eyes = []
    const cols = 2,
      rows = N
    const headerH =
      document.querySelector('.header')?.getBoundingClientRect().height || 64
    const svg = root.ownerSVGElement
    const vb = svg.viewBox.baseVal
    const usableH = vb.height
    const topPad = 20
    const bottomPad = 30
    const gap = (usableH - topPad - bottomPad) / N
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = 40 + j * 70
        const y = topPad + gap / 2 + i * gap
        const eye = makeEye(x, y)
        root.appendChild(eye)
        eyes.push(eye.querySelector('.iris'))
      }
    }
    return eyes
  }
  const eyesL = mount('eyesL')
  const eyesR = mount('eyesR')
  const all = [...eyesL, ...eyesR]
  const lids = Array.from(document.querySelectorAll('.eyes .lid'))
  const BLINK_MIN_DELAY = 6000 // ms
  const BLINK_MAX_DELAY = 100000 // ms
  const BLINK_MIN_DURATION = 100 // ms
  const BLINK_MAX_DURATION = 220 // ms
  lids.forEach(lid => {
    const loop = () => {
      const dur =
        BLINK_MIN_DURATION +
        Math.random() * (BLINK_MAX_DURATION - BLINK_MIN_DURATION)
      lid.animate(
        [
          { opacity: 0 },
          { opacity: 1, offset: 0.42 },
          { opacity: 1, offset: 0.58 },
          { opacity: 0 },
        ],
        { duration: dur, easing: 'ease-in-out' }
      )
      const delay =
        BLINK_MIN_DELAY + Math.random() * (BLINK_MAX_DELAY - BLINK_MIN_DELAY)
      setTimeout(loop, delay)
    }
    const startDelay =
      BLINK_MIN_DELAY * 0.2 + Math.random() * (BLINK_MAX_DELAY * 0.3)
    setTimeout(loop, startDelay)
  })
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n))
  function update(e) {
    const x = e.clientX,
      y = e.clientY
    all.forEach(iris => {
      const c = iris
      const parent = c.parentNode
      const svg = parent.ownerSVGElement
      const rect = svg.getBoundingClientRect()
      let sx = (x - rect.left) / rect.width
      const sy = (y - rect.top) / rect.height
      if (svg.classList.contains('right')) sx = 1 - sx
      const sclera = parent.querySelector('ellipse')
      const cx0 = +sclera.getAttribute('cx')
      const cy0 = +sclera.getAttribute('cy')
      const rx = +sclera.getAttribute('rx')
      const ry = +sclera.getAttribute('ry')
      const rI = +c.getAttribute('r')
      const dx = (sx - 0.5) * rx * 0.6
      const dy = (sy - 0.5) * ry * 0.6
      const maxX = Math.min(rx - rI - 2, 6)
      const maxY = Math.min(ry - rI - 2, 5)
      const nx = cx0 + clamp(dx, -maxX, maxX)
      const ny = cy0 + clamp(dy, -maxY, maxY)
      c.setAttribute('cx', nx)
      c.setAttribute('cy', ny)
      const spec = parent.querySelector('.spec')
      if (spec) {
        spec.setAttribute('cx', nx - 3)
        spec.setAttribute('cy', ny - 3)
      }
    })
  }
  let raf = 0
  window.addEventListener('mousemove', e => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => update(e))
  })
  window.addEventListener('mouseleave', () => {
    all.forEach(c => {
      const sclera = c.parentNode.querySelector('ellipse')
      c.setAttribute('cx', sclera.getAttribute('cx'))
      c.setAttribute('cy', sclera.getAttribute('cy'))
    })
  })
})()
