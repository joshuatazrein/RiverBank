//# TIMER
var timer = new Timer({
  tick: 1,
  ontick: function (sec) {
    let minutes = Math.floor((sec) / 60000); // minutes
    let secs = Math.ceil((sec - (minutes * 60000)) / 1000)
    if (secs == 60) {
      minutes += 1
      secs = 0
    }
    $('#timerent').val(String(minutes) + ':' +
      String(secs).padStart(2, 0))
  },
  onstart: function () { }
})

// defining options using on
timer.on('end', function () {
  // display notification and sound
  if (window.Notification) {
    if (Notification.permission === 'granted') {
      // notify
      var notify = new Notification('RiverBank', {
        body: 'timer complete',
        icon: 'logo.png'
      })
    }
  }
  if (data.play == 'true') {
    const timersnd = new Audio('snd/timer.mp3')
    timersnd.play()
  }
  var timertime = new Date().getTime()
  $('#timerent').val('0:00')
  if (stopwatch) clearInterval(stopwatch)
  stopwatch = setInterval(function () {
    const curtime = new Date().getTime() - timertime
    let minutes = Math.floor(curtime / 60000); // minutes
    let secs = Math.floor(Math.ceil(((curtime) - minutes * 60000)) / 1000)
    $('#timerent').val('-' + String(minutes) + ':' +
      String(secs).padStart(2, 0))
  }, 1000)
})

function timeCheck() {
  // checks the current time and sees if any events match it for notifications
  const eventslist = getHeadingChildren(dateToHeading(stringToDate('0d')))
    .filter((x) => {
    return $(x).hasClass('event') && 
      /^\d/.test($(x).text().split(' ')[0])
  })
  const now = new Date()
  const testtime = [now.getHours(), now.getMinutes()]
  let pm = false // for am/pm
  let curhour = 0 // tracks current hour
  for (task of eventslist) {
    // analyzes match from time description in event
    const timelist = [0, 0]
    const eventtime = task.text().split(' ')[0].split('-')[0]
    const hours = eventtime.split(':')[0]
    if (Number(hours) < curhour) pm = true
    if (eventtime.includes(':')) timelist[1] = 
      Number(/^\d+/.exec(eventtime.split(':')[1]))
    else timelist[1] = 0
    // process hours
    if (eventtime.includes('a')) timelist[0] = Number(hours)
    else if (eventtime.includes('p') || pm) {
      timelist[0] = Number(hours) + 12
      pm = true
    }
    else timelist[0] = Number(hours)
    // test for match
    if (JSON.stringify(testtime) == JSON.stringify(timelist)) {
      new Notification('RiverBank', {body: task.text()})
    }
    curhour = timelist[0]
  }
}

function addTime(time) {
  // adds time to the timer
  if ($('#timerent').val().includes('-')) {
    stopTimer()
  } else {
    timer.stop()
  }
  if ($('#timerent').val().split(':').length > 1) {
    $('#timerent').val(
      String(Number($('#timerent').val().split(':')[0]) + time) +
      ':' + $('#timerent').val().split(':')[1]
    )
  } else {
    $('#timerent').val(Number($('#timerent').val() + time) + ':00')
  }
  startTimer()
}


function startTimer() {
  if ($('#timerent').val() == '') {
    var timertime = new Date().getTime()
    $('#timerent').val('0:00')
    if (stopwatch) clearInterval(stopwatch)
    stopwatch = setInterval(function () {
      const curtime = new Date().getTime() - timertime
      let minutes = Math.floor(curtime / 60000); // minutes
      let secs = Math.floor(Math.ceil(((curtime) - minutes * 60000)) / 1000)
      $('#timerent').val(String(minutes) + ':' +
        String(secs).padStart(2, 0))
    }, 1000)
  } else {
    timertext = $('#timerent').val()
    if (!timertext.includes(':')) {
      timer.start(timertext * 60)
      time = timertext * 60000
    } else if (timertext.includes(':')) {
      split = timertext.split(':').map((x) => {
        return Number(x)
      })
      timer.start(split[0] * 60 + split[1])
    }
  }
  $('#timerent').blur()
}

function stopTimer() {
  timer.stop()
  if (stopwatch) clearInterval(stopwatch)
  $('#timerent').blur()
  $('#timerent').val('')
}

function timertest(ev) {
  if (ev.key == 'Enter') {
    ev.preventDefault()
    startTimer()
  } else if (ev.key == 'Escape') {
    ev.preventDefault()
    stopTimer()
  } else if (ev.key == ' ') {
    ev.preventDefault()
   if (!pause) {
      timer.pause()
      if (stopwatch) clearInterval(stopwatch)
      $('#timerent').blur()
      pause = true
    } else {
      startTimer()
      pause = false
    }
  }
}