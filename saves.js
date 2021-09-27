// # SAVING TASKS

// # BROWSER 

function resetCookies() {
  // delete cookies
  let past = new Date()
  past.setTime(
    past.getTime() - 10000000)
  past = past.toUTCString()
  document.cookie = 'user=;expires=' + past + ';'
  document.cookie = 'fname=;expires=' + past + ';'
  document.cookie = 'pw=;expires=' + past + ';'
}

// # CLEANING

function clearEmptyHeadlines() {
  // clears empty headlines
  let parent
  if (selected == undefined) {
    return
  } else {
    if (
      selected.parents().toArray().includes(('#pop')[0]) ||
      selected.attr('id') == 'pop'
    ) {
      parent = $('#pop')
    } else if (
      selected.parents().toArray().includes(('#flop')[0]) ||
      selected.attr('id') == 'flop'
    ) {
      parent = $('#flop')
    }
  }
  for (
    heading of parent.find('span.h1').toArray().concat(
      parent.find('span.h2').toArray(),
      parent.find('span.h3').toArray()
    )) {
    if (getHeadingChildren($(heading)).length == 0) {
      $(heading).remove()
    }
  }
  save()
}

function updateTitles() {
  // update titles of any continuous events in view with current date
  let bh = $(':root').css('--butheight')
  // add in titles
  bh = Number(bh.slice(0, bh.length - 2)) + 
    Number($('#events').height())
  const curdate = stringToDate(stripChildren($($('.dateheading')
    .toArray().find((x) => { 
      return $(x).position().top > bh
    }))), true).getTime()
  const inview = $('#pop .continuous').toArray().filter((x) => { 
    return stringToDate($(x).attr('end')).getTime() > curdate &&
      $(x).attr('start') < curdate
  })
  const list = inview.map((x) => {
    return {title: $(x).attr('title'), end: $(x).attr('end')} 
  }).concat(duedates.filter((x) => { 
    return stringToDate(x.end).getTime() > curdate 
  })).map((x) => { 
    return $('<p style="margin:0;"><span class="falselink" deadline="' +
      x.end + '">' + x.title + '</span>' + 
      '<span class="eventspan" onclick="select(dateToHeading(' + 
      'stringToDate($(this).text())), true)">' + x.end + 
      '</span></p>')
  }).sort((a, b) => { 
    return stringToDate($($(a).children()[0]).attr('deadline')).getTime() - 
      stringToDate($($(b).children()[0]).attr('deadline')).getTime()
  })
  $('#events').empty()
  list.forEach((x) => { $('#events').append(x) })
}

// # SAVING

function queue(operation) {
  if (['migrate'].includes(operation)) {
    savequeue.push(operation)
  } else {
    savequeue.push([selected.clone(), operation])
  }
}

function updateImportants() {
  // updates importants list
  $('#importants').empty()
  importants.forEach((x) => { $('#importants').append(x) })
}

function updateDuedates() {
  // updates deadlines and events
} 

function save(undoing, cleaning) {
  // // console.log(savequeue);
  // process savequeue
  // update importants
  // update deadlines
  // uploadData()
  // if (savequeue == 'migrate') {
  //   // react to migrate operation which moves things and deletes things?
  //   // might not affect importants or deadlines or anything like that
  // }
  // savequeue = []
  // stores data
  unFilter(false)
  if (undoing) prevsave = JSON.parse(JSON.stringify(data))
  // save data
  data.pop = $('#pop').html()
  if (loadedlist != undefined) {
    if (loadedlist > data.flop.length - 1) {
      loadedlist = undefined
    } else {
      data.flop[loadedlist].text = $('#flop').html()
      data.flop[loadedlist].title =
        $('#loads').children()[loadedlist].value
    }
  }
  data.loadedlist = loadedlist
  // backup data to the server after setting localstorage data
  uploadData()
}

function diffsLog(oldString, newString) {
  if (!oldString || !newString) return
  // log diffs between previous data and new data
  let diffs = 'Diffs:'
  if (!oldString) oldString = JSON.stringify({ flop: [], pop: '' })
  const initialjson = JSON.parse(oldString)
  const olddata = initialjson.flop.concat(
    [{ 'title': 'pop', 'text': initialjson.pop }])
  const olddatadict = {}
  // create comparison copies of data, split into individual tasks 
  // (find span.in)
  for (list of olddata) {
    $('#test').html(list.text)
    olddatadict[list.title] = $('#test').find('span.in').toArray().map(
      (x) => { return x.outerHTML })
  }
  const responsejson = JSON.parse(newString)
  const newdata = responsejson.flop.concat(
    [{ 'title': 'pop', 'text': responsejson.pop }])
  const newdatadict = {}
  for (list of newdata) {
    $('#test').html(list.text)
    newdatadict[list.title] = $('#test').find('span.in').toArray().map(
      (x) => { return x.outerHTML })
  }
  for (list of Object.keys(olddatadict)) {
    if (!Object.keys(newdatadict).includes(list)) {
      diffs += '\n- list: ' + list
    } else {
      for (task of olddatadict[list]) {
        if (!newdatadict[list].includes(task)) {
          diffs += '\n- task in ' + list + ': ' + task
        }
      }
    }
  }
  for (list of Object.keys(newdatadict)) {
    if (!Object.keys(olddatadict).includes(list)) {
      diffs += '\n+ list: ' + list
    } else {
      let i = 0
      for (task of newdatadict[list]) {
        if (!olddatadict[list].includes(task)) {
          diffs += '\n+ task in ' + list + ': ' + task
        } else if (
          olddatadict[list][i] != task &&
          olddatadict[list][olddatadict[list].indexOf(task) - 1] !=
          newdatadict[list][i - 1] &&
          olddatadict[list][olddatadict[list].indexOf(task) + 1] !=
          newdatadict[list][i + 1]) {
          // moved tasks have different befores and afters; hack
          // to make so that it doesn't screw up on duplicate text
          diffs += '\nmoved task in ' + list + ': ' + task
        }
        i++
      }
    }
  }
  display(diffs)
  return diffs
}

function uploadData(reloading) {
  // upload data to the server
  if (window.parent.location.href.includes('welcome')) {
    return // for demo
  }
  display('--- upload started ---') 
  if (JSON.stringify(data) == prevupload) {
    display('identical');
    return
  }
  if (navigator.onLine && !offlinemode) {
    $.post("upload.php", {
      datastr: JSON.stringify(data),
    }, function (data, status, xhr) {
      diffsLog(prevupload, xhr.responseText)
      display('*** upload finished ***')
      prevupload = xhr.responseText
      localStorage.setItem('data', JSON.stringify(data))
      if (reloading) reload() // reloads page
    });
  } else {
    if (!navigator.onLine && !offline) {
      // if it's offline save that
      alert('Connection lost; saving locally')
      offline = true
    } else if (navigator.onLine && offline) {
      reload()
      return
    }
    // offline mode
    // console.log(data.pop);
    localStorage.setItem('data', JSON.stringify(data))
    diffsLog(prevupload, JSON.stringify(data))
    display('*** local upload finished ***')
    prevupload = JSON.stringify(data)
    if (reloading) {
      display('reloading from upload (offline)');
      reload() // reloads page
      return
    }
  }
}

// # LOADING

function undo() {
  // reset to previous save
  if (!prevsave) return
  // undo
  let oldselect
  if (selected) {
    oldselect = [getFrame(selected), 
      getFrame(selected).find('span.in').toArray().indexOf(selected[0])]
  }
  const floptop = $('#flop').scrollTop()
  const poptop = $('#pop').scrollTop()
  data = JSON.parse(JSON.stringify(prevsave))
  const oldload = Number(loadedlist)
  $('#pop').html(data.pop)
  $('#loads').empty()
  for (list of data.flop) {
    newlist(list.title, list.text, false)
    $('.taskselect').removeClass('taskselect')
  }
  loadedlist = oldload
  loadList(false)
  dragsOn(false)
  $('#flop').scrollTop(floptop)
  $('#pop').scrollTop(poptop)
  if (oldselect) {
    select(oldselect[0].find('span.in')[oldselect[1]])
  }
}

function reload() {
  // begin reload by downloading server data
  if (window.parent.location.href.includes('welcome')) {
    reload2()
    return
  }
  $('body').prepend("<div id='logoimage' class='show' style='z-index:2;opacity:0'><img src='logo.png'></div>")
  display('--- download started ---');
  if (!navigator.onLine || offlinemode) {
    // skip upload
    diffsLog(JSON.stringify(data), localStorage.getItem('data'))
    data = JSON.parse(localStorage.getItem('data'))
    display('*** local download finished ***')
    $('#logoimage').remove()
  } else {
    if (navigator.onLine && offline) {
      // upload data once navigator comes online
      const doupload = confirm('Connection detected; upload local data?\n' +
        '(overwrites changes from other devices)')
      offline = false
      if (doupload) {
        uploadData(true)
        return
      } else {
        alert('downloading from cloud...')
      }
    }
    $.post('download.php',
      function (datastr, status, xhr) {
        const diffs = diffsLog(JSON.stringify(data), xhr.responseText)
        if (diffs == 'Diffs:') {
          display('*** identical ***')
          $('#logoimage').remove()
        } else {
          display('*** download finished, reloading ***');
          $('#logoimage').animate({'opacity': 0.1}, 300)
          // only reload if data differs
          data = JSON.parse(xhr.responseText)
          reload2()
        }
      }
    )
  }
}

function reload2() {
  // data is downloaded, prepare page for reload
  let selectframe, selectindex
  try {
    if (selected && selected[0].tagName == 'SPAN') {
      selectframe = getFrame(selected)
      selectindex = selectframe.find('span.in').toArray().indexOf(selected[0])
    } else if (selected && getFrame(selected)) {
      selectframe = getFrame(selected)
    }
  } catch (err) {
    const floptop = $('#flop').scrollTop()
    const poptop = $('#pop').scrollTop()
    $('#pop').empty()
    $('#flop').empty()
    $('#loads').empty()
    loadPage(false, undefined, [floptop, poptop])
    $(':focus').blur()
    return
  }
  const floptop = $('#flop').scrollTop()
  const poptop = $('#pop').scrollTop()
  $('#pop').empty()
  $('#flop').empty()
  $('#loads').empty()
  loadPage(false, [selectframe, selectindex], [floptop, poptop])
  $(':focus').blur()
}

function stopload() {
  $('#pop').find('span.buffer').remove()
  $('#pop').prepend('<span class="buffer"></span>')
  $('#pop').append('<span class="buffer bottom"></span>')
  $('#flop').find('span.buffer').remove()
  $('#flop').prepend('<span class="buffer"></span>')
  $('#flop').append('<span class="buffer bottom"></span>')
  $('#logoimage').remove()
  debugger
}

function loadPage(starting, oldselect, scrolls) {
  if (!window.location.href.includes('welcome')) {
    $('#username').text(getCookie('user'))
  }
  if (starting) {
    // start window for first load
    window.savequeue = [] // edited tasks
    window.loadedlist = data.loadedlist // loaded list
    window.selected = undefined // selected task
    window.dragsenabled = true // editing lists
    window.focused = false // focus mode
    window.movelist = false // moving lists
    window.movetask = undefined // moving task
    window.slider = undefined // event slider
    window.durslider = undefined // duration slider
    window.stopwatch = false // stopwatch
    window.copieditem = undefined // copy/paste
    window.prevupload = undefined // upload
    window.prevsave = undefined // undo
    window.flopscrollsave = undefined // dragging
    window.popscrollsave = undefined // dragging
    window.justclicked = false // context
    window.dblclicked = false // doubleclick
    window.dragtimer = undefined // autoscroll drag
    window.draggingtask = false // drags
    window.justdropped = false // drop check
    window.justcollapsed = false // motion on collapsed
    window.duedates = [] // events update
    window.importants = [] // importants update
    window.filtered = undefined // filtering
    window.filteredlist = undefined // filtered tasks
    window.activedate = new Date()
    if (activedate.getHours() < 3) {
      activedate.setDate(activedate.getDate() - 1) // active date
    }
    // mobile widths for reloading
    if (window.innerWidth < 600) window.mobile = true
    else if (window.innerWidth > 600) window.mobile = false
    window.linestarts = {
      '# ': 'h1',
      '## ': 'h2',
      '### ': 'h3',
      '•': 'list',
      '@': 'event',
      '-': 'note'
    } // span types
    window.weekdaysNum = {
      'U': 0, 'M': 1, 'T': 2, 'W': 3, 'R': 4, 'F': 5, 'S': 6,
      'u': 0, 'm': 1, 't': 2, 'w': 3, 'r': 4, 'f': 5, 's': 6,
      'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6,
      'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6,
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4,
      'Friday': 5, 'Saturday': 6,
      'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
      'friday': 5, 'saturday': 6,
      'tues': 2, 'Tues': 2, 'thurs': 4, 'Thurs': 4, 'frid': 5, 'Frid': 5,
      'su': 0, 'mo': 1, 'tu': 2, 'we': 3, 'th': 4, 'fr': 5, 'sa': 6,
      'Su': 0, 'Mo': 1, 'Tu': 2, 'We': 3, 'Th': 4, 'Fr': 5, 'Sa': 6,
    } // weekdays conversion
    if (data.play === undefined) { data.play = 'true' } // set play
    if (data.headingalign === undefined) data.headingalign = 'center'
    // load style
    $('head').append(
      $("<link id='theme' rel='stylesheet' type='text/css' href='" +
        data.style + "' />")
    )
    $.get(data.style, 
      function () { 
        $('#logoimage').animate({opacity: 0}, 500)
        setTimeout(function() { 
          $('#logoimage').remove() 
          resetdoc()
        }, 500)
      }
    )
    if (data.weekdays == 'M') {
      weekdaysStr = { 0: 'U', 1: 'M', 2: 'T', 3: 'W', 4: 'R', 5: 'F', 6: 'S' }
    } else if (data.weekdays == 'Mon') {
      weekdaysStr = {
        0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri',
        6: 'Sat'
      }
    }
    // event bindings
    $(document).on('keydown', keyDown)
    $(document).on('keyup', keyUp)
    $(document).on('contextmenu', function(event) {
      context(event)
      $('#listcontainer > span').hide()
    })
    $(document).on('mousedown', clickOn)
    $(document).on('mouseup', clickOff)
    $(window).resize(updateSizes)
    $(window).focus(function () {
      // // console.log('reloading');
      reload()
    })
    $('#container').on('mouseleave', function () {
      save()
    })
    $('.dropdown-item').mouseover(function () { 
      $(this).css('color', 'var(--select)')
    })
    $('.dropdown-item').mouseleave(function () { 
      $(this).css('color', '')
    })
    $('#pop').on('scroll', updateTitles)
    if (window.innerWidth < 600) { 
      // collapse menu
      toggleCollapse()
    }
    try {
      if (Notification.permission != 'granted') {
        Notification.requestPermission()
      }
    } catch (err) {
      // // console.log('window notifications disabled');
    }
    setInterval(timeCheck, 60000) // checks every minute for reminders
    if (mobiletest()) {
      $('head').append('<link href="mobilestyle.css" rel="stylesheet">')
    }
    display('loaded settings');
  }
  // behavior for all reloads
  if ($('#theme').attr('href') != data.style) {
    // reloads theme if it was changed
    setStyle(data.style)
  }
  document.documentElement.style.setProperty('--headingalign',
    data.headingalign)
  // load pop
  $('#pop').html(data.pop)
  for (list of data.flop) {
    // load lists
    const newthing = $('<textarea class="listtitle unselected"></textarea>')
    newthing.on('dragstart', dragList)
    newthing.on('drop', dropList)
    newthing.on('click', loadthis)
    newthing.attr('draggable', 'true')
    newthing.val(list.title)
    $('#loads').append(newthing)
  }
  const children = $('#loads').children().toArray()
  for (i in children) {
    // remember folding
    const val = $(children[i]).val()
    if (val.slice(val.length - 4) == ' ...') {
      toggleFoldList(false, i)
    }
  }
  loadList(false) // load list from data
  if (data.help == 'show') $('#help').show()
  if (data.help == 'hide') $('#help').hide()
  if (data.hidebuts == 'false') {
    data.hidebuts = 'true'
  } else if (data.hidebuts == 'true') {
    data.hidebuts = 'false'
  }
  toggleButs(false)
  // reload deadlines
  $('.duedate').remove()
  let counter = 0
  for (list of data.flop.concat([{
    'title':'pop', 
    'text':$('#pop').html()}])) {
    // scan data for deadlines
    $('#test').empty()
    $('#test').html(list.text)
    $('#test').find('span.important:not(.complete)').toArray()
      .forEach((x) => {
        // add all important tasks to a list
        importants.push($('<p><span class="impspan" list="' + 
          counter + '">' + list.title + '</span>' + 
          '<span class="falselinkimp">' + stripChildren($(x)) + 
          '</span></p>'))
      })
    counter ++
    for (let deadline of $('#test').find('.deadline').filter(function () {
      return !$(this).parent().hasClass('complete')
    })) {
      // append under heading
      const text = stripChildren($($(deadline).parent()))
      const index = text.search('>')
      const endindex = index + text.slice(index).search(' ')
      const date = $(deadline).text().slice(1)
      const heading = dateToHeading(stringToDate(date), false)
      const duedate = $('<span class="duedate"></span>')
      // take out deadline
      duedate.text('> ' +
        text.slice(0, index).replace(/^•\s/, '').replace(/^\-\s/, '') +
        text.slice(endindex))
      $(heading).after(duedate)
      if (list.title != 'pop') {
        duedates.push({
          'title': duedate.text().slice(2),
          'end': date
        })
      }
    }
  }
  updateImportants()
  updateDuedates()
  // update continous dates
  $('.continuous').remove()
  $('#pop').find('span.in:not(.complete) > .deadline').toArray().forEach((x) => {
    // create continuous date lines
    function castrate(phallus) {
      return String(phallus).slice(0, String(phallus).indexOf('.'))
    }
    const targetdate = $(dateToHeading(stringToDate($(x).text().slice(1))))
    const newelt = $('<div class="continuous"></div>')
    const scrolltop = $('#pop').scrollTop()
    const xpos = $(x).offset().top - $('#pop').offset().top
    newelt.css('top', '0')
    const target = $(getHeadingChildren(targetdate).filter((y) => { 
      // finds target deadline
      return $(y).hasClass('duedate') && 
        $(x).parent().text().includes(
        $(y).text().slice(2, $(y).text().length - 1))
    }))[0]
    newelt.css('height', castrate(
      target.position().top + target.height() - xpos) + 'px')
    newelt.attr('title', ($(x).parent().text().slice(0, $(x).parent().text().indexOf(' >'))))
    newelt.attr('start', 
      stringToDate(stripChildren($(getHeading($(x))))).getTime())
    newelt.attr('end', $(x).text().slice(1)) // as text for searching
    $(x).append(newelt)
  })
  // clean data
  $('.taskselect').removeClass('taskselect')
  $('textarea.in').remove()
  // cleans invisible things which aren't folded under headings
  // const hiddens = $('span:not(:visible)')
  // for (hidden of hiddens) {
  //   if (!getHeading($(hidden)) || 
  //     $(getHeading($(hidden))).attr('folded') != 'true') {
  //     hidden.remove()
  //   }
  // }
  for (span of $('span').toArray()) {
    // remove empty spans
    if (['', ' ', '\n'].includes($(span).text())) {
      $(span).remove()
    }
  }
  // reset styling
  $('span.in:visible').attr('style', '')
  console.log($('.dateheading.complete'));
  $('.dateheading.complete').removeClass('complete')
  timeCheck(true)
  console.log($('.dateheading.complete'));
  // merge duplicate dates
  // const dateheadings = $('.dateheading').toArray()
  // const dates = []
  // const duplicates = []
  // dateheadings.forEach((x) => {
  //   // rewrite dates and remove weird ones
  //   if ($(x).text().includes('undefined') ||
  //     [' ...', '...'].includes(stripChildren($(x)))) {
  //     $(x).remove
  //   } else {
  //     let text = stripChildren($(x)).replace(' ...', '')
  //     while (text.charAt(text.length - 1) == ' ') {
  //       text = text.slice(0, text.length - 1)
  //     }
  //     if (!dates.includes(text)) { dates.push(text) }
  //     else if (!duplicates.includes(text)) { 
  //       duplicates.push(text) 
  //     }
  //   }
  // })
  // for (duplicate of duplicates) {
  //   // merge duplicate dates
  //   const headingslist = $('.dateheading').toArray().filter((x) => {
  //     return stripChildren($(x)).includes(duplicate)
  //   })
  //   console.log(headingslist);
  //   const firstheading = $(headingslist[0])
  //   for (heading of headingslist.slice(1)) {
  //     getHeadingChildren($(heading)).forEach((x) => {
  //       firstheading.prepend(x)
  //     })
  //   }
  //   headingslist.slice(1).forEach((x) => { x.remove() })
  // }
  // clear empty dates & process future dates
  const now = activedate.getTime()
  $('#pop').children().filter('.dateheading').toArray().forEach((x) => {
    if (getHeadingChildren($(x)).length == 0) {
      const then = stringToDate(stripChildren($(x)), true).getTime()
      if (then == now) {
        // today
        // console.log('today', x);
      } else if (then > now &&
        then < now + 2628000000) {
        // if less than one month from now
        $(x).addClass('futuredate')
      } else {
        $(x).remove()
      }
    }
  })
  // sort headings
  // $('#test').empty() // rewrites pop's html
  // const headingslist = $('#pop').children().filter('.dateheading')
  //   .toArray().concat([])
  // for (heading of headingslist.sort((a, b) => {
  //   return stringToDate(stripChildren($(a)), true).getTime() -
  //     stringToDate(stripChildren($(b)), true).getTime()})) {
  //   const children = getHeadingChildren($(heading)).reverse()
  //   $('#test').append($(heading))
  //   children.forEach((x) => {
  //     $(heading).after($(x))
  //   })
  // }
  // $('#pop').empty()
  // $('#pop').html($('#test').html())
  // clean empty lists
  const loads = $('#loads').children().toArray().concat([])
  for (list in loads) {
    try {
      $('#test').html(data.flop[list].text)
    } catch (err) {
      $($('#loads').children()[list]).remove()
      continue
    }
    // clears out empty lists
    if ($(loads[list]).val().length <= 1 &&
      $('#test > .in').length == 0 &&
      loadedlist != list) {
      data.flop.splice(list, 1)
      $($('#loads').children()[list]).remove()
    }
  }
  // update formatting
  $('#pop').find('span.buffer').remove()
  $('#pop').prepend('<span class="buffer"></span>')
  $('#pop').append('<span class="buffer bottom"></span>')
  $('#flop').find('span.buffer').remove()
  $('#flop').prepend('<span class="buffer"></span>')
  $('#flop').append('<span class="buffer bottom"></span>')
  updateSpanDrags()
  if (scrolls) {
    $('#flop').scrollTop(scrolls[0])
    $('#pop').scrollTop(scrolls[1])
  }
  if (oldselect) {
    // select previous selected
    if (oldselect[1])
      select(oldselect[0].find('span.in').toArray()[oldselect[1]])
    else if (oldselect[0])
      select(oldselect[0])
  } else {
    setTimeout(scrollToToday, 1000)
  }
  updateSizes()
  if (starting == false) {
    // remove image after reload
    $('#logoimage').stop(true)
    $('#logoimage').animate({opacity: 0}, 500)
    setTimeout(function() { $('#logoimage').remove() }, 500)
  }
  resetdoc()
}