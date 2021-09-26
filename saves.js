function display(x) {
  console.log(x)
}

function resetCookies() {
  let past = new Date()
  past.setTime(
    past.getTime() - 10000000)
  past = past.toUTCString()
  document.cookie = 'user=;expires=' + past + ';'
  document.cookie = 'fname=;expires=' + past + ';'
  document.cookie = 'pw=;expires=' + past + ';'
}

function undo() {
  if (!savedata) return
  // undo
  let oldselect
  if (selected) {
    oldselect = [getFrame(selected), 
      getFrame(selected).find('span.in').toArray().indexOf(selected[0])]
  }
  const floptop = $('#flop').scrollTop()
  const poptop = $('#pop').scrollTop()
  data = JSON.parse(JSON.stringify(savedata))
  const oldload = Number(loadedlist)
  $('#pop').html(data.pop)
  $('#loads').empty()
  for (list of data.flop) {
    newlist(list.title, list.text, false)
    $('.taskselect').removeClass('taskselect')
  }
  loadedlist = oldload
  loadList(false)
  dragson(false)
  $('#flop').scrollTop(floptop)
  $('#pop').scrollTop(poptop)
  if (oldselect) {
    select(oldselect[0].find('span.in')[oldselect[1]])
  }
}

function clean() {
  $('#test').empty()
  $('textarea.in').remove()
  const dates = []
  const duplicates = []
  console.log($('.dateheading'));
  $('.dateheading').toArray().forEach((x) => {
    // rewrite dates
    if ($(x).text().includes('undefined')) $(x).remove()
    else {
      $(x).text(dateToString(stringToDate(stripChildren($(x)), true), true))
    }
    const text = stripChildren($(x)).replace(' ...', '')
    if (!dates.includes(text)) { dates.push(text) }
    else { duplicates.push(text) }
  })
  console.log(dates, duplicates);
  console.log('cleaning');
  for (duplicate of duplicates) {
    console.log(duplicate);
    // merge duplicate dates
    const headingslist = $('.dateheading').toArray().filter((x) => {
      return stripChildren($(x)).includes(duplicate)
    })
    const firstheading = $(headingslist[0])
    for (heading of headingslist.slice(1)) {
      getHeadingChildren($(heading)).forEach((x) => {
        firstheading.prepend(x)
      })
    }
    headingslist.slice(1).forEach((x) => { x.remove() })
  }
  if (selected != undefined && selected[0].tagName == 'TEXTAREA' &&
    selected.parent().hasClass('in')) {
    // clear open tasks
    selected.remove()
  }
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
  for (span of $('span').toArray()) {
    if (['', ' ', '\n'].includes($(span).text())) {
      // remove empty ones
      $(span).remove()
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
  // clean empty lists
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
      display(err)
      $($('#loads').children()[list]).remove()
      loadlist = $('#loads').children().toArray()
    }
  }
  // clear out deprecated attributes
  $('span.in').removeAttr('ondragstart')
  $('span.in').removeAttr('ondragover')
  $('span.in').removeAttr('ondrop')
}

// Storing data:
function save(undoing, cleaning) {
  unFilter(false)
  if (undoing) savedata = JSON.parse(JSON.stringify(data))
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
  if (cleaning != false) {
    // clean up styling
    $('span.in:visible').attr('style', '')
    // clean()
    updatedeadlines() // updateSpanDrags() called in updatedeadlines
    // backup data to the server after setting localstorage data
    uploadData()
  }
}

function clearEmptyHeadlines() {
  // clears empty headlines'
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

function clearEmptyDates(saving, clearing) {
  $('.futuredate').removeClass('futuredate')
  // take away empty dates
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
        if (clearing) {
          $(date).remove()
        } else {
          $(date).addClass('futuredate')
          $(date).addClass('dateheading')
        }
      }
    }
  }
  if (saving != false) { save() }
}

function migrate() {
  const today = stringToDate('0d').getTime()
  const todayheading = $(dateToHeading(stringToDate('0d'), false))
  const headings = $('#pop').children().filter('.dateheading').toArray()
  for (heading of headings) {
    if (stringToDate(stripChildren($(heading)), true).getTime() < today) {
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
}

function updatetitles() {
  // updates titles of any continuous events in view with current date
  let bh = $(':root').css('--butheight')
  // add in titles
  bh = Number(bh.slice(0, bh.length - 2)) + 
    Number($('#events').height())
  const curdate = stringToDate(stripChildren($($('#pop .dateheading')
    .toArray().filter((x) => { 
      return $(x).position().top > bh
    })[0])), true).getTime()
  const inview = $('#pop .continuous').toArray().filter((x) => { 
    return stringToDate($(x).attr('end')).getTime() > curdate &&
      $(x).attr('start') < curdate
  })
  const list = inview.map((x) => {
    return {title: $(x).attr('title'), end: $(x).attr('end')} 
  }).concat(flopdeadlines.filter((x) => { 
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
// console.log(list);
  $('#events').empty()
  list.forEach((x) => { $('#events').append(x) })
}

function updatedeadlines(saving) {
  if (filtered) return
  if (saving != false) { 
    updateSpanDrags() 
  }
  migrate()
  $('.duedate').remove()
  $('.placeholder').remove()
  flopdeadlines = []
  const collapselist = $('#pop').children().filter('.h1').toArray().filter(
    (x) => { return ($(x).attr('folded') == 'true') })
  // uncollapses then recollapses to prevent weirdness
  for (heading of collapselist) {
    toggleFold($(heading), false)
  }
  const importants = []
  let counter = 0
  for (list of data.flop.concat([{
    'title': 'pop',
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
        flopdeadlines.push({
          'title': duedate.text().slice(2),
          'end': date
        })
      }
    }
  }
  for (heading of collapselist) {
    toggleFold($(heading), false)
  }
  // add all importants to importants
  $('#importants').empty()
  importants.forEach((x) => { $('#importants').append(x) })
  // creating relative dates
  today = stringToDate('0d')
  for (heading of $('#pop').children().filter('.dateheading:not(.futuredate)')) {
    // add in relative dates underneath
    const newelt = createBlankTask()
    newelt.text(datesToRelative(
      today,
      stringToDate(stripChildren($(heading)), true)))
    newelt.addClass('placeholder')
    newelt.removeClass('in')
    $(heading).append(newelt)
  }
  // update future dates up to 30 days from now
  const futuredate = stringToDate('0d')
  futuredate.setDate(today.getDate() + 29)
  if (!$('#pop').children().filter('.dateheading')
    .toArray().map((x) => { return stripChildren($(x)) })
    .includes(dateToString(futuredate, true))) {
      // if future not filled out
      const curdate = today.getDate()
      for (let i = 0; i < 30; i ++) {
        const futuredate = new Date()
        futuredate.setDate(curdate + i)
        const newdate = dateToHeading(futuredate, false)
    }
  } else {
    const newdate = new Date()
    newdate.setDate(today.getDate() + 30)
    const newheading = dateToHeading(newdate, false)
  }
  // update continous dates from pop
  $('.continuous').remove()
  $('#pop').find('span.in:not(.complete) > .deadline').toArray().forEach((x) => {
    function castrate(phallus) {
      return String(phallus).slice(0, String(phallus).indexOf('.'))
    }
    const targetdate = $(dateToHeading(stringToDate($(x).text().slice(1))))
  // console.log(x, targetdate)
    const newelt = $('<div class="continuous"></div>')
    const scrolltop = $('#pop').scrollTop()
    const xpos = $(x).offset().top - $('#pop').offset().top
    newelt.css('top', '0')
    const target = $(getHeadingChildren(targetdate).filter((y) => { 
    // console.log($(y).text().slice(2), $(x).parent().text());
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
  clearEmptyDates(false)
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

function uploadData(reloading) {
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

function diffsLog(oldString, newString) {
  // log the diffs
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
  display(diffs)
  return diffs
}

function reload() {
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
    loadpage(false, undefined, [floptop, poptop])
    $(':focus').blur()
    return
  }
  const floptop = $('#flop').scrollTop()
  const poptop = $('#pop').scrollTop()
  $('#pop').empty()
  $('#flop').empty()
  $('#loads').empty()
  loadpage(false, [selectframe, selectindex], [floptop, poptop])
  $(':focus').blur()
}

function loadpage(setload, oldselect, scrolls) {
  loading = true
  // right after signing in
  display('loading...');
  if (!window.location.href.includes('welcome')) {
    $('#username').text(getCookie('user'))
  }
  if (setload != false) {
    // sets variables
    window.loadedlist = undefined
    window.selected = undefined
    window.focused = undefined
    window.focusmode = undefined
    window.dragsenabled = true
    window.inprogress = undefined
    window.time = undefined
    window.pause = undefined
    window.updated = false
    window.searchwidth = 10
    window.movetask = undefined
    window.fileinput = undefined
    window.loadedlistobj = undefined
    window.reloading = undefined
    window.currentupload = undefined
    window.slider = undefined
    window.movetolist = false
    window.durslider = undefined
    window.stopwatch = undefined
    window.copieditem = undefined
    window.prevupload = JSON.stringify(data)
    window.flopscrollsave = undefined
    window.popscrollsave = undefined
    window.justclicked = undefined
    window.dblclicked = undefined
    window.dragtimer = undefined
    window.mobile = undefined
    window.loading = undefined
    window.draggingtask = undefined
    window.justdropped = undefined
    window.justcollapsed = undefined
    window.flopdeadlines = undefined
    window.linestarts = {
      '# ': 'h1',
      '## ': 'h2',
      '### ': 'h3',
      '•': 'list',
      '@': 'event',
      '-': 'note'
    }
    window.lineinners = {
      // '_*': ['*_', 'bold-italic'],
      // '*': ['*', 'bold'],
      // '_': ['_', 'italic'],
      '[[': [']]', 'link'],
      '>': [' ', 'deadline']
    }
    window.savedata = undefined
    window.weekdaysStr = undefined
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
    }
    window.filtered = undefined
    window.filteredlist = undefined
    if (window.innerWidth < 600) window.mobile = true
    else if (window.innerWidth > 600) window.mobile = false
    // initial loads (not called on reloads)
    $('#focusbar').hide()
    if (data.play === undefined) { data.play = 'true' }
    // removes things
    $('head').append(
      $("<link id='theme' rel='stylesheet' type='text/css' href='" +
        data.style + "' />")
    )
    if (!mobiletest()) {
      $.get(data.style, 
        function () { 
          $('#logoimage').stop(true)
          $('#logoimage').animate({opacity: 0}, 500)
          setTimeout(function() { $('#logoimage').remove() }, 500)
        }
      )
    }
    if (data.weekdays == 'M') {
      weekdaysStr = { 0: 'U', 1: 'M', 2: 'T', 3: 'W', 4: 'R', 5: 'F', 6: 'S' }
    } else if (data.weekdays == 'Mon') {
      weekdaysStr = {
        0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri',
        6: 'Sat'
      }
    }
    // prevents endless loading loop
    $(document).on('keydown', keyComms)
    $(document).on('keyup', keyUp)
    $(document).on('contextmenu', function(event) {
      context(event)
      $('#listcontainer > .in').hide()
    })
    $(document).on('mousedown', event, clicked)
    $(document).on('mouseup', event, clickOff)
    $('#timer').on('click', function () {
      if (Notification.permission != 'granted') {
        Notification.requestPermission()
      }
    })
    setInterval(timeCheck, 60000) // checks every minute for reminders
    $(window).resize(updateSizes)
    $('#pop').scroll(updatetitles)
    window.addEventListener('focus', function () {
      reload()
    })
    $('#container').on('mouseleave', function () {
      save()
    })
    if (window.innerWidth < 600) { 
      if (!$('#leftcol').hasClass('collapsed')) 
      toggleCollapse()
    }
    if (mobiletest()) {
      $('head').append('<link href="mobilestyle.css" rel="stylesheet">')
      // behavior for initial scroll
      $(document).on('touchend', function () {
        setTimeout(function() { 
          $('#logoimage').remove() 
          resetdoc()
          // $('body').css('overflow', 'hidden')
        }, 500)
        document.off('touchend')
      })
      setTimeout(function () {
        $('#logoimage').remove() 
        resetdoc()
      }, 3000)
    }
    display('loaded settings');
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
  $('#pop').html(data.pop)
  // loads data
  let oldload
  // load lists if there is one
  if (setload == false) {
    // fixes weird loadlist glitch
    oldload = Number(loadedlist)
  } else if (data.loadedlist != undefined) {
    oldload = Number(data.loadedlist)
  }
  for (i of data.flop) {
    const newthing = $('<textarea class="listtitle unselected"></textarea>')
    newthing.attr('ondragstart', 'dragList(event)')
    newthing.attr('ondragover', 'draggingOver(event)')
    newthing.attr('ondrop', 'dropList(event)')
    newthing.on('click', loadthis)
    newthing.attr('draggable', 'true')
    newthing.val(i.title)
    $('#loads').append(newthing)
  }
  const children = $('#loads').children().toArray()
  for (i in children) {
    // remember folding
    const val = $(children[i]).val()
    if (val.slice(val.length - 4) == ' ...') {
      $(children[i]).removeClass('folded')
      loadedlist = Number(i)
      loadList(false)
      toggleFoldList(false)
    }
  };
  if (oldload != undefined && oldload <= data.flop.length - 1) {
    loadedlist = Number(oldload)
    loadList(false)
  }
  dragson(false)
  display('loaded lists...');
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
  updatedeadlines(false)
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
    setTimeout(scrollToToday, 500)
  }
  if (loadedlist) {
    $(loads[loadedlist]).blur()
  }
  display('loaded drags...')
  updateSizes()
  if (setload == false) {
    // remove image after reload
    // $('#logoimage').stop(true)
    $('#logoimage').stop(true)
    $('#logoimage').animate({opacity: 0}, 500)
    setTimeout(function() { $('#logoimage').remove() }, 500)
  }
  resetdoc()
  loading = false
  $('.dropdown-item').mouseover(function () { 
    $(this).css('color', 'var(--select)')
  })
  $('.dropdown-item').mouseleave(function () { 
    $(this).css('color', '')
  })
  if (setload != false) {
    clean()
    clearEmptyDates(false)
  }
}