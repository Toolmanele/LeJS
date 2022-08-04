class LeXGrid {
  constructor({ wrapper, unit = 30 } = {}) {
    if (!wrapper) return
    if (typeof wrapper === 'string') {
      let el = document.querySelector(wrapper)
      this.checkElement(el)
    } else {
      this.checkElement(wrapper)
    }
    if (!this.canvas) return
    this.setWH()

    this.unit = unit
    this.transform = new LeTransform()
    this.renderGrid()
    if (!this.canvas.parentElement) {
      this.wrapper.appendChild(this.canvas)
    }
    this.addResizeEvent()
    this.addZoomPanEvent()
    this.layers = []
  }

  addLayerContainer() {
    // transform-origin:0 0; 很关键
    let layer = document.createElement('div')
    layer.style.cssText = `position:absolute;top:0;left:0;transform-origin:0 0;`
    this.wrapper.appendChild(layer)
    this.layerContainer = layer
  }
  renderGrid() {
    let w = this.width
    let h = this.height
    let ctx = this.ctx
    let unit = this.unit
    let t = this.transform
    let _cx = w / 2
    let _cy = h / 2
    // 起点
    let centerX = _cx % 1 ? Math.floor(_cx) : _cx
    let centerY = _cy % 1 ? Math.floor(_cy) : _cy

    let xS, yS, xE, yE
    if (t) {
      // 终点 [0,0],[w,h]
      let invertTransform = t.invert()
      let tl = invertTransform.getXY(0, 0)
      let br = invertTransform.getXY(w, h)

      xS = tl[0]
      yS = tl[1]
      xE = br[0]
      yE = br[1]
    } else {
      xS = 0
      yS = 0
      xE = w
      yE = h
    }

    function getDot5(v) {
      if (v % 1) {
        // 找到和 0.5 最近的值
        let c1 = Math.floor(v) + 0.5
        let c2 = Math.floor(v) - 0.5
        return c1 - v < v - c2 ? c1 : c2
      } else {
        return v + 0.5
      }
    }
    ctx.clearRect(0, 0, w, h)

    // 修改 i 不完全匹配
    let index
    function xi(i) {
      return i % 5 !== 0
    }
    function cu(i) {
      return !xi(i)
    }
    function drawline(color, cx) {
      ctx.beginPath()
      ctx.strokeStyle = color
      index = Math.floor((xE - centerX) / unit)
      for (let i = 0; i <= index; i += 1) {
        if (cx(i)) {
          let v = i * unit + centerX
          let _i = t ? getDot5(t.getX(v)) : v + 0.5
          ctx.moveTo(_i, 0)
          ctx.lineTo(_i, h)
        }
      }
      index = Math.floor((centerX - xS) / unit)
      for (let i = 1; i <= index; i++) {
        if (cx(i)) {
          let v = centerX - i * unit
          let _i = t ? getDot5(t.getX(v)) : v + 0.5
          ctx.moveTo(_i, 0)
          ctx.lineTo(_i, h)
        }
      }
      index = Math.floor((yE - centerY) / unit)
      for (let i = 0; i <= index; i++) {
        if (cx(i)) {
          let v = i * unit + centerY
          let _i = t ? getDot5(t.getY(v)) : v + 0.5
          ctx.moveTo(0, _i)
          ctx.lineTo(w, _i)
        }
      }

      index = Math.floor((centerY - yS) / unit)
      for (let i = 1; i <= index; i++) {
        if (cx(i)) {
          let v = centerY - i * unit
          let _i = t ? getDot5(t.getY(v)) : v + 0.5
          ctx.moveTo(0, _i)
          ctx.lineTo(w, _i)
        }
      }

      ctx.stroke()
    }

    drawline('#cccccc', xi)
    drawline('#000000', cu)
  }
  checkElement(el) {
    if (el instanceof HTMLCanvasElement) {
      this.wrapper = el.parentElement
      this.canvas = el
      this.genCtx()
    } else if (el instanceof HTMLElement) {
      this.wrapper = el
      this.createCanvas()
      this.genCtx()
    }
  }
  createCanvas() {
    this.canvas = document.createElement('canvas')
  }
  genCtx() {
    this.ctx = this.canvas.getContext('2d')
  }
  setWH() {
    let width = this.wrapper.clientWidth
    let height = this.wrapper.clientHeight
    this.width = width
    this.height = height
    let styles = getComputedStyle(this.wrapper)
    let position = styles['position']
    if (position === 'static') {
      this.wrapper.style.position = 'absolute'
    }
    this.wrapper.style.overflow = 'hidden'
    this.canvas.setAttribute('width', width)
    this.canvas.setAttribute('height', height)
    this.canvas.style.cssText = `position:absolute;top:0;left:0;width:${width}px;height:${height}px;`
  }
  addResizeEvent() {
    window.onresize = () => {
      this.resize()
    }
  }
  resize() {
    this.setWH()
    this.renderGrid()
  }
  addZoomPanEvent() {
    this.canvas.addEventListener('wheel', (e) => {
      let f = e.deltaY > 0 ? 0.9 : 1.1
      let x = e.clientX
      let y = e.clientY

      this.transform.translate(-x, -y).scale(f, f).translate(x, y)
      let s = t.getScale()
      let curUnit = this.unit * s
      let unitRange = [16, 32]
      while (curUnit < unitRange[0]) {
        this.unit *= 2
        curUnit = this.unit * s
      }
      while (curUnit > unitRange[1]) {
        this.unit /= 2
        curUnit = this.unit * s
      }

      this.renderGrid()
      if (this.layerContainer) {
        this.layerContainer.transform = this.transform.toString()
      }
    })
    let sT
    addLeDrag(this.canvas, {
      start: () => {
        sT = this.transform
      },
      moving: (target, mX, mY, dX, dY) => {
        let t = new LeTransform(sT).translate(dX, dY)
        this.renderGrid()
        this.transform = t
        if (this.layerContainer) {
          this.layerContainer.transform = t.toString()
        }
      },
    })
  }
}
