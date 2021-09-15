// changes
var loadedlist
var selected
var focused
var focusmode
var dragsenabled = true
var inprogress
var time
var pause
var updated = false
var searchwidth = 10
var movetask
var fileinput
var loadedlistobj
var uploading = false
var reloading
var currentupload
var slider
var movetolist = false
var durslider
var stopwatch
var copieditem
var prevupload = JSON.stringify(data)
var flopscrollsave
var popscrollsave
var justclicked
var dragtimer
var mobile
var draggingtask
var linestarts = {
  '# ': 'h1',
  '## ': 'h2',
  '### ': 'h3',
  '•': 'list',
  '@': 'event',
  '-': 'note'
}
var lineinners = {
  '_*': ['*_', 'bold-italic'],
  '*': ['*', 'bold'],
  '_': ['_', 'italic'],
  '[[': [']]', 'link'],
  '>': [' ', 'deadline']
}
var savedata
var weekdaysStr
var weekdaysNum = {
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
var filtered
var filteredlist

function display(x) {
  console.log(x)
}

function mobiletest() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    .test(navigator.userAgent)) {
    console.log(true);
    return true
  } else {
    console.log(false);
    return false
  }
}

//# TIMER
var timer = new Timer({
  tick: 1,
  ontick: function (sec) {
    let minutes = Math.floor(sec / 60000); // minutes
    let secs = Math.ceil((sec - (Math.floor(sec / 60000) * 60000)) / 1000)
    $('#timerent').val(String(minutes) + ':' +
      String(secs).padStart(2, 0))
  },
  onstart: function () { }
})

// defining options using on
timer.on('end', function () {
  $('#timersnd')[0].currentTime = 0
  $('#timersnd')[0].play()
  alert('timer done')
  $('#timersnd')[0].pause()
  $('#timerent').val('')
})

//# DRAG BEHAVIOR

//start of drag
function dragList(evt) {
  //start drag
  loadedlistobj = evt.target
  //set data - sets drag data
  evt.dataTransfer.setData('text/plain', evt.target.value)
  //specify allowed transfer
  evt.dataTransfer.effectAllowed = 'move'
}

// for desktops
function dragTaskOver(event) {
  // $('#listcontainer > .in').css('width', $('#flop').width() + 'px')
  $(document).scrollTop(0)
  const boxright = $('#listcontainer').offset().left
  if (event.pageX < boxright) {
    // load the dragged-over list
    let i = 0
    const loads = $('#loads').children().toArray()
    for (list of loads) {
      const boxtop = $(list).offset().top
      if (event.pageY > boxtop && event.pageY < boxtop + $(list).height() &&
        $(list).hasClass('unselected')) {
        $(loads[loadedlist]).removeClass('selected')
        $(loads[loadedlist]).addClass('unselected')
        selected.detach()
        data.flop[loadedlist].text = $('#flop').html()
        flopscrollsave = undefined
        if (popscrollsave) {
          $('#pop').scrollTop(popscrollsave)
        }
        popscrollsave = undefined
        $('#flop, #pop').removeClass('greyedout')
        $('.drop-hover').removeClass('.drop-hover')
        loadedlist = i
        $('#flop').empty()
        $('#flop').html(data.flop[loadedlist].text)
        $(list).removeClass('unselected')
        $(list).addClass('selected')
        updateSpanDrags()
        return
      }
      i++
    }
  } else {
    const timertime = 3
    const offsetwidth = 50
    const scrollChange = 1
    const flopoffset = $('#flop').offset().top
    const flopheight = $('#flop').height()
    const popoffset = $('#pop').offset().top
    const popheight = $('#pop').height()
    const popleft = $('#pop').offset().left
    clearTimeout(dragtimer)
    dragtimer = setTimeout(mobileDragOver, timertime, event)
    if (flopoffset + flopheight - offsetwidth < event.pageY &&
      event.pageY < flopoffset + flopheight &&
      event.pageX < popleft) {
      // scroll down
      $('#flop').scrollTop($('#flop').scrollTop() + scrollChange)
    } else if (flopoffset < event.pageY &&
      event.pageY < flopoffset + offsetwidth &&
      event.pageX < popleft) {
      // scroll up
      $('#flop').scrollTop($('#flop').scrollTop() - scrollChange)
    } else if (popoffset + popheight - offsetwidth < event.pageY &&
      event.pageY < popoffset + popheight &&
      event.pageX > popleft) {
      // scroll down
      $('#pop').scrollTop($('#pop').scrollTop() + scrollChange)
    } else if (popoffset < event.pageY &&
      event.pageY < popoffset + offsetwidth &&
      event.pageX > popleft) {
      // scroll up
      $('#pop').scrollTop($('#pop').scrollTop() - scrollChange)
    } else {
      clearTimeout(dragtimer)
    }
  }
}

//dropping
function dropList(evt) {
  //drop
  evt.preventDefault()
  evt.stopPropagation()
  //update data
  loads = Array.from($('#loads').children())
  // swap positions in array
  if (selected != undefined) {
    // move task to new list
    const index = $(evt.target).parent().children().toArray().indexOf(
      $(evt.target)[0])
    const children = getHeadingChildren(selected)
    $('#test').html(data.flop[index].text); // update test p with html
    $('#test').append(selected)
    for (i = children.length - 1; i >= 0; i--) {
      // append each child after
      selected.after(children[i])
    }
    data.flop[index].text = $('#test').html()
    save()
    loadedlist = Number(index)
    loadList()
    return
  }
  data.flop.splice(loads.indexOf(evt.target) + 1, 0,
    data.flop[loads.indexOf(loadedlistobj)])
  // take out old item
  if (loads.indexOf(loadedlistobj) > loads.indexOf(evt.target)) {
    data.flop.splice(loads.indexOf(loadedlistobj) + 1, 1)
    loadedlist = loads.indexOf(evt.target) + 1
  } else {
    data.flop.splice(loads.indexOf(loadedlistobj), 1)
    loadedlist = loads.indexOf(evt.target)
  }
  for (let i = 0; i < loads.length; i++) {
    loads[i].value = data.flop[i].title
    $(loads[i]).removeClass('sublist')
    if ($(loads[i]).val().slice(0, 2) == '- ') $(loads[i]).addClass('sublist')
  }
  $(':focus').blur()
  loadList()
}

//enable you to edit titles
function toggledrags(saving) {
  loads = $('#loads').children().toArray()
  if (dragsenabled === true) {
    loads.forEach((i) => {
      i.setAttribute('draggable', 'false')
    })
    dragsenabled = false
    const oldval = $(loads[loadedlist]).val()
    $(loads[loadedlist]).val('')
    $(loads[loadedlist]).val(oldval)
    if (saving != false) {
      save()
      setTimeout(function () { loads[loadedlist].focus() }, 300)
    }
  } else {
    loads.forEach((x) => {
      $(x).attr('draggable', 'true')
    })
    dragsenabled = true
    $(document).scrollTop(0); // fixes weird shit
    if ($(loads[loadedlist]).val().slice(0, 2) == '- ') {
      $(loads[loadedlist]).addClass('sublist')
    } else {
      $(loads[loadedlist]).removeClass('sublist')
    }
    if (saving != false) save()
    $(':focus').blur()
  }
  updateSizes()
}

function dragsoff(saving) {
  if (dragsenabled) {
    toggledrags(saving)
  }
}

function dragson(saving) {
 if (!dragsenabled) {
    toggledrags(saving)
  }
}

// # DATA BEHAVIOR

// new list
function newlist(title, text, saving) {
  let savetitle
  if (!title) {
    savetitle = ''
  } else {
    savetitle = title
  }
  let savetext
  if (!text) {
    savetext = ''
  } else {
    savetext = text
  }
  const newobj = {
    'title': savetitle,
    'text': savetext
  }
  if (!title) {
    data.flop.push(newobj) //add to main list of lists only if it's new
  }
  const newthing = $('<textarea></textarea>')
  newthing.val(newobj.title)
  newthing.addClass('unselected listtitle')
  newthing.on('click', loadthis)
  if (dragsenabled == 'true') {
    newthing.attr('draggable', 'true')
  }
  newthing.attr('ondragstart', 'dragList(event)')
  newthing.attr('ondragover', 'draggingOver(event)')
  newthing.attr('ondrop', 'dropList(event)')
  $('#loads').append(newthing)
  loadedlist = $('#loads').children().length - 1
  loadList(saving); // load last element in list
  if (saving != false) {
    try { $('#loads').children()[loadedlist].focus() }
    catch (err) { display([err, 'loadedlist is ' + loadedlist]) }
  }
  if ($($('#loads').children()[loadedlist]).val().slice(0, 2) == '- ') {
    $($('#loads').children()[loadedlist]).addClass('sublist')
  } else {
    $($('#loads').children()[loadedlist]).removeClass('sublist')
  }
  dragsoff(saving)
}

// remove list from display and data
function deletelist() {
  yes = confirm('are you sure you want to delete this list?')
  if (yes) {
    $('#loads').children()[loadedlist].remove()
    data.flop.splice(loadedlist, 1)
    $('#flop').empty()
    loadedlist = undefined
    save()
    if (data.flop.length > 0) {
      loadedlist = 0
      loadList()
    }
  }
}

function loadList(saving) { //updates the list display
  unfilter()
  const loads = $('#loads').children().toArray()
  loads.forEach(function (i) {
    $(i).removeClass('selected')
    $(i).addClass('unselected')
  })
  $(loads[loadedlist]).removeClass('unselected')
  $(loads[loadedlist]).addClass('selected')
  $('#flop').html(data.flop[loadedlist].text)
  updateSpanDrags()
  $('.taskselect').removeClass('taskselect')
  if (saving != false) {
    save()
  } else {
    $(loads[loadedlist]).blur()
  }
  $('#flop').scrollTop(0)
}

function toggleFoldList(saving) {
  // folds list into sublists
  let sublist = Number(loadedlist) + 1
  const children = $('#loads').children().toArray()
  if ($(children[sublist]).hasClass('sublist')) {
    // toggle folded and "..."
    $(children[loadedlist]).toggleClass('folded')
    const val = $(children[loadedlist]).val()
    if (
      $(children[loadedlist]).hasClass('folded') &&
      val.slice(val.length - 4, val.length) != ' ...'
    ) {
      $(children[loadedlist]).val(val + ' ...')
    } else if (
      !$(children[loadedlist]).hasClass('folded') &&
      val.slice(val.length - 4, val.length) == ' ...'
    ) {
      $(children[loadedlist]).val(val.slice(0, val.length - 4))
    }
  }
  while ($(children[sublist]).hasClass('sublist')) {
    // toggle shown
    if ($(children[sublist]).is(':visible')) {
      $(children[sublist]).hide()
    } else {
      $(children[sublist]).show()
    }
    sublist += 1

  }
  if (saving != false) save()
}

function updateSizes() {
  for (list of [
    [$('#timerent')[0], 6],
    [$('#searchbar')[0], 5],
    [$('#username')[0], $('#username').text().length / 2 + 2],
    [$('#lists')[0], 7]
  ]
    // ].concat(
    //   $('#loads').children().toArray().map((x) => {
    //     let textlength = Math.max($(x).val().split(' ').map((x) => {
    //       return x.length
    //     }))
    //     return [$(x)[0], textlength / 2 + 2.5]
    //   }))
  ) {
    // update entries
    let fontsize = 24
    if (mobiletest()) fontsize = 16
    while ($(list[0]).width() / (fontsize / 2) < list[1]) {
      fontsize -= 1
    }
    $(list).css('font-size', fontsize + 'px')
  }
  // fix context menu for mobile
  if (mobiletest()) {
    $('.dropdown-item').toArray().forEach((x) => {
      $(x).text($(x).text().replace(/\s\((.*)\)/, ''))
    })
  }
  for (list of $('#loads').children()) {
    if ($(list).width() < $(list).val().length *
      ($(list).css('font-size').slice(0,
        $(list).css('font-size').length - 2) / 2)) {
      $(list).css('overflow-y', 'scroll')
    } else {
      $(list).css('overflow-y', 'hidden')
    }
  }
  $('#flopbuts, #popbuts').css('width',
    String(
      Math.floor(($('.rendered:visible').width() / window.innerWidth) * 100)) +
      'vw')
}

// picks a new loadlist
function loadthis(event) {
  let movetask
  if (movetolist) {
    movetask = selected.detach()
    movetolist = false
  }
  loads = Array.from($('#loads').children())
  loadedlist = loads.indexOf(this)
  loadList(this)
  if (movetask) {
    $('#flop > .buffer.bottom').before(movetask)
    save()
  }
}

function clean() {
  $('#test').empty()
  // update height of loads
  const leftcol = $($('.leftcolumn')[0])
  const loadsheight = leftcol.height() -
    leftcol.children().filter(':not(#loads):visible').toArray().reduce((total,
      x) => {
      return total + $(x).height();
    }, 0)
  $('#loads').css('height', loadsheight + 'px')
  $('textarea.in').remove()
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
    return stringToDate($(a).text(), true).getTime() -
      stringToDate($(b).text(), true).getTime()
  })) {
    const children = getHeadingChildren($(heading)).reverse()
    $('#pop').append($(heading))
    children.forEach((x) => {
      $(heading).after($(x))
    })
  }
  // clean empty lists
  const loadlist = $('#loads').children().toArray()
  for (list in loadlist) {
    try {
      $('#test').html(data.flop[list].text)
      // clears out empty lists
      if (
        $(loadlist[list]).val().length == 0 &&
        $('#test').children().filter('.in').length == 0 &&
        loadedlist != list
      ) {
        data.flop.splice(list, 1)
        $($('#loads').children()[list]).remove()
      }
    } catch (err) {
      display(err)
      $($('#loads').children()[list]).remove()
    }
  }
  // clear out deprecated attributes
  $('span.in').removeAttr('ondragstart')
  $('span.in').removeAttr('ondragover')
  $('span.in').removeAttr('ondrop')
  $('span.in').removeAttr('draggable')
}

// Storing data:
function save(undo) {
  unfilter(false)
  if (undo) savedata = JSON.parse(JSON.stringify(data))
  // save data
  let newdata = JSON.parse(JSON.stringify(data)) // copies data
  newdata.pop = $('#pop').html()
  if (loadedlist != undefined) {
    try {
      newdata.flop[loadedlist].text = $('#flop').html()
      try {
        newdata.flop[loadedlist].title =
          $('#loads').children()[loadedlist].value
      } catch (TypeError) {
        newdata.flop[loadedlist].title = ''
      }
      newdata.loadedlist = loadedlist
    } catch (TypeError) {
      newdata.loadedlist = 0
      loadedlist = 0
      loadList()
    }
  }
  // clean up styling
  $('span.in:visible').attr('style', '')
  clean()
  data = JSON.parse(JSON.stringify(newdata))
  updatedeadlines() // updateSpanDrags() called in updatedeadlines
  $(document).scrollTop(0) // fixes scroll
  // backup data to the server after setting localstorage data
  uploadData()
}

function clearEmptyDates(saving) {
  $('.placeholder').remove()
  // take away empty dates
  const dateslist = $('#pop').children().filter('.dateheading')
  for (date of dateslist) {
    if (
      getHeadingChildren($(date)).length == 0 &&
      stringToDate($(date).text(), true).getTime() !=
      stringToDate('0d').getTime()
    ) { date.remove() }
  }
  if (saving != false) { save() }
}

function switchUser() {
  // switches data and reloads page
  save()
  let past = new Date()
  past.setTime(
    past.getTime() - 10000000)
  past = past.toUTCString()
  document.cookie = 'user=;expires=' + past + ';' + ';path=/;'
  document.cookie = 'fname=;expires=' + past + ';' + ';path=/;'
  document.cookie = 'pw=;expires=' + past + ';' + ';path=/;'
  location.reload()
}

function upload() {
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
  var blob = new Blob([JSON.stringify(data)], {
    type: 'text/plain;charset=utf-8'
  })
  const date = new Date()
  saveAs(blob, 'RiverBank-backup-' + dateToString(date) + '.json')
}

// Reset data to store in the browser
function reset() {
  yes = confirm("Are you sure you want to reset?")
  if (yes) {
    data = JSON.parse(JSON.stringify(resetstring))
    uploadData(true)
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

function toggleHeadingAlign() {
  if (data.headingalign == 'left') data.headingalign = 'center'
  else data.headingalign = 'left'
  save()
  document.documentElement.style.setProperty('--headingalign',
    data.headingalign)
}

function toggleWeekdayFormat() {
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
      const getdate = stringToDate($(x).text().slice(
        1, $(x).text().length - 1), false)
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
  uploadData(true)
}

function dateToString(date, weekday) {
  // date to formatted string
  let datestr = ''
  if (weekday) {
    // add in weekday
    datestr += weekdaysStr[date.getDay()] + ' '
  }
  if (data.dateSplit == 'dd.mm.yyyy') {
    datestr += String(date.getDate()).padStart(2, 0) + '.' +
      String(Number(date.getMonth()) + 1).padStart(2, 0) + '.' +
      date.getFullYear()
  } else if (data.dateSplit == 'mm/dd/yyyy') {
    datestr += String(Number(date.getMonth() + 1)).padStart(2, 0) +
      '/' + String(date.getDate()).padStart(2, 0) + '/' +
      date.getFullYear()
  } else if (data.dateSplit == 'yyyy-mm-dd') {
    datestr += date.getFullYear() + '-' +
      String(Number(date.getMonth() + 1)).padStart(2, 0) + '-' +
      String(date.getDate()).padStart(2, 0)
  }
  return datestr
}

function stringToDate(string, weekday, future) {
  // maps a date-search string to a specific date heading
  if (weekday) {
    // chop off weekday
    string = string.split(' ').slice(1).join(' ')
  } else {
    weekday = false
  }
  string = string.replace('...', '')
  if (string.charAt(0) == ' ') {
    string = string.slice(1)
  }
  let date = new Date()
  if (
    Object.keys(weekdaysNum).includes(string.split(/(\+|-|\s)/)[0])
  ) {
    // analyze as a weekday string
    weekday = weekdaysNum[string.split(/(\+|-|\s)/)[0]]
    if (future) {
      date.setDate(date.getDate() + 1)
    }
    while (date.getDay() != weekday) {
      date.setDate(date.getDate() + 1)
    }
  } else {
    // analyze as a date string
    let datestring
    if (string.match(/[\+-]*\d+[wmyd]/) != null) {
      datestring = string.slice(0,
        string.search(/[\+-]*\d+[wmyd]/))
      // compensates for no t
      if (datestring == '') datestring = String(date.getDate())
    } else {
      datestring = string
    }
    if (data.dateSplit == 'dd.mm.yyyy') {
      const list = datestring.split('.')
      date.setDate(list[0])
      if (list.length >= 2) {
        date.setMonth(list[1] - 1)
      }
      if (list.length == 3) {
        if (list[2].length == 2) {
          date.setFullYear('20' + list[2])
        } else if (list[2].length == 4) {
          date.setFullYear(list[2])
        }
      }
    } else if (data.dateSplit == 'mm/dd/yyyy') {
      const list = datestring.split('/')
      if (list.length == 1) {
        date.setDate(list[0])
      } else {
        date.setMonth(list[0] - 1)
        date.setDate(list[1])
        if (list.length == 3) {
          if (list[2].length == 2) {
            date.setFullYear('20' + list[2])
          } else {
            date.setFullYear(list[2])
          }
        }
      }
    } else if (data.dateSplit == 'yyyy-mm-dd') {
      const list = datestring.split('-')
      if (list.length == 1) {
        date.setDate(list[0])
      } else if (list.length == 2) {
        date.setDate(list[1])
        date.setMonth(list[0] - 1)
      } else if (list.length == 3) {
        date.setDate(list[2])
        date.setMonth(list[1] - 1)
        if (list[0].length == 2) {
          date.setFullYear('20' + list[0])
        } else if (list[0].length == 4) {
          date.setFullYear(list[0])
        }
      }
    }
  }
  // analyze for addition of stuff
  if (string.match(/[\+-]*\d+[wmyd]/g) != null) {
    const matches = string.match(/[\+-]*\d+[wmyd]/g); // regexp
    for (match of matches) {
      if (match.charAt(match.length - 1) == 'd') {
        date.setDate(Number(date.getDate()) +
          Number(match.slice(0, -1)))
      } else if (match.charAt(match.length - 1) == 'w') {
        date.setDate(Number(date.getDate()) + (match.slice(0, -1) * 7))
      } else if (match.charAt(match.length - 1) == 'm') {
        // find first weekday of month
        date.setMonth(Number(date.getMonth()) +
          Number(match.slice(0, -1)))
        if (weekday != false) {
          date.setDate(1)
          while (date.getDay() != weekday) {
            date.setDate(date.getDate() + 1)
          }
        }
      } else if (match.charAt(match.length - 1) == 'y') {
        // find first weekday of year
        date.setFullYear(Number(date.getFullYear()) +
          Number(match.slice(0, -1)))
        if (weekday != false) {
          date.setDate(1)
          date.setMonth(0)
          while (date.getDay() != weekday) {
            date.setDate(date.getDate() + 1)
          }
        }
      }
    }
  }
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

function dateToHeading(date, saving) {
  if (date === undefined) return
  if (dateToString(date).includes('NaN')) return
  // find the matching date, or create if not
  // sort date headings to be correct
  const headingslist = $('#pop').children().toArray().filter((x) => {
    return stringToDate($(x).text(), true) != 'Invalid Date' &&
      $(x).hasClass('dateheading')
  })
  let heading1 = headingslist.find((x) => {
    return stringToDate(stripChildren($(x)), true).getTime() ==
      stringToDate(dateToString(date)).getTime()
  })
  if (heading1 == undefined) {
    // insert elt where it should go
    heading1 = createBlankTask()
    heading1.addClass('h1')
    heading1.attr('folded', 'false')
    heading1.text(dateToString(date, true))
    heading1.addClass('dateheading')
    heading1.attr('draggable', 'false')
    let headingbefore = headingslist.find((x) => {
      return stringToDate($(x).text(), true).getTime() <
        stringToDate($(heading1).text(), true).getTime()
    })
    if (!headingbefore) {
      $('#pop').prepend(heading1)
    } else {
      // insert it after last child
      const headingchildren = getHeadingChildren($(headingbefore))
      if (headingchildren.length > 0) {
        $(headingchildren[headingchildren.length - 1]).after(heading1)
      } else {
        $(headingbefore).after(heading1)
      }
    }
    if (saving != false) save()
  }
  return heading1
}

function search(skiplinks, deadline) {
  // find all matches with the searchtext
  let searchtext = $('#searchbar').val()
  if (searchtext == '') return
  while (/\s/.test(searchtext.charAt(searchtext.length - 1))) {
    // chop off end spaces
    searchtext = searchtext.slice(0, searchtext.length - 1)
  }
  searchtext = searchtext.replace(/\s\s/, ' ')
  const searches = data.flop.concat([{
    'title': 'pop',
    'text': data.pop
  }])
  const matches = []
  let children
  for (let search of searches) {
    // search all lists for matches
    $('#test').html(search.text)
    children = $('#test').find('span.in')
    for (let child of children) {
      // if it's a match, add to matches
      if (stripChildren($(child)).includes(searchtext)) {
        // add to matches
        if (skiplinks &&
          $(child).text().includes('[[' + searchtext)) {
          // test for links
          continue
        } else if (skiplinks == 'deadline' &&
          (!stripChildren($(child)).includes('>') ||
            !stripChildren($(child)).includes(deadline) ||
            stripChildren($(child)).replace(searchtext, '').replace(
              /•\s/, '').replace(/\-\s/, '').split(' ').filter((x) => {
                return x != ''
              }).length > 1)) {
          // finds only deadlines with exact match to text and date
          continue
        } else {
          if (skiplinks != 'complete' && $(child).hasClass('complete')) {
            continue
          } else {
            // add it
            matches.push({
              'title': search.title,
              'text': stripChildren($(child)),
              'index': children.toArray().indexOf(child)
            })
          }
        }
      }
    }
  }
  $('#searchbar-results').empty()
  for (let match of matches) {
    // create search results
    $('#searchbar-results').append(
      '<p class=\'dropdown-item\' onclick=' +
      '\'gotosearch($(this))\' title=\'' + match.title + '\' index=\'' +
      match.index + '\'>' + match.text + '</p>'
    )
  }
  $('#searchbar-results').show()
  if ($('#searchbar-results').children().length == 1) {
    // go automatically to first item if that works
    gotosearch($($('#searchbar-results').children()[0]))
    $('#searchbar').val('')
    $('#searchbar-results').hide()
    $('#searchbar').blur()
    select(focused, true)
  }
}

function gotosearch(el) {
  // load the list and scroll to the found element
  let focusarea
  if (el.attr('title') == 'pop') {
    // load pop
    focusarea = $('#pop')
  } else {
    // load flop and switch lists
    focusarea = $('#flop')
    loadedlist = Number(data.flop.map((x) => {
      return x.title
    }).indexOf(
      el.attr('title')))
    loadList()
  }
  // find the matching element
  focused = $(focusarea.find('span.in')[el.attr('index')])
  select(focused, true)
  $('#searchbar').val('')
  $('#searchbar-results').hide()
}

function datesToRelative(a, b) {
  // converts two dates into the relation between them as a string
  let returnstring = ''
  let diff = b.getTime() - a.getTime()
  let change = 1
  if (diff < 0) {
    change = -1
    diff *= -1
  } else if (diff == 0) return 'today'
  let years = 0
  let months = 0
  let weeks = 0
  let days = 0
  while (diff >= 31556952000) {
    // years
    diff -= 31556952000
    years += 1 * change
  }
  if (years != 0) returnstring += years + 'y'
  while (diff >= 2592000000) {
    // months
    diff -= 2592000000
    months += 1 * change
  }
  if (months != 0) returnstring += months + 'm'
  while (diff >= 604800000) {
    // weeks
    diff -= 604800000
    weeks += 1 * change
  }
  if (weeks != 0) returnstring += weeks + 'w'
  while (diff >= 86400000) {
    // days
    diff -= 86400000
    days += 1 * change
  }
  if (days != 0) returnstring += days + 'd'
  return returnstring
}

function topChild(frame) {
  const childrenlist = $(frame).children().filter(function () {
    return $(this).position().top > 0
  })
  return childrenlist[0]
}

function updatedeadlines() {
  $('.duedate').remove()
  $('.placeholder').remove()
  $('.mobhandle').remove()
  const collapselist = $('#pop').children().filter('.h1').toArray().filter(
    (x) => { return ($(x).attr('folded') == 'true') })
  // uncollapses then recollapses to prevent weirdness
  for (heading of collapselist) {
    togglefold($(heading), false)
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
    }
  }
  for (heading of collapselist) {
    togglefold($(heading), false)
  }
  today = new Date()
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0)
  for (heading of $('#pop').children().filter('.dateheading')) {
    // add in relative dates underneath
    const newelt = createBlankTask()
    newelt.text(datesToRelative(
      today,
      stringToDate(stripChildren($(heading)), true)))
    newelt.addClass('placeholder')
    newelt.removeClass('in')
    $(heading).before(newelt)
  }
  if (!$('#flop').children().filter('.buffer')[0]) {
    $('#flop').prepend('<span class="buffer" style="height:var(--butheight)"></span>')
    $('#flop').append('<span class="buffer bottom" style="height:90%;"></span>')
  }
  if (!$('#pop').children().filter('.buffer')[0]) {
    $('#pop').prepend('<span class="buffer" style="height:var(--butheight)"></span>')
    $('#pop').append('<span class="buffer bottom" style="height:90%"></span>')
  }
  updateSpanDrags()
  migrate()
}

function migrate() {
  const today = stringToDate('0d').getTime()
  const todayheading = $(dateToHeading(stringToDate('0d'), false))
  for (heading of $('#pop').children().filter('.dateheading').toArray()) {
    if (stringToDate($(heading).text(), true).getTime() < today) {
      try {
        if (selected &&
          (selected[0] == heading ||
            (getHeading(selected, true) && getHeading(selected, true)[0]
              == heading))) {
          continue
        }
      } catch (err) {
        display([err, getHeading(selected, true)])
        continue
      }
      // migrate all uncompleted tasks
      for (child of getHeadingChildren($(heading))) {
        const ch = $(child)
        if (/^uncompleted/.test(ch.text())) {
          // takes out the uncompleted heading
          ch.remove()
          continue
        }
        const appends = []
        ch.children().filter('span.in:not(.complete)').toArray().forEach(
          (x) => { appends.push(x) })
        if (ch.hasClass('event') && !ch.hasClass('complete')) {
          toggleComplete(ch)
        } else if (!ch.hasClass('complete') && !isHeading(ch)) {
          appends.push(ch)
        }
        if (appends.length > 0) {
          // show all
          appends.forEach((x) => { $(x).show() })
          // find the place and add the heading
          let uncompletespan
          const headingchildren = getHeadingChildren(todayheading)
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
        }
      }
      // fold and complete
      $(heading).addClass('complete')
      if ($(heading).attr('folded') == 'false') {
        togglefold($(heading), false)
      }
    }
  }
}

function updateSpanDrags() {
  if (mobiletest()) {
    // insert mobiledrag elements
    $('.mobhandle').remove()
    $('span.in').prepend(
      '<span class="mobhandle"></span>')
    $('span.in:not(.dateheading)').draggable({
      handle: '.mobhandle',
      containment: 'window',
      axis: 'y',
      revert: true,
      appendTo: $('#listcontainer'),
      helper: 'clone',
      refreshPositions: true,
      zIndex: 1,
      addClasses: false,
      start: function (event) {
        // $(this).hide()
        dragTask(event, $(this))
      },
      drag: function (event) {
        mobileDragOver(event)
      },
    })
  } else {
    $('.mobhandle').remove()
    $('span.in:not(.dateheading)').draggable({
      containment: 'window',
      revert: true,
      appendTo: $('#listcontainer'),
      helper: 'clone',
      refreshPositions: true,
      zIndex: 1,
      addClasses: false,
      start: function (event) {
        // $(this).hide()
        dragTask(event, $(this))
      },
      drag: function (event) {
        dragTaskOver(event)
      },
    })
  }
  $('span.in').droppable({
    accept: 'span.in',
    hoverClass: 'drop-hover',
    greedy: true,
    drop: function (event, ui) {
      ui.draggable.css('top', '0')
      ui.draggable.css('left', '0')
      dropTask(event, ui.draggable[0])
      select(ui.draggable[0], true)
    }
  })
  $('p.rendered').droppable({
    accept: 'span.in',
    hoverClass: 'drop-hover',
    greedy: true,
    drop: function (event, ui) {
      ui.draggable.css('top', '0')
      ui.draggable.css('left', '0')
      $($(event.target).children()[
        $(event.target).children().length - 1]).before(ui.draggable[0])
      select(ui.draggable[0], true)
    }
  })
}

function mobileDragOver(event) {
  const boxright = $('#listcontainer').offset().left
  if (event.pageX < boxright) {
    // load the dragged-over list
    let i = 0
    const loads = $('#loads').children().toArray()
    for (list of loads) {
      const boxtop = $(list).offset().top
      if (event.pageY > boxtop && event.pageY < boxtop + $(list).height() &&
        $(list).hasClass('unselected')) {
        $(loads[loadedlist]).removeClass('selected')
        $(loads[loadedlist]).addClass('unselected')
        selected.detach()
        data.flop[loadedlist].text = $('#flop').html()
        flopscrollsave = undefined
        if (popscrollsave) {
          $('#pop').scrollTop(popscrollsave)
        }
        popscrollsave = undefined
        $('#flop, #pop').removeClass('greyedout')
        $('.drop-hover').removeClass('.drop-hover')
        loadedlist = i
        $('#flop').empty()
        $('#flop').html(data.flop[loadedlist].text)
        $(list).removeClass('unselected')
        $(list).addClass('selected')
        updateSpanDrags()
        return
      }
      i++
    }
  } else {
    const timertime = 3
    const offsetwidth = 30
    const scrollChange = 1
    const flopoffset = $('#flop').offset().top
    const flopheight = $('#flop').height()
    const popoffset = $('#pop').offset().top
    const popheight = $('#pop').height()
    clearTimeout(dragtimer)
    dragtimer = setTimeout(mobileDragOver, timertime, event)
    if (
      flopoffset + flopheight - offsetwidth < event.pageY &&
      event.pageY < flopoffset + flopheight
    ) {
      // scroll down
      $('#flop').scrollTop($('#flop').scrollTop() + scrollChange)
    } else if (
      flopoffset < event.pageY &&
      event.pageY < flopoffset + offsetwidth
    ) {
      // scroll up
      $('#flop').scrollTop($('#flop').scrollTop() - scrollChange)
    } else if (
      popoffset + popheight - offsetwidth < event.pageY &&
      event.pageY < popoffset + popheight
    ) {
      // scroll down
      $('#pop').scrollTop($('#pop').scrollTop() + scrollChange)
    } else if (
      popoffset < event.pageY &&
      event.pageY < popoffset + offsetwidth
    ) {
      // scroll up
      $('#pop').scrollTop($('#pop').scrollTop() - scrollChange)
    } else {
      clearTimeout(dragtimer)
    }
    if (mobiletest() &&
      event.pageY > popoffset && !flopscrollsave) {
      // scroll flop to end
      if (popscrollsave) {
        $('#pop').scrollTop(popscrollsave)
      }
      $('#pop').removeClass('greyedout')
      popscrollsave = undefined
      flopscrollsave = $('#flop').scrollTop()
      $('#flop').addClass('greyedout')
      if ($('#flop').children().length < 2) {
        $('#flop').scrollTop($('#flop').height())
      } else {
        const flopchild = $($('#flop').children()[
          $('#flop').children().length - 1])
        $('#flop').scrollTop($('#flop').scrollTop() + flopchild.position().top +
          flopheight)
      }
    } else if (mobiletest() &&
      event.pageY < popoffset && !popscrollsave) {
      // scroll flop to end
      if (flopscrollsave) {
        $('#flop').scrollTop(flopscrollsave)
      }
      $('#flop').removeClass('greyedout')
      flopscrollsave = undefined
      popscrollsave = $('#pop').scrollTop()
      $('#pop').scrollTop(0)
      $('#pop').addClass('greyedout')
    }
  }
}

function deleteTask() {
  if (!selected || selected[0].tagName == 'P' ||
    selected.hasClass('dateheading')) {
    return
  }
  let newselect = selected.next()
  if (!selected.next()[0] || !selected.next().hasClass('in')) {
    newselect = taskAbove()
  }
  if (selected.attr('folded') == 'true') {
    // unfold deleted headings before deleting
    togglefold(selected)
    setTimeout(null, 500)
  }
  selected.remove()
  select(newselect)
  save(true)
  clearEmptyDates()
}

function indentTask(indent) {
 if (selected.parent()[0].tagName == 'SPAN' && !indent) {
    selected.parent().after(selected)
  } else if (indent) {
    selected.prev().append(selected)
  }
}

function mod12(val) {
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

function dragTime(el) {
  let pretext = el.text().split('-')
  function timetest(text, placement, included) {
    console.log(placement, pretext);
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
  console.log('dragtime');
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
    save()
  })
  slider.on('mouseup touchend', function () {
    slider.remove()
    durslider.remove()
    save()
  })
}

function saveTask() {  // analyze format of task and create new <span> elt for it
  const savetask = selected.prev() // looks at item before it
  selected.next().remove() // removes appended children
  if (['', '• ', '- ', '# ', '## ', '### ', '@', '@ '
  ].includes(selected.val()) ||
    /^•\s$/.test(selected.val())) {
    selected.remove()
    savetask.remove()
    return
  }
  if (selected.val() == '---') {
    // add in a hr
    savetask.before('<span class=\'in horizline\'>   </span>')
    savetask.remove()
    selected.remove()
    return
  }
  if (
    selected.val().slice(0, 2) == '# ' &&
    savetask.parents().filter('#pop').length != 0
  ) {
    const date = stringToDate(selected.val().slice(2))
    savetask.remove()
    selected.remove()
    select(dateToHeading(date))
    // makes new date
    return
  }
  // fixes leading or hanging indents
  while (selected.val().charAt(0) == '\n') {
    selected.val(selected.val().slice(1))
  }
  while (selected.val().charAt(-1) == '\n') {
    selected.val(selected.val().slice(0, -1))
  }
  if (selected.val().slice(0, 2) == '  ') {
    // move as subtask of previous item
    selected.val(selected.val().slice(2))
    savetask.prev().append(savetask)
  }
  if (selected.val().includes('>')) {
    // analyze the string as a search string + replace the date
    // find the start and end points
    const index = selected.val().search('>')
    let endindex = selected.val().slice(index).search(' ')
    let addspace = false
    if (endindex == -1) {
      endindex = selected.val().length
      addspace = true
    } else endindex += index
    if (
      stringToDate(selected.val().slice(index + 1, endindex)) ==
      'Invalid Date'
    ) {
      alert('invalid date entered')
      selected.val(
        selected.val().slice(0, index) +
        selected.val().slice(endindex)
      )
    } else {
      selected.val(
        selected.val().slice(0, index) +
        '>' +
        dateToString(stringToDate(selected.val().slice(index + 1, endindex))) +
        selected.val().slice(endindex)
      )
      if (addspace) {
        // add space at end
        selected.val(selected.val() + ' ')
      }
    }
  }
  for (linestart of Object.keys(linestarts)) {
    // test each for a match
    if (selected.val().slice(0, linestart.length) == linestart) {
      // add the class
      savetask.addClass(linestarts[linestart])
      break
    }
  }
  // add in line inners
  let htmlstr = selected.val()
  let newstr = '' // newstr is the gradually added string with classes
  let start = 0
  const modecloses = []
  for (let i = 0; i < htmlstr.length; i++) {
    // test for mode modecloses
    let modeclosed = false
    for (modeclose of modecloses) {
      // test for matches
      if (htmlstr.slice(i, i + modeclose.length) ==
        modeclose) {
        // close span
        i += modeclose.length
        newstr += htmlstr.slice(start, i) + '</span>'
        start = i
        modecloses.splice(modecloses.indexOf(modeclose), 1)
        modeclosed = true
      }
    }
    if (modeclosed) {
      continue
    }
    // go down the string
    for (lineinner of Object.keys(lineinners)) {
      // test for a match
      if (htmlstr.slice(i, i + lineinner.length) == lineinner &&
        htmlstr.slice(i).includes(lineinners[lineinner][0])) {
        // add in a span to the list and where it splits
        newstr += htmlstr.slice(start, i) + '<span class=\'' +
          lineinners[lineinner][1] + '\'>'
        start = i
        i += lineinner.length
        modecloses.push(lineinners[lineinner][0])
        continue
      }
    }
  }
  newstr += htmlstr.slice(start)
  newstr = newstr.replace(
    /\n/g, '<br>').replace(/\s/g, ' ')
  newstr += getChildren(el)
  if (selected.val().charAt(0) == '@') {
    // process event signs
    const list = newstr.split(' ')
    if (/@\d(.*)/.test(list[0])) {
      // replace with timing object with times
      const timing = $('<span class="timing"></span>')
      timing.text(list[0].slice(1))
      list[0] = timing[0].outerHTML
      newstr = list.join(' ')
    } else if (list[0].length > 1) {
      const timing = $('<span class="faketiming"></span>')
      timing.text(list[0].slice(1))
      list[0] = timing[0].outerHTML
      newstr = list.join(' ')
    } else {
      newstr = newstr.slice(1)
    }
  }
  newstr = newstr.replace(
    /\_(.*)\_/, "$1").replace(
      /\*(.*)\*/, "$1").replace(
        /\_*(.*)\*_/, "$1")
  savetask.html(newstr)
  try {
    // fixing weird glitch
    const wordlist = savetask.html().split(' ')
    for (word in wordlist) {
      // add in weblinks
      if (wordlist[word].slice(1, wordlist[word].length - 1).includes('.') &&
        stringToDate(wordlist[word]) == 'Invalid Date') {
        let match = false
        for (patt of [/^\.+$/, /\d+\.\d+/]) {
          if (patt.test(wordlist[word])) {
            match = true
          }
        }
       if (!match) {
          wordlist[word] = '<span class="weblink" title="' + wordlist[word] +
            '">' + wordlist[word] + '</span>'
        }
        savetask.html(wordlist.join(' '))
      }
    }
  } catch (err) {
    // skip it if it doesn't work    return
  }
  // take away hashtags
  if (savetask.hasClass('h1')) {
    savetask.html(savetask.html().slice(2))
  } else if (savetask.hasClass('h2')) {
    savetask.html(savetask.html().slice(3))
  }
  if (savetask.hasClass('h3')) {
    savetask.html(savetask.html().slice(4))
  }
  if (isHeading(savetask) && savetask.attr('folded') != 'true')
    savetask.attr('folded', 'false') // sets heading folds
  selected.remove()
  savetask.show()
  select(savetask, true)
  let parent = selected.parent()
  while (parent[0].tagName == 'SPAN') {
    // disable drags
    parent.attr('draggable', 'true')
    parent = parent.parent()
  }
  save(true)
}

function getHeading(el, actual) {
  if (!el) return
  // gets the heading
  try {
    while (el.parent()[0].tagName != 'P') el = el.parent()
  } catch (TypeError) { return }
  let heading = el.prev()
  while (heading[0] && !isHeading($(heading))) heading = $(heading).prev()
  if ($(heading).hasClass('dateheading') &&
    actual != true) return $(heading).prev() // actual bypasses placeholders
  else if ($(heading)[0]) return $(heading)
}

function select(el, scroll, animate) {
  if (el &&
    $(el)[0].tagName == 'SPAN' && !isSubtask($(el))) el = $(el).parent()
  if ($(el).hasClass('buffer')) {
    select(getFrame($(el)), scroll)
    return
  }
  $(document).scrollTop(0); // fixes weird shit
  // switch selection
  if (selected != undefined) {
    $('.taskselect').removeClass('taskselect')
  }
  if (el != undefined && $(el).hasClass('in')) {
    selected = $(el)
    selected.addClass('taskselect')
    let parent
    if (getFrame(selected)) {
      parent = getFrame(selected)
    } else {
      parent = $(el)
    }
    if (selected != undefined) {
      try {
        parent.find(":not(span)").addBack().contents().filter(
          function () {
            return this.nodeType == 3;
          }).remove();
      } catch (err) { }
    }
    if (scroll) {
      if (!selected.is(':visible') && getHeading(selected)) {
        togglefold($(getHeading(selected, true)))
      }
      if (getFrame(selected)) {
        // only execute if not clicked
        parent = getFrame(selected)
        const butheight = $(':root').css('--butheight')
        const oldscroll = parent.scrollTop() -
          Number(butheight.slice(0, butheight.length - 2))
        let scrolltime
        if (animate != false) {
          scrolltime = 300
        } else {
          scrolltime = 0
        }
        parent.stop(true) // clear queue
        if (!selected.hasClass('dateheading') && !isHeading(selected)) {
          if (getHeading(selected) &&
            Number(getHeading(selected).offset().top) + parent.height() / 2 >
            Number(selected.offset().top)) {
            // scroll to heading
            const scrolllocation = Number(
              oldscroll +
              getHeading(selected).offset().top) -
              Number(getFrame(selected).offset().top)
            parent.animate({
              scrollTop: scrolllocation
            }, scrolltime)
          } else {
            // if more than halfway down the page
            const scrolllocation = Number(
              oldscroll +
              selected.offset().top) -
              Number(parent.offset().top) -
              parent.height() / 2
            parent.animate({
              scrollTop: scrolllocation
            }, scrolltime)
          }
        } else if (selected.hasClass('dateheading')) {
          const scrolllocation = Number(
            oldscroll +
            selected.prev().offset().top) -
            Number(getFrame(selected).offset().top)
          parent.animate({
            scrollTop: scrolllocation
          }, scrolltime)
        } else if (isHeading(selected)) {
          const scrolllocation = Number(
            oldscroll +
            selected.offset().top) -
            Number(getFrame(selected).offset().top)
          parent.animate({
            scrollTop: scrolllocation
          }, scrolltime)
        }
      }
    }
  } else if ($(el).parent().attr('id') == 'context-menu') {
    // do nothing (context)
  } else {
    selected = undefined
  }
}

function setText(el) {
  // set the text only to the parent span and its formatting
}

function stripChildren(el, mode) {
  // retrieve text from only the parent span and any of its formatting
  const testelt = el.clone()
  testelt.html(testelt.html().replace(/<br>/g, '\n'))
  for (child of testelt.children()) {
    // strip the subtasks
    if (isSubtask($(child))) {
      $(child).remove()
    } else if ($(child).hasClass('weblink')) {
      $(child).html($($(child).children()[0]).attr('href'))
    }
  }
  while (testelt.text().charAt(testelt.text().length - 1) == '\n') {
    testelt.text(testelt.text().slice(0, testelt.text().length - 1))
  }
  if (mode == undefined) {
    return testelt.text()
  } else if (mode == 'html') {
    return testelt.html()
  }
}

function isSubtask(el) {
  // tests inline spans until it gets one, otherwise returns true
  for (lineinner of [
    'link', 'italic', 'bold', 'bold-italic', 'deadline', 'weblink', 'timing',
    'mobhandle', 'faketiming'
  ]) {
    if (el.hasClass(lineinner)) {
      return false
    }
  }
  return true
}

function getChildren(el) {
  // returns the children's HTML
  let newstr = ''
  let children = el.children()
  for (let child of children) {
    if (isSubtask($(child))) {
      children = children.slice(children.toArray().indexOf(child))
      for (let child of children) {
        // append all subtasks to tasks
        newstr += child.outerHTML
      }
      break
    }
  }
  while (newstr.slice(0, 4) == '<br>') newstr = newstr.slice(4)
  return newstr
}

function updateHeight() {
  // $('#texttest').font(selected.css('font'))
  $('#texttest').text(selected.val() + ' x')
  $('#texttest').css('font', selected.css('font'))
  $('#texttest').css('font-size', selected.css('font-size'))
  // $('#texttest').css('padding', selected.css('padding'))
  $('#texttest').css('width', selected.width() + 'px')
  selected.css('height', $('#texttest').height() + 5 + 'px')
}

function editTask() {
  el = selected
  if (selected.hasClass('dateheading')) return
  // if (selected.parent()[0].tagName == 'SPAN') {
  //   selected.parent().attr('draggable', 'false')
  // }
  if (selected != undefined) {
    $('#context-menu').hide()
    const newelt = $('<textarea class=\'in edit\'></textarea>')
    el.after(newelt)
    el.hide()
    select(newelt, true)
    let parent = selected.parent()
    while (parent[0].tagName == 'SPAN') {
      // disable drags
      parent.attr('draggable', 'false')
      parent = parent.parent()
    }
    selected.focus()
    if (getChildren(el) == '') {
      selected.after('<span style="display:none;"></span>')
    } else {
      // appends children after
      selected.after('<span>' + getChildren(el) + '</span>')
    }
    // (el).html()
    el.html(el.html().replace(
      /<span class="italic">(.*)<\/span>/,
      '<span class="italic">_$1_</span>').replace(
        /<span class="bold">(.*)<\/span>/,
        '<span class="bold">*$1*</span>').replace(
          /<span class="bold-italic">(.*)<\/span>/,
          '<span class="bold-italic">_*$1*_</span>'))
    selected.val(stripChildren(el))
    // add back hashtags
    if (el.hasClass('h1')) {
      selected.val('# ' + selected.val())
      el.removeClass('h1')
    } else if (el.hasClass('h2')) {
      selected.val('## ' + selected.val())
      el.removeClass('h2')
    } else if (el.hasClass('h3')) {
      selected.val('### ' + selected.val())
      el.removeClass('h3')
    } else if (el.hasClass('event')) {
      selected.val(('@') + selected.val())
      el.removeClass('event')
    }
    while (selected.val().charAt(0) == '\n') {
      selected.val(selected.val().slice(1))
    }
    while (selected.val().charAt(selected.val().length - 1) == '\n') {
      selected.val(selected.val().slice(0, selected.val().length - 1))
    }
    if (selected.prev().prev().text().charAt(0) == '•' &&
      selected.val() == '') {
      // continue lists
      selected.val('• ' + selected.val())
    }
    updateHeight()
    setTimeout(function () {
      selected.focus()
      selected.click()
    }, 300)
  }
}

function createBlankTask() {
  const savetask = $('<span class="in"></span>')
  return savetask
}

function newTask(subtask) {
  if (loadedlist == undefined || loadedlist > data.flop.length - 1) {
    alert('no list selected; create or select a list first')
    return
  }
  $('#context-menu').hide()
  const newspan = createBlankTask()
  if (selected == undefined) return; // prevents glitches
  if (selected.attr('folded') == 'true') {
    togglefold(selected)
    const children = getHeadingChildren(selected)
    select(children[children.length - 1])
  }
  let e = selected
  if (selected[0].tagName == 'P' && selected.hasClass('in')) {
    // blank before buffer
    $(e.children()[e.children().length - 1]).before(newspan)
  } else if (selected[0].tagName == 'SPAN' && subtask) {
    // subtask
    e.append(newspan)
  } else if (['SPAN'].includes(selected[0].tagName)) {
    // regular task
    e.after(newspan)
  }
  if (selected.hasClass('dateheading')) {
    updatedeadlines()
  }
  select(newspan)
  editTask()
}

function toggleSomeday() {
  selected.toggleClass('someday')
}

function archiveAll() {
  $('span').filter('#flop .complete').toArray().forEach((x) => {
    select(x);
    archiveTask()
  })
}

function archiveTask(play) {
  let taskabove = taskAbove()
  if (taskabove[0] == selected[0]) { taskabove = getFrame(selected) }
  if (play) {
    $('#popsnd')[0].currentTime = 0 // resets pop sound
    $('#popsnd')[0].play();
  }
  // archives the selected Flop to the current day
  let heading
  const day = $(dateToHeading(stringToDate('0d')))
  const childText = getHeadingChildren(day).map((x) => {
    return $(x).text()
  })
  if (
    !(childText.includes('completed') ||
      childText.includes('completed ...'))
  ) {
    // add in an extra heading
    heading = $('<span class=\'in h2\' folded=\'false\'>' +
      'completed ...</span>')
    heading.attr('ondragstart', 'dragTask(event)')
    heading.attr('ondragover', 'draggingOver(event)')
    heading.attr('ondrop', 'dropTask(event)')
    heading.attr('draggable', 'true')
    heading.attr('folded', 'true')
    if (getHeadingChildren(day).length >= 1) {
      getHeadingChildren(day)[
        getHeadingChildren(day).length - 1].after(heading)
    } else {
      day.after(heading)
    }
  } else {
    // select completed heading
    heading = getHeadingChildren(day).find((x) => {
      if (['completed', 'completed ...'].includes($(x).text())) {
        return true
      }
    })
  }
 if (!selected.hasClass('complete')) {
    toggleComplete(selected)
  }
  heading.after(selected)
  // formatting
  if (heading.attr('folded') == 'true') {
    selected.hide()
  }
  select(taskabove)
  save(true)
}

function toggleComplete(task) {
  // task is for autocompleting yesterday's events
  let completetask
  if (!task) {
    completetask = selected
    if (selected && selected[0].tagName == 'P') {
      return
    }
  }
  else completetask = $(task)
  const text = stripChildren(completetask).split(' ')
  if (!completetask.hasClass('complete') &&
    /^~/.test(text[text.length - 1])) {
    if (stringToDate(text[text.length - 1].slice(1)) == 'Invalid Date') {
      alert('invalid repeat date')
      completetask.text(text.slice(0, text.length - 1) +
        getChildren(completetask))
    } else {
      const date = stringToDate(text[text.length - 1].slice(1), false, true)
      if (task) {
        date.setDate(date.getDate() - 1)
      }
      const heading = dateToHeading(date)
      const newtask = completetask.clone()
      newtask.removeClass('complete')
      if (
        !getHeadingChildren($(heading)).map((x) => {
          return $(x).text()
        }).includes(completetask.text())
      ) {
        $(heading).after(newtask)
      }
    }
  }
  completetask.toggleClass('complete')
  if (!task) {
    clearEmptyDates()
    save(true)
  }
}

function toggleImportant() {
  if (selected[0].tagName == 'SPAN') {
    selected.removeClass('maybe')
    selected.toggleClass('important')
    save()
  }
}

function toggleMaybe() {
  if (selected[0].tagName == 'SPAN') {
    selected.removeClass('important')
    selected.toggleClass('maybe')
    save()
  }
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
    startTimer()
  } else if (ev.key == 'Escape') {
    evt.preventDefault()
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

//start of drag
function dragTask(evt) {
  select(evt.target)
  draggingtask = true
  if (mobiletest()) {
    $('.nav').hide()
    return
  }
  //start drag
  if (selected[0].tagName == 'TEXTAREA') {
    return; // stops from dragging edited subtasks
  } else if (stringToDate(selected.text()) != 'Invalid Date' &&
    selected.parents().toArray().includes($('#pop')[0])) {
    return; // stops from reordering dates
  }
  // plaintext alternative? for compatibility?
  //specify allowed transfer
  // evt.dataTransfer.effectAllowed = 'move'
}

function togglecollapse() {
  $('#leftcol').toggleClass('collapsed')
  if ($('#leftcol').hasClass('collapsed')) {
    $('#listcontainer').addClass('fullwidth')
  } else {
    $('#listcontainer').removeClass('fullwidth')
  }
  if (focusmode) togglefocus(false) // unfocus if uncollapse
  updateSizes()
}

function togglefocus(collapse) {
  if (!focusmode) {
    if (!selected) select(dateToHeading(stringToDate('0d')))
    // focus
    $('#focusbar').prepend($('#focusbut'))
    $('#searchbarcont').append($('#searchbarframe'))
    $('#timerentcont').append($('#timerent'))
    getFrame(selected).parent().css('width', '100vw')
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
    if (!collapse && !$('#leftcol').hasClass('collapsed')) { togglecollapse() }
    focusmode = true
  } else {
    // unfocus
    $('#editbuts').after($('#searchbarframe'))
    $('#movebuts').after($('#timerent'))
    $('#collapsebut').after($('#focusbut'))
    for (thing of [$('#flop'), $('#pop')]) {
      thing.parent().css('width', '')
      thing.parent().css('height', '')
      thing.parent().css('border-right', '')
      thing.parent().css('border-left', '')
    }
    if (!$('#poplist').is(':visible')) {
      $('#poplist').show()
    } else if (!$('#floplist').is(':visible')) {
      $('#floplist').show()
    }
    $('#focusbar').hide()
    focusmode = false
    if (!collapse && $('#leftcol').hasClass('collapsed')) {
      togglecollapse()
    }
  }
}

//dropping
function dropTask(evt, obj) {
  draggingtask = false
  let el
  if (obj) {
    el = obj
  } else {
    el = evt.target
  }
  if (el.tagName == 'SPAN' && !isSubtask($(el))) {
    el = $(el).parent()[0]
  }
  if (selected[0].tagName == 'TEXTAREA') {
    return
  } else if (stringToDate(selected.text()) != 'Invalid Date' &&
    selected.parents().toArray().includes($('#pop')[0])) {
    return; // stops from reordering dates
  }
  let children = []
  if (selected.hasClass('h1') || selected.hasClass('h2') ||
    selected.hasClass('h3')) {
    // drop all the tasks
    children = getHeadingChildren(selected)
  }
  if ($(el).attr('folded') == 'true') {
    // unfold
    togglefold($(el))
    if (getHeadingChildren($(el)).length == 0) {
      $(el).after(selected)
    } else {
      getHeadingChildren($(el))[
        getHeadingChildren($(el)).length - 1].after(selected)
    }
  } else if ($(el).hasClass('buffer')) {
    // dropped onto buffer
    if (evt.metaKey) {
      $(el).parent().prepend(selected)
    } else {
      $(el).after(selected)
    }
  } else if (el.tagName == 'SPAN' &&
    $(el).hasClass('in')) {
    // dropping task (according to key commands)
    if (evt.altKey && $(evt.target).parent()[0].tagName != 'SPAN') {
      if (evt.metaKey) {
        const subtasks = $(el).children().toArray().filter(
          (x) => {
            if (isSubtask($(x))) return true
          }
        )
        if (subtasks.length == 0) {
          $(el).append(selected)
        } else {
          $(subtasks[0]).prepend(selected)
        }
      } else {
        $(el).append(selected)
      }
    } else {
      if (evt.metaKey) {
        $(el).before(selected)
      } else {
        $(el).after(selected)
      }
    }
  }
  for (i = children.length - 1; i >= 0; i--) {
    // append each child after
    selected.after(children[i])
  }
  save()
}

function toggleSubtasks() {
  if (selected.hasClass('h1') || selected.hasClass('h2') ||
    selected.hasClass('h3')) {
    togglefold(selected)
  } else {
    if (getChildren(selected) != '') {
      // hide subitems
      const e = selected
      if (e.hasClass('folded')) {
        e.children().toArray().forEach((x) => {
          $(x).show()
        })
        e.html(stripChildren(e, 'html').slice(0, -4) + getChildren(e))
     } else if (!e.hasClass('folded')) {
        e.children().toArray().forEach((x) => {
          $(x).hide()
        })
        e.html(stripChildren(e, 'html') + ' ...' + getChildren(e))
      }
      e.toggleClass('folded')
    }
    save()
  }
}

function getHeadingChildren(el) {
  // gets all subtasks of a heading
  // headings to stop folding at
  const folds = {
    'h1': ['h1'],
    'h2': ['h2', 'h1'],
    'h3': ['h3', 'h2', 'h1']
  }
  el = $(el)
  let thisclass
  if (el.hasClass('h1')) {
    thisclass = 'h1'
  } else if (el.hasClass('h2')) {
    thisclass = 'h2'
  } else if (el.hasClass('h3')) {
    thisclass = 'h3'
  }
  const children = el.parent().children()
    .filter(':not(.placeholder):not(.buffer)')
  const start = children.toArray().indexOf(el[0]) + 1
  for (let i = start; i < children.length; i++) {
    let toggle = true
    for (fold of folds[thisclass]) {
      if ($(children[i]).hasClass(fold)) {
        toggle = false
      }
    }
   if (!toggle) {
      return children.toArray().slice(start, i).map((x) => {
        return $(x)
      })
    }
  }
  return children.toArray().slice(start).map((x) => {
    return $(x)
  })
}

// toggle fold of a heading
function togglefold(e, saving) {
  children = e.parent().children().toArray()
  start = children.indexOf(e[0]) + 1
  hides = []
  // hide or show everything underneath
  let thisclass
  const keepfolded = []
  for (child of getHeadingChildren(e)) {
    // fold everything
    if (e.attr('folded') == 'false') {
      if (saving === undefined) child.hide(500)
      else child.hide()
    } else {
      // if unfolding, keep folded headings folded
      if (child.attr('folded') == 'true') {
        keepfolded.push(child)
      }
      if (saving === undefined) {
        child.show(500)
      } else child.show()
    }
  }
  if (e.attr('folded') == 'true') {
    for (heading of keepfolded) {
      // keep folded headings folded
      getHeadingChildren($(heading)).forEach((x) => {
        $(x).stop(true)
        $(x).hide()
      })
    }
  }
  // update folded attr
  if (e.attr('folded') == 'false') {
    e.attr('folded', 'true')
    e.addClass('folded')
    if (stripChildren(e).slice(-4) != ' ...') {
      e.html(stripChildren(e) + ' ...' + getChildren(e))
    }
  } else {
    e.attr('folded', 'false')
    e.removeClass('folded')
    if (stripChildren(e).slice(-4) == ' ...') {
      e.html(stripChildren(e).slice(0, -4) + getChildren(e))
    }
  }
  if (saving === undefined) {
    setTimeout(save, 600)
  }
}

function toggleButs() {
  if (data.hidebuts == 'true') {
    $('.butbar').show()
    $('#focusbut').show() // just in case it's moved in focusmode
    $('#typebut').show()
    data.hidebuts = 'false'
    $(':root').css('--butheight', $('#flopbuts').height() + 5 + 'px')
  } else {
    $('.butbar:not(#editbuts)').hide()
    $('#typebut').hide()
    $('#focusbut').hide()
    data.hidebuts = 'true'
    $(':root').css('--butheight', '0px')
  }
  if (mobiletest()) {
    // hide unnecessary buts
    $('.mobilehide').hide()
  }
  save()
}

function toggleHelp() {
  if (data.help == 'show') {
    $("#help").hide()
    data.help = 'hide'
  } else {
    $("#help").show()
    data.help = 'show'
  }
  save()
}

function setStyle(style) {
  const poptop = $('#pop').scrollTop()
  const floptop = $('#flop').scrollTop()
  var oldstyle = String(data.style)
  if (navigator.onLine || offlinemode) {
    data.style = style
    $.get(
      data.style,
      function () {
        console.log(oldstyle, $('link[href="' + oldstyle + '"]'));
        $('link[href="' + oldstyle + '"]').remove()
        $('head').append(
          $("<link rel='stylesheet' type='text/css' href='" +
            data.style + "' />")
        );
        uploadData()
        $('#pop').scrollTop(poptop)
        $('#flop').scrollTop(floptop)
      }
    )
  } else {
    alert('Connect to the Internet to load styles')
  }
}

function context(e, mobile) {
  justclicked = true
  setTimeout(function () { justclicked = false }, 300)
  if (
    selected != undefined &&
    selected[0].tagName == 'TEXTAREA') {
    saveTask()
  }
  let target = e.target
  if (mobile) {
    target = $(e.target).parent()[0]
  }
  e.preventDefault()
  if (
    $(target)[0].tagName == 'TEXTAREA' &&
    !$(target).hasClass('selected')
  ) {
    // select list
    target.click()
  } else {
    select($(target))
  }
  $('#context-menu').show()
  options = {
    '#context-newlist': [
      ['TEXTAREA', 'DIV'],
      ['selected', 'unselected',
        'loads'
      ]
    ],
    '#context-toggledrags': [
      ['TEXTAREA'],
      ['selected', 'unselected']
    ],
    '#context-deletelist': [
      ['TEXTAREA'],
      ['selected', 'unselected']
    ],
    '#context-toggleFoldList': [
      ['TEXTAREA'],
      ['selected', 'unselected']
    ],
    '#context-reset': [
      ['BUTTON', 'DIV'],
      ['opts']
    ],
    '#context-switchUser': [
      ['BUTTON', 'DIV'],
      ['opts']
    ],
    '#context-upload': [
      ['BUTTON', 'DIV'],
      ['opts']
    ],
    '#context-download': [
      ['BUTTON', 'DIV'],
      ['opts']
    ],
    '#context-moveToList': [
      ['SPAN'], ['in']
    ],
    '#context-divider': [
      ['SPAN'],
      ['in']
    ],
    '#context-toggleComplete': [
      ['SPAN'],
      ['in']
    ],
    '#context-toggleSomeday': [
      ['SPAN'],
      ['in']
    ],
    '#context-toggleimportant': [
      ['SPAN'],
      ['in']
    ],
    '#context-weekdaysToggle': [
      ['BUTTON'],
      ['opts']
    ],
    '#context-toggleHelp': [
      ['BUTTON', 'P'],
      ['opts', 'help']
    ],
    '#context-editTask': [
      ['SPAN'],
      ['in']
    ],
    '#context-archiveTask': [
      ['SPAN'],
      ['in']
    ],
    '#context-newTask': [
      ['SPAN', 'P'],
      ['in', 'buffer']
    ],
    '#context-newSubtask': [
      ['SPAN'],
      ['in']
    ],
    '#context-goToToday': [
      ['SPAN', 'P'], ['in', 'buffer']
    ],
    '#context-deleteTask': [
      ['SPAN'],
      ['in']
    ],
    '#context-indentTask': [
      ['SPAN'],
      ['in']
    ],
    '#context-unIndentTask': [
      ['SPAN'],
      ['in']
    ],
    '#context-toggleSubtasks': [
      ['SPAN'],
      ['in']
    ],
    '#context-archiveComplete': [
      ['SPAN', 'P'],
      ['in', 'buffer']
    ],
    '#context-clearEmptyHeadlines': [
      ['P', 'SPAN'],
      ['in', 'buffer']
    ],
    '#context-toggleButs': [
      ['BUTTON'],
      ['opts']
    ],
    '#context-toggleHeadingAlign': [
      ['BUTTON'],
      ['opts']
    ],
    '#context-styleDefault': [
      ['BUTTON'],
      ['opts']
    ],
    '#context-styleJason': [
      ['BUTTON'],
      ['opts']
    ],
    '#context-styleLight': [
      ['BUTTON'],
      ['opts']
    ],
    '#context-stylePink': [
      ['BUTTON'],
      ['opts']
    ],
    '#context-styleGreen': [
      ['BUTTON'],
      ['opts']
    ],
    '#context-changeDate1': [
      ['BUTTON'],
      ['opts']
    ],
    '#context-changeDate2': [
      ['BUTTON'],
      ['opts']
    ],
    '#context-changeDate3': [
      ['BUTTON'],
      ['opts']
    ],
    '#context-clearEmptyDates': [
      ['BUTTON'],
      ['opts']
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
  $('#context-menu').css('top', Math.min(e.pageY,
    window.innerHeight - $('#context-menu').height()) - 20)
  $('#context-menu').css('left', Math.min(e.pageX,
    window.innerWidth - $('#context-menu').width()) - 40)
  console.log($('#context-menu').offset());
  if ($('#context-menu').offset().top < 0) {
    $('#context-menu').css('top', '0')
  }
  if ($('#context-menu').offset().left < 0) {
    $('#context-menu').css('left', '0')
  }
}

function setOptions() {
  justclicked = true
  setTimeout(function () { justclicked = false }, 300)
  $('#settype-menu').css('top', $('#typebut').offset().top)
  $('#settype-menu').css('left', $('#typebut').offset().left)
  $('#settype-menu').show()
}

function gotolink(e) {
  textstr = e.text().slice(2, -2)
  $('#searchbar').val(textstr)
  search(skiplinks = true)
}

// # KEY COMMANDS

function isHeading(el) {
  if (el.hasClass('h1') || el.hasClass('h2') ||
    el.hasClass('h3')) {
    return true
  } else {
    return false
  }
}

function selectRandom() {
  let headinglist
  // get children
  if (selected != undefined && isHeading(selected)) {
    headinglist = getHeadingChildren(selected)
  } else if (selected != undefined && getChildren(selected).length > 0) {
    headinglist = selected.children().filter((x) => {
      return isSubtask($(x))
    })
  } else if (selected == undefined ||
    selected.hasClass('in')) {
    headinglist = $('#flop').children().toArray()
  }
  if (headinglist.length > 0) {
    headinglist = headinglist.filter((x) => {
     if (!$(x).hasClass('complete') &&
       !$(x).hasClass('taskselect')) return true
    })
    if (headinglist.length > 0) {
      select($(headinglist[
        Math.floor(Math.random() * (headinglist.length))
      ]), true)
    }
  }
}

function moveToList() {
  movetolist = true
}

function setTask(type) {
  if (!selected || selected.hasClass('dateheading')) return
  const list = stripChildren(selected).split(' ').filter((x) => {
    return x != ''
  })
  if (type == 'deadline') {
    if (!/\>/.test(list[list.length - 1])) {
      selected.html(stripChildren(selected) + ' >' +
        getChildren(selected))
    } else {
      selected.html(
        list.slice(0, list.length - 1).join(' ') + ' >' +
        getChildren(selected))
    }
    editTask()
  } else if (type == 'repeat') {
    if (!/~/.test(list[list.length - 1])) {
      selected.html(stripChildren(selected) + ' ~' + getChildren(selected))
    } else {
      selected.html(
        list.slice(0, list.length - 1).join(' ') + ' ~' + getChildren(selected))
    }
    editTask()
  } else {
    selected.attr('class', 'in ' + type)
    if (['-', '•'].includes(selected.text().charAt(0))) {
      // remove bullet or list
      selected.html(selected.html().slice(1))
      if (selected.text().charAt(0) == ' ') {
        selected.html(selected.html().slice(1))
      }
    }
    if (type == 'list') {
      selected.html('• ' + selected.html())
    } else if (type == 'note') {
      selected.html('- ' + selected.html())
    }
    save()
  }
}

function clickoff(ev) {
  if (mobiletest()) {
    // on revert drags on mobile
    $('.drop-hover').removeClass('drop-hover')
    if (flopscrollsave) {
      $('#flop').scrollTop(flopscrollsave)
    }
    if (popscrollsave) {
      $('#pop').scrollTop(popscrollsave)
    }
    flopscrollsave = undefined
    $('#flop').removeClass('greyedout')
    popscrollsave = undefined
    $('#pop').removeClass('greyedout')
    if (draggingtask) { return }
    if ($(ev.target).hasClass('mobhandle')) {
      // context menu
      select($(ev.target).parent(), false)
      context(ev, true)
    }
  }
  if ($(ev.target).hasClass('dropdown-item') && !justclicked) {
    eval($(ev.target).attr('function'))
  }
  if (!justclicked) $('nav').hide()
}

function clicked(ev) {
  if (movetolist && !$(ev.target).hasClass('listtitle')) {
    // cancels move to list
    movetolist = false
  }
  $(document).scrollTop(0); // fixes weird shit
  $('nav').hide()
  // pre-click
  if (ev.target.tagName == 'TEXTAREA' && $(ev.target).hasClass('in')) {
    return 
  } else if ($(ev.target).hasClass('slider')) {
    return
  } else if (selected != undefined && selected[0].tagName == 'TEXTAREA' &&
    ev.target.tagName != 'TEXTAREA') {
    saveTask()
  } 
  $('.slider').remove() // remove sliders
  // click events
  if ($(ev.target).attr('id') == 'newHeadingFlopBut') {
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
  } else if ($(ev.target).attr('id') == 'todayBut') {
    select(dateToHeading(stringToDate('0d')), true)
    save()
  } else if ($(ev.target).attr('id') == 'addDateBut') {
    ev.preventDefault()
    $('#searchbar').val('d:')
    select()
    $('#searchbar').focus()
  } else if ($(ev.target).attr('id') == 'timer25But') {
    stopTimer()
    $('#timerent').val('25:00')
    startTimer()
  } else if ($(ev.target).attr('id') == 'timer15But') {
    stopTimer()
    $('#timerent').val('15:00')
    startTimer()
  } else if ($(ev.target).attr('id') == 'timer5But') {
    stopTimer()
    $('#timerent').val('5:00')
    startTimer()
  } else if ($(ev.target).attr('id') == 'timer+2But') {
    timer.stop()
    if ($('#timerent').val().split(':').length > 1) {
      $('#timerent').val(
        String(Number($('#timerent').val().split(':')[0]) + 2) +
        ':' + $('#timerent').val().split(':')[1]
      )
    } else {
      $('#timerent').val(Number($('#timerent').val() + 2))
    }
    startTimer()
  } else if ($(ev.target).attr('id') == 'timer-2But') {
    timer.stop()
    if ($('#timerent').val().split(':').length > 1) {
      $('#timerent').val(
        String(Number($('#timerent').val().split(':')[0]) - 2) +
        ':' + $('#timerent').val().split(':')[1]
      )
    } else {
      $('#timerent').val(Number($('#timerent').val() - 2))
    }
    startTimer()
  } else if ($(ev.target).attr('id') == 'timerStartBut') {
    startTimer()
  } else if ($(ev.target).attr('id') == 'timerStopBut') {
    stopTimer()
  } else if ($(ev.target).attr('id') == 'popBut') {
    if (selected == undefined || getFrame(selected).attr('id') != 'pop') {
      select(dateToHeading(stringToDate('0d')), true)
    }
    newTask()
  } else if ($(ev.target).attr('id') == 'flopBut') {
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
  } else if ($(ev.target)[0].tagName == 'BUTTON') {
     // execute button functions
    eval($(ev.target).attr('function'))
  } else if ($(ev.target).hasClass('dropdown-item')) {
    // classes
    ev.preventDefault()
    const oldselect = selected
    eval($(ev.target).attr('function'))
    if (selected && selected[0].tagName != 'TEXTAREA' &&
      $(ev.target).attr('id') != 'context-goToToday') {
      select(oldselect)
    }
  } else if ($(ev.target).hasClass('listtitle')) {
    if (mobiletest() && $(ev.target).val() != '') {
      ev.preventDefault()
      $(':focus').blur()
      dragson()
    } else if ($(ev.target).hasClass('unselected')) {
      dragson()
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
      getHeading($(ev.target), true).text(), true)))
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

function taskAbove() {
  // returns task above
  let returntask
  if ((selected.prev()[0] == undefined || !selected.prev().hasClass('in')) &&
    selected.parent()[0].tagName == 'SPAN') {
    returntask = selected.parent()
  } else if (selected.prev()[0] != undefined) {
    returntask = selected.prev()
  } // nonedisplays are not selected
 while (returntask[0] && !returntask.hasClass('in')) {
    returntask = returntask.prev()
  }
  if (returntask[0] && !returntask.is(':visible')) {
    // while invisible
    select(returntask, false)
    return taskAbove()
 } else if (!returntask[0] || !returntask.hasClass('in')) {
    return selected
  } else {
    return returntask
  }
}

function taskBelow() {
  // returns task below
  let returntask
  if (getChildren(selected) != '') {
    // subtasks
    let child = false
    for (child of selected.children()) {
      if (isSubtask($(child))) {
        returntask = $(child)
        child = true
        break
      }
    }
    if (!child) {
      // if no subtasks, regular next task
      returntask = selected.next()
    }
  } else if (selected.next()[0] == undefined) {
    // end of parent item
    const parents = selected.parents().toArray()
    returntask = $(parents[0]).next()
    let i = 0
    while (!returntask[0]) {
      i += 1
      if (['flop', 'pop'].includes($(parents[i]).attr('id'))) return
      if (!(parents[i])) return
      else returntask = $(parents[i]).next()
    }
  } else if (selected.next()[0] != undefined) {
    // regular next task
    returntask = selected.next()
  }
 while (returntask[0] != undefined && !returntask.hasClass('in')) {
    returntask = returntask.next()
  }
  if (returntask[0] != undefined && !returntask.is(':visible')) {
    // while invisible
    select(returntask, false)
    return taskBelow()
  } else if (returntask[0] == undefined || !returntask.hasClass('in')) {
    return selected
  } else {
    return returntask
  }
}

function moveTask(direction) {
  if (!selected) return
  if (selected.hasClass('dateheading')) return
  if (direction == 'pop') {
    $('#searchbar').val('d:')
    $('#searchbar').focus()
    movetask = selected
  } else if (direction == 'flop' &&
    getFrame(selected).attr('id') == 'pop') {
    $('#flop').append(selected)
  } else if (direction == 'down') {
    // move the task down
    if (taskBelow()) taskBelow().after(selected)
    else select(selected, false)
  } else if (direction == 'up') {
    // move the task up
    if (taskAbove()) taskAbove().before(selected)
    else select(selected, false)
  }
  save(true)
  if (selected.is(':visible')) select(selected, false)
  else select()
}

function dblclick(ev) {
  if ($(ev.target)[0].tagName == 'TEXTAREA' &&
    $(ev.target).hasClass('selected')) {
    if (!mobiletest()) {
      dragsoff()
    } else {
      context(ev)
    }
  } else if ($(ev.target)[0].tagName == 'TEXTAREA') {
    return
  } else if (selected && 
    selected.hasClass('in') && 
    selected[0].tagName == 'P') {
    ev.preventDefault()
    newTask()
    console.log(selected);
    selected.click(function (e) { $(this).focus() })
    setTimeout(function () { 
      selected.trigger('click')
    }, 200)
  } else if (
    $(ev.target).hasClass('in') &&
    ev.target.tagName != 'TEXTAREA' &&
    !$(ev.target).hasClass('dateheading')
  ) {
    select($(ev.target))
    ev.preventDefault()
    editTask()
  } else if (
    ['bold', 'italic', 'bold-italic'].includes(
      $(ev.target).attr('class'))) {
    select($(ev.target).parent())
    editTask()
  } else if (
    ($(ev.target).hasClass('selected') ||
      $(ev.target).hasClass('unselected'))
  ) {
    dragsoff()
  } else if ($(ev.target).hasClass('loads')) {
    newlist()
  }
}

function unfilter(update) {
  // show everything which is filtered
  if (filtered) {
    filteredlist.forEach((x) => { $(x).show() })
    filtered = false
    filteredlist = []
    if (update != false) {
      updatedeadlines()
    }
    $('#searchbar').val('')
  }
}

function hierarchyCheck(task, headings) {
  for (heading of headings) {
    if ($(task).hasClass(heading)) return true
  }
  return false
}

function keycomms(evt) {
  if (['Control', 'Command', 'Shift', 'Alt'].includes(evt.key)) {
    return
  }
  // makes sure to unselect on proper things
  if (evt.key == 'Escape' && selected != undefined &&
    selected[0].tagName == 'TEXTAREA') {
    evt.preventDefault()
    const exp = /^(•*)(\s*)$/
    if (exp.test(selected.val())) {
      selected.prev().remove()
      const taskabove = taskAbove()
      selected.remove()
      select(taskabove)
    } else {
      // select current task if cancelling
      saveTask()
    }
  } else if (evt.key == 't' && evt.ctrlKey) {
    select(dateToHeading(stringToDate('0d')), true)
  } else if (evt.key == 'f' && evt.ctrlKey) {
    $('#searchbar').focus()
  } else if (evt.code == 'KeyH' && evt.ctrlKey && evt.shiftKey) {
    togglefocus()
  } else if (evt.code == 'KeyH' && evt.ctrlKey) {
    togglecollapse()
  } else if (evt.key == 'Enter' && $(':focus').attr('id') ==
    'searchbar') {
    evt.preventDefault()
    // focus on searchbar and find it
    if ($('#searchbar').val().slice(0, 2) == 'd:') {
      const date = dateToHeading(
        stringToDate($('#searchbar').val().slice(2)))
      select(date, true)
      $('#searchbar').val('')
      $('#searchbar').blur()
      if (movetask != undefined) {
        selected.after(movetask)
        movetask = undefined
      }
      save()
    } else if ($('#searchbar').val().charAt(0) == '#') {
      const searchstr = $('#searchbar').val()
      filtered = true
      filteredlist = $('#pop').find('span.in:visible').toArray().concat(
        $('#flop').find('span.in:visible').toArray(),
        $('.placeholder:visible').toArray(),
        $('.deadline:visible').toArray()).filter((x) => {
          return !stripChildren($(x)).includes(searchstr)
        })
      filteredlist.forEach((x) => { $(x).hide() })
    } else {
      search()
    }
  } else if ($(':focus').attr('id') == 'timerent') {
    timertest(evt);
  } else if (evt.key == 'Escape') {
    // cancel select
    evt.preventDefault()
    $('#searchbar').val('')
    $('#searchbar-results').hide()
    $(':focus').blur()
    select()
    if (filtered) unfilter()
  } else if (evt.key == 'z' && evt.ctrlKey) {
    data = JSON.parse(JSON.stringify(savedata))
    select()
    const oldload = Number(loadedlist)
    $('#pop').html(data.pop)
    $('#loads').empty()
    for (list of data.flop) {
      newlist(list.title, list.text)
      $('.taskselect').removeClass('taskselect')
    }
    loadedlist = oldload
    loadList()
    dragsoff()
  } else if (
    selected == undefined && evt.key == 'Enter' &&
    $(':focus').hasClass('selected')
  ) {
    evt.preventDefault()
    $(document).scrollTop(0)
    toggledrags()
  } else if (selected != undefined && evt.key == 'Enter' &&
    !evt.altKey && !evt.shiftKey) {
    // swap editing
    $(document).scrollTop(0)
    evt.preventDefault()
    if (selected[0].tagName == 'TEXTAREA') {
      saveTask()
    } else if (selected[0].tagName == 'SPAN' &&
     !selected.hasClass('dateheading')) {
      evt.preventDefault()
      editTask()
    }
  } else if (selected != undefined && evt.key == 'Enter' &&
    evt.altKey && evt.metaKey) {
    evt.preventDefault()
    $(document).scrollTop(0)
    // new task if it's in textarea then save task
    if (selected[0].tagName == 'TEXTAREA') {
      saveTask()
    }
    if ($(taskAbove())[0] != selected[0]) {
      select(taskAbove())
      newTask()
    } else {
      const newspan = $('<span class="in">try task</span>')
      selected.before(newspan)
      select(newspan)
      newTask()
      newspan.remove()
    }
  } else if (selected != undefined && evt.key == 'Enter' &&
    evt.altKey) {
    $(document).scrollTop(0)
    evt.preventDefault()
    // new task if it's in textarea then save task
    if (selected[0].tagName == 'TEXTAREA') {
      saveTask()
    }
    if (evt.shiftKey) {
      newTask(true) // make subtask
    } else {
      newTask()
    }
  } else if (!evt.metaKey && !evt.altKey && !evt.ctrlKey &&
    selected != undefined && selected[0].tagName == 'TEXTAREA') {
    // modify the height of the textarea to hold everything
    updateHeight()
  } else if ($(':focus').hasClass('listtitle')) {
    updateSizes()
  } else if (evt.key == 'r' && evt.ctrlKey) {
    selectRandom()
  } else if (selected != undefined && selected[0].tagName !=
    'TEXTAREA') {
    if (evt.key == 'Backspace' && $(':focus').attr('id') != 'searchbar') {
      deleteTask()
    } else if (evt.code == 'KeyI' && evt.altKey) {
      toggleImportant()
    } else if (evt.code == 'KeyM' && evt.altKey) {
      toggleMaybe()
    } else if (evt.key == '‘') {
      indentTask(true)
    } else if (evt.key == '“') {
      indentTask(false)
    } else if (evt.key == 'ArrowUp' && evt.altKey) {
      evt.preventDefault()
      moveTask('up')
    } else if (evt.key == 'ArrowDown' && evt.altKey) {
      evt.preventDefault()
      moveTask('down')
    } else if (evt.key == ' ') {
      evt.preventDefault();
      if (evt.shiftKey) {
        archiveTask()
      } else {
        toggleComplete()
      }
    } else if (evt.key == 'ArrowRight' &&
      evt.altKey) {
      // insert afterwards
      // TODO: find the date of today
      // const today = getDate(today)
      moveTask('pop')
    } else if (evt.key == 'ArrowLeft' &&
      evt.altKey) {
      // insert afterwards
      moveTask('flop')
    } else if (evt.key == 'c' && evt.metaKey) {
      copieditem = selected.clone()
    } else if (evt.key == 'x' && evt.metaKey) {
      copieditem = selected.clone
      selected.remove()
    } else if (evt.key == 'v' && evt.metaKey) {
      if (copieditem) {
        selected.after(copieditem)
        select(selected.next(), true)
        copieditem = undefined
        save()
      }
    }
  }
  if (selected != undefined && selected[0].tagName != 'TEXTAREA' &&
    !event.metaKey && !event.ctrlKey && !event.altKey) {
    // key comms without modifier keys
    // TODO fix to make it so they skip over hidden tasks
    // TODO make so that tasks which don't have subtasks aren't folded

    if (evt.key == 'ArrowUp' && evt.shiftKey) {
      evt.preventDefault()
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
    } else if (evt.key == 'ArrowDown' && evt.shiftKey) {
      evt.preventDefault()
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
    } else if (evt.key == 'ArrowUp') {
      evt.preventDefault()
      select(taskAbove(), true)
    } else if (evt.key == 'ArrowDown') {
      evt.preventDefault()
      select(taskBelow(), true)
    } else if (evt.key == 'ArrowRight') {
      select(dateToHeading(stringToDate('0d')), true)
    } else if (evt.key == 'ArrowLeft') {
      select($('#flop').children()[1], true)
    } else if (evt.key == 'ArrowRight' && Array().includes($('#flop')[0])) {
      // go over and select pop
      // TODO: find the date of today
      // const today = getDate(today)
      select($('#pop').children().toArray()[
        $('#pop').children().toArray().length - 1], true)
    } else if (evt.key == 'ArrowLeft' &&
      selected.parents().toArray().includes($('#pop')[0])) {
      // go over and select pop
      // TODO: find the date of today
      // const today = getDate(today)
      select($('#flop').children().toArray()[
        $('#flop').children().toArray().length - 1], true)
    } else if (['{', '}'].includes(evt.key)) {
      if (selected.attr('folded') == 'false') {
        collapseAll('false')
      } else if (selected.attr('folded') == 'true') {
        collapseAll('true')
      }
    } else if (evt.key == '[' || evt.key == ']') {
      // toggle folding
      toggleSubtasks();
    } else if (evt.key == 'Enter' && evt.altKey &&
      evt.shiftKey) {
      newTask(true) // create subtask
    } else if (evt.key == 'Enter' && evt.altKey) {
      newTask() // new task
    }
  }
  if (evt.key == 'Escape') {
    evt.preventDefault()
    $(document).scrollTop(0) // fixes scrolling
  }
}

function getFrame(task) {
  if (task.attr('id') == 'flop') return $('#flop')
  else if (task.attr('id') == 'pop') return $('#pop')
  const parents = task.parents().toArray()
  if (parents.includes($('#flop')[0])) return $('#flop')
  else if (parents.includes($('#pop')[0])) return $('#pop')
}

function tutorial() {
  $('#tutorial').show()
  $('video').toArray().forEach((x) => {
    x.currentTime = 0
    x.playbackRate = 1.5
  })
}

function uploadData(reloading) {
  display('--- upload started ---')
  if (JSON.stringify(data) == prevupload) {
    display('identical');
    return
  }
  if (navigator.onLine && !offlinemode) {
   if (!uploading) {
      uploading = true
      $.post("upload.php", {
        datastr: JSON.stringify(data),
      }, function (data, status, xhr) {
        uploading = false
        diffsLog(prevupload, xhr.responseText)
        display('*** upload finished ***')
        prevupload = xhr.responseText
        localStorage.setItem('data', JSON.stringify(data))
        if (reloading) reload() // reloads page
      });
    }
  } else {
    if (!navigator.onLine && !offline) {
      // if it's offline save that
      alert('Connection lost; saving locally')
      offline = true
    } else if (navigator.onLine && offline) {
      reload()
      return
    }
    uploading = false
    // offline mode
    prevupload = JSON.stringify(data)
    localStorage.setItem('data', JSON.stringify(data))
    display('*** local upload finished ***')
    if (reloading) {
      localStorage.setItem('data', JSON.stringify(data))
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
}

function reload() {
  display('--- download started ---');
  if (!navigator.onLine || offlinemode) {
    // skip upload
    diffsLog(JSON.stringify(data), localStorage.getItem('data'))
    data = JSON.parse(localStorage.getItem('data'))
    display('*** local download finished ***')
    reload2()
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
    $.post(
      'download.php',
      function (datastr, status, xhr) {
        diffsLog(JSON.stringify(data), xhr.responseText)
        display('*** download finished ***');
        data = JSON.parse(xhr.responseText)
        reload2()
      }
    )
  }
}

function reload2() {
  let selectframe, selectindex
  if (selected && selected[0].tagName == 'SPAN') {
    selectframe = getFrame(selected)
    selectindex = selectframe.find('span.in').toArray().indexOf(selected[0])
  } else if (selected && getFrame(selected)) {
    selectframe = getFrame(selected)
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
  // right after signing in
  $('#username').text(getCookie('user'))
  if (setload != false) {
    // initial loads (not called on reloads)
    $('#focusbar').hide()
    $('head').append(
      $("<link rel='stylesheet' type='text/css' href='" +
        data.style + "' />")
    );
    if (data.weekdays == 'M') {
      weekdaysStr = { 0: 'U', 1: 'M', 2: 'T', 3: 'W', 4: 'R', 5: 'F', 6: 'S' }
    } else if (data.weekdays == 'Mon') {
      weekdaysStr = {
        0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri',
        6: 'Sat'
      }
    }
    // prevents endless loading loop
    $(document).on('keydown', keycomms)
    $(document).on('contextmenu', event, context)
    $(document).on('mousedown', event, clicked)
    $(document).on('mouseup', event, clickoff)
    $(document).on('dblclick', event, dblclick)
    $(window).resize(updateSizes)
    window.addEventListener('focus', function () {
      reload()
    })
    $('#container').on('mouseleave', function () {
      save()
    })
  }
  if (!data.headingalign) data.headingalign = 'center'
  document.documentElement.style.setProperty('--headingalign',
    data.headingalign)
  $('#pop').html(data.pop)
  // loads data
  let oldload
  console.log(data.loadedlist, setload);
  // load lists if there is one
  if (setload == false) {
    // fixes weird loadlist glitch
    oldload = Number(loadedlist)
  } else if (data.loadedlist != undefined) {
    oldload = Number(data.loadedlist)
  }
  console.log(oldload);
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
  $('#searchbar').val('')
  // show buttons and help right
  if (data.help == 'show') $('#help').show()
  if (data.help == 'hide') $('#help').hide()
  if (data.hidebuts == 'false') {
    $('.butbar').show()
    $('#focusbut').show()
    $('#typebut').show()
    $(':root').css('--butheight', $('#flopbuts').height() + 5 + 'px')
  } else {
    $('.butbar:not(#editbuts)').hide()
    $('#focusbut').hide()
    $('#typebut').hide()
    $(':root').css('--butheight', '0px')
  }
  if (mobiletest()) {
    // hide unnecessary buts
    $('.mobilehide').hide()
  }
  $('.taskselect').removeClass('taskselect')
  $(document).scrollTop(0)
  updateSizes()
  clearEmptyDates(false)
  clean()
  updatedeadlines()
  updateSpanDrags()
  console.log(scrolls);
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
  $('#logoimage').remove()
  display('loaded')
}

function scrollToToday() {
  const butheight = $(':root').css('--butheight')
  $('#pop').animate({
    scrollTop: $(dateToHeading(stringToDate('0d'))).prev().offset().top
      - $('#pop').offset().top - butheight.slice(0, butheight.length - 2)
  }, 500)
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