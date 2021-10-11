// # TIMER

var timer = new Timer({
  // using timer.js, start the window's timer
  tick: 1,
  ontick: function (sec) {
    stopwatchTime(sec)
  },
  onstart: function (sec) { stopwatchTime(sec) }
})

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
  if (mobileTest()) {
    setTimeout(function() { alert('timer complete') }, 1000)
    $('#timerent').val('')
  } else {
    $('#timerent').val('0:00')
    var timertime = new Date().getTime()
    if (stopwatch) clearInterval(stopwatch)
    stopwatch = setInterval(function () {
      const curtime = new Date().getTime() - timertime
      stopwatchTime(curtime, '-')
    }, 1000)
  }
})

function addTime(time) {
  // adds time to the timer
  if ($('#timerent').val().includes('-')) {
    stopTimer()
  } else {
    timer.stop()
  }
  if ($('#timerent').val().split(':').length == 3) {
    $('#timerent').val(
      String(Number($('#timerent').val().split(':')[0]) * 60 + 
      Number($('#timerent').val().split(':')[1]) + time) +
      ':' + $('#timerent').val().split(':')[1]
    )
  } else if ($('#timerent').val().split(':').length == 2) {
    $('#timerent').val(
      String(Number($('#timerent').val().split(':')[0]) + time) +
      ':' + $('#timerent').val().split(':')[1]
    )
  } else {
    $('#timerent').val(Number($('#timerent').val() + time) + ':00')
  }
  startTimer()
}

function stopwatchTime(curtime, negative) {
  if (!negative) negative = ''
  console.log(curtime / 1000)
  let hours = Math.floor(curtime / (60000 * 60))
  let minutes = Math.floor((curtime - (hours * (60000 * 60))) / 60000); 
    // minutes
  let secs = Math.ceil(
    Math.ceil((curtime - (hours * (60000 * 60))) - minutes * 60000) / 1000)
  if (hours > 0) {
    $('#timerent').val(negative + String(hours) + ':' + 
      String(minutes).padStart(2, 0) + ':' + String(secs).padStart(2, 0))
  } else {
    $('#timerent').val(negative + String(minutes) + ':' + 
      String(secs).padStart(2, 0))
  }
}

function startTimer() {
  const s = $('#startsnd')[0]
  s.src = s.src
  s.play()
  let startitme
  if ($('#timerent').val() == ':00') {
    var timertime = new Date().getTime()
    $('#timerent').val('0:00')
    if (stopwatch) clearInterval(stopwatch)
    stopwatch = setInterval(function () {
      const curtime = new Date().getTime() - timertime
      stopwatchTime(curtime)
    }, 1000)
  } else {
    timertext = $('#timerent').val()
    if (!timertext.includes(':')) {
      starttime = timertext * 60
    } else if (timertext.split(':').length == 3) {
      split = timertext.split(':').map((x) => {
        return Number(x)
      })
      starttime = split[0] * 60 * 60 + split[1] * 60 + split[2]
    } else if (timertext.includes(':')) {
      split = timertext.split(':').map((x) => {
        return Number(x)
      })
      starttime = split[0] * 60 + split[1]
    }
  }
  time = starttime
  timer.start(starttime)
  // setTimeout(function() { stopwatchTime(starttime) }, 10)
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

// # EVENTS

function mod12(val) {
  // convert times to 12-hour clock time (events)
  if (val > 12.9) return val - 12
  else if (val < 1) return val + 12
  else return val
}

function compareTimes(a, b) {
  // compares prev/after times based on 6h before
  if (a >= 6) {
    // 6-12
    if (b > a) return 1
    else return -1 // same counts as before
  } else {
    // 1-6
    if (b > a && b < mod12(a - 6)) return 1
    else return -1
  }
}

function eventTimeFormat(el) {
  function process(x) {
    // convert to number
    let pm = false
    if (x.includes(':')) {
      // round times
      x = x.split(':')
      x[1] = Number(x[1].replace(/\D/g, ''))
      if (x[1] > 15 && x[1] < 31) { x[0] += '.5' }
      else if (x[1] > 31) { x[0] = Number(x[0]) + 1 }
      x = Number(x[0])
    } else {
      x = Number(x.replace(/\D/g, ''))
    }
    return x
  }
  function mod12sub(x, y) {
    // subtracts mod 12
    if (x - y < 0) {x += 12}
    return x - y
  }
  if ($($(el).children().filter('.timing')).length == 0) return
  let timing = $($(el).children().filter('.timing')[0]).text().split('-')
  timing = timing.map(x => { return process(x) })
  if (timing.length == 2 && mod12sub(timing[1], timing[0]) > 1) {
    $(el).css('padding-bottom', mod12sub(timing[1], timing[0]) + 'em')
  } else if (timing.length == 1 &&
    $(el).next().find('.timing')[0]) {
    // treat start of next event as next time
    $(el).css('padding-bottom', 
      mod12sub(
      process($($(el).next().find('.timing')[0]).text().split('-')[0]), 
      timing[0]) + 'em')
  } else {
    $(el).css('padding-bottom', '')
  }
}

function dragTime(el) {
  // enable event timings to be dragged after clicking on them
  let pretext = el.text().split('-')
  function timetest(text, placement, included) {
    // replaces pm and am
    if ((pretext[placement].includes('11:30a') && text.includes('12')) ||
    (pretext[placement].includes('12a') && text.includes('11:30'))) {
      // rollover pms
      if (placement == 0) endof = endof.replace('a', 'p')
      else if (placement == 1) endof2 = endof2.replace('a', 'p')
    } else if ((pretext[placement].includes('11:30p') && text.includes('12')) ||
    (pretext[placement].includes('12p') && text.includes('11:30'))) {
      // rollover ams
      if (placement == 0) endof = endof.replace('p', 'a')
      else if (placement == 1) endof2 = endof2.replace('p', 'a')
    }
    if (placement == 0 && included != false) return text + endof
    else if (placement == 0) return text
    else if (placement == 1) return text + endof2
  }
  // sets up sliders to drag times on events
  $('.slider').remove()
  slider = $('<input type="range" min="-12" max="12" value="0"' +
    ' class="slider slider-vert">')
  $(document.body).append(slider)
  slider.css('top', el.offset().top + 5)
  slider.css('left', el.offset().left - 210)
  durslider = $(
    '<input type="range" min="-12" max="12" value="0" class="slider">')
  $(document.body).append(durslider)
  durslider.css('top', el.offset().top + 25)
  durslider.css('left', el.offset().left - 195 + el.width() / 2)
  const splitlist = el.text().split('-')
  let durval
  // cleans out nonrounded values
  const endmatch = splitlist[0].match(/[a-z]+$/)
  let endof = ''
  let endof2 = ''
  if (endmatch) { 
    endof = endmatch[0] 
    splitlist[0] = splitlist[0].slice(0, splitlist[0].search(endof))
  }
  if (!/\d+:30/.test(splitlist[0]) && !/^\d+$/.test(splitlist[0])) {
    splitlist[0] = splitlist[0].split(':')[0] + ':30'
  }
  const origvalue = Number(splitlist[0].replace(':30', '.5'))
  if (splitlist[1]) {
    // set endpoint if it exists
    const endmatch2 = splitlist[1].match(/[a-z]+$/)
    if (endmatch2) { 
      endof2 = endmatch2[0] 
      splitlist[1] = splitlist[1].slice(0, splitlist[1].search(endof2))
    }
    if (!/:30/.test(splitlist[1]) && !/^\d+$/.test(splitlist[1])) {
      splitlist[1] = splitlist[1].split(':')[0] + ':30'
    }
    durval = Number(splitlist[1].replace(':30', '.5'))
  } else durval = origvalue

  slider.on('input', function () {
    // change time
    if (durslider) durslider.remove()
    let changeval = mod12(origvalue + slider.val() / 2)
    if (durval != origvalue) {
      durchangeval = mod12(durval + slider.val() / 2)
      el.text(timetest(String(changeval).replace('.5', ':30'), 0) + 
        '-' + timetest(String(durchangeval).replace('.5', ':30'), 1))
    } else {
      el.text(timetest(String(changeval).replace('.5', ':30'), 0))
    }
    pretext = el.text().split('-')
  })
  durslider.on('input', function () {
    // change duration
    if (slider) slider.remove()
    durchangeval = mod12(durval + durslider.val() / 2)
    // prevent earlier
    if (compareTimes(origvalue, durchangeval) <= 0 &&
      durslider.val() <= 0) {
      el.text(timetest(splitlist[0], 0))
      pretext = [el.text()]
        .concat([el.text()])
    } else {
      if (!endof2) {
        endof2 = endof
        pretext = [timetest(splitlist[0], 0)]
          .concat(String(durchangeval).replace('.5', ':30') + endof2)
      }
      el.text(timetest(splitlist[0], 0) + '-' +
        timetest(String(durchangeval).replace('.5', ':30'), 1))
      pretext = el.text().split('-')
    }
  })
  durslider.on('mouseup touchend', function () {
    slider.remove()
    durslider.remove()
    eventTimeFormat(selected)
    save('+', selected)
  })
  slider.on('mouseup touchend', function () {
    slider.remove()
    durslider.remove()
    eventTimeFormat(selected)
    eventTimeFormat(selected.prev())
    save('+', selected)
  })
}

function timeCheck() {
  // checks the current time and sees if any events match it for notifications
  const eventslist = getHeadingChildren(dateToHeading(stringToDate('0d')))
    .filter((x) => {
    const t = $(x).text().split(' ')[0]
    return $(x).hasClass('event') && 
      /^\d/.test(t) && /[\dapm]+/.test(t)
  })
  const now = new Date()
  now.setMinutes(now.getMinutes() + 15) // reminds in 15 minutes
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
    else if ((eventtime.includes('p') && eventtime[0].includes('12')) 
      || pm) {
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
  migrate() // migrate previous dates in
}