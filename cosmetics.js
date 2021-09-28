// # SOUNDS

function playPop() {
  // plays completion sound
  const pop = document.getElementById('popsnd')
  pop.src = pop.src
  pop.play()
}

// # WINDOW

function mobileTest() {
  // test if mobile browser or not
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    .test(navigator.userAgent)) {
    return true
  } else {
    return false
  }
}

function resetDoc() {
  // reset document zoom and scroll
  if (selected && selected[0].tagName == 'TEXTAREA') return
  $(document).scrollTop(0)
  $(document.body).css('zoom', "100%")
  document.firstElementChild.style.zoom = "reset";
  if (flopscrollsave) {
    $('#flop').scrollTop(flopscrollsave)
    flopscrollsave = undefined
  }
  if (popscrollsave) {
    $('#pop').scrollTop(popscrollsave)
    popscrollsave = undefined
  }
  $('#flop').removeClass('greyedout')
  $('#pop').removeClass('greyedout')
}

function updateHeight() {
  // update height of currently edited task
  $('#texttest').removeAttr('class')
  $('#texttest').removeAttr('style')
  $('#texttest').css('font', selected.css('font'))
  $('#texttest').css('padding', selected.css('padding'))
  $('#texttest').text(selected.val() + ' x')
  $('#texttest').css('width', selected.width() + 'px')
  selected.css('height', 'calc(' + $('#texttest').height() + 'px + 0.25em')
}

function updateSizes() {
  // update sizes of left column objects
  for (list of [
      [$('#timerent')[0], 6],
      [$('#searchbar')[0], 5],
      [$('#username')[0], $('#username').text().length / 2 + 2],
      [$('#lists')[0], 7]
  ]) {
    // update entries
    let fontsize = 24
    if (mobileTest()) fontsize = 16
    while ($(list[0]).width() / (fontsize / 2) < list[1]) {
      fontsize -= 1
    }
    $(list).css('font-size', fontsize + 'px')
  }
  // fix context menu for mobile
  if (mobileTest()) {
    $('.dropdown-item').toArray().forEach((x) => {
      $(x).text($(x).text().replace(/\s\((.*)\)/, ''))
    })
  }
  $('#texttest').removeAttr('style')
  $('#texttest').attr('class', 'listtitle unselected')
  for (list of $('#loads').children()) {
    if ($(list).width() < $(list).val().length *
      ($(list).css('font-size').slice(0,
        $(list).css('font-size').length - 2) / 2)) {
      $('#texttest').text($(list).val())
      $('#texttest').css('font', $(list).css('font'))
      $('#texttest').css('width', $(list).width() + 'px')
      $(list).css('height', 'calc(' + $('#texttest').height() + 
        'px + 0.35em)')
    } else {
      $(list).css('height', '')
      $(list).css('overflow-y', 'hidden')
    }
  }
  if (window.innerWidth > 600 && mobile) {
    location.reload()
  } else if (window.innerWidth < 600 && !mobile) {
    location.reload()
  }
  // update height of loads
  let loadsheight = window.innerHeight - 10 - $('#desktopbutstop').height()
  if (data.help == 'show') loadsheight -= $('#help').height()
  $('#loads').css('height', loadsheight + 'px')
  if (window.innerWidth < 600) mobile = true
  else if (window.innerWidth > 600) mobile = false
  if (data.hidebuts == 'false') {
    $(':root').css('--butheight', $('#flopbuts').height() + 5 + 'px')
  }
}

// # BACKUPS

function upload() {
  // upload backup
  var fileinput = $('<input type="file" id="fileinput" />')
  fileinput.on('change', function () {
    const fileReader = new FileReader()
    fileReader.addEventListener('loadend', function () {
      // rewrite existing data with this
      data = JSON.parse(this.result)
      dataString = JSON.stringify(data)
      uploadData(true)
    })
    fileReader.readAsText(this.files[0])
  })
  fileinput.click()
}

function download() {
  // download backup
  var blob = new Blob([JSON.stringify(data)], {
    type: 'text/plain;charset=utf-8'
  })
  const date = new Date()
  saveAs(blob, 'RiverBank-backup-' + dateToString(date) + '.json')
}

function reset() {
  // reset data
  yes = confirm("Are you sure you want to reset?")
  if (yes) {
    data = JSON.parse(resetstring)
    uploadData(true)
  }
}

function switchUser() {
  // switches data and reloads page
  save('0')
  let past = new Date()
  past.setTime(
    past.getTime() - 10000000)
  past = past.toUTCString()
  document.cookie = 'user=;expires=' + past + ';' + ';path=/;'
  document.cookie = 'pw=;expires=' + past + ';' + ';path=/;'
  location.reload()
}

// # TOGGLES

function toggleWeekdayFormat() {
  // change between short and long weekdays
  if (data.weekdays == 'M') {
    data.weekdays = 'Mon'
    weekdaysStr = {
      0: 'Sun',
      1: 'Mon',
      2: 'Tue',
      3: 'Wed',
      4: 'Thu',
      5: 'Fri',
      6: 'Sat'
    }
  } else if (data.weekdays == 'Mon') {
    data.weekdays = 'M'
    weekdaysStr = {
      0: 'U',
      1: 'M',
      2: 'T',
      3: 'W',
      4: 'R',
      5: 'F',
      6: 'S'
    }
  }
  // changes between 1 and 3 letter date formats
  const headingslist = $('#pop').children().toArray().filter(
    (x) => { return $(x).hasClass('dateheading') })
  for (heading of headingslist) {
    // switches the dates back and forth
    $(heading).html(dateToString(stringToDate(stripChildren($(heading))),
      true))
  }
}

function changeDateFormat(format) {
  // changes bewteen dd.mm.yy, mm/dd/yy, and yy-mm-dd formats
  const thisformat = data.dateSplit
  $('.dateheading').toArray().forEach((x) => {
    // change all dates in pop
    const getdate = stringToDate(stripChildren($(x)), true)
    data.dateSplit = format
    $(x).text(dateToString(getdate, true))
    data.dateSplit = thisformat
  })
  const floplist = data.flop.concat([{
    title: '#pop',
    text: $('#pop').html()
  }])
  for (i in floplist) {
    $('#test').html(floplist[i].text)
    for (x of $('#test').find('.deadline')) {
      // change all deadlines
      data.dateSplit = thisformat
      const getdate = stringToDate(stripChildren($(x))
        .slice(1, stripChildren($(x)).length - 1), false)
      data.dateSplit = format
      $(x).text('>' + dateToString(getdate, false) + ' ')
    }
    // update loadedlist
    if (floplist[i].title != '#pop') { // # to prevent overlap
      data.flop[i].text = $('#test').html()
    } else {
      data.pop = $('#test').html()
    }
  }
  data.dateSplit = format
  save('0')
}

function toggleHeadingAlign() {
  // switch headings between centered and left aligned
  if (data.headingalign == 'left') data.headingalign = 'center'
  else data.headingalign = 'left'
  save('0')
  document.documentElement.style.setProperty('--headingalign',
    data.headingalign)
}

function toggleButs(saving) {
  // toggle buttons show/hide
  if (data.hidebuts == 'true') {
    $('.butbar').show()
    $('#focusbut').show() // just in case it's moved in focused
    $('#typebut').show()
    data.hidebuts = 'false'
    $('#collapseBut').removeAttr('style')
    $('#flopbuts').prepend($('#collapseBut'))
    $(':root').css('--butheight', $('#flopbuts').height() + 'px')
  } else {
    $('.butbar:not(#editbuts)').hide()
    $('#typebut').hide()
    $('#focusbut').hide()
    $('#collapseBut').css('top', '0')
    $('#collapseBut').css('left', '2px')
    $('#collapseBut').css('z-index', '3')
    $('#collapseBut').css('position', 'absolute')
    $('#listcontainer').prepend($('#collapseBut'))
    data.hidebuts = 'true'
    $(':root').css('--butheight', '0px')
  }
  if (saving != false) save('0')
  updateSizes()
}

function toggleFuturePanes(saving) {
  // help show/hide
  if (data.futurepanes == 'show') {
    $("#events, #importants").hide()
    data.futurepanes = 'hide'
  } else {
    $("#events, #importants").show()
    data.futurepanes = 'show'
  }
  if (saving != false) {
    save('0')
  }
}

function toggleHelp(saving) {
  // help show/hide
  if (data.help == 'show') {
    $("#help").hide()
    data.help = 'hide'
  } else {
    $("#help").show()
    data.help = 'show'
  }
  if (saving != false) {
    save('0')
  }
  updateSizes()
}

function togglePlay() {
  // play on/off
  if (data.play == 'true') {
    data.play = 'false'
    alert('sounds off')
    save('0')
  } else if (data.play == 'false') {
    data.play = 'true'
    alert('sounds on')
    save('0')
  }
}

function setStyle(style, alert) {
  // sets the current style
  const floptop = $('#flop').scrollTop()
  if (navigator.onLine || offlinemode) {
    data.style = style
    $.get(
      style,
      function () {
        $('#theme').remove()
        $('head').append(
          $("<link id='theme' rel='stylesheet' type='text/css' href='" +
            style + "' />")
        );
        uploadData()
        setTimeout(function () {
          select(dateToHeading(stringToDate('0d')), true, false)
          select()
        }, 500)
      }
    )
  } else if (alert != false) {
    alert('Connect to the Internet to load styles')
  }
}

// # VIEWS

function toggleCollapse(animate) {
  // collapse/uncollapse left column
  updateSizes()
  if (animate) {
    $('#leftcol').css('transition', 'margin-left 0.7s')
    $('#listcontainer').css('transition', 'width 0.7s')
  }
  if (!$('#leftcol').hasClass('collapsed')) {
    $('#flopbuts button, #popbuts button').css('min-width', '')
    $('#leftcol').addClass('collapsed')
    $('#listcontainer').addClass('fullwidth')
  } else {
    // collapse
    $('#listcontainer').removeClass('fullwidth')
    $('#leftcol').removeClass('collapsed')
  }
  if (animate) {
    setTimeout(function () {
      $('#leftcol').css('transition', '')
      $('#listcontainer').css('transition', '')
      updateSizes()
    }, 710)
  }
  if (focused) toggleFocus(false) // unfocus if uncollapse
}

function toggleFocus(collapse) {
  // focus on current frame only
  if (!focused) {
    if (!selected) select(dateToHeading(stringToDate('0d')))
    // focus
    $('#focusbar').prepend($('#focusbut'))
    $('#searchbarcont').append($('#searchbarframe'))
    $('#timerentcont').append($('#timerent'))
    if (mobileTest()) {
      $('#timerent').css('height', '2em')
      $('#focusbut').css('height', '2em')
      $('#searchbar').css('height', '2em')
      $('#focusbut').css('width', '45px')
      $('#focusbut').css('margin-left', '0')
      $('#focusbar').css('border-left', '1px solid var(--bdcolor)')
    } else {
      $('#timerent').css('height', '1em')
      $('#searchbar').css('height', '1em')
    }
    getFrame(selected).parent().parent().addClass('fullwidth')
    getFrame(selected).parent().css('width', '100%')
    getFrame(selected).parent().css('height', '100%')
    getFrame(selected).parent().css('border-right', 'none')
    getFrame(selected).parent().css('border-left', 'none')
    if (getFrame(selected).attr('id') == 'flop') {
      // hide other thing and this' buttons
      $('#poplist').hide()
    } else if (getFrame(selected).attr('id') == 'pop') {
      $('#floplist').hide()
    }
    $('#focusbar').show()
    if (!collapse && !$('#leftcol').hasClass('collapsed')) { toggleCollapse() }
    focused = true
  } else {
    // unfocus
    $('#editbuts').after($('#searchbarframe'))
    $('#movebuts').after($('#timerent'))
    $('#collapseBut').after($('#focusbut'))
    $('#timerent').css('height', '')
    $('#searchbar').css('height', '')
    $('#focusbut').css('height', '')
      $('#focusbut').css('width', '')
    for (thing of [$('#flop'), $('#pop')]) {
      thing.parent().removeClass('fullwidth')
      thing.parent().css('height', '')
      thing.parent().css('width', '')
    }
    if (!$('#poplist').is(':visible')) {
      $('#poplist').show()
    } else if (!$('#floplist').is(':visible')) {
      $('#floplist').show()
    }
    $('#focusbar').hide()
    focused = false
    if (!collapse && $('#leftcol').hasClass('collapsed') && !(mobileTest())) {
      toggleCollapse()
    }
  }
}

function tutorial() {
  // view tutorial
  $('#tutorial').show()
  $('video').toArray().forEach((x) => {
    x.currentTime = 0
    x.playbackRate = 1.5
  })
}

function scrollToToday() {
  // view today
  let butheight = $(':root').css('--butheight')
  butheight = Number(butheight.slice(0, butheight.length - 2)) + 10
  $('#pop').animate({
    scrollTop: $(dateToHeading(stringToDate('0d'))).offset().top
      - $('#pop').offset().top - butheight
  }, 500)
}

// # MENUS

function context(ev, mobile) {
  // right-click menu
  justclicked = true
  setTimeout(function () { justclicked = false }, 500)
  if (selected != undefined &&
    selected[0].tagName == 'TEXTAREA') {
    saveTask()
  }
  let target = ev.target
  if (mobile) {
    target = $(ev.target).parent()[0]
  }
  ev.preventDefault()
  if ($(target)[0].tagName == 'TEXTAREA' &&
    !$(target).hasClass('selected')) {
    // select list
    target.click()
  } else {
    select($(target))
  }
  $('#context-menu').show()
  options = {
    '#context-newlist': [
      ['TEXTAREA', 'DIV'],['selected', 'unselected', 'loads']
    ],
    '#context-toggledrags': [
      ['TEXTAREA'], ['selected', 'unselected']
    ],
    '#context-deletelist': [
      ['TEXTAREA'], ['selected', 'unselected']
    ],
    '#context-toggleFoldList': [
      ['TEXTAREA'], ['selected', 'unselected']
    ],
    '#context-reset': [
      ['BUTTON', 'DIV'], ['opts']
    ],
    '#context-switchUser': [
      ['BUTTON', 'DIV'], ['opts']
    ],
    '#context-upload': [
      ['BUTTON', 'DIV'], ['opts']
    ],
    '#context-download': [
      ['BUTTON', 'DIV'], ['opts']
    ],
    '#context-moveToList': [
      ['SPAN'], ['in']
    ],
    '#context-divider': [
      ['SPAN'], ['in']
    ],
    '#context-toggleComplete': [
      ['SPAN'], ['in']
    ],
    '#context-toggleMaybe': [
      ['SPAN'], ['in']
    ],
    '#context-toggleimportant': [
      ['SPAN'], ['in']
    ],
    '#context-weekdaysToggle': [
      ['BUTTON'], ['opts']
    ],
    '#context-toggleHelp': [
      ['BUTTON', 'P'], ['opts', 'help']
    ],
    '#context-editTask': [
      ['SPAN'], ['in']
    ],
    '#context-archiveTask': [
      ['SPAN'], ['in']
    ],
    '#context-newTask': [
      ['SPAN', 'P'], ['in', 'buffer']
    ],
    '#context-newSubtask': [
      ['SPAN'], ['in']
    ],
    '#context-goToToday': [
      ['SPAN', 'P'], ['in', 'buffer']
    ],
    '#context-deleteTask': [
      ['SPAN'], ['in']
    ],
    '#context-indentTask': [
      ['SPAN'], ['in']
    ],
    '#context-unIndentTask': [
      ['SPAN'], ['in']
    ],
    '#context-toggleSubtasks': [
      ['SPAN'], ['in']
    ],
    '#context-collapseAll': [
      ['SPAN'], ['in']
    ],
    '#context-archiveComplete': [
      ['SPAN', 'P'], ['in', 'buffer']
    ],
    '#context-clearEmptyHeadlines': [
      ['P', 'SPAN'], ['in', 'buffer']
    ],
    '#context-toggleButs': [
      ['BUTTON'], ['opts']
    ],
    '#context-toggleFuturePanes': [
      ['BUTTON'], ['opts']
    ],
    '#context-toggleHeadingAlign': [
      ['BUTTON'], ['opts']
    ],
    '#context-togglePlay': [
      ['BUTTON'], ['opts']
    ],
    '#context-styleDefault': [
      ['BUTTON'], ['opts']
    ],
    '#context-styleJason': [
      ['BUTTON'], ['opts']
    ],
    '#context-styleLight': [
      ['BUTTON'], ['opts']
    ],
    '#context-stylePink': [
      ['BUTTON'], ['opts']
    ],
    '#context-styleGreen': [
      ['BUTTON'], ['opts']
    ],
    '#context-changeDate1': [
      ['BUTTON'], ['opts']
    ],
    '#context-changeDate2': [
      ['BUTTON'], ['opts']
    ],
    '#context-changeDate3': [
      ['BUTTON'], ['opts']
    ],
    '#context-clearEmptyDates': [
      ['BUTTON'], ['opts']
    ],
  }
  for (option of Object.keys(options)) {
    let showoption = false
    if (options[option][0].includes(target.tagName)) {
      for (cls of options[option][1]) {
        if ($(target).hasClass(cls)) {
          showoption = true
          break
        }
      }
    }
    if (showoption) {
      $(option).show()
    } else {
      $(option).hide()
    }
  }
  // correctly position top and left
  $('#context-menu').css('top', Math.min(ev.pageY,
    window.innerHeight - $('#context-menu').height()) - 20)
  $('#context-menu').css('left', Math.min(ev.pageX,
    window.innerWidth - $('#context-menu').width()) - 40)
  if ($('#context-menu').offset().top < 0) {
    $('#context-menu').css('top', '0')
  }
  if ($('#context-menu').offset().left < 0) {
    $('#context-menu').css('left', '0')
  }
}

function setOptions() {
  // triggered by clicking options button (index.html)
  justclicked = true
  setTimeout(function () { justclicked = false }, 500)
  $('#settype-menu').css('top', $('#typebut').offset().top)
  $('#settype-menu').css('left', $('#typebut').offset().left)
  $('#settype-menu').show()
}

// # COMMANDS

function clickOff(ev) {
  // mouse off
  if (draggingtask) { 
    setTimeout(function () {
      draggingtask = false
      if (!justdropped) {
        undo()
        resetDoc()
      }
    }, 100)
    return 
  }
  if (dblclicked) {
    if (ev.target.tagName == 'TEXTAREA' && $(ev.target).hasClass('in')) {
      // prevents interfering with edits
      return
    }
    if (ev.target.tagName == 'TEXTAREA' &&
      $(ev.target).hasClass('selected')) {
      if (!mobileTest()) {
        dragsOff()
      } else {
        context(ev)
      }
    } else if ($(ev.target)[0].tagName == 'TEXTAREA') {
      return
    } else if (selected && 
      selected.hasClass('in') && 
      selected[0].tagName == 'P') {
      newTask()
      selected.click(function (e) { $(this).focus() })
      setTimeout(function () { 
        selected.trigger('click')
      }, 200)
    } else if ($(ev.target).hasClass('in') &&
      ev.target.tagName != 'TEXTAREA' &&
      !$(ev.target).hasClass('dateheading')) {
      select($(ev.target))
      editTask()
    } else if (['bold', 'italic', 'bold-italic'].includes(
      $(ev.target).attr('class'))) {
      select($(ev.target).parent())
      editTask()
    } else if (($(ev.target).hasClass('selected') ||
      $(ev.target).hasClass('unselected'))) {
      dragsOff()
    } else if ($(ev.target).hasClass('loads')) {
      newlist()
    }
    return
  }
  dblclicked = true
  setTimeout(function () { 
    dblclicked = false 
  }, 300)
  if (mobileTest() && $(ev.target).hasClass('mobhandle') && !draggingtask) {
    // context menu
    select($(ev.target).parent(), false)
    context(ev, true)
  } else if ($(ev.target).attr('id') == 'popBut') {
    if (selected == undefined || getFrame(selected).attr('id') != 'pop') {
      select(dateToHeading(stringToDate('0d')), true)
    }
    newTask()
  } else if ($(ev.target).attr('id') == 'flopBut' && !justcollapsed) {
    if (selected == undefined || getFrame(selected).attr('id') != 'flop') {
      // insert after selected
      const newtask = $('<span class="in"></span>')
      $($('#flop').children()[0]).after(newtask)
      select(newtask)
      newTask()
      newtask.remove()
    } else {
      newTask()
    }
  } else if ($(ev.target).attr('id') == 'newHeadingFlopBut') {
    if (selected == undefined || getFrame(selected).attr('id') != 'flop') {
      // insert after selected
      const newtask = $('<span class="in"></span>')
      $('#flop').prepend(newtask)
      select(newtask)
      newTask()
      newtask.remove()
    } else {
      newTask()
    }
    selected.val('# ')
  } else if (['editTaskBut', 'newSubtaskBut', 'scheduleBut', 'collapseBut']
    .includes($(ev.target).attr('id'))) {
    eval($(ev.target).attr('function'))
  } else if ($(ev.target).hasClass('dropdown-item') && !justclicked) {
    eval($(ev.target).attr('function'))
  }
  // on revert drags on mobile
  $('.drop-hover').removeClass('drop-hover')
  if (!justclicked) { $('nav').hide() }
  if (ev.target.tagName != 'TEXTAREA') {
    resetDoc()
  }
}

function clickOn(ev) {
  // mouse down
  if (movetolist && !$(ev.target).hasClass('listtitle')) {
    // cancels move to list
    movetolist = false
  }
  // pre-click
  if (ev.target.tagName == 'TEXTAREA' && $(ev.target).hasClass('in')) {
    return 
  } else if ($(ev.target).hasClass('slider')) {
    return
  } else if ($(ev.target).hasClass('dropdown-item')) { 
    return
  } else if (selected != undefined && selected[0].tagName == 'TEXTAREA' &&
    ev.target.tagName != 'TEXTAREA') {
    saveTask()
  }
  $('nav').hide() 
  $('.slider').remove() // remove sliders
  // click events
  if ($(ev.target).attr('id') == 'todayBut') {
    select(dateToHeading(stringToDate('0d')), true)
  } else if ($(ev.target).attr('id') == 'addDateBut') {
    ev.preventDefault()
    $('#searchbar').val('d:')
    select()
    $('#searchbar').focus()
  } else if ($(ev.target).attr('id') == 'timerStartBut') {
    const timerval = $('#timerent').val()
    if (!timerval.includes(':')) $('#timerent').val(timerval + ':00')
    startTimer()
  } else if ($(ev.target).attr('id') == 'timerStopBut') {
    stopTimer()
  } else if (['newSubtaskBut', 'scheduleBut', 'collapseBut', 'editTaskBut']
    .includes($(ev.target).attr('id'))) {
    // buttons evaluated with clickoff() (for selection purposes)
    return
  } else if ($(ev.target)[0].tagName == 'BUTTON') {
    // execute button functions
    eval($(ev.target).attr('function'))
  } else if ($(ev.target).hasClass('listtitle')) {
    if (mobileTest() && $(ev.target).val() != '') {
      ev.preventDefault()
      $(':focus').blur()
      dragsOn()
    } else if ($(ev.target).hasClass('unselected')) {
      dragsOn()
    }
    if (movetolist != true) select()
  } else if ($(ev.target).hasClass('buffer')) {
    select(getFrame($(ev.target)), false)
  } else if ($(ev.target).attr('id') == 'searchbar') {
    select()
    // nothing; don't unselect
  } else if ($(ev.target).hasClass('link')) {
    // search the task
    $('#searchbar').val($(ev.target).text().slice(2, -2))
    search(true)
  } else if ($(ev.target).hasClass('falselink')) {
    // search the task
    $('#searchbar').val($(ev.target).text())
    search('deadline', $(ev.target).attr('deadline'))
  } else if ($(ev.target).hasClass('falselinkimp')) {
    // search the task
    $('#searchbar').val($(ev.target).text())
    search()
  } else if ($(ev.target).hasClass('impspan')) {
    // search the task
    const list = Number($(ev.target).attr('list'))
    if (list < data.flop.length) {
      loadedlist = list
      loadList()
    } else {
      select(dateToHeading(stringToDate('0d')), true)
    }
  } else if ($(ev.target).hasClass('weblink')) {
    let title = $(ev.target).attr('title')
    if (!title.includes('https://www.')) title = 'https://www.' + title
    else if (!title.includes('https://')) title = 'https://' + title
    window.open(title, '_blank')
  } else if ($(ev.target).hasClass('timing')) {
    // timing generate for thing
    dragTime($(ev.target))
  } else if ($(ev.target).hasClass('deadline')) {
    select(dateToHeading(stringToDate(
      $(ev.target).text().slice(1))), true)
  } else if ($(ev.target).hasClass('duedate')) {
    // jump to deadline
    $('#searchbar').val(stripChildren($(ev.target)).slice(2))
    search('deadline', dateToString(stringToDate(
      stripChildren($(getHeading($(ev.target)))), true)))
  } else if (getFrame($(ev.target)) && $(ev.target).hasClass('in')) {
    // select allowable elements
    select(ev.target, false)
  } else if (!isSubtask($(ev.target))) {
    // select parents of 
    select($(ev.target).parent(), false)
  } else {
    select()
  }
}

function keyUp(ev) {
  // key up
  if (ev.key == 'Control') {
    // re-enable drags
    try {
      $('span.in').draggable('option', 'disabled', false)
    } catch (err) {}
  } else if (ev.key == 'Alt') {
    for (let button of $('#timertimes').children()) {
      if ($(button).text().charAt(0) == '-') {
        $(button).text($(button).text().slice(1))
      }
    }
  }
}

function keyDown(ev) {
  // key down
  if (ev.key == 'Control') {
    // cancel draggables
    try {
      $('span.in').draggable('option', 'disabled', true)
    } catch (err) {}
  }
  if (ev.key == 'Alt') {
    for (let button of $('#timertimes').children()) {
      $(button).text('-' + $(button).text())
    }
  }
  if (['Command', 'Shift', 'Alt'].includes(ev.key)) {
    return
  }
  if (['ArrowUp', 'ArrowDown'].includes(ev.key)) ev.preventDefault()
  if (ev.ctrlKey || ev.metaKey || ev.altKey || ev.key == 'Enter' ||
    ev.key == 'Escape') {
    // reset zoom and scroll to make better
    resetDoc()
  }
  // makes sure to unselect on proper things
  if (selected && selected[0].tagName == 'TEXTAREA' && ev.ctrlKey) {
    const selectstart = selected[0].selectionStart
    const selectend = selected[0].selectionEnd
    const val = selected.val()
    if (ev.key == '1') {
      selected.val('# ' + val)
      selected[0].selectionStart = selectstart + 2
      selected[0].selectionEnd = selectend + 2
    } else if (ev.key == '2') {
      selected.val('## ' + val)
      selected[0].selectionStart = selectstart + 3
      selected[0].selectionEnd = selectend + 3
    } else if (ev.key == '3') {
      selected.val('### ' + val)
      selected[0].selectionStart = selectstart + 4
      selected[0].selectionEnd = selectend + 4
    } else if (ev.key == '8') {
      selected.val('• ' + val)
      selected[0].selectionStart = selectstart + 2
      selected[0].selectionEnd = selectend + 2
    } else if (ev.key == '9') {
      selected.val('- ' + val)
      selected[0].selectionStart = selectstart + 2
      selected[0].selectionEnd = selectend + 2
    } else if (ev.key == 'b') {
      selected.val(val.slice(0, selectstart) +
        '*' + val.slice(selectstart, selectend) + '*' + 
        val.slice(selectend))
      selected[0].selectionStart = selectstart + 1
      selected[0].selectionEnd = selectend + 1
    } else if (ev.key == 'i') {
      selected.val(val.slice(0, selectstart) +
        '_' + val.slice(selectstart, selectend) + '_' + 
        val.slice(selectend))
      selected[0].selectionStart = selectstart + 1
      selected[0].selectionEnd = selectend + 1
    } else if (ev.key == 'l') {
      selected.val(val.slice(0, selectstart) +
        '[[' + val.slice(selectstart, selectend) + ']]' + 
        val.slice(selectend))
      selected[0].selectionStart = selectstart + 2
      selected[0].selectionEnd = selectend + 2
    } else if (ev.key == 'r') {
      selected.val(val + ' ~')
      selected[0].selectionStart = val.length + 2
      selected[0].selectionEnd = val.length + 2
    } else if (ev.code == 'Period') {
      selected.val(val + ' >')
      selected[0].selectionStart = val.length + 2
      selected[0].selectionEnd = val.length + 2
    }
  } else if (ev.key == 'Escape' && selected != undefined &&
    selected[0].tagName == 'TEXTAREA') {
    // save task
    ev.preventDefault()
    const frame = getFrame(selected)
    const scrollsave = getFrame(selected).scrollTop()
    const exp = /^(•*)(\s*)$/
    if (exp.test(selected.val())) {
      selected.prev().remove()
      let taskabove = taskAbove()
      if (!taskabove || taskabove == selected) {
        taskabove = taskBelow()
      } 
      if (!taskabove || taskabove == selected) {
        taskabove = getFrame(selected)
      }
      selected.remove()
      select(taskabove, false)
    } else {
      // select current task if cancelling
      saveTask()
    }
    frame.scrollTop(scrollsave)
  } else if (ev.key == 't' && ev.ctrlKey) {
    // go to today
    select(dateToHeading(stringToDate('0d')), true)
  } else if (ev.key == 'f' && ev.ctrlKey) {
    // focus on search
    $('#searchbar').focus()
  } else if (ev.code == 'KeyH' && ev.ctrlKey && ev.shiftKey) {
    // focus
    toggleFocus()
  } else if (ev.code == 'KeyH' && ev.ctrlKey) {
    // hide sidebar
    toggleCollapse()
  } else if (ev.key == 'Enter' && $(':focus').attr('id') ==
    'searchbar') {
    // focus on searchbar and find it
    ev.preventDefault()
    if ($('#searchbar').val().slice(0, 2) == 'd:') {
      const date = dateToHeading(
        stringToDate($('#searchbar').val().slice(2)), false, true)
      select(date, true)
      $('#searchbar').val('')
      $('#searchbar').blur()
      if (movetask != undefined) {
        selected.after(movetask)
        movetask = undefined
      }
      // already saves
    } else if ($('#searchbar').val().charAt(0) == '#') {
      // filter tags
      const searchstr = $('#searchbar').val()
      filtered = true
      filteredlist = $('#pop').find('span.in:visible:not(.dateheading)')
        .toArray().concat($('#flop').find('span.in:visible').toArray(),
        $('.duedate').toArray()).filter((x) => {
          return !stripChildren($(x)).includes(searchstr)
        })
      filteredlist.forEach((x) => { $(x).hide() })
    } else {
      // search
      search()
    }
  } else if ($(':focus').attr('id') == 'timerent' && ev.key == 'Enter') {
    // enter timer
    document.body.style.zoom = "100%";
    timertest(ev)
  } else if ($(':focus').attr('id') == 'timerent' && ev.key == 'Escape') {
    ev.preventDefault()
    stopTimer()
  } else if ($(':focus').attr('id') == 'timerent' && ev.key == ' ') {
    ev.preventDefault()
    timer.stop()
    $('#timerent').blur()
  } else if (ev.key == 'Escape') {
    // cancel select
    ev.preventDefault()
    $('#searchbar').val('')
    $('#searchbar-results').hide()
    $(':focus').blur()
    select()
    if (filtered) unFilter()
  } else if (ev.key == 'z' && ev.ctrlKey) {
    undo()
  } else if (!selected && ev.key == 'Enter' &&
    ev.shiftKey && $(':focus').hasClass('selected')) {
    // save list
    toggleDrags()
  } else if (!selected && ev.key == 'Escape' &&
    $(':focus').hasClass('selected')) {
    ev.preventDefault()
    // save list
    dragsOn()
    $(':focus').blur()
  } else if (!selected && ev.key == 'Enter' &&
    $(':focus').hasClass('listtitle')) {
    // new list
    ev.preventDefault()
    newlist()
  } else if (selected && ev.key == 'Enter' &&
    ev.shiftKey) {
    ev.preventDefault()
    // edit/save task
    if (selected[0].tagName == 'TEXTAREA') {
      saveTask()
    } else if (selected[0].tagName == 'SPAN') {
      editTask()
    }
  } else if (selected != undefined && ev.key == 'Enter' && 
    ev.metaKey && ev.altKey) {
    ev.preventDefault()
    newTask(true, true)
  } else if (selected != undefined && ev.key == 'Enter' &&
    ev.metaKey) {
    // new task above
    ev.preventDefault()
    if (selected[0].tagName == 'TEXTAREA') {
      saveTask()
    }
    const oldselect = selected
    if ($(taskAbove())[0] == selected.parent()[0]) {
      // first subtask
      select(taskAbove())
      newTask(true, true)
    } else if ($(taskAbove())[0] != selected[0]) {
      // normal
      select(taskAbove())
      newTask()
    } else {
      // first task
      const newspan = $('<span class="in">try task</span>')
      selected.before(newspan)
      select(newspan)
      newTask()
      newspan.remove()
    }
    if (oldselect.hasClass('list')) { 
      selected.val('• ')
    }
  } else if (selected && ev.key == 'Enter' && ev.altKey &&
    !isHeading(selected)) {
    // new subtask
    ev.preventDefault()
    if (selected[0].tagName == 'TEXTAREA') {
      saveTask()
    }
    newTask(true)
  } else if (selected != undefined && ev.key == 'Enter') {
    // new task 
    ev.preventDefault()
    if (selected[0].tagName == 'TEXTAREA') {
      saveTask()
    }
    newTask()
  } else if (!ev.metaKey && !ev.altKey && !ev.ctrlKey &&
    selected != undefined && selected[0].tagName == 'TEXTAREA') {
    // modify the height of the textarea to hold everything
    updateHeight()
  } else if ($(':focus').hasClass('listtitle')) {
    // resize
    updateSizes()
  } else if (ev.key == 'r' && ev.ctrlKey) {
    // select random
    selectRandom()
  } else if (selected != undefined && selected[0].tagName !=
    'TEXTAREA') {
    // task commands
    if (ev.key == 'Backspace' && $(':focus').attr('id') != 'searchbar') {
      // delete
      deleteTask()
    } else if (ev.code == 'KeyI' && ev.altKey) {
      // important
      toggleImportant()
    } else if (ev.code == 'KeyM' && ev.altKey) {
      // maybe
      toggleMaybe()
    } else if (ev.key == '‘') {
      // indent
      indentTask(true)
    } else if (ev.key == '“') {
      // unindent
      indentTask(false)
    } else if (ev.key == '[' || ev.key == ']') {
      // toggle folding
      toggleSubtasks();
    } else if (ev.key == ' ') {
      // toggle complete or archive
      ev.preventDefault();
      if (ev.shiftKey) {
        archiveTask()
      } else {
        toggleComplete()
      }
    } else if (ev.key == 'c' && ev.metaKey) {
      // copy
      copieditem = selected.clone()
    } else if (ev.key == 'x' && ev.metaKey) {
      // cut
      copieditem = selected.clone
      selected.remove()
      save('-', copieditem)
    } else if (ev.key == 'v' && ev.metaKey) {
      // paste
      if (copieditem) {
        selected.after(copieditem)
        select(selected.next(), true)
        copieditem = undefined
        save('+', selected)
      }
    } else if (ev.key == 'ArrowUp' && ev.altKey) {
      ev.preventDefault()
      moveTask('up')
    } else if (ev.key == 'ArrowDown' && ev.altKey) {
      ev.preventDefault()
      moveTask('down')
    } else if (ev.key == 'ArrowRight' && ev.altKey) {
      // move to pop
      moveTask('pop')
    } else if (ev.key == 'ArrowLeft' && ev.altKey) {
      // move to flop
      moveTask('flop')
    } else if (ev.key == 'ArrowUp' && ev.shiftKey) {
      // select previous heading
      ev.preventDefault()
      let heading
      if (selected.hasClass('h1')) headings = ['h1']
      else if (selected.hasClass('h2')) headings = ['h1', 'h2']
      else if (selected.hasClass('h3')) headings = ['h1', 'h2', 'h3']
      else headings = ['in']
      const oldselect = selected[0]
      try {
        while (taskAbove() && (!isHeading(taskAbove()) ||
          !hierarchyCheck(taskAbove(), headings))) {
          if (taskAbove()[0] == selected[0]) break
          select(taskAbove(), false)
        }
        select(taskAbove(), true)
      } catch (er) {
        // just select the thing
        select(oldselect)
        while (taskAbove() && !isHeading(taskAbove())) {
          if (taskAbove()[0] == selected[0]) break
          select(taskAbove(), false)
        }
        select(taskAbove(), true)
      }
    } else if (ev.key == 'ArrowDown' && ev.shiftKey) {
      // select next heading
      ev.preventDefault()
      let heading
      if (selected.hasClass('h1')) headings = ['h1']
      else if (selected.hasClass('h2')) headings = ['h1', 'h2']
      else if (selected.hasClass('h3')) headings = ['h1', 'h2', 'h3']
      else headings = ['in']
      const oldselect = selected[0]
      try {
        while (taskBelow() && (!isHeading(taskBelow()) ||
          !hierarchyCheck(taskBelow(), headings))) {
          if (taskBelow()[0] == selected[0]) break
          select(taskBelow(), false)
        }
        select(taskBelow(), true)
      } catch (er) {
        // just select the thing
        select(oldselect)
        while (taskBelow() && !isHeading(taskBelow())) {
          if (taskBelow()[0] == selected[0]) break
          select(taskBelow(), false)
        }
        select(taskBelow(), true)
      }
    } else if (ev.key == 'ArrowUp') {
      // select previous
      ev.preventDefault()
      select(taskAbove(), true)
    } else if (ev.key == 'ArrowDown') {
      // select next
      ev.preventDefault()
      select(taskBelow(), true)
    } else if (ev.key == 'ArrowRight') {
      // select pop
      select(dateToHeading(stringToDate('0d')), true)
    } else if (ev.key == 'ArrowLeft') {
      // select flop
      select($('#flop').children()[1], true)
    }
  }
}