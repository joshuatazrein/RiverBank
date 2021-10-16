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

function castrate(phallus) {
  return String(phallus).slice(0, String(phallus).indexOf('.'))
}

function clean() {
  // cleans data
  $('span.in:visible:not(.event)').attr('style', '')
  $('span.in.event').toArray().forEach(x => {
    eventTimeFormat($(x))
  })
  $('span.in').attr('quickhelp', 'task (see help: syntax)')
  $('span.dateheading').attr('quickhelp', 'date (see help: dates)')
  $('textarea.listtitle').attr('quickhelp', 'list (click or drag)')
  $('#flop').attr('quickhelp', 'Bank (unscheduled tasks)')
  $('#pop').attr('quickhelp', 'River (scheduled tasks)')
  $('span.deadline').attr('quickhelp', 'deadline (see help: dates)')
  $('span.duedate').attr('quickhelp', 'duedate (click to see task)')
  $('span.timing').attr('quickhelp', 'time (click to adjust)')
  $('span.event').attr('quickhelp', 'event (see help: syntax)')
  $('span').attr('title', '')
  $('textarea').attr('title', '')
  $('button').attr('title', '')
  for (span of $('span:not(.mobhandle):not(#quickhelp)').toArray()) {
    if (['', ' ', '\n'].includes($(span).text())) {
      // remove empty ones
      $(span).remove()
    }
  }
  // clean empty lists
  function cleanLists() {
    let loadlist = $('#loads').children().toArray()
    for (list in loadlist) {
      try {
        $('#test').html(data.flop[list].text)
        // clears out empty lists
        if ($(loadlist[list]).val().length <= 1 &&
          $('#test > .in').length == 0 &&
          loadedlist != list) {
          data.flop.splice(list, 1)
          $($('#loads').children()[list]).remove()
        }
      } catch (err) {
        $($('#loads').children()[list]).remove()
        cleanLists()
      }
    }
  }
  cleanLists()
  $('textarea.in').remove()
  // // cleans invisible things which aren't folded under headings
  // let headings = $('span').toArray()
  // headings = headings.filter((x) => {
  //   if ($(x).attr('folded') == 'true' &&
  //     $(x).css('display') != 'none') {
  //     return true
  //   }
  // })
  // let foldedlist = []
  // for (heading of headings) {
  //   foldedlist =
  //     foldedlist.concat(getHeadingChildren($(heading)).map((x) => {
  //       return x[0]
  //     }))
  // }
  // const blindeds = $('span').toArray().filter((x) => {
  //   return ($(x).css('display') == 'none')
  // })
  // for (blinded of blindeds) {
  //  if (!foldedlist.includes(blinded) &&
  //     $(blinded) != selected && 
  //     !($(blinded).hasClass('dateheading') ||
  //     (getHeading($(blinded)) && 
  //     getHeading($(blinded)).hasClass('dateheading')))) {
  //     // filter out subtasks
  //     if ($(blinded).parent()[0].tagName != 'SPAN') $(blinded).remove()
  //   }
  // }
  // sort headings
  const headingslist = $('#pop').children().filter('.dateheading').toArray()
  const now = stringToDate('today').getTime()
  for (heading of headingslist.sort((a, b) => {
    return stringToDate(stripChildren($(a)), true).getTime() -
      stringToDate(stripChildren($(b)), true).getTime()
  })) {
    if ([' ...', '...'].includes(stripChildren($(heading)))) {
      heading.remove()
      continue
    }
    if (stringToDate(stripChildren($(heading)), true).getTime() < now) {
      $(heading).addClass('complete')
      if ($(heading).attr('folded') == 'false') {
        toggleFold($(heading), false)
      }
    } else {
      $(heading).removeClass('complete')
      if ($(heading).attr('folded') == 'true') {
        toggleFold($(heading), false)
      }
    }
    const children = getHeadingChildren($(heading)).reverse()
    $('#pop').append($(heading))
    children.forEach((x) => {
      $(heading).after($(x))
    })
  }
  $('.dateheading').toArray().forEach((x) => {
    if ($(x).attr('folded') == 'true') {
      $(x).attr('folded', 'false')
      toggleFold($(x), false)
    }
  })
  updatePast()
}

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
  save('-')
}

function clearEmptyDates() {
  // take away empty dates
  $('.futuredate').removeClass('futuredate')
  const dateslist = $('#pop').children().filter('.dateheading')
  const now = stringToDate('0d').getTime()
  for (date of dateslist) {
    const thistime = stringToDate(stripChildren($(date)), true).getTime()
    if (getHeadingChildren($(date)).length == 0 &&
      thistime != now &&
      date != selected) { 
      if (thistime < now || thistime > now + 2629800000) {
        // clear the date if it's past or more than a month from now
        $(date).remove() 
      } else {
        // minimize the date
        $(date).addClass('futuredate')
      }
    }
  }
}

function migrate() {
  var now = new Date()
  display('migrating...')
  var initial = now.getTime()
  // move past tasks to today
  const todaydate = stringToDate('0d')
  const today = todaydate.getTime()
  const todayheading = $(dateToHeading(stringToDate('0d'), false))
  const headings = $('#pop').children().filter('.dateheading').toArray()
  function migratable(x) {
    // checks to see if heading has incomplete tasks
    for (child of getHeadingChildren($(x))) {
      if (!$(child).hasClass('complete') && !$(child).hasClass('duedate')) {
        return true
      }
    }
  }
  const appends = []
  for (heading of headings) {
    if (stringToDate(stripChildren($(heading)), true).getTime() < today) {
      if (migratable(heading)) {
        try {
          if (selected &&
            (selected[0] == heading ||
            (getHeading(selected) && getHeading(selected)[0] == heading))) {
            continue
          }
        } catch (err) {
          display(err)
          continue
        }
        // migrate all uncompleted tasks
        for (child of getHeadingChildren($(heading))) {
          const ch = $(child)
          if (/^completed/.test(ch.text()) && 
            heading != todayheading[0]) {
            // takes out the uncompleted heading
            if (ch.attr('folded') == 'true') { 
              toggleFold($(heading), false) 
            }
            ch.remove()
            continue
          }
          if (ch.hasClass('event') && !ch.hasClass('complete')) {
            toggleComplete(ch, false)
          } if (!ch.hasClass('complete') && 
            !isRepeat(ch) && !isHeading(ch) &&
            !ch.hasClass('duedate')) {
            // push all uncompleted tasks
            appends.push(ch)
          }
          if (!isRepeat(ch)) {
            ch.children().filter('span.in:not(.complete):not(.duedate)')
              .toArray().forEach((x) => { appends.push(x) })
          }
        }
      }
      // fold and complete
      $(heading).addClass('complete')
      if ($(heading).attr('folded') == 'false') {
        toggleFold($(heading), false)
      }
    }
  }
  const headingchildren = getHeadingChildren(todayheading)
  if (appends.length > 0) {
    // append tasks after it
    appends.forEach((x) => {
      $(x).show()
      todayheading.after($(x))
    })
  }
  now = new Date()
  display('migrated:' + (now.getTime() - initial))
  var initial = now.getTime()
  // creating relative dates
  $('.placeholder').remove()
  for (heading of $('#pop').children().filter('.dateheading')) {
    // add in relative dates underneath
    const newelt = createBlankTask()
    newelt.html(datesToRelative(
      todaydate,
      stringToDate(stripChildren($(heading)), true)))
    newelt.addClass('placeholder')
    newelt.removeClass('in')
    $(heading).append(newelt)
  }
  now = new Date()
  display('updated relatives:' + (now.getTime() - initial))
  var initial = now.getTime()
  // update future dates up to 30 days from now
  const curdate = todaydate.getDate()
  for (let i = 1; i < 30; i ++) {
    const futuredate = new Date()
    futuredate.setDate(curdate + i)
    const newdate = dateToHeading(futuredate, false)
  }
  now = new Date()
  display('updated futures:' + (now.getTime() - initial))
  var initial = now.getTime()
}

function updatePast() {
  console.log('update past');
  var today = dateToHeading(stringToDate('0d'))
  var headings = $('#pop').children().toArray()
  headings = headings.slice(0, headings.indexOf(today))
  if (pastdates) {
    headings.forEach(x => { 
      const el = $(x)
      if (!el.is(':visible')) el.show() 
    })
  } else {
    headings.forEach(x => { 
      const el = $(x)
      if (el.is(':visible')) el.hide() 
    })
  }
}

function updateTitles() {
  // update titles of any continuous events in view with current date
  // add in titles
  const thisdate = dateToString(new Date())
  const bottomdate = $('#pop .dateheading').toArray().find((x) => { 
    return $(x).position().top > 0 && 
      $(x).position().top < $('#pop').height()
  })
  if (bottomdate == undefined) { return }
  const curdate = stringToDate(stripChildren($(bottomdate)), true).getTime()
  const inview = $('#pop .continuous:not(.complete)').toArray().filter((x) => { 
    return $(x).attr('start') < curdate
  })
  const today = new Date()
  const list = inview.map((x) => {
    return {title: $(x).attr('title'), end: $(x).attr('end'), 
      overdue: stringToDate($(x).attr('end')).getTime() < curdate} 
  }).concat(window.duedates.map((x) => { return {title: x.title, end: x.end, 
    overdue: datesToRelative(stringToDate('0d'),
      stringToDate(x.end)).includes('-')} }))
  const displaylist = list.map((x) => { 
    return $('<p style="margin:0;"><span class="falselink" quickhelp="deadline" deadline="' +
      x.end + '" overdue="' + x.overdue + '">' + 
      x.title.replace(/•\s/, '').replace(/\-\s/, '') + '</span>' + 
      '<span class="eventspan" quickhelp="due date" onclick="select(dateToHeading(' + 
      'stringToDate($(this).text())), true)" overdue="' + 
      x.overdue + '"">' + datesToRelative(stringToDate('0d'),
        stringToDate(x.end)) + 
        '</span></p>')
  }).sort((a, b) => { 
    return stringToDate($($(a).children()[0]).attr('deadline')).getTime() - 
      stringToDate($($(b).children()[0]).attr('deadline')).getTime()
  })
  $('#events').empty()
  displaylist.forEach((x) => { $('#events').append(x) })
}

function updateImportants() {
  // add all importants to importants
  const importants = []
  let counter = 0
  for (list of data.flop.concat([{
    'title': 'river',
    'text': $('#pop').html()
  }])) {
    $('#test').empty()
    $('#test').html(list.text)
    $('#test').find('span.important:not(.complete)').toArray()
      .forEach((x) => {
        // add all important tasks to a list
        if (getMainHeading($(x))) {
          importants.push($('<p><span class="impspan" quickhelp="parent heading" list="' + 
            counter + '">' + stripChildren(getMainHeading($(x))) + '</span>' + 
            '<span class="falselinkimp" quickhelp="important & uncomplete">' + 
            stripChildren($(x)).replace(/•\s/, '').replace(/\-\s/, '') + 
            '</span></p>'))
        } else {
          importants.push($('<p><span class="impspan-list" quickhelp="parent list" list="' + 
            counter + '">' + 
            list.title.replace(/•\s/, '').replace(/\-\s/, '')  + '</span>' + 
            '<span class="falselinkimp" quickhelp="important & uncomplete">' + stripChildren($(x)) + 
            '</span></p>'))
        }
      })
    counter ++
  }
  $('#importants').empty()
  importants.forEach((x) => { $('#importants').append(x) })
}

function updateDeadlines() {
  // update displayed deadlines to match data
  $('.duedate').remove()
  window.duedates = []
  const collapselist = $('#pop').children().filter('.h1').toArray().filter(
    (x) => { return ($(x).attr('folded') == 'true') })
  // uncollapses then recollapses to prevent weirdness
  for (heading of collapselist) {
    toggleFold($(heading), false)
  }
  for (list of data.flop.concat([{
    'title': 'pop',
    'text': $('#pop').html()
  }])) {
    $('#test').empty()
    $('#test').html(list.text)
    for (let deadline of $('#test').find('.deadline').filter(function () {
      return !$(this).parent().hasClass('complete')
    })) {
      // append under heading
      const text = stripChildren($(deadline).parent())
      const index = text.search('>')
      const date = $(deadline).text().slice(1)
      const heading = dateToHeading(stringToDate(date), false)
      const duedate = createBlankTask()
      duedate.attr('title', 'duedate')
      // take out deadline
      duedate.text('> ' +
        text.slice(0, index).replace(/^•\s/, '').replace(/^\-\s/, ''))
      if (getHeading($(deadline).parent())) {
        // add span underneath with its heading
        duedate.append($('<span class="duedateBacklink">' + 
          stripChildren(getHeading($(deadline).parent())) + '</span>'))
      }
      duedate.addClass('duedate')
      duedate.removeClass('in')
      $(heading).after(duedate)
      if (list.title != 'pop') {
        window.duedates.push({
          'title': stripChildren(duedate).slice(2),
          'end': date
        })
      }
    }
  }
  for (heading of collapselist) {
    toggleFold($(heading), false)
  }
  // update continous dates from pop
  $('.continuous').remove()
  $('#pop').find('span.in:not(.complete) > .deadline')
    .toArray().forEach((x) => {
    const deadfind = $(x).text().slice(1)
    const targetdate = $(dateToHeading(stringToDate(
      deadfind, false)))
    const newelt = $('<div class="continuous"></div>')
    const scrolltop = $('#pop').scrollTop()
    const xpos = $(x).offset().top - $('#pop').offset().top
    newelt.css('top', '0')
    const target = $(getHeadingChildren(targetdate).filter((y) => { 
      // finds target deadline
      return $(y).hasClass('duedate') && 
        stripChildren($(x).parent()).includes(
          stripChildren($(y)).slice(2, stripChildren($(y)).length - 1))
    }))[0]
    if (target) {
      newelt.css('height', castrate(
        target.position().top + target.height() - xpos) + 'px')
      newelt.attr('title', (stripChildren($(x).parent()).slice(0, 
        stripChildren($(x).parent()).indexOf(' >'))))
      newelt.attr('start', 
        stringToDate(stripChildren($(getHeading($(x))))).getTime())
      newelt.attr('end', stripChildren($(x)).slice(1)) // as text for searching
      $(x).append(newelt)
    }
  })
}

function updateBuffers() {
  // adds in scroll buffers if needed
  $('.buffer').remove()
  if (!$('#flop').children().filter('.buffer')[0]) {
    $('#flop').prepend('<span class="buffer"></span>')
    $('#flop').append('<span class="buffer bottom"></span>')
  }
  if (!$('#pop').children().filter('.buffer')[0]) {
    $('#pop').prepend('<span class="buffer"></span>')
    $('#pop').append('<span class="buffer bottom"></span>')
  }
}

// # SAVING

function save(changes, changed, undo) {
  // stores data
  let now = new Date()
  let initial = now.getTime()
  unFilter()
  if (undo) {
    prevsave = JSON.parse(JSON.stringify(data))
  }
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
  // X updates everything without uploading data
  data.loadedlist = loadedlist
  // save data
  now = new Date()
  display('saved: ' + String(now.getTime() - initial))
  initial = now.getTime()
  if (changes != 'X') { 
    if (changed && selected) {
      if (getFrame(selected).attr('id') == 'pop') {
        uploadData(false, 'pop')
      } else {
        uploadData(false, loadedlist)
      }
    } else {
      uploadData() 
    }
  }
  now = new Date()
  display('uploadData: ' + String(now.getTime() - initial))
  initial = now.getTime()
  // X updates everything without uploading data
  // P is for date creation
  if (['i', 'X', '+', '-'].includes(changes)) {
    updateImportants()
  }
  if (['>', '+'].includes(changes) && getHeading(changed) &&
    getHeading(changed).hasClass('futuredate')) {
    // update heading formats
    getHeading(changed).removeClass('futuredate')
  }
  now = new Date()
  display('updateImportants: ' + String(now.getTime() - initial))
  initial = now.getTime()
  if (['-', '+', 'X', '>'].includes(changes)) {
    updateDeadlines()
    updateTitles()
  }
  now = new Date()
  display('updateDeadlines: ' + String(now.getTime() - initial))
  initial = now.getTime()
  if (['-', 'X', '>'].includes(changes)) {
    clearEmptyDates()
  }
  now = new Date()
  display('clearEmptyDates: ' + String(now.getTime() - initial))
  initial = now.getTime()
  if (['L', 'X'].includes(changes)) {
    updateBuffers()
  }
  now = new Date()
  display('updateBuffers: ' + String(now.getTime() - initial))
  initial = now.getTime()
  if (changes == 'X') {
    updateSpanDrags()
  } else if (changes == 'L') {
    updateSpanDrags('flop')
  } else if (changes == '+' && changed) {
    updateSpanDrags(changed)
  }
  now = new Date()
  display('updateSpanDrags: ' + String(now.getTime() - initial))
  initial = now.getTime()
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
  for (list of olddata) {
    $('#test').html(list.text)
    olddatadict[list.title] = $('#test').find('span.in').toArray().map(
      (x) => { return stripChildren($(x)) })
  }
  const responsejson = JSON.parse(newString)
  const newdata = responsejson.flop.concat(
    [{ 'title': 'pop', 'text': responsejson.pop }])
  const newdatadict = {}
  for (list of newdata) {
    $('#test').html(list.text)
    newdatadict[list.title] = $('#test').find('span.in').toArray().map(
      (x) => { return stripChildren($(x)) })
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
  if (diffs == 'Diffs:') { display('** identical **') }
  else { display(diffs) }
  return diffs
}

function uploadData(reloading, list) {
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
    if (list != undefined) {
      let text
      if (list == 'pop') {
        text = data.pop
        list = 'pop'
      } else {
        text = data.flop[list].text
      }
      $.post("uploadPartial.php", {
        datastr: text,
        datalist: list,
      }, function (d, s, xhr) {
        display('*** upload finished ***')
        const datasave = JSON.stringify(data)
        localStorage.setItem('data', datasave)
        prevupload = datasave
        if (reloading == 'reload') {
          location.reload()
        } else if (reloading) {
          reload(true) // reloads page
        }
      }).fail(function () {
        alert('upload failed');
      });
    } else {
      $.post("upload.php", {
        datastr: JSON.stringify(data),
      }, function (data, status, xhr) {
        diffsLog(prevupload, xhr.responseText) // for debugging saving
        display('*** upload finished ***')
        const datasave = JSON.stringify(data)
        localStorage.setItem('data', datasave)
        prevupload = datasave
        if (reloading == 'reload') {
          location.reload()
        } else if (reloading) {
          reload(true) // reloads page
        }
      }).fail(function () {
        alert('upload failed');
      });
    }
  } else {
    if (!navigator.onLine && !offline) {
      // if it's offline save that
      alert('Connection lost; saving locally')
      offline = true
      cancel()
    } else if (navigator.onLine && offline) {
      reload(true)
      return
    }
    // offline mode
    localStorage.setItem('data', JSON.stringify(data))
    diffsLog(prevupload, JSON.stringify(data))
    display('*** local upload finished ***')
    prevupload = JSON.stringify(data)
    display('reloading from upload (offline)');
    if (reloading == 'reload') {
      location.reload()
    } else if (reloading) {
      reload(true) // reloads page
    }
  }
}

// # LOADING

function undo() {
  // reset to previous save
  if (!prevsave) return
  // undo
  let oldselect
  if (selected && getFrame(selected)) {
    oldselect = [getFrame(selected), 
      getFrame(selected).find('span.in').toArray().indexOf(selected[0])]
  }
  const floptop = $('#flop').scrollTop()
  const poptop = $('#pop').scrollTop()
  data = JSON.parse(JSON.stringify(prevsave))
  $('#pop').empty()
  $('#flop').empty()
  $('#loads').empty()
  // load pop
  $('#pop').html(data.pop)
  for (list in data.flop) {
    // load lists
    newList(list)
  }
  const children = $('#loads').children().toArray()
  for (i in children) {
    // remember folding
    const val = $(children[i]).val()
    if (val.slice(val.length - 4) == ' ...') {
      toggleFoldList(false, i)
    }
  }
  loadedlist = data.loadedlist
  loadList(false) // load list from data
  dragsOn(false)
  $('#searchbar').val('')
  $('#flop').scrollTop(floptop)
  $('#pop').scrollTop(poptop)
  if (oldselect) {
    select(oldselect[0].find('span.in')[oldselect[1]])
  }
  updateSpanDrags()
  updateSizes()
}

function cancel() {
  display('cancelling load')
}

function clearLogo() {
  // finishload
  $('#logoimage').animate({opacity: 0}, 500)
  $('#logoimage').remove()
  loading = false
}

function reload(force) {
  // begin reload by downloading server data
  if (window.parent.location.href.includes('welcome')) {
    reload2()
    return
  }
  display('--- download started ---');
  if (!navigator.onLine || offlinemode) {
    if (force) {
      reload2()
    } else {
      cancel()
    }
  } else {
    if (navigator.onLine && offline) {
      // upload data once navigator comes online
      const doupload = confirm('Connection detected; upload local data?\n' +
        '(overwrites changes from other devices)')
      offline = false
      if (doupload) {
        uploadData(true)
        cancel()
        return
      } else {
        alert('downloading from cloud...')
      }
    }
    if (force) { 
      reload2() 
      return 
    } else {
      // prevents changes from triggering reload
      var curdata = JSON.stringify(data)
      $.post('download.php',
      function (datastr, status, xhr) {
          const diffs = diffsLog(curdata, xhr.responseText)
          if (diffs == 'Diffs:') {
            cancel()
            // don't reload page at all
          } else {
            display('*** download finished, reloading ***');
            // only reload if data differs
            data = JSON.parse(xhr.responseText)
            reload2()
          }
        }
      )
    }
  }
}

function reload2() {
  // data is downloaded, prepare page for reload
  $('body').prepend("<div id='logoimage' class='show' style='z-index:2;opacity:0'><img src='logo.png'></div>")
  $('#logoimage').animate({'opacity': 0.1}, 250)
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

function loadPage(starting, oldselect, scrolls) {
  // load the page with current data
  loading = true
  var now = new Date()
  var initial = now.getTime()
  // right after signing in
  display('loading... ');
  if (!window.location.href.includes('welcome')) {
    $('#username').text(getCookie('user'))
  }
  if (starting) {
    console.log(data);
    if (!data.flop && localStorage.getItem('data')) {
      data = JSON.parse(localStorage.getItem('data').replace(/\\+/g, '\\')
        .replace(/^\"+/, ''))
      console.log('fixed', data);
    }
    while (typeof data == 'string') {
      data = JSON.parse(data)
    }
    // start window for first load
    window.stylegot = false // getting style
    window.pastdates = false
    window.loadedlist = data.loadedlist // loaded list
    window.selected = undefined // selected task
    window.dragsenabled = true // editing lists
    window.droplist = []
    window.focused = false // focus mode
    window.movelist = false // moving lists
    window.movetask = undefined // moving task
    window.movetolist = undefined // move to list mode
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
    window.editing = false
    window.touched = false
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
    if (data.futurepanes === undefined) { data.futurepanes = 'show' } 
    // set futurepanes
    if (data.headingalign === undefined) data.headingalign = 'center'
    // load style
    if (!data.brightness) data.brightness = 'dark'
    setStyle(data.style, false)
    if (data.weekdays == 'M') {
      weekdaysStr = { 0: 'U', 1: 'M', 2: 'T', 3: 'W', 4: 'R', 5: 'F', 6: 'S' }
    } else if (data.weekdays == 'Mon') {
      weekdaysStr = {
        0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri',
        6: 'Sat'
      }
    }
    // event bindings
    $(document).on('mousemove', function(ev) {
      const t = ev.target.getAttribute('quickhelp')
      if (t && $('#quickhelp').text() != t) { 
        $('#quickhelp').text(t)
      } else if (!t && $('#quickhelp').text() != '') {
        $('#quickhelp').text('')
      }
    })
    $.get(data.style + '-' + data.brightness + '.css',
      function () {
        display('got style: ' + data.style + '-' + data.brightness + '.css')
        clearLogo()
      }
    ).fail(function () {
      data.style = 'space'
      data.brightness = 'dark'
      setStyle(data.style)
      clearLogo()
    })
    $(document).on('touchstart', function () { 
      touched = true
      updateSpanDrags() 
    })
    $(document).off(
      'keydown keyup contextmenu mousedown mouseup touchend')
    $(document).on('touchend', function(ev) {
      if (!['SPAN', 'TEXTAREA'].includes(ev.target.tagName) &&
        !['flopBut', 'popBut', 'newHeadingFlopBut'].includes(
        $(ev.target).attr('id')) &&
        !$(ev.target).hasClass('dropdown-item') &&
        editing == false) {
        resetDoc()
      }
    })
    $(document).on('keydown', keyDown)
    $(document).on('keyup', keyUp)
    $(document).on('contextmenu', function(event) {
      context(event)
      $('#listcontainer > span').hide()
    })
    $(document).on('mousedown', clickOn)
    $(document).off('mouseup')
    $(document).on('mouseup', clickOff)
    $(document).on('touchend', resetDoc)
    $(window).resize(updateSizes)
    $(window).focus(function () {
      reload()
    })
    $('#container').on('mouseleave', function () {
      save()
    })
    $('.dropdown-item').mouseover(function () { 
      $(this).css('color', 'var(--select) !important')
    })
    $('.dropdown-item').mouseleave(function () { 
      $(this).css('color', '')
    })
    if (window.innerWidth < 600) { 
      // collapse menu
      toggleCollapse()
    }
    try {
      if (Notification.permission != 'granted') {
        Notification.requestPermission()
      }
    } catch (err) {
    }
    setInterval(timeCheck, 60000) // checks every minute for reminders
    if (mobileTest()) {
      $('head').append('<link href="mobilestyle.css" rel="stylesheet">')
    }
  }
  if (window.innerWidth < 600) {
    $('#desktopbuts button.mobilebut').toArray().forEach(function (x) {
      $('#mobilebuts').append(x)
    })
  }
  if (!starting && !$('#theme').attr('href').includes(data.style)) {
    // reloads theme if it was changed
    setStyle(data.style)
  }
  if (!data.headingalign) data.headingalign = 'center'
  if (window.innerWidth < 600) {
    $('#desktopbuts button.mobilebut').toArray().forEach(function (x) {
      $('#mobilebuts').append(x)
    })
  }
  document.documentElement.style.setProperty('--headingalign',
    data.headingalign)
  // load pop
  $('#pop').html(data.pop)
  for (list in data.flop) {
    // load lists
    newList(list)
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
  dragsOn(false)
  $('#searchbar').val('')
  // show buttons and help right
  if (data.help == 'show') $('#help').show()
  if (data.help == 'hide') $('#help').hide()
  if (data.hidebuts == 'false') {
    data.hidebuts = 'true'
  } else if (data.hidebuts == 'true') {
    data.hidebuts = 'false'
  }
  toggleButs(false)
  $('.taskselect').removeClass('taskselect')
  if (scrolls) {
    $('#flop').scrollTop(scrolls[0])
    $('#pop').scrollTop(scrolls[1])
  }
  var now = new Date()
  curtime = now.getTime() - initial
  display('loaded data: ' + curtime);
  initial = now.getTime()
  $('#events, #importants').hide()
  save('X', null, true)
  var now = new Date()
  curtime = now.getTime() - initial
  display('saved: ' + curtime)
  initial = now.getTime()
  if (starting) {
    migrate()
  }
  if (mobileTest() && window.innerWidth < 600) {
    select($('#pop'))
    toggleFocus()
  }
  now = new Date()
  curtime = now.getTime() - initial
  display('saved and cleaned: ' + curtime);
  initial = now.getTime()
  function startdoc() {
    if (data.futurepanes == 'show') {
      $('#events, #importants').show()
    }
    if (!focused) { $('#focusbar').hide() }
    updateSizes()
    updateBuffers()
    if (oldselect) {
      // select previous selected
      if (oldselect[1])
      select(oldselect[0].find('span.in').toArray()[oldselect[1]], true)
      else if (oldselect[0])
      select(oldselect[0], true)
    } else {
      scrollToToday()
    }
    // remove image after reload
    var curdate = new Date()
    now = new Date()
    curtime = now.getTime() - initial
    initial = now.getTime()
    display('startdoc: ' + String(curtime));
    now = new Date()
    $('#logoimage').stop(true)
    if (!starting) { clearLogo() }
    // curtime = now.getTime() - initial
    // initial = now.getTime()
    // display('checkStyle: ' + String(curtime));
      // check style is skipped (takes too long)
    // doesn't check for style anymore
  }
  now = new Date()
  curtime = now.getTime() - initial
  display('loaded: ' + curtime);
  initial = now.getTime()
  clean()
  setTimeout(startdoc, 500)
}