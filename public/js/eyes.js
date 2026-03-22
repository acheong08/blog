;(function () {
  const N = 8

  /* ── Eye SVG construction ─────────────────────────────── */
  const makeEye = (x, y) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')

    const sclera = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse')
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
    veins.classList.add('veins')

    const iris = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    iris.setAttribute('cx', x)
    iris.setAttribute('cy', y)
    iris.setAttribute('r', 7)
    iris.setAttribute('fill', '#ff4d45')
    iris.setAttribute('filter', 'url(#irisGlow)')
    iris.classList.add('iris')

    const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
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

  /* ── Mount eyes into SVG panels ───────────────────────── */
  const mount = (id) => {
    const root = document.getElementById(id)
    if (!root) return []
    const eyes = []
    const cols = 2, rows = N
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
  const allVeins = Array.from(document.querySelectorAll('.eyes .veins'))

  /* ── Per-iris animation state ─────────────────────────── */
  const state = all.map((iris) => {
    const sclera = iris.parentNode.querySelector('ellipse')
    return {
      iris,
      // Home position (centre of sclera)
      cx0: +sclera.getAttribute('cx'),
      cy0: +sclera.getAttribute('cy'),
      // Current interpolated position
      curX: +sclera.getAttribute('cx'),
      curY: +sclera.getAttribute('cy'),
      // Target from mouse/touch
      targetX: +sclera.getAttribute('cx'),
      targetY: +sclera.getAttribute('cy'),
      // Idle drift target (randomised per eye)
      driftX: 0,
      driftY: 0,
      // Unique phase offsets for tremor & dilation
      tremorPhase: Math.random() * Math.PI * 2,
      dilationPhase: Math.random() * Math.PI * 2,
      // Base iris radius
      baseR: 7,
    }
  })

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

  /* ── Input tracking ───────────────────────────────────── */
  let lastInputTime = performance.now()
  let pointerActive = false

  function setTargets(clientX, clientY) {
    lastInputTime = performance.now()
    pointerActive = true

    state.forEach((s) => {
      const parent = s.iris.parentNode
      const svg = parent.ownerSVGElement
      const rect = svg.getBoundingClientRect()
      let sx = (clientX - rect.left) / rect.width
      const sy = (clientY - rect.top) / rect.height
      if (svg.classList.contains('right')) sx = 1 - sx

      const sclera = parent.querySelector('ellipse')
      const rx = +sclera.getAttribute('rx')
      const ry = +sclera.getAttribute('ry')
      const rI = s.baseR

      const dx = (sx - 0.5) * rx * 0.6
      const dy = (sy - 0.5) * ry * 0.6
      const maxX = Math.min(rx - rI - 2, 6)
      const maxY = Math.min(ry - rI - 2, 5)

      s.targetX = s.cx0 + clamp(dx, -maxX, maxX)
      s.targetY = s.cy0 + clamp(dy, -maxY, maxY)
    })
  }

  function resetTargets() {
    pointerActive = false
    state.forEach((s) => {
      s.targetX = s.cx0
      s.targetY = s.cy0
    })
  }

  // Mouse events
  window.addEventListener('mousemove', (e) => setTargets(e.clientX, e.clientY))
  window.addEventListener('mouseleave', resetTargets)

  // Touch events (mobile/tablet support)
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      setTargets(e.touches[0].clientX, e.touches[0].clientY)
    }
  }, { passive: true })
  window.addEventListener('touchend', resetTargets)
  window.addEventListener('touchcancel', resetTargets)

  /* ── Idle drift — eyes wander independently ───────────── */
  const IDLE_THRESHOLD = 3000 // ms before drift kicks in
  const DRIFT_INTERVAL = 2500 // ms between new drift targets

  let lastDriftUpdate = 0

  function updateDrift(now) {
    if (now - lastDriftUpdate < DRIFT_INTERVAL) return
    lastDriftUpdate = now
    state.forEach((s) => {
      s.driftX = (Math.random() - 0.5) * 8 // px offset in SVG units
      s.driftY = (Math.random() - 0.5) * 6
    })
  }

  /* ── Vein throb ───────────────────────────────────────── */
  const VEIN_THROB_PERIOD = 5000 // ms for one full pulse cycle
  function updateVeins(now) {
    const t = (now % VEIN_THROB_PERIOD) / VEIN_THROB_PERIOD
    const pulse = 0.45 + 0.35 * Math.sin(t * Math.PI * 2) // range 0.1 .. 0.8
    allVeins.forEach((v) => {
      v.setAttribute('opacity', pulse.toFixed(3))
    })
  }

  /* ── Main animation loop ──────────────────────────────── */
  const LERP_FACTOR = 0.06 // sluggish tracking
  const LERP_FACTOR_IDLE = 0.015 // even slower when drifting
  const TREMOR_AMP = 0.4 // sub-pixel noise amplitude
  const TREMOR_SPEED = 0.003 // radians per ms
  const DILATION_AMP = 1.2 // radius wobble +/- units
  const DILATION_SPEED = 0.0008 // slow breathing

  function tick(now) {
    const idle = (now - lastInputTime) > IDLE_THRESHOLD && !pointerActive
    if (idle) updateDrift(now)

    state.forEach((s) => {
      // Determine effective target
      let tx = s.targetX
      let ty = s.targetY
      if (idle) {
        tx = s.cx0 + s.driftX
        ty = s.cy0 + s.driftY
      }

      // Lerp toward target
      const lf = idle ? LERP_FACTOR_IDLE : LERP_FACTOR
      s.curX += (tx - s.curX) * lf
      s.curY += (ty - s.curY) * lf

      // Micro-tremor
      const tremX = Math.sin(now * TREMOR_SPEED + s.tremorPhase) * TREMOR_AMP
      const tremY = Math.cos(now * TREMOR_SPEED * 1.3 + s.tremorPhase + 1.7) * TREMOR_AMP

      const finalX = s.curX + tremX
      const finalY = s.curY + tremY

      s.iris.setAttribute('cx', finalX)
      s.iris.setAttribute('cy', finalY)

      // Specular highlight follows iris
      const spec = s.iris.parentNode.querySelector('.spec')
      if (spec) {
        spec.setAttribute('cx', finalX - 3)
        spec.setAttribute('cy', finalY - 3)
      }

      // Pupil dilation — slow breathing
      const dilate = Math.sin(now * DILATION_SPEED + s.dilationPhase) * DILATION_AMP
      s.iris.setAttribute('r', (s.baseR + dilate).toFixed(2))
    })

    // Vein throb
    updateVeins(now)

    // Glow pulse — animate the SVG blur stdDeviation
    const glowBlur = document.querySelector('#irisGlow feGaussianBlur')
    if (glowBlur) {
      const gt = (now % VEIN_THROB_PERIOD) / VEIN_THROB_PERIOD
      const glow = 1.5 + 2.0 * Math.sin(gt * Math.PI * 2) // range ~0 .. 3.5
      glowBlur.setAttribute('stdDeviation', glow.toFixed(2))
    }

    requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)

  /* ── Blink system ─────────────────────────────────────── */

  // Sparse independent blinks — subtle and in the corner of vision
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
})()
