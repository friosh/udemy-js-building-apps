class Timer {
  constructor(durationInput, startBtn, pauseBtn, callbacks) {
    this.durationInput = durationInput
    this.startBtn = startBtn
    this.pauseBtn = pauseBtn
    this.hooks = callbacks || null

    this.startBtn.addEventListener('click', this.start)
    this.pauseBtn.addEventListener('click', this.pause)
  }

  start = () => {
    this.hooks && this.hooks.onStart(this.timeRemaining)
    this.tick()
    this.interval = setInterval(this.tick, 20)
  }

  pause = () => {
    clearInterval(this.interval)
  }

  tick = () => {
    if (this.timeRemaining > 0) {
      this.timeRemaining = this.timeRemaining - 0.02
      this.hooks && this.hooks.onTick(this.timeRemaining)
    } else {
      this.pause()
      this.hooks && this.hooks.onFinished()
    }
  }

  get timeRemaining() {
    return parseFloat(this.durationInput.value)
  }

  set timeRemaining(time) {
    this.durationInput.value = time.toFixed(2)
  }
}
