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

function clean() {
  // cleans data
  $('span.in:visible').attr('style', '')
  for (span of $('span.in').toArray()) {
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
  // cleans invisible things which aren't folded under headings
  let headings = $('span').toArray()
  headings = headings.filter((x) => {
    if ($(x).attr('folded') == 'true' &&
      $(x).css('display') != 'none') {
      return true
    }
  })
  let foldedlist = []
  for (heading of headings) {
    foldedlist =
      foldedlist.concat(getHeadingChildren($(heading)).map((x) => {
        return x[0]
      }))
  }
  const blindeds = $('span').toArray().filter((x) => {
    return ($(x).css('display') == 'none')
  })
  for (blinded of blindeds) {
   if (!foldedlist.includes(blinded) &&
      $(blinded) != selected) {
      // filter out subtasks
      if ($(blinded).parent()[0].tagName != 'SPAN') $(blinded).remove()
    }
  }
  // sort headings
  const headingslist = $('#pop').children().filter('.dateheading').toArray()
  for (heading of headingslist.sort((a, b) => {
    return stringToDate(stripChildren($(a)), true).getTime() -
      stringToDate(stripChildren($(b)), true).getTime()
  })) {
    if ([' ...', '...'].includes(stripChildren($(heading)))) {
      heading.remove()
      continue
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
  const today = stringToDate('0d').getTime()
  const todayheading = $(dateToHeading(stringToDate('0d'), false))
  const todaydate = new Date()
  const headings = $('#pop').children().filter('.dateheading').toArray()
  function migratable(x) {
    // checks to see if heading has incomplete tasks
    getHeadingChildren($(x)).forEach((y) => {
      if (!$(y).hasClass('complete')) {
        return true
      }
    })
  }
  for (heading of headings) {
    if (stringToDate(stripChildren($(heading)), true).getTime() < today &&
      migratable(heading)) {
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
        if ((/^uncompleted/.test(ch.text()) ||
          /^completed/.test(ch.text())) && 
          heading != todayheading[0]) {
          // takes out the uncompleted heading
          if (ch.hasClass('folded')) { toggleFold($(heading), false) }
          ch.remove()
          continue
        }
        const appends = []
        ch.children().filter('span.in:not(.complete)').toArray().forEach(
          (x) => { appends.push(x) })
        if (ch.hasClass('event') && !ch.hasClass('complete')) {
          if (!loading) {
            toggleComplete(ch, false)
          }
        } else if (!ch.hasClass('complete') && !isHeading(ch)) {
          appends.push(ch)
        }
        const headingchildren = getHeadingChildren(todayheading)
        if (appends.length > 0) {
          // show all
          appends.forEach((x) => { $(x).show() })
          // find the place and add the heading
          let uncompletespan
          uncompletespan = headingchildren.find((x) => {
            return /^uncompleted/.test($(x).text()) && $(x).hasClass('h2')
          })
          if (!uncompletespan) {
            // insert after completed tasks heading
            let completed = headingchildren.find((x) => {
              return /^completed/.test($(x).text()) && $(x).hasClass('h2')
            })
            if (completed) {
              completed = $(completed).prev()
            } else if (!completed && headingchildren.length > 0) {
              completed = headingchildren[headingchildren.length - 1]
            } else {
              completed = todayheading
            }
            uncompletespan = createBlankTask()
            uncompletespan.addClass('h2')
            uncompletespan.text('uncompleted')
            completed.after(uncompletespan)
          }
          // append tasks after it
          appends.forEach((x) => {
            uncompletespan.after($(x))
          })
        } else {
          for (let child of headingchildren) {
            if (/^uncompleted/.test($(child).text()) && 
            isHeading($(child)) &&
            getHeadingChildren($(child)).length > 0) { 
              $(child).remove()
              break
            }
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
  // update future dates up to 30 days from now
  const curdate = todaydate.getDate()
  for (let i = 1; i < 30; i ++) {
    const futuredate = new Date()
    futuredate.setDate(curdate + i)
    const newdate = dateToHeading(futuredate, false)
  }
  now = new Date()
  display('migrated:' + (now.getTime() - initial))
  var initial = now.getTime()
}

function updateTitles() {
  // update titles of any continuous events in view with current date
  // add in titles
  const thisdate = dateToString(new Date())
  const bottomdate = $('#pop .dateheading').toArray().find((x) => { 
    return $(x).position().top > 0 && 
      $(x).position().top < $('#pop').height() &&
      !$(x).text().includes(thisdate)
  })
  if (!bottomdate) { return }
  const curdate = stringToDate(stripChildren($(bottomdate), true)).getTime()
  const inview = $('#pop .continuous:not(.complete)').toArray().filter((x) => { 
    return $(x).attr('start') < curdate
  })
  const list = inview.map((x) => {
    return {title: $(x).attr('title'), end: $(x).attr('end'), 
      overdue: stringToDate($(x).attr('end')).getTime() < curdate} 
  }).concat(window.duedates.map((x) => { return {title: x.title, end: x.end, 
    overdue: stringToDate(x.end).getTime() < curdate} }))
  const displaylist = list.map((x) => { 
    return $('<p style="margin:0;"><span class="falselink" deadline="' +
      x.end + '" overdue="' + x.overdue + '">' + x.title + '</span>' + 
      '<span class="eventspan" onclick="select(dateToHeading(' + 
      'stringToDate($(this).text())), true)" overdue="' + 
      x.overdue + '">' + x.end + '</span></p>')
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
        importants.push($('<p><span class="impspan" list="' + 
          counter + '">' + list.title + '</span>' + 
          '<span class="falselinkimp">' + stripChildren($(x)) + 
          '</span></p>'))
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
      const text = stripChildren($($(deadline).parent()))
      const index = text.search('>')
      const endindex = index + text.slice(index).search(' ')
      const date = $(deadline).text().slice(1)
      const heading = dateToHeading(stringToDate(date), false)
      const duedate = createBlankTask()
      // take out deadline
      duedate.text('> ' +
        text.slice(0, index).replace(/^•\s/, '').replace(/^\-\s/, '') +
        text.slice(endindex))
      duedate.addClass('duedate')
      duedate.removeClass('in')
      $(heading).after(duedate)
      if (list.title != 'pop') {
        window.duedates.push({
          'title': duedate.text().slice(2),
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
  if (changes != 'X') { uploadData() }
  now = new Date()
  display('uploadData: ' + String(now.getTime() - initial))
  initial = now.getTime()
  // X updates everything without uploading data
  // P is for date creation
  if (['i', 'X'].includes(changes)) {
    updateImportants()
  }
  now = new Date()
  display('updateImportants: ' + String(now.getTime() - initial))
  initial = now.getTime()
  if (['-', '+', 'X'].includes(changes)) {
    updateDeadlines()
  }
  now = new Date()
  display('updateDeadlines: ' + String(now.getTime() - initial))
  initial = now.getTime()
  if (['-', 'X'].includes(changes)) {
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

// function uploadData(reloading) {
//   // upload data to the server
//   if (window.parent.location.href.includes('welcome')) {
//     return // for demo
//   }
//   display('--- upload started ---') 
//   if (JSON.stringify(data) == prevupload) {
//     display('identical');
//     return
//   }
//   if (navigator.onLine && !offlinemode) {
//     $.post("upload.php", {
//       datastr: JSON.stringify(data),
//     }, function (data, status, xhr) {
//       display('*** upload finished ***')
//       diffsLog(JSON.stringify(data), xhr.responseText)
//       prevupload = xhr.responseText
//       localStorage.setItem('data', JSON.stringify(data))
//       if (reloading) reload() // reloads page
//     });
//   } else {
//     if (!navigator.onLine && !offline) {
//       // if it's offline save that
//       alert('Connection lost; saving locally')
//       offline = true
//     } else if (navigator.onLine && offline) {
//       reload()
//       return
//     }
//     // offline mode
//     localStorage.setItem('data', JSON.stringify(data))
//     display('*** local upload finished ***')
//     prevupload = JSON.stringify(data)
//     if (reloading) {
//       display('reloading from upload (offline)');
//       reload() // reloads page
//       return
//     }
//   }
// }

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
      // diffsLog(prevupload, xhr.responseText)
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
    localStorage.setItem('data', JSON.stringify(data))
    // diffsLog(prevupload, JSON.stringify(data))
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
  if (selected && getFrame(selected)) {
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
  updateSpanDrags()
}

function reload() {
  // begin reload by downloading server data
  if (window.parent.location.href.includes('welcome')) {
    reload2()
    return
  }
  $('body').prepend("<div id='logoimage' class='show' style='z-index:2;opacity:0'><img src='logo.png'></div>")
  $('#logoimage').animate({'opacity': 0.1}, 300)
  display('--- download started ---');
  if (!navigator.onLine || offlinemode) {
    const diffs = diffsLog(JSON.stringify(data), 
      localStorage.getItem('data'))
    if (diffs == 'Diffs:') {
      $('#logoimage').remove()
    }
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
          $('#logoimage').remove()
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
    // start window for first load
    window.loadedlist = data.loadedlist // loaded list
    window.selected = undefined // selected task
    window.dragsenabled = true // editing lists
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
    $('head').append(
      $("<link id='theme' rel='stylesheet' type='text/css' href='" +
        data.style + "' />")
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
  if ($('#theme').attr('href') != data.style) {
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
  for (list of data.flop) {
    // load lists
    const newthing = $('<textarea class="listtitle unselected"></textarea>')
    newthing.on('dragstart', dragList)
    newthing.on('drop', dropList)
    newthing.on('dragover', dragListOver)
    newthing.on('click', loadThis)
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
  now = new Date()
  curtime = now.getTime() - initial
  display('saved and cleaned: ' + curtime);
  initial = now.getTime()
  function startdoc() {
    if (data.futurepanes == 'show') {
      $('#events, #importants').show()
    }
    updateSizes()
    clean()
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
    $('#logoimage').stop(true)
    $('#logoimage').animate({opacity: 0}, 500)
    setTimeout(function() { 
      $('#logoimage').remove()
      resetDoc()
      now = new Date()
      curtime = now.getTime() - initial
      display('startdoc: ' + String(curtime));
      initial = now.getTime()
    }, 500)
  }
  if (mobileTest()) {
    $(document).on('scroll mouseup', function() {
      $('html, body').animate({scrollTop: window.innerHeight}, 300)
      startdoc()
      $(document).off('scroll mouseup')
      $(document).on('mouseup', clickOff)
    })
  } else {
    now = new Date()
    curtime = now.getTime() - initial
    display('loaded: ' + curtime);
    initial = now.getTime()
    setTimeout(startdoc, 500)
  }
}