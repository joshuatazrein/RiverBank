// changes
var loadedlist
var selected
var focused
var dragsenabled = false
var inprogress
var time
var pause
var updated = false
var searchwidth = 10
var movetask
var fileinput
var loadedlistobj
var uploading
var reloading
var xhr
var slider
var durslider
var stopwatch
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
var weekdaysNum
var filtered
var filteredlist

//# TIMER
var timer = new Timer({
  tick: 1,
  ontick: function(sec) {
    let minutes = Math.floor(sec / 60000); // minutes
    let secs = Math.ceil((sec - (Math.floor(sec / 60000) * 60000)) / 1000)
    $('#timerent').val(String(minutes) + ':' +
      String(secs).padStart(2, 0))
  },
  onstart: function() {}
})

// defining options using on
timer.on('end', function() {
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

//passing over stuff
function draggingOver(evt) {
  //drag over
  evt.preventDefault()
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
  if (data.hidebuts == 'true') {
    $('.butbar').hide()
  }
  $(':focus').blur()
  loadList()
}

//enable you to edit titles
function toggledrags() {
  loads = $('#loads').children().toArray()
  if (dragsenabled === true) {
    loads.forEach((i) => {
      i.setAttribute('draggable', 'false')
    })
    dragsenabled = false
    loads[loadedlist].focus()
    const oldval = $(loads[loadedlist]).val()
    $(loads[loadedlist]).val('')
    $(loads[loadedlist]).val(oldval)
    save()
  } else {
    loads.forEach((x) => {
      $(x).attr('draggable', 'true')
    })
    dragsenabled = true
    $(':focus').blur()
    $(document).scrollTop(0); // fixes weird shit
    if ($(loads[loadedlist]).val().slice(0, 2) == '- ') {
      $(loads[loadedlist]).addClass('sublist')
    } else {
      $(loads[loadedlist]).removeClass('sublist')
    }
    save()
  }
  updateSizes()
}

function dragsoff() {
  if (dragsenabled === true) {
    toggledrags()
  }
}

function dragson() {
  if (dragsenabled === false) {
    toggledrags()
  }
}

// # DATA BEHAVIOR

// new list
function newlist(title, text) {
  let savetitle
  if (title === undefined) {
    savetitle = ''
  } else {
    savetitle = title
  }
  let savetext
  if (text === undefined) {
    savetext = ''
  } else {
    savetext = text
  }
  const newobj = {
    'title': savetitle,
    'text': savetext
  }
  if (title === undefined) {
    data.flop.push(newobj); //add to main list of lists only if it's new
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
  loadedlist = document.getElementById('loads').children.length - 1
  loadList(); // load last element in list
  $('#loads').children()[loadedlist].focus()
  if ($(loads[loadedlist]).val().slice(0, 2) == '- ') {
    $(loads[loadedlist]).addClass('sublist')
  } else {
    $(loads[loadedlist]).removeClass('sublist')
  }
  dragsoff()
}

// remove list from display and data
function deletelist() {
  yes = confirm('are you sure you want to delete this list?')
  if (yes == true) {
    $('#loads').children()[loadedlist].remove()
    data.flop.splice(loadedlist, 1)
    $('#flop').empty()
    loadedlist = 0
    save()
    loadList()
  }
}

function loadList() { //updates the list display
  unfilter()
  loads = $('#loads').children().toArray()
  loads.forEach(function(i) {
    $(i).removeClass('selected')
    $(i).addClass('unselected')
  })
  $(loads[loadedlist]).removeClass('unselected')
  $(loads[loadedlist]).addClass('selected')
  $('#flop').html(data.flop[loadedlist].text)
  $('.taskselect').removeClass('taskselect')
  save()
}

function toggleFoldList() {
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
  save()
}

function updateSizes() {
  for (list of [
      [$('#timerent')[0], 6],
      [$('#searchbar')[0], 5],
      [$('#username')[0], $('#username').text().length / 2 + 2],
      [$('#lists')[0], 7]
    ].concat(
      $('#loads').children().toArray().map((x) => {
        let textlength = Math.max($(x).val().split(' ').map((x) => {
          return x.length
        }))
        return [$(x)[0], textlength / 2 + 2.5]
      })
    )) {
    // update entries
    let fontsize = 24
    if (window.innerWidth < 600) fontsize = 16
    while ($(list[0]).width() / (fontsize / 2) < list[1]) {
      fontsize -= 1
    }
    $(list).css('font-size', fontsize + 'px')
  }
  // fix context menu for mobile
  if (window.innerWidth < 600) {
    $('.dropdown-item').toArray().forEach((x) => {
      $(x).text($(x).text().replace(/\s\((.*)\)/, ''))
    })
  }
  // updates the text sizes of each list
  let height = 0
  $('#texttest').css('font-family', 'var(--font), serif')
  $('#texttest').css('font-weight', 'bold')
  for (list of $('#loads').children()) {
    $('#texttest').css('font-size', $(list).css('font-size'))
    $('#texttest').html($(list).val())
    if ($(list).val() == '') $('#texttest'.html($('&nbsp;')))
    $('#texttest').css('width', $(list).width() + 'px')
    $(list).css('height', $('#texttest').height() + 'px')
  }
  $('#texttest').css('font-family', '')
  $('#texttest').css('font-size', '')
  $('#texttest').css('font-weight', '')
}

// picks a new loadlist
function loadthis() {
  if (loadedlist != undefined && loadedlist != this.value) {
    select()
    save()
  }
  loads = Array.from($('#loads').children())
  loadedlist = loads.indexOf(this)
  loadList(this)
}

// Storing data:
function save(undo) {
  unfilter()
  if (undo == true) savedata = JSON.parse(JSON.stringify(data))
  // update height of loads
  const leftcol = $($('.leftcolumn')[0])
  const loadsheight = leftcol.height() -
    leftcol.children().filter(':not(#loads):visible').toArray().reduce((total,
      x) => {
      return total + $(x).height();
    }, 0) - 25
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
    if (foldedlist.includes(blinded) == false &&
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
  // save data
  data.pop = $('#pop').html()
  if (loadedlist != undefined) {
    try {
      data.flop[loadedlist].text = $('#flop').html()
      try {
        data.flop[loadedlist].title = $('#loads').children()[loadedlist].value
      } catch (TypeError) {
        data.flop[loadedlist].title = ''
      }
      data.loadedlist = loadedlist
    } catch (TypeError) {
      data.loadedlist = 0
      loadedlist = 0
      loadList()
    }
  }
  dataString = JSON.stringify(data)
  localStorage.setItem('data', dataString)
  // backup data to the server after setting localstorage data
  uploadData()
  updatedeadlines()
  $(document).scrollTop(0) // fixes scroll
}

function clearEmptyDates() {
  $('.placeholder').remove()
  // take away empty dates
  const dateslist = $('#pop').children().filter('.h1')
  for (date of dateslist) {
    if (
      getHeadingChildren($(date)).length == 0 &&
      stringToDate($(date).text(), true).getTime() !=
      stringToDate('t').getTime()
    ) date.remove()
  }
  const today = stringToDate('t')
  try {
    $('#pop').children().filter('.dateheading').toArray().forEach((heading) => {
      if (
        stringToDate($(heading).text(), true).getTime() < today.getTime() &&
        $(heading).attr('folded') == 'false'
      ) {
        if (getHeadingChildren($(heading)).length > 0 &&
          !getHeadingChildren($(heading)).map((x) => 
          {return x[0]}).includes(selected[0])) {
          togglefold($(heading))
        }
        if (!$(heading).hasClass('complete')) {
          $(heading).addClass('complete')
          $(heading).prev().addClass('complete') // also to date header
          if (stringToDate($(heading).text(), true).getTime() == 
            stringToDate('t').getTime() - 86400000) {
            const today = dateToHeading(stringToDate('t'))
            // if it's the previous day
            getHeadingChildren(today).filter(
              'span:not(.complete):not(.event)').toArray().forEach(function() {
                $(today).after($(this))
              })
          }
        }
      }
    })
  } catch (err) {
    // prevents loadpage error
  }
  save()
}

function switchUser() {
  // switches data and reloads page
  save()
  const past = new Date()
  past.setTime(past.getTime() - 86400000)
  document.cookie = 'username=; expires=' + past.toUTCString()
  reloadpage()
}

function upload() {
  var fileinput = $('<input type="file" id="fileinput" />')
  fileinput.on('change', function() {
    const fileReader = new FileReader()
    fileReader.addEventListener('loadend', function() {
      // rewrite existing data with this
      data = JSON.parse(this.result)
      dataString = JSON.stringify(data)
      localStorage.setItem('data', dataString)
      uploadData(true)
      reloadpage()
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
  if (yes == true) {
    data = JSON.parse(JSON.stringify(resetstring))
    localStorage.setItem('data', JSON.stringify(data))
    uploadData()
    reloadpage()
  }
}

function uploadData(async) {
  // uploads data to server
  try {
    // cancels previous uploads to overwrite
    if (uploading == true) xhr.abort()
    uploading = true
    const blob = new Blob([JSON.stringify(data)], {
      type: "text/plain"
    })
    const newdata = new FormData()
    newdata.append("upfile", blob)
    xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
      if (this.readyState == 4) {
        uploading = false
        if (reloading == true) {
          reloading = false 
          console.log('reloading from upload');
          reloadpage()
        }
        console.log('upload complete');
      }
    }
    if (async ==true) {
      xhr.open("POST", "upload.php", false)
    } else {
      xhr.open("POST", "upload.php")
    }
    xhr.send(newdata)
  } catch (err) {
    // pass
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

function toggleWeekdays() {
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
    weekdaysNum = {
      'Sun': 0,
      'Mon': 1,
      'Tue': 2,
      'Wed': 3,
      'Thu': 4,
      'Fri': 5,
      'Sat': 6
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
    weekdaysNum = {
      'U': 0,
      'M': 1,
      'T': 2,
      'W': 3,
      'R': 4,
      'F': 5,
      'S': 6
    }
  }
  save()
}

function toggleHeadingAlign() {
  console.log(data.headingalign);
  if (data.headingalign == 'left') data.headingalign = 'center'
  else data.headingalign = 'left'
  save()
  document.documentElement.style.setProperty('--headingalign', 
    data.headingalign)
}

function toggleWeekdayFormat() {
  // changes between 1 and 3 letter date formats
  const weekdaytransdict = {
    'M': 'Mon',
    'Mon': 'M',
    'T': 'Tue',
    'Tue': 'T',
    'W': 'Wed',
    'Wed': 'W',
    'R': 'Thu',
    'Thu': 'R',
    'F': 'Fri',
    'Fri': 'F',
    'S': 'Sat',
    'Sat': 'S',
    'U': 'Sun',
    'Sun': 'U'
  }
  const headingslist = $('#pop').children().toArray().filter(
    (x) => {
      if ($(x).hasClass('h1') &&
        stringToDate($(x).text(), true) != 'Invalid Date') {
        return true
      }
    })
  for (heading of headingslist) {
    // switches the dates back and forth
    const textlist = $(heading).text().split(' ')
    textlist[0] = weekdaytransdict[textlist[0]]
    $(heading).html(textlist.join(' ') + getChildren($(heading)))
  }
  toggleWeekdays(); // new
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
  localStorage.setItem('data', JSON.stringify(data))
  uploadData(true)
  reloadpage()
}

function dateToString(date, weekday) {
  // date to formatted string
  let datestr = ''
  if (weekday == true) {
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
  if (weekday == true) {
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
  if (string.charAt(0) == 't') {
    if (string.length > 1 && !/[\+-]*\d+[wmyd]/.test(string.slice(1))) {
      return 'Invalid Date'
    }
    // nothing because the weekday is correct
  } else if (
    Object.keys(weekdaysNum).includes(string.split(/(\+|-|\s)/)[0])
  ) {
    // analyze as a weekday string
    weekday = weekdaysNum[string.split(/(\+|-|\s)/)[0]]
    if (future == true) {
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

function dateToHeading(date) {
  if (date === undefined) return
  if (dateToString(date).includes('NaN')) return
  // find the matching date, or create if not
  const newtask = createBlankTask()
  newtask.addClass('h1')
  newtask.attr('folded', 'false')
  newtask.text(dateToString(date, true))
  newtask.addClass('dateheading')
  newtask.attr('draggable', 'false')
  // sort date headings to be correct
  const headingslist = $('#pop').children().toArray().filter((x) => {
    if (stringToDate($(x).text()) != 'Invalid Date' &&
      $(x).hasClass('dateheading')) return true
  })
  let heading1 = headingslist.find((x) => {
    return stringToDate(stripChildren($(x)), true).getTime() ==
      stringToDate(newtask.text(), true).getTime()
  })
  if (heading1 == undefined) {
    // insert elt at beginning
    $('#pop').append(newtask)
    headingslist.push(newtask)
    for (heading of headingslist.sort((a, b) => {
        return stringToDate($(a).text().replace('...', ''), true).getTime() -
          stringToDate($(b).text().replace('...', ''), true).getTime()
      })) {
      const children = getHeadingChildren($(heading)).reverse()
      $('#pop').append($(heading))
      children.forEach((x) => {
        $(heading).after($(x))
      })
    }
    // save()
    return newtask
  } else {
    return heading1
  }
}

function search(skiplinks) {
  // find all matches with the searchtext
  let searchtext = $('#searchbar').val()
  while (searchtext.charAt(searchtext.length - 1) == ' ') {
    // chop off end spaces
    searchtext = searchtext.slice(0, searchtext.length - 1)
  }
  searchtext = searchtext.replace('  ', ' ');
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
        if (skiplinks == true &&
          $(child).text().includes('[[' + searchtext)) {
          // test for links
          continue
        } else if (skiplinks == 'deadline' &&
          !stripChildren($(child)).includes('>')) {
          // finds only deadlines
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
    select(focused)
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
  select(focused)
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

function updatedeadlines() {
  $('.duedate').remove()
  $('.placeholder').remove()
  $('.mobhandle').remove()
  const collapselist = $('#pop').children().filter('.h1').toArray().filter(
    (x) => {
      return $(x).attr('folded') == 'true'
    })
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
    for (let deadline of $('#test').find('.deadline').filter(function() {
        return !$(this).parent().hasClass('complete')  
      })) {
      // append under heading
      const text = stripChildren($($(deadline).parent()))
      const index = text.search('>')
      const endindex = index + text.slice(index).search(' ')
      const date = $(deadline).text().slice(1)
      const heading = dateToHeading(stringToDate(date))
      const duedate = createBlankTask()
      // take out deadline
      duedate.text(text.slice(0, index) + text.slice(endindex))
      duedate.addClass('duedate')
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
    $('#flop').append('<span class="buffer" style="height:90%"></span>')
  }
  if (!$('#pop').children().filter('.buffer')[0]) {
    $('#pop').append('<span class="buffer" style="height:90%"></span>')
  }
  for (list in $('#loads').children().toArray()) {
    // clears out empty lists
    if (
      $($('#loads').children()[list]).val() == '' &&
      data.flop[list].text == '' &&
      loadedlist != list
    ) {
      data.flop.splice(list, 1)
      $($('#loads').children()[list]).remove()
    }
  }
  if (window.innerWidth < 600) {
    // insert mobiledrag elements
    $('span.in').draggable({
      delay: 400,
      axis: 'y',
      containment: 'window',
      revert: true,
      scrollSpeed: 10
    })
    $('span.in').droppable({
      accept: 'span.in', 
      hoverClass: 'drop-hover',
      greedy: true,
      drop: function(event, ui) {
        ui.draggable.css('top', '0')
        ui.draggable.css('left', '0')
        dropTask(event, ui.draggable[0])
      }
    })
    $('span.in').attr('dragstart', '')
    $('span.in').attr('dragover', '')
    $('span.in').attr('drop', '')
    $('span.in').attr('draggable', 'false')
  } else {
    $('span.in').attr('draggable', 'true')
    $('span.in').attr('dragstart', 'dragTask(event)')
    $('span.in').attr('dragover', 'draggingOver(event)')
    $('span.in').attr('drop', 'dropTask(event)')
  }
}

function deleteTask() {
  if (selected[0].tagName == 'P') {
    return
  }
  let newselect = selected.next()
  if (newselect.hasClass('buffer')) {
    newselect = [undefined]
  }
  if (newselect[0] == undefined) {
    newselect = selected.prev()
  }
  if (newselect[0] == undefined) {
    newselect = selected.parent()
  }
  if (selected.hasClass('dateheading') == true) {
    return; // prevents deleting dates
  }
  if (selected.attr('folded') == 'true') {
    // unfold deleted headings before deleting
    togglefold(selected)
  }
  selected.remove()
  select(newselect)
  save(true)
  clearEmptyDates()
}

function indentTask(indent) {
  if (selected.parent()[0].tagName == 'SPAN' && indent == false) {
    selected.parent().after(selected)
  } else if (indent == true) {
    selected.prev().append(selected)
  }
}

function mod12(val) {
  if (val > 12.9) return val - 12
  else if (val < 1) return val + 12
  else return val
}

function dragTime(el) {
  console.log('dragtime');
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
  if (!/\d+:30/.test(splitlist[0]) && !/^\d+$/.test(splitlist[0])) {
    console.log(/\d+:30/.test(splitlist[0]), !/^\d$/.test(splitlist[0]), 
    'tests');
    splitlist[0] = splitlist[0].split(':')[0] + ':30'
    console.log('fail');
  }
  const origvalue = Number(splitlist[0].replace(':30', '.5'))
  if (splitlist[1]) {
    // set endpoint if it exists
    if (!/:30/.test(splitlist[1]) && !/^\d+$/.test(splitlist[1])) {
      splitlist[1] = splitlist[1].split(':')[0] + ':30'
    }
    durval = Number(splitlist[1].replace(':30', '.5'))
  } else durval = origvalue
  slider.on('input', function() {
    if (durslider) durslider.remove()
    let changeval = mod12(origvalue + slider.val() / 2)
    if (durval != origvalue) {
      durchangeval = mod12(durval + slider.val() / 2)
      el.text(String(changeval).replace('.5', ':30') + '-' + 
        String(durchangeval).replace('.5', ':30'))
    } else {
      el.text(String(changeval).replace('.5', ':30'))
    }
  })
  durslider.on('input', function() {
    if (slider) slider.remove()
    durchangeval = mod12(durval + durslider.val() / 2)
    // prevent earlier
    if (durchangeval < origvalue && durslider.val() < 0) return 
    else if (durchangeval == origvalue) el.text(splitlist[0])
    else el.text(splitlist[0] + '-' + 
      String(durchangeval).replace('.5', ':30'))
  })
  durslider.on('mouseup', function() {
    slider.remove()
    durslider.remove()
    save()
  })
  slider.on('mouseup', function() {
    slider.remove()
    durslider.remove()
    save()
  })
}

function removesliders() {
  slider.remove()
  durslider.remove()
}

function saveTask() {
  // analyze format of task and create new <span> elt for it
  const savetask = selected.prev() // looks at item before it
  selected.next().remove() // removes appended children
  console.log([selected.val()])
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
    alert('create new dates by searching them')
    savetask.remove()
    selected.remove()
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
        dateToString(stringToDate(selected.val().slice(index + 1,endindex))) + 
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
    if (modeclosed == true) {
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
  newstr += getChildren(el)
  if (selected.val().charAt(0) == '@') {
    // process event signs
    const list = newstr.split(' ')
    console.log(list[0]);
    if (/@\d(.*)/.test(list[0])) {
      console.log('match');
      // replace with timing object with times
      const timing = $('<span class="timing"></span>')
      timing.text(list[0].slice(1))
      list[0] = timing[0].outerHTML
      console.log(list[0]);
      newstr = list.join(' ')
    } else {
      newstr = newstr.slice(1)
    }
  }
  if (savetask.hasClass('folded') == 'true') {
    savetask.addClass('folded')
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
          if (patt.test(wordlist[word]) == true) {
            match = true
          }
        }
        if (match == false) {
          console.log('matching');
          wordlist[word] = '<span class="weblink" title="' + wordlist[word] + 
            '">' + wordlist[word] + '</span>'
        }
        savetask.html(wordlist.join(' '))
        console.log(savetask.html());
      }
    }
  } catch (err) {
    // skip it if it doesn't work
    console.log(savetask.html(), 'split didn\'t work');
    return
  }
  // take away hashtags
  if (savetask.hasClass('h1') == true) {
    savetask.html(savetask.html().slice(2))
  } else if (savetask.hasClass('h2') == true) {
    savetask.html(savetask.html().slice(3))
  }
  if (savetask.hasClass('h3') == true) {
    savetask.html(savetask.html().slice(4))
  }
  selected.remove()
  savetask.show()
  select(savetask)
  if (selected.parent()[0].tagName == 'SPAN') {
    selected.parent().attr('draggable', 'true')
  }
  save(true)
}

function getHeading(el) {
  // gets the heading
  while (el.parent()[0].tagName != 'P') el = el.parent()
  let heading = el.prev()
  while (heading[0] && !isHeading($(heading))) heading = $(heading).prev()
  if ($(heading).hasClass('dateheading')) return $(heading).prev()
  else return $(heading)
}

function select(el, scroll) {
  if (el && 
    $(el)[0].tagName == 'SPAN' && !isSubtask($(el))) el = $(el).parent()
  console.log('selecting', el);
  if (slider) removesliders() // removes sliders
  if ($(el).hasClass('buffer')) {
    select(getFrame($(el)), scroll)
    return
  }
  $(document).scrollTop(0); // fixes weird shit
  // switch selection
  if (selected != undefined) {
    selected.removeClass('taskselect')
  }
  if (el != undefined && $(el).hasClass('in') == true) {
    selected = $(el)
    selected.addClass('taskselect')
    let parent
    if (selected.parents().toArray().includes($('#flop')[0])) {
      parent = $('#flop')
    } else if (selected.parents().toArray().includes($('#pop')[0])) {
      parent = $('#pop')
    } else {
      parent = $(el)
    }
    if (selected != undefined) {
      try {
        getFrame(selected).find(":not(span)").addBack().contents().filter(
          function() {
            return this.nodeType == 3;
          }).remove();
      } catch (err) {}
    }
    if (scroll != false) {
      // only execute if not clicked
      const oldscroll = parent.scrollTop()
      parent.scrollTop(0)
      const scrolltime = 300
      parent.stop(true)
      if (!selected.hasClass('dateheading') && !isHeading(selected)) {
        if (getHeading(selected)[0] && 
        Number(getHeading(selected).offset().top) + parent.height() / 2 >
        Number(selected.offset().top)) {
          // scroll to heading
          const scrolllocation = Number(
            getHeading(selected).offset().top) - 
            Number(getFrame(selected).offset().top)
          parent.scrollTop(oldscroll)
          parent.animate({
            scrollTop: scrolllocation
            }, scrolltime)
        } else {
          // if more than halfway down the page
          const scrolllocation = Number(selected.offset().top) - 
            Number(parent.offset().top) -
            parent.height() / 2
          parent.scrollTop(oldscroll)
          parent.animate({
            scrollTop: scrolllocation}, scrolltime)
        }
      } else if (selected.hasClass('dateheading')) {
        const scrolllocation = Number(selected.prev().offset().top) - 
          Number(getFrame(selected).offset().top)
        parent.scrollTop(oldscroll)
        parent.animate({
          scrollTop: scrolllocation}, scrolltime)
      } else if (isHeading(selected)) {
        const scrolllocation = Number(selected.offset().top) - 
          Number(getFrame(selected).offset().top)
        parent.scrollTop(oldscroll)
        parent.animate({
          scrollTop: scrolllocation}, scrolltime)
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
  for (child of testelt.children()) {
    // strip the subtasks
    if (isSubtask($(child)) == true) {
      $(child).remove()
    } else if ($(child).hasClass('weblink') == true) {
      $(child).html($($(child).children()[0]).attr('href'))
    }
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
      'mobhandle'
    ]) {
    if (el.hasClass(lineinner) == true) {
      return false
      break
    }
  }
  return true
}

function getChildren(el) {
  // returns the children's HTML
  let newstr = ''
  let children = el.children()
  for (let child of children) {
    if (isSubtask($(child)) == true) {
      children = children.slice(children.toArray().indexOf(child))
      for (let child of children) {
        // append all subtasks to tasks
        newstr += child.outerHTML
      }
      break
    }
  }
  return newstr
}

function updateHeight() {
  if (selected.val() == '') {
    selected.css('height', '1em')
  } else {
    $('#texttest').text(selected.val() + ' x')
    $('#texttest').css('width', selected.width() + 'px')
    $('#texttest').css('padding-left', selected.css('padding-left'))
    selected.css('height', $('#texttest').height() + 'px')
  }
}

function editTask() {
  el = selected
  if (selected.hasClass('dateheading') == true) return
  if (selected.parent()[0].tagName == 'SPAN') {
    selected.parent().attr('draggable', 'false')
  }
  if (selected != undefined) {
    $('#context-menu').hide()
    const newelt = $('<textarea class=\'in edit\'></textarea>')
    el.after(newelt)
    el.hide()
    select(newelt)
    console.log(getChildren(el));
    if (getChildren(el) == '') {
      selected.after('<span style="display:none;"></span>')
      console.log('0height');
    } else {
      // appends children after
      selected.after('<span>' + getChildren(el) + '</span>') 
    }
    selected.focus()
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
  }
}

function createBlankTask() {
  const savetask = $('<span class="in"></span>')
  savetask.attr('ondragstart', 'dragTask(event)')
  savetask.attr('ondragover', 'draggingOver(event)')
  savetask.attr('ondrop', 'dropTask(event)')
  savetask.attr('draggable', 'true')
  return savetask
}

function newTask(subtask) {
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
  } else if (selected[0].tagName == 'SPAN' && subtask == true) {
    // subtask
    e.append(newspan)
  } else if (['SPAN'].includes(selected[0].tagName)) {
    // regular task
    e.after(newspan)
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
  if (play == true) {$('#popsnd')[0].play(); console.log('playing');}
  // archives the selected Flop to the current day
  let heading
  const day = $(dateToHeading(stringToDate('t')))
  const childText = getHeadingChildren(day).map((x) => {
    return $(x).text()
  })
  if ((childText.includes('completed') == true ||
      childText.includes('completed ...') == true) == false) {
    // add in an extra heading
    heading = $('<span class=\'in h2\' folded=\'false\'>' +
      'completed ...</span>')
    heading.attr('ondragstart', 'dragTask(event)')
    heading.attr('ondragover', 'draggingOver(event)')
    heading.attr('ondrop', 'dropTask(event)')
    heading.attr('draggable', 'true')
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
  if (selected.hasClass('complete') == false) {
    toggleComplete() // complete it
  }
  heading.after(selected)
  // formatting
  if (heading.attr('folded') == 'false') {
    togglefold(heading)
  } else {
    selected.hide()
  }
  save()
}

function toggleComplete() {
  if (selected[0].tagName == 'P') {
    return
  }
  const text = stripChildren(selected).split(' ')
  if (!selected.hasClass('complete') &&
    /^~/.test(text[text.length - 1])) {
    if (stringToDate(text[text.length - 1].slice(1)) == 'Invalid Date') {
      alert('invalid repeat date')
      selected.text(text.slice(0, text.length - 1) + 
        getChildren(selected))
    } else {
      const date = stringToDate(text[text.length - 1].slice(1), false, true)
      const heading = dateToHeading(date)
      const newtask = selected.clone()
      if (
        !getHeadingChildren($(heading)).map((x) => {
          return $(x).text()
        }).includes(selected.text())
      ) {
        $(heading).after(newtask)
      }
    }
  }
  selected.toggleClass('complete')
  save()
  clearEmptyDates()
}

function toggleImportant() {
  selected.toggleClass('important')
  save()
}

function startTimer() {
  if ($('#timerent').val() == '') {
    var timertime = new Date().getTime()
    $('#timerent').val('0:00')
    if (stopwatch) clearInterval(stopwatch)
    stopwatch = setInterval(function() {
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
    stopTimer()
  } else if (ev.key == ' ') {
    ev.preventDefault()
    if (pause == false) {
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
  select(evt.target, false)
  //start drag
  if (selected[0].tagName == 'TEXTAREA') {
    return; // stops from dragging edited subtasks
  } else if (stringToDate(selected.text()) != 'Invalid Date' &&
    selected.parents().toArray().includes($('#pop')[0]) == true) {
    return; // stops from reordering dates
  }
  // plaintext alternative? for compatibility?
  //specify allowed transfer
  evt.dataTransfer.effectAllowed = 'move'
}

//dropping
function dropTask(evt, obj) {
  let el
  if (obj) {
    el = obj
  } else {
    el = evt.target
  }
  if (selected[0].tagName == 'TEXTAREA') {
    return
  } else if (stringToDate(selected.text()) != 'Invalid Date' &&
    selected.parents().toArray().includes($('#pop')[0]) == true) {
    return; // stops from reordering dates
  }
  let children = []
  if (selected.hasClass('h1') || selected.hasClass('h2') ||
    selected.hasClass('h3')) {
    // drop all the tasks
    children = getHeadingChildren(selected)
  }
  if ($(el).attr('folded') == 'true') {
    togglefold($(el))
    if (getHeadingChildren($(el)).length == 0) {
      $(el).after(selected)
    } else {
      getHeadingChildren($(el))[
        getHeadingChildren($(el)).length - 1].after(selected)
    }
  } else if ($(el).hasClass('buffer')) {
    // dropped onto buffer
    if (evt.metaKey == true) {
      $(el).parent().prepend(selected)
    } else {
      $(el).before(selected)
    }
  } else if (el.tagName == 'P' && $(el).hasClass('in')) {
    // drop task at beginning
    if (evt.altKey == true) {
      if (evt.metaKey == true) {
        $(el).prepend(selected)
      } else {
        $(el).append(selected)
      }
    } else {
      $(el).append(selected)
    }
  } else if (el.tagName == 'SPAN' &&
    $(el).hasClass('in')) {
    // dropping task (according to key commands)
    if (evt.altKey == true) {
      if (evt.metaKey == true) {
        const subtasks = $(el).children().toArray().filter(
          (x) => {
            if (isSubtask($(x)) == true) return true
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
      if (evt.metaKey == true) {
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
  select(selected)
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
      if (e.hasClass('folded') == true) {
        e.children().toArray().forEach((x) => {
          $(x).show()
        })
        e.html(stripChildren(e, 'html').slice(0, -4) + getChildren(e))
      } else if (e.hasClass('folded') == false) {
        e.children().toArray().forEach((x) => {
          $(x).hide()
        })
        e.html(stripChildren(e, 'html') + ' ...' + getChildren(e))
      }
      e.toggleClass('folded')
    }
  }
  save()
}

function getHeadingChildren(el) {
  // gets all subtasks of a heading
  // headings to stop folding at
  const folds = {
    'h1': ['h1'],
    'h2': ['h2', 'h1'],
    'h3': ['h3', 'h2', 'h1']
  }
  let thisclass
  if (el.hasClass('h1') == true) {
    thisclass = 'h1'
  } else if (el.hasClass('h2') == true) {
    thisclass = 'h2'
  } else if (el.hasClass('h3') == true) {
    thisclass = 'h3'
  }
  const children = el.parent().children().filter('.in')
  const start = children.toArray().indexOf(el[0]) + 1
  for (let i = start; i < children.length; i++) {
    let toggle = true
    for (fold of folds[thisclass]) {
      if ($(children[i]).hasClass(fold) == true) {
        toggle = false
      }
    }
    if (toggle == false) {
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
      child.hide()
    } else {
      // if unfolding, keep folded headings folded
      if (child.attr('folded') == 'true') {
        keepfolded.push(child)
      }
      child.show()
    }
  }
  if (e.attr('folded') == 'true') {
    for (heading of keepfolded) {
      // keep folded headings folded
      getHeadingChildren($(heading)).forEach((x) => {
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
    save()
  }
}

function toggleButs() {
  if (data.hidebuts == 'true') {
    $('.butbar').show()
    $('#editbuts').append($('#optionsbut'))
    $('#optionsbut').css('margin', '')
    data.hidebuts = 'false'
    $(':root').css('--butheight', $('#flopbuts').height() + 'px')
  } else if (window.innerWidth > 600) {
    $('.butbar').hide()
    data.hidebuts = 'true'
    $('#username').after($('#optionsbut'))
    console.log(String($('#optionsbut').width() / 2));
    $('#optionsbut').css('margin-left', 'calc(50% - ' + 
      String($('#optionsbut').width() / 2) + 'px)')
    $(':root').css('--butheight', '-10px')
  }
  if (window.innerWidth < 600) {
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
  data.style = style
  save()
  location.reload()
}

function context(e, mobile) {
  console.log('context');
  if (selected != undefined && selected[0].tagName == 'TEXTAREA') {
    saveTask()
  }
  let target = e.target
  if (mobile == true) {
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
    select($(target), false)
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
      ['in']
    ],
    '#context-clearEmptyHeadlines': [
      ['P'],
      ['in']
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
        if ($(target).hasClass(cls) == true) {
          showoption = true
          break
        }
      }
    }
    if (showoption == true) {
      $(option).show()
    } else {
      $(option).hide()
    }
  }
  $('#context-menu').css('top', Math.min(e.pageY,
    window.innerHeight - $('#context-menu').height()) - 20)
  $('#context-menu').css('left', Math.min(e.pageX,
    window.innerWidth - $('#context-menu').width()) - 40)
}

function setOptions() {
  console.log($('#typebut'));
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
  if (el.hasClass('h1') == true || el.hasClass('h2') == true ||
    el.hasClass('h3') == true) {
    return true
  } else {
    return false
  }
}

function selectRandom() {
  let headinglist
  // get children
  if (selected != undefined && isHeading(selected) == true) {
    headinglist = getHeadingChildren(selected)
  } else if (selected != undefined && getChildren(selected).length > 0) {
    headinglist = selected.children().filter((x) => {
      return isSubtask($(x))
    })
  } else if (selected == undefined ||
    selected.hasClass('in') == true) {
    headinglist = $('#flop').children().toArray()
  }
  if (headinglist.length > 0) {
    headinglist = headinglist.filter((x) => {
      if ($(x).hasClass('complete') == false &&
        $(x).hasClass('taskselect') == false) return true
    })
    if (headinglist.length > 0) {
      select($(headinglist[
        Math.floor(Math.random() * (headinglist.length))
      ]))
    }
  }
}

function setTask(type) {
  if (!selected || selected.hasClass('dateheading')) return
  const list = selected.text().split(' ').filter((x) => {return x != ''})
  console.log(list);
  if (type == 'deadline') {
    if (!/\>/.test(list[list.length - 1])) {
      selected.text(selected.text() + ' >')
    } else {
      selected.text(list.slice(0, list.length - 1).join(' ') + ' >')
    }
    editTask()
  } else if (type == 'repeat') {
    if (!/~/.test(list[list.length - 1])) {
      selected.text(selected.text() + ' ~')
    } else {
      selected.text(list.slice(0, list.length - 1).join(' ') + ' ~')
    }
    editTask()
  } else {
    selected.attr('class', 'in ' + type)
    if (['-', '•'].includes(selected.text().charAt(0))) {
      // remove bullet or list
      selected.text(selected.text().slice(1))
      if (selected.text().charAt(0) == ' ') {
        selected.text(selected.text().slice(1))
      }
    }
    if (type == 'list') {
      selected.text('• ' + selected.text())
    } else if (type == 'note') {
      selected.text('- ' + selected.text())
    }
    save()
  }
}

function clicked(ev) {
  $(document).scrollTop(0); // fixes weird shit
  $('nav').hide()
  if (ev.target.tagName == 'TEXTAREA' && !$(ev.target).hasClass('listtitle')) {
    return
  } else if (selected != undefined && selected[0].tagName == 'TEXTAREA' &&
    ev.target.tagName != 'TEXTAREA') {
    saveTask()
    select($(ev.target), false)
    return
  } else if ($(ev.target).hasClass('buffer')) {
    select(getFrame($(ev.target)), false)
  } else if ($(ev.target).attr('id') == 'newHeadingFlopBut') {
    if (selected == undefined ||
      selected.parents().toArray().includes($('#pop')[0]) ||
      selected.attr('id') == 'pop') {
      const newtask = createBlankTask()
      $('#flop').append(newtask)
      select(newtask)
      editTask()
    } else {
      newTask()
    }
    selected.val('# ')
  } else if ($(ev.target).attr('id') == 'todayBut') {
    select(dateToHeading(stringToDate('t')))
    save()
  } else if ($(ev.target).attr('id') == 'addDateBut') {
    $('#searchbar').val('d:')
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
    if (selected == undefined) {
      select(dateToHeading(stringToDate('t')))
    }
    newTask()
  } else if ($(ev.target).attr('id') == 'flopBut') {
    if (selected == undefined || selected.parents().toArray().includes(
        $('#flop')[0]) == false) {
      // insert after selected
      try {
        select($('#flop').children().$('#flop').children().length - 1)
      } catch (IndexError) {
        select($('#flop'))
      }
    }
    newTask()
    // other clicks
  } else if ($(ev.target)[0].tagName == 'BUTTON') {
    eval($(ev.target).attr('function')) // execute button functions
  } else if ($(ev.target).hasClass('link') == true) {
    // search the task
    $('#searchbar').val($(ev.target).text().slice(2, -2))
    search(true)
  } else if ($(ev.target).hasClass('weblink')) {
    let title = $(ev.target).attr('title')
    if (!title.includes('https://www.')) title = 'https://www.' + title
    else if (!title.includes('https://')) title = 'https://' + title
    window.location = title
  } else if ($(ev.target).hasClass('timing')) {
    // timing generate for thing
    dragTime($(ev.target))
  } else if ($(ev.target).hasClass('deadline') == true) {
    select(dateToHeading(stringToDate(
      $(ev.target).text().slice(1))))
  } else if ($(ev.target).hasClass('duedate') == true) {
    // jump to deadline
    $('#searchbar').val(stripChildren($(ev.target)))
    search('deadline')
  } else if (getFrame($(ev.target)) && $(ev.target).hasClass('in')) {
    // select allowable elements
    select(ev.target, false)
  } else if (!isSubtask($(ev.target))) {
    // select parents of 
    select($(ev.target).parent(), false)
    if ($(ev.target).hasClass('mobhandle')) {
      context(ev, true)
    }
  } else if ($(ev.target).hasClass('dropdown-item')) {
    const oldselect = selected
    eval($(ev.target).attr('function'))
    if (selected && selected[0].tagName != 'TEXTAREA' &&
      (evt.target).attr('id') != 'context-goToToday') {
      select(oldselect)
    }
  } else if ($(ev.target).hasClass('listtitle')) {
    select()
    if (window.innerWidth < 600) $(':focus').blur()
    if ($(ev.target).hasClass('unselected')) {
      dragson()
    }
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
  while (returntask != undefined && returntask.hasClass('in') == false) {
    returntask = returntask.prev()
  }
  if (returntask != undefined && !returntask.is(':visible' )) {
    // while invisible
    select(returntask)
    return taskAbove()
  } else if (!returntask || returntask.hasClass('in') == false) {
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
      if (isSubtask($(child)) == true) {
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
  while (returntask[0] != undefined && returntask.hasClass('in') == false) {
    returntask = returntask.next()
  }
  if (returntask[0] != undefined && !returntask.is(':visible' )) {
    // while invisible
    select(returntask)
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
    else select(selected)
  } else if (direction == 'up') {
    // move the task up
    if (taskAbove()) taskAbove().before(selected)
    else select(selected)
  }
  save(true)
  if (selected.is(':visible')) select(selected)
  else select()
  console.log(selected, 'finished');
}

function dblclick(ev) {
  if ($(ev.target)[0].tagName == 'TEXTAREA') return
  if (selected.hasClass('in') && selected[0].tagName == 'P') {
    newTask()
  } else if (
    $(ev.target).hasClass('in') &&
    ev.target.tagName != 'TEXTAREA' &&
    !$(ev.target).hasClass('dateheading')
  ) {
    select($(ev.target))
    editTask()
  } else if (
    ['bold', 'italic', 'bold-italic'].includes(
      $(ev.target).attr('class')) == true) {
    select($(ev.target).parent())
    editTask()
  } else if (
    ($(ev.target).hasClass('selected') == true ||
      $(ev.target).hasClass('unselected') == true)
  ) {
    dragsoff()
  } else if ($(ev.target).hasClass('loads') == true) {
    newlist()
  }
}

function unfilter() {
  // show everything which is filtered
  if (filtered == true) {
    filteredlist.forEach((x) => {$(x).show()})
    filtered = false
    filteredlist = []
    updatedeadlines()
    $('#searchbar').val('')
  }
}

function keycomms(evt) {
  if (['Control', 'Command', 'Shift', 'Alt'].includes(evt.key)) {
    return
  }
  // makes sure to unselect on proper things
  if ($(':focus')[0] != undefined &&
    $(':focus')[0].tagName == 'INPUT') select()
  if (evt.key == 'Escape' && selected != undefined &&
    selected[0].tagName == 'TEXTAREA') {
    evt.preventDefault()
    const exp = /^(•*)(\s*)$/
    if (exp.test(selected.val()) == true) {
      selected.prev().remove()
      const taskabove = taskAbove()
      selected.remove()
      select(taskabove)
    } else {
      // select current task if cancelling
      saveTask()
    }
  } else if (evt.key == 't' && evt.ctrlKey) {
    select(dateToHeading(stringToDate('t')))
  } else if (evt.key == 'Enter' && $(':focus').attr('id') ==
    'searchbar') {
    evt.preventDefault()
    // focus on searchbar and find it
    if ($('#searchbar').val().slice(0, 2) == 'd:') {
      const date = dateToHeading(
        stringToDate($('#searchbar').val().slice(2)))
      select(date)
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
        return !stripChildren($(x)).includes(searchstr)})
      console.log(filteredlist)
      filteredlist.forEach((x) => {$(x).hide()})
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
    if (filtered == true) unfilter()
  } else if (evt.key == 'z' && evt.ctrlKey == true) {
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
  } else if (
    selected == undefined && evt.key == 'Enter' &&
    $(':focus').hasClass('selected')
  ) {
    evt.preventDefault()
    toggledrags()
  } else if (selected != undefined && evt.key == 'Enter' &&
    !evt.altKey && !evt.shiftKey) {
    // swap editing
    evt.preventDefault()
    if (selected[0].tagName == 'TEXTAREA') {
      saveTask()
    } else if (selected[0].tagName == 'SPAN' &&
      selected.hasClass('dateheading') == false) {
      evt.preventDefault()
      editTask()
    }
  } else if (selected != undefined && evt.key == 'Enter' && 
    evt.altKey == true && evt.metaKey == true) {
    evt.preventDefault()
    // new task if it's in textarea then save task
    if (selected[0].tagName == 'TEXTAREA') {
      saveTask()
    }
    select(taskAbove())
    newTask()
  } else if (selected != undefined && evt.key == 'Enter' && 
    evt.altKey == true) {
    evt.preventDefault()
    // new task if it's in textarea then save task
    if (selected[0].tagName == 'TEXTAREA') {
      saveTask()
    }
    if (evt.shiftKey == true) {
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
  } else if (evt.key == 'r' && evt.ctrlKey == true) {
    selectRandom()
  } else if (selected != undefined && selected[0].tagName !=
    'TEXTAREA') {
    if (evt.key == 'Backspace') {
      deleteTask()
    } else if (evt.key == '‘') {
      indentTask(true)
    } else if (evt.key == '“') {
      indentTask(false)
    } else if (evt.key == 'ArrowUp' && evt.altKey == true) {
      evt.preventDefault()
      moveTask('up')
    } else if (evt.key == 'ArrowDown' && evt.altKey == true) {
      evt.preventDefault()
      moveTask('down')
    } else if (evt.key == ' ') {
      evt.preventDefault();
      if (evt.shiftKey == true) {
        archiveTask()
      } else {
        toggleComplete()
      }
    } else if (evt.key == 'i') {
      toggleImportant()
    } else if (evt.key == 'ArrowRight' &&
      evt.altKey == true) {
      // insert afterwards
      // TODO: find the date of today
      // const today = getDate(today)
      moveTask('pop')
    } else if (evt.key == 'ArrowLeft' &&
      evt.altKey == true) {
      // insert afterwards
      moveTask('flop')
    }
  }
  if (selected != undefined && selected[0].tagName != 'TEXTAREA' &&
    !event.metaKey && !event.ctrlKey && !event.altKey) {
    // key comms without modifier keys
    // TODO fix to make it so they skip over hidden tasks
    // TODO make so that tasks which don't have subtasks aren't folded
    
    if (evt.key == 'ArrowUp' && evt.shiftKey) {
      evt.preventDefault()
      while (taskAbove() && !isHeading(taskAbove())) {
        console.log(taskBelow());
        if (taskAbove()[0] == selected[0]) break
        select(taskAbove())
      }
      select(taskAbove())
    } else if (evt.key == 'ArrowDown' && evt.shiftKey) {
      evt.preventDefault()
      while (taskBelow() && !isHeading(taskBelow())) {
        if (taskBelow()[0] == selected[0]) break
        select(taskBelow())
      }
      select(taskAbove())
    } else if (evt.key == 'ArrowUp') {
      evt.preventDefault()
      select(taskAbove())
    } else if (evt.key == 'ArrowDown') {
      evt.preventDefault()
      select(taskBelow())
    } else if (evt.key == 'ArrowRight' && Array().includes($('#flop')[0])) {
      // go over and select pop
      // TODO: find the date of today
      // const today = getDate(today)
      select($('#pop').children().toArray()[
        $('#pop').children().toArray().length - 1])
    } else if (evt.key == 'ArrowLeft' &&
      selected.parents().toArray().includes($('#pop')[0])) {
      // go over and select pop
      // TODO: find the date of today
      // const today = getDate(today)
      select($('#flop').children().toArray()[
        $('#flop').children().toArray().length - 1])
    } else if (['{', '}'].includes(evt.key)) {
      if (selected.attr('folded') == 'false') {
        collapseAll('false')
      } else if (selected.attr('folded') == 'true') {
        collapseAll('true')
      }
    } else if (evt.key == '[' || evt.key == ']') {
      // toggle folding
      toggleSubtasks();
    } else if (evt.key == 'Enter' && evt.altKey == true &&
      evt.shiftKey == true) {
      newTask(true) // create subtask
    } else if (evt.key == 'Enter' && evt.altKey == true) {
      newTask() // new task
    }
  }
  if (evt.key == 'Escape') $(document).scrollTop(0); // fixes scrolling
}

function getFrame(task) {
  if (task.attr('id') == 'flop') return $('#flop')
  else if (task.attr('id') == 'pop') return $('#pop')
  const parents = task.parents().toArray()
  if (parents.includes($('#flop')[0])) return $('#flop')
  else if (parents.includes($('#pop')[0])) return $('#pop')
}

function reloadpage() {
  if (uploading == true) {
    reloading = true
    console.log('uploading in prog; returning reupload')
    return
  }
  try {
    const test = new XMLHttpRequest();
    test.onreadystatechange = function () {
      if (this.readyState == 4) {
        try {
          data = JSON.parse(this.responseText)
        } catch (err) {}
        reloadpage2() //fixing things to be di
      }
    }
    test.open(
      'POST', 
      'users/' + document.cookie.split(';')[0].split('=')[1] + '.json'
    )
    test.send()
  } catch(syntaxError) {
    reloadpage2()
  }
}

function reloadpage2() {
  console.log(['downloaded', data.flop[loadedlist].text]);
  // reselect old select
  let selectframe, selectindex
  if (selected != undefined && selected[0].tagName == 'SPAN') {
    selectframe = getFrame(selected)
    selectindex = selectframe.find('span').toArray().indexOf(selected[0])
  }
  $('#pop').empty()
  $('#flop').empty()
  $('#loads').empty()
  loadpage(false)
  if (selectframe != undefined) {
    select($(selectframe.find('span').toArray()[selectindex]), false)
  }
  $(':focus').blur()
}

function loadpage(setload) {
  $('#username').text(document.cookie.split(';')[0].split('=')[1].split('_')[0])
  if (setload != false) {
    // prevents endless loading loop
    $(document).on('keydown', keycomms)
    $(document).on('contextmenu', event, context)
    $(document).on('click', event, clicked)
    $(document).on('dblclick', event, dblclick)
    $(window).resize(updateSizes)
    window.addEventListener('focus', reloadpage)
  }
  if (!data.headingalign) data.headingalign = 'center'
  document.documentElement.style.setProperty('--headingalign', 
    data.headingalign)
  $('#pop').html(data.pop)
  // loads data
  let oldload
  if (setload == false) {
    // fixes weird loadlist glitch
    oldload = Number(loadedlist)
  } else {
    oldload = Number(data.loadedlist)
  }
  for (i of data.flop) {
    newlist(i.title, i.text)
  }
  const children = $('#loads').children().toArray()
  for (i in children) {
    // remember folding
    const val = $(children[i]).val()
    if (val.slice(val.length - 4) == ' ...') {
      $(children[i]).removeClass('folded')
      loadedlist = Number(i)
      loadList()
      toggleFoldList()
    }
  }
  loadedlist = Number(oldload)
  loadList()
  dragson()
  $('#searchbar').val('')
  // show buttons and help right
  if (data.help == 'show') $('#help').show()
  if (data.help == 'hide') $('#help').hide()
  if (data.hidebuts == 'false') {
    $('.butbar').show()
    $('#editbuts').append($('#optionsbut'))
    $('#optionsbut').css('margin', '')
    $(':root').css('--butheight', $('#flopbuts').height() + 'px')
  } else {
    $('.butbar').hide()
    $('#username').after($('#optionsbut'))
    $('#optionsbut').css('margin-left', 'calc(50% - ' + 
      String($('#optionsbut').width() / 2) + 'px)')
    $(':root').css('--butheight', '-10px')
  }
  if (window.innerWidth < 600) {
    // hide unnecessary buts and show good ones
    $('.butbar').show()
    $('#movebuts').append($('#optionsbut'))
    $('#optionsbut').text('...')
    $(':root').css('--butheight', $('#flopbuts').height() + 'px')
    $('.butbar.mobilehide').hide()
    $('button').show()
  }
  $('.taskselect').removeClass('taskselect')
  updateSizes()
  clearEmptyDates()
  // go to today
  updatedeadlines()
  select(dateToHeading(stringToDate('t')))
  loading = false
  $(document).scrollTop(0)
}

loadpage()