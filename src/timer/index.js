const durationInput = document.getElementById('duration')
const start = document.getElementById('start')
const pause = document.getElementById('pause')
const circle = document.querySelector('circle')

const perimeter = circle.getAttribute('r') * 2 * Math.PI
circle.setAttribute('stroke-dasharray', perimeter)

let duration
const callbacks = {
  onStart(totalDuration) {
    duration = totalDuration
  },
  onTick(timeRemaining) {
    circle.setAttribute('stroke-dashoffset',
        perimeter * timeRemaining/duration - perimeter)
  },
  onFinished() { console.log('onFinished') }
}

const timer = new Timer(durationInput, start, pause, callbacks)
timer.pause()
