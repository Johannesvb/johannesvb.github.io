const { performance } = require('perf_hooks');

Timer = {
  startTime: 0,
  endTime: 0,
  timeStart: function() {
    this.startTime = performance.now()
  },
  timeEnd: function() {
    this.endTime = performance.now()
    return this.endTime - this.startTime
  },
  getProgress: function() {
    return this.endTime - this.startTime
  }
}

module.exports = {
  Timer
}