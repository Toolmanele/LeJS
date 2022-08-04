class LeAnim {
  constructor({
    distance,
    totalTime,
    easing = 'Linear',
    startValue,
    update,
    playTime = 0,
    loop = 1, // 循环几次, -1 代表无限循环
  } = {}) {
    // 这是一个 动画播放器
    // 使用 requestAnimationFrame

    // 默认的 raf 是按照 帧率来的,

    // 但是我们的动画, 是按照时间来的

    // 所以要定义一个动画
    this.distance = distance
    totalTime *= 1000
    this.totalTime = totalTime
    this.easingFn = leEasing(startValue, distance, totalTime, easing)
    this.play = this._play.bind(this)
    this.startValue = startValue
    this.update = update
    // 播放进度
    this._playTime = playTime
    this.loopTime = 0
    this.loop = loop
  }

  set playTime(v) {
    this._playTime = v
  }
  get playTime() {
    let now = performance.now()
    if (this.startTime == null) {
      this.startTime = now
    }

    return now - this.startTime + this._playTime
  }

  get invertPlayTime() {
    return this.totalTime - this.playTime
  }

  _play() {
    let t = this.playTime
    let curPos = this.easingFn(t)
    this.update(curPos)

    if (t > this.totalTime) {
      this.loopTime++
      if (this.loop === -1) {
        this.replay()
      } else {
        if (this.loopTime < this.loop) {
          this.restart()
        } else {
          this.pause()
          this.playState = 'playEnd'
        }
      }
    } else {
      this.playState = 'playing'
    }
    if (this.playState === 'playing') {
      this.timer = requestAnimationFrame(this.play)
    }
  }
  pause() {
    this.playState = 'pause'
    this.playTime = performance.now() - this.startTime
    this.startTime = null
    cancelAnimationFrame(this.timer)
  }

  replay() {
    this.playTime = 0
    this.startTime = null
    this.play()
  }
  invertPlay() {
    // 倒着播放
    this.playTime
    this.playTime = 0
    this.startTime = null
  }
}
