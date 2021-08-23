// changes
var loadedlist
var data
var selected
var focused
var dragsenabled = false
var rendered = false
var increase = true
var time
var pause
var updated = false
var searchwidth = 10
var movetask
var fileinput
var loadedlistobj
var linestarts = {
  '# ': 'h1',
  '## ': 'h2',
  '### ': 'h3',
  '•': 'list',
  '@': 'event',
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

//# TIMER
var timer = new Timer({
    tick : 1,
    ontick : function (sec) {
      let minutes = Math.floor(sec / 60000); // minutes
      let secs = Math.ceil((sec - (Math.floor(sec / 60000) * 60000)) / 1000)
      $('#timerent').val(String(minutes) + ':' +
      String(secs).padStart(2, 0))
    },
    onstart : function() {}
})

// defining options using on
timer.on('end', function () {
  $('#timersnd')[0].play()
  alert('timer done')
  $('#timersnd')[0].pause()
  $('#timerent').val('')
})

//# DRAG BEHAVIOR

//start of drag
function dragStarted(evt) {
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
function dropped(evt) {
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
    for (i = children.length - 1; i >= 0; i --) {
      // append each child after
      selected.after(children[i])
    }
    data.flop[index].text = $('#test').html()
    save()
    loadedlist = index
    loadlist()
    return
  } 
  loadedlist = loads.indexOf(evt.target)
  if (loads.indexOf(loadedlistobj) > loads.indexOf(evt.target)) {
    data.flop.splice(loads.indexOf(evt.target), 0,
      data.flop[loads.indexOf(loadedlistobj)])
  } else {
    data.flop.splice(loads.indexOf(evt.target) + 1, 0,
      data.flop[loads.indexOf(loadedlistobj)])
  }
  // take out old item
  if (loads.indexOf(loadedlistobj) > loads.indexOf(evt.target)) {
    data.flop.splice(loads.indexOf(loadedlistobj) + 1, 1)
  } else {
    data.flop.splice(loads.indexOf(loadedlistobj), 1)
  }
  for (let i = 0; i < loads.length; i ++) {
    loads[i].value = data.flop[i].title
  }
  if (data.hidebuts == 'true') {
    $('.butbar').hide()
  }
  loadlist()
}

//enable you to edit titles
function toggledrags() {
  loads = Array.from($('#loads').children())
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
    loads.forEach((i) => {
      i.setAttribute('draggable', 'true')
    })
    dragsenabled = true
    $(':focus').blur()
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
  const newobj = {'title': savetitle, 'text': savetext}
  if (title === undefined) {
    data.flop.push(newobj); //add to main list of lists only if it's new
  }
  const newthing = $('<textarea></textarea>')
  newthing.val(newobj.title)
  newthing.addClass('unselected listtitle')
  newthing.on('click', loadthis)
  if (dragsenabled == 'true'){newthing.attr('draggable', 'true')}
  newthing.attr('ondragstart', 'dragStarted(event)')
  newthing.attr('ondragover', 'draggingOver(event)')
  newthing.attr('ondrop', 'dropped(event)')
  $('#loads').append(newthing)
  loadedlist = document.getElementById('loads').children.length - 1
  loadlist(); // load last element in list
  dragsoff()
  $('#loads').children()[loadedlist].focus()
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
    loadlist()
  }
}

function loadlist() { //updates the list display
  loads = Array.from($('#loads').children())
  loads.forEach(function(i) {i.setAttribute('class', 'unselected')})
  document.getElementById('loads').children[loadedlist].setAttribute(
  'class', 'selected')
  $('#flop').html(data.flop[loadedlist].text)
  $('.taskselect').removeClass('taskselect')
  save()
}

function updateSizes() {
  // updates the text sizes of each list
  let height = 0
  $('#texttest').css('font-family', 'var(--font), serif')
  $('#texttest').css('font-size', $('#loads').css('font-size'))
  $('#texttest').css('font-weight', 'bold')
  for (list of $('#loads').children()) {
    $('#texttest').html($(list).val())
    $('#texttest').css('width', $(list).width() + 'px')
    $(list).css('height', $('#texttest').height() + 'px')
  }
  $('#texttest').css('font-family', '')
  $('#texttest').css('font-size', '')
  $('#texttest').css('font-weight', '')
  for (list of [
    [$('#timerent')[0], 6], 
    [$('#searchbar')[0], 5],
    [$('#username')[0], $('#username').val().length / 2 + 2],
    [$('#lists')[0], 7]
  ]) {
    // update entries
    let fontsize = 24
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
}

// picks a new loadlist
function loadthis() {
  if (loadedlist != undefined && loadedlist != this.value) {
    select()
    save()
  }
  loads = Array.from($('#loads').children())
  loadedlist = loads.indexOf(this)
  loadlist(this)
}

function finalsave() {
  select()
  save()
  uploadData(true) // makes sure it gets saved
}

// Storing data:
function save() {
  savedata = JSON.parse(JSON.stringify(data))
  $('textarea.in').remove()
  if (selected != undefined && selected[0].tagName == 'TEXTAREA' &&
  selected.parent().hasClass('in')) {
    // clear open tasks
    selected.remove()
  }
  // cleans invisible things which aren't folded under headings
  let headings = $('span').toArray()
  headings = headings.filter((x) =>
  {if ($(x).attr('folded') == 'true' &&
  $(x).css('display') != 'none') {return true}})
  let foldedlist = []
  for (heading of headings) {
    foldedlist =
    foldedlist.concat(getHeadingChildren($(heading)).map((x) =>
    {return x[0]}))
  }
  const blindeds = $('span').toArray().filter((x) => {
    return ($(x).css('display') == 'none')
  })
  for (blinded of blindeds) {
    if (foldedlist.includes(blinded) == false &&
    $(blinded) != selected) {
      $(blinded).remove()
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
    data.flop[loadedlist].text = $('#flop').html()
    try {
      data.flop[loadedlist].title = $('#loads').children()[loadedlist].value
    } catch (TypeError) {
      data.flop[loadedlist].title = ''
    }
    data.loadedlist = loadedlist
  }
  dataString = JSON.stringify(data)
  localStorage.setItem('data', dataString)
  // backup data to the server after setting localstorage data
  uploadData()
  updatedeadlines()
}

function clearEmptyDates() {
  $('.placeholder').remove()
  // take away empty dates
  const dateslist = $('#pop').children().filter('.h1')
  for (date of dateslist) {
    console.log(stringToDate($(date).text(), true), stringToDate('t'));
    if (
      getHeadingChildren($(date)).length == 0 &&
      stringToDate($(date).text(), true).getTime() != 
        stringToDate('t').getTime()
    ) date.remove()
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
  var blob = new Blob([JSON.stringify(data)], 
  {type: 'text/plain;charset=utf-8'})
  const date = new Date()
  saveAs(blob, 'RiverBank-backup-' + dateToString(date) + '.json')
}

// Reset data to store in the browser
function reset() {
  yes = confirm("Are you sure you want to reset?")
  if (yes == true) {
    data = {'flop': [{'title': 'inbox', 'text': '<span class="in h1" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">Welcome to RiverBank!</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">RiverBank is a tool for storing and scheduling tasks.</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">This is the Bank view, where you can bank unscheduled tasks and projects.</span><span class="in h1" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">tutorial</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">right-click to see all options (double-tap on mobile)</span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• Select and edit tasks<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) press alt-enter to create a new task</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) press enter (or double-click) to save/edit</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">4) create subtasks with alt-shift-enter</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">5) delete tasks with delete</span></span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• Create a new project<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) select "tutorial" by clicking on it ^^</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) press alt-enter to create a new task</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) type "# " to make it a heading</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">4) press enter to save your heading</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">5) select a heading or task and press "[" or "]" to fold/unfold</span></span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• Create a new list<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">Lists are areas that store related tasks and projects</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) Right click on the "LISTS" area &lt;--</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) select "new"</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) enter the list name</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">4) click on a list\'s title to select it</span></span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• Schedule &amp; move tasks<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) enter "d:t+1d" in the search bar (top left) for tomorrow</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) drag your task onto the new heading to schedule it --&gt;</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) alt-drag: add as subtask</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">4) cmd-drag: insert before</span></span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• format tasks<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) [[links]] will search when you click on them</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) **bold**, *italic*, and **bold-italic**</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) weblink will automatically collapse</span></span><span class="in h2" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">extras</span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• search<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) type into the searchbar (top left)</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) press enter to search</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) click on options to select them</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">4) press esc to clear search</span></span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• Search for dates<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) enter "d:" to start date search</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) enter "t" for today</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) enter weekday to search weekdays (ex: "d:Mon"</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">4) enter modifiers after that to move forward/back: (+ or -)(number)(d/w/m/y)<span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">•&nbsp;ex: Mon+1d, Mon-1d, Mon+3w, Mon+1m+2w</span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">•&nbsp;Search will find the first weekday which matches and create a heading if it doesn\'t already exist</span></span></span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• set a timer<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) enter minutes into "timer" (top left)</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) press enter to start, space to stop, and esc to clear</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="false" style="">3) 25, 15, 5: set minutes</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">4) +2, -2: add/subtract 2 minutes</span></span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• customize settings: click on options (top left)<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) change date between dd.mm.yyyy, mm/dd/yyyy, and yyyy-mm-dd</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) change weekdays between long (Mon) and short (M)</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) change color themes</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">4) hide/show buttons</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">5) hide/show help</span></span>'}],'pop': '<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">This is the River view, where you can drag tasks to specific dates to schedule them.</span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• Complete tasks<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) select the task</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) press space to complete in place</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) OR press shift-space to archive (moves to "completed" for today</span></span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">•&nbsp;create events<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) create a new task</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) enter "@ " to make an event and save</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) drag tasks onto the event to schedule them for that block of time</span></span><span class="in list" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">• create deadlines<span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">1) create a new task</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">2) enter "&gt;" and a date or weekday</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">3) enter the task name and save</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">4) a red heading is displayed under the due date (see below)</span><span class="in" ondragstart="dragTask(event)" ondragover="draggingOver(event)" ondrop="dropTask(event)" draggable="true" style="">5) click on due date or deadline to navigate between them</span></span>', 'hidebuts':'false', 'style':'default.css', 'dateSplit':'mm/dd/yyyy', 'weekdays':'Mon', 'help':'show', 'loadedlist':'0'}
    dataString = JSON.stringify(data)
    localStorage.setItem('data', dataString)
    uploadData()
    reloadpage()
  }
}

function uploadData(async) {
  // uploads data to server
  try {
    const blob = new Blob([JSON.stringify(data)], {type:
      "text/plain"})
    const newdata = new FormData()
    newdata.append("upfile", blob)
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
      if (this.readyState == 4) {
      }
    }
    if (async == true) {
      xhr.open("POST", "upload.php", false)
    } else {
      xhr.open("POST", "upload.php")
    }
    xhr.send(newdata)
  } catch (err) {
    // pass
    console.log(err)
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
    weekdaysStr = {0:'Sun', 1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 
      6:'Sat'}
    weekdaysNum = {'Sun':0, 'Mon':1, 'Tue':2, 'Wed':3, 'Thu':4, 'Fri':5, 
      'Sat':6}
  } else if (data.weekdays == 'Mon') {
    data.weekdays = 'M'
    weekdaysStr = {0:'U', 1:'M', 2:'T', 3:'W', 4:'R', 5:'F', 6:'S'}
    weekdaysNum = {'U':0, 'M':1, 'T':2, 'W':3, 'R':4, 'F':5, 'S':6}
  }
  save()
}

function toggleWeekdayFormat() {
  // changes between 1 and 3 letter date formats
  const weekdaytransdict = {'M':'Mon','Mon':'M','T':'Tue','Tue':'T','W':'Wed',
  'Wed':'W','R':'Thu','Thu':'R','F':'Fri','Fri':'F','S':'Sat','Sat':'S',
  'U':'Sun','Sun':'U'}
  const headingslist = $('#pop').children().toArray().filter(
  (x) => {if ($(x).hasClass('h1') &&
  stringToDate($(x).text(), true) != 'Invalid Date') {return true}})
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
  const floplist = data.flop.concat([{title:'#pop', text:$('#pop').html()}])
  for (i in floplist) {
    $('#test').html(floplist[i].text)
    for (x of $('#test').find('.deadline')) {
      // change all deadlines
      data.dateSplit = thisformat
      console.log(stringToDate($(x).text().slice(
        1, $(x).text().length - 1), false));
      const getdate = stringToDate($(x).text().slice(
        1, $(x).text().length - 1), false)
      data.dateSplit = format
      console.log(dateToString(getdate, false));
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

function stringToDate(string, weekday) {
  // maps a date-search string to a specific date heading
  if (weekday == true) {
    // chop off weekday
    string = string.split(' ').slice(1).join(' ')
  } else {
    weekday = false
  }
  if (string.charAt(0) == ' ') {
    string = string.slice(1)
  }
  let date = new Date()
  if (string.charAt(0) == 't') {
    // nothing because the weekday is correct
  } else if (
    Object.keys(weekdaysNum).includes(string.split(/(\+|-|\s)/)[0])
  ) {
    // analyze as a weekday string
    weekday = weekdaysNum[string.split(/(\+|-|\s)/)[0]]
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
  // find the matching date, or create if not
  const newtask = createBlankTask()
  newtask.addClass('h1')
  newtask.attr('folded', 'false')
  newtask.text(dateToString(date, true))
  newtask.addClass('dateheading')
  newtask.attr('draggable', 'false')
  // sort date headings to be correct
  const headingslist = $('#pop').children().toArray().filter((x) =>
  {if (stringToDate($(x).text()) != 'Invalid Date' &&
  $(x).hasClass('dateheading')) return true})
  let heading1 = headingslist.find((x) => 
  {if ($(x).text() == newtask.text()) return true})
  if (heading1 == undefined) {
    // insert elt at beginning
    $('#pop').append(newtask)
    headingslist.push(newtask)
    for (heading of headingslist.sort(
    (a, b) => {return stringToDate($(a).text(), true).getTime() - 
    stringToDate($(b).text(), true).getTime()})) {
      const children = getHeadingChildren($(heading)).reverse()
      $('#pop').append($(heading))
      children.forEach((x) => {$(heading).after($(x))})
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
  const searches = data.flop.concat([{'title':'pop', 'text':data.pop}])
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
    loadedlist = data.flop.map((x) => {return x.title}).indexOf(
    el.attr('title'))
    loadlist()
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
  $('.buffer').remove()
  const collapselist = $('#pop').children().filter('.h1').toArray().filter(
  (x) => {return $(x).attr('folded') == 'true'})
  // uncollapses then recollapses to prevent weirdness
  for (heading of collapselist) {
    togglefold($(heading), false)
  }
  for (list of data.flop.concat([{'title':'pop', 'text':$('#pop').html()}])) {
    $('#test').empty()
    $('#test').html(list.text)
    for (let deadline of $('#test').find('.deadline')) {
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
  today.setHours(0); today.setMinutes(0); today.setSeconds(0); 
  today.setMilliseconds(0)
  for (heading of $('#pop').children().filter('.dateheading')) {
    // add in relative dates underneath
    const newelt = createBlankTask()
    newelt.text(datesToRelative(
      today, 
      stringToDate($(heading).text(), true))
    )
    newelt.addClass('placeholder')
    newelt.removeClass('in')
    $(heading).before(newelt)
  }
  $('#pop').append('<span class="buffer" style="height:75%"></span>')
  if ($('#flop').html().length > 0) {
    $('#flop').append('<span class="buffer" style="height:75%"></span>')
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
  save()
  clearEmptyDates()
}

function indentTask(indent) {
  if (selected.parent()[0].tagName == 'SPAN' && indent == false) {
    selected.parent().after(selected)
  } else if (indent == true) {
    selected.prev().append(selected)
  }
}

function saveTask() {
  // analyze format of task and create new <span> elt for it
  const savetask = selected.prev() // looks at item before it
  if (selected.val() == '') {
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
    }
    else endindex += index
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
  let newstr = ''
  let start = 0
  const modecloses = []
  for (let i = 0; i < htmlstr.length; i ++) {
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
  if (savetask.hasClass('folded') == 'true') {
    savetask.addClass('folded')
  }
  savetask.html(newstr)
  // take away hashtags
  if (savetask.hasClass('h1') == true) {
    savetask.html(savetask.html().slice(2))
  } else if (savetask.hasClass('h2') == true) {
    savetask.html(savetask.html().slice(3))
  } if (savetask.hasClass('h3') == true) {
    savetask.html(savetask.html().slice(4))
  }
  const wordlist = stripChildren(savetask).split(' ')
  for (word in wordlist) {
    if (wordlist[word].slice(1, wordlist[word].length - 1).includes('.') && 
    stringToDate(wordlist[word]) == 'Invalid Date') { 
      let match = false 
    for (patt of [/\.+/, /\d*\.\d*/]) { 
        if (patt.test(wordlist[word]) == true) { 
          match = true
        }
      }
      if (match == false) {
        // format as a url
        savetask.html(savetask.html().replace(wordlist[word], 
        '<span class="weblink"><a href="' + wordlist[word] + '" title="' + 
        wordlist[word] + '">§</a></span>')); 
      }
    }
  }
  selected.remove()
  savetask.show()
  select(savetask)
  if (selected.parent()[0].tagName == 'SPAN') {
    selected.parent().attr('draggable', 'true')
  }
  save()
}

function helpfold(el) {
  for (child of el.children().toArray().slice(1)) {
    if ($(child).is(':hidden')) {
      $(child).show()
    } else {
      $(child).hide()
    }
  }
}

function select(el, scroll) {
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
    if (scroll != false) {
      // only execute if not clicked
      parent.scrollTop(0)
      parent.scrollTop(Number(selected.offset().top) - 
      Number(parent.offset().top) - 200)
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
    'link', 'italic', 'bold', 'bold-italic', 'deadline', 'weblink'
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
    $('#texttest').text(selected.val())
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
    selected.focus()
    selected.val(stripChildren(el))
    // add back hashtags
    if (el.hasClass('h1') == true) {
      selected.val('# ' + selected.val())
      el.removeClass('h1')
    } else if (el.hasClass('h2') == true) {
      selected.val('## ' + selected.val())
      el.removeClass('h2')
    } else if (el.hasClass('h3') == true) {
      selected.val('### ' + selected.val())
      el.removeClass('h3')
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
  e = selected
  if (selected[0].tagName == 'P' && selected.hasClass('in')) {
    // blank
    e.append(newspan)
  } else if (selected[0].tagName =='SPAN' && subtask == true) {
    // subtask
    e.append(newspan)
  } else if (['SPAN'].includes(selected[0].tagName)) {
    // regular task
    e.after(newspan)
  }
  select(newspan)
  editTask()
}

function toggleSomeday() {
  selected.toggleClass('someday')
}

function archiveAll() {
  $('span').filter('#flop .complete').toArray().forEach((x) =>
  {select(x); archiveTask()})
}

function archiveTask(dated) {
  // archives the selected Flop to the current day
  let heading
  const day = $(dateToHeading(stringToDate('t')))
  const childText = getHeadingChildren(day).map((x) =>
  {return $(x).text()})
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
  /~\d[d|w|m|y]/.test(text[text.length - 1])) {
    const date = new Date()
    const lastchar = text[text.length - 1].charAt(
    text[text.length - 1].length - 1)
    const amount = Number(text[text.length - 1].slice(1, 
    text[text.length - 1].length - 1))
    if (lastchar == 'd') {
      date.setDate(Number(date.getDate()) + amount)
    } else if (lastchar == 'w') {
      date.setDate(Number(date.getDate()) + (amount * 7))
    } else if (lastchar == 'm') {
      date.setMonth(Number(date.getMonth()) + amount)
    } else if (lastchar == 'y') {
      date.setFullYear(Number(date.getFullYear()) + amount)
    }
    const heading = dateToHeading(date)
    const newtask = createBlankTask()
    newtask.text(selected.text())
    if (
      !getHeadingChildren($(heading)).map((x) => {
        return $(x).text()
      }).includes(selected.text())
    ) {
      $(heading).after(newtask)
    }
  }
  selected.toggleClass('complete')
  save()
}

function toggleImportant() {
  selected.toggleClass('important')
  save()
}

function startTimer() {
  timertext = $('#timerent').val()
  if (!timertext.includes(':')) {
    timer.start(timertext * 60)
    time = timertext * 60000
  } else if (timertext.includes(':')) {
    split = timertext.split(':').map((x) => {return Number(x)})
    timer.start(split[0] * 60 + split[1])
  }
  $('#timerent').blur()
}

function timertest(ev) {
  if (ev.key == 'Enter') {
    startTimer()
  } else if (ev.key == 'Escape') {
    timer.stop()
    $('#timerent').blur()
    $('#timerent').val('')
  } else if (ev.key == ' ') {
    ev.preventDefault()
    if (pause == false) {
      timer.pause()
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
function dropTask(evt) {
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
  if ($(evt.target).attr('folded') == 'true') {
    togglefold($(evt.target))
    getHeadingChildren($(evt.target))[
    getHeadingChildren($(evt.target)).length - 1].after(selected)
  } else if (evt.target.tagName == 'P' && 
  $(evt.target).hasClass('in')) {
    if (evt.altKey == true) {
      if (evt.metaKey == true) {
        $(evt.target).prepend(selected)
      } else {
        $(evt.target).append(selected)
      }
    } else {
      $(evt.target).append(selected)
    }
  } else if (evt.target.tagName == 'SPAN' && 
  $(evt.target).hasClass('in')) {
    if (evt.altKey == true) {
      if (evt.metaKey == true) {
        const subtasks = $(evt.target).children().toArray().filter(
          (x) => {if (isSubtask($(x)) == true) return true}
        )
        if (subtasks.length == 0) {
          $(evt.target).append(selected)
        } else {
          $(subtasks[0]).prepend(selected)
        }
      } else {
        $(evt.target).append(selected)
      }
    } else {
      if (evt.metaKey == true) {
        $(evt.target).before(selected)
      } else {
        $(evt.target).after(selected)
      }
    }
  }
  for (i = children.length - 1; i >= 0; i --) {
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
      if (e.hasClass('folded') == true) {
      e.children().toArray().forEach((x) => {$(x).show()})
      e.html(stripChildren(e, 'html').slice(0, -4) + getChildren(e))
      } else if (e.hasClass('folded') == false) {
        e.children().toArray().forEach((x) => {$(x).hide()})
        e.html(stripChildren(e, 'html') + ' ...' + getChildren(e))
      }
      e.toggleClass('folded')
    }
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
  for (let i = start; i < children.length; i ++) {
    let toggle = true
    for (fold of folds[thisclass]) {
      if ($(children[i]).hasClass(fold) == true) {
        toggle = false
      }
    }
    if (toggle == false) {
      return children.toArray().slice(start, i).map((x) => {return $(x)})
    }
  }
  return children.toArray().slice(start).map((x) => {return $(x)})
}

function collapseAll(folded) {
  $('span').toArray().forEach((x) => {
    if ($(x).attr('folded') == folded) {togglefold($(x));}
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
  for (heading of keepfolded) {
    heading.attr('folded', 'false')
    togglefold(heading)
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
  } else {
    $('.butbar').hide()
    data.hidebuts = 'true'
    $('#searchbar').before($('#optionsbut'))
    $('#optionsbut').css('margin', '5px calc(50% - 10px)')
    $(':root').css('--butheight', '-10px')
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

function context(e) {
  if (selected != undefined && selected[0].tagName == 'TEXTAREA') {
    saveTask()
  }
  e.preventDefault()
  if (
    $(e.target)[0].tagName == 'TEXTAREA' && 
    !$(e.target).hasClass('selected')
  ) {
    // select list
    e.target.click()
  } else {
    select($(e.target))
  }
  $('#context-menu').show()
  options = {
    '#context-newlist': [['TEXTAREA', 'DIV'], ['selected', 'unselected', 
      'loads']],
    '#context-toggledrags': [['TEXTAREA'], ['selected', 'unselected']],
    '#context-deletelist': [['TEXTAREA'], ['selected', 'unselected']],
    '#context-reset': [['BUTTON', 'DIV'], ['opts']],
    '#context-switchUser': [['BUTTON', 'DIV'], ['opts']],
    '#context-upload': [['BUTTON', 'DIV'], ['opts']],
    '#context-download': [['BUTTON', 'DIV'], ['opts']],
    '#context-divider': [['SPAN'], ['in']],
    '#context-toggleComplete': [['SPAN'],['in']],
    '#context-toggleSomeday': [['SPAN'],['in']],
    '#context-toggleimportant': [['SPAN'],['in']],
    '#context-weekdaysToggle': [['BUTTON'], ['opts']],
    '#context-editTask': [['SPAN'], ['in']],
    '#context-archiveTask': [['SPAN'], ['in']],
    '#context-newTask': [['SPAN', 'P'], ['in', 'buffer']],
    '#context-newSubtask': [['SPAN'], ['in']],
    '#context-deleteTask': [['SPAN'], ['in']],
    '#context-indentTask': [['SPAN'], ['in']],
    '#context-unIndentTask': [['SPAN'], ['in']],
    '#context-toggleSubtasks' : [['SPAN'], ['in']],
    '#context-archiveComplete' : [['SPAN', 'P'], ['in']],
    '#context-clearEmptyHeadlines' : [['P'], ['in']],
    '#context-collapseAll' : [['P', 'SPAN'], ['in']],
    '#context-expandAll' : [['P', 'SPAN'], ['in']],
    '#context-toggleButs' : [['BUTTON'], ['opts']],
    '#context-styleDefault' : [['BUTTON'], ['opts']],
    '#context-styleJason' : [['BUTTON'], ['opts']],
    '#context-styleLight' : [['BUTTON'], ['opts']],
    '#context-stylePink' : [['BUTTON'], ['opts']],
    '#context-styleGreen' : [['BUTTON'], ['opts']],
    '#context-changeDate1' : [['BUTTON'], ['opts']],
    '#context-changeDate2' : [['BUTTON'], ['opts']],
    '#context-changeDate3' : [['BUTTON'], ['opts']],
    '#context-clearEmptyDates' : [['BUTTON'], ['opts']],
  }
  for (option of Object.keys(options)) {
    let showoption = false
    if (options[option][0].includes(e.target.tagName)) {
      for (cls of options[option][1]) {
        if ($(e.target).hasClass(cls) == true) {
          showoption = true
          break
        }
      }
    }
    if (showoption == true) {
      $(option).show()
    } else {
      console.log(option, 'hiding');
      $(option).hide()
    }
  }
  $('#context-menu').css('top', Math.min(e.pageY,
  window.innerHeight - $('#context-menu').height()) - 20)
  $('#context-menu').css('left', Math.min(e.pageX,
  window.innerWidth - $('#context-menu').width()) - 40)
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
    headinglist = selected.children().filter((x) => 
    {return isSubtask($(x))})
  } else if (selected == undefined ||
  selected.hasClass('in') == true) {
    headinglist = $('#flop').children().toArray()
  }
  if (headinglist.length > 0) {
    headinglist = headinglist.filter((x) => 
    {if ($(x).hasClass('complete') == false && 
    $(x).hasClass('taskselect') == false) return true})
    if (headinglist.length > 0) {
      select($(headinglist[
        Math.floor(Math.random() * (headinglist.length))
      ]))
    }
  }
}

function clicked(ev) {
  if ($(ev.target).hasClass('buffer')) {
    $('.buffer').remove();
  };
  $(document).scrollTop(0); // fixes weird shit
  $('#context-menu').hide()
  if (selected != undefined && selected[0].tagName == 'TEXTAREA' &&
  ev.target.tagName != 'TEXTAREA') {
    saveTask()
  }
  // buttons
  if ($(ev.target).attr('id') == 'optionsbut') {
    context(ev)
  } else if ($(ev.target).attr('id') == 'moveUpBut') {
    moveTask('up')
  } else if ($(ev.target).attr('id') == 'moveDownBut') {
    moveTask('down')
  } else if ($(ev.target).attr('id') == 'movePopBut') {
    moveTask('pop')
  } else if ($(ev.target).attr('id') == 'randomBut') {
    selectRandom()
  } else if ($(ev.target).attr('id') == 'addListBut') {
    newlist()
  } else if ($(ev.target).attr('id') == 'deleteListBut') {
    deletelist()
  } else if ($(ev.target).attr('id') == 'editListBut') {
    dragsoff()
  } else if ($(ev.target).attr('id') == 'moveFlopBut') {
    moveTask('flop')
  } else if ($(ev.target).attr('id') == 'editTaskBut') {
    editTask()
  } else if ($(ev.target).attr('id') == 'deleteTaskBut') {
    deleteTask()
  } else if ($(ev.target).attr('id') == 'archiveTaskBut') {
    archiveTask()
    $('#popsnd')[0].play()
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
    console.log('date');
  } else if ($(ev.target).attr('id') == 'timer25But') {
    timer.stop()
    $('#timerent').val('25:00')
    startTimer()
  } else if ($(ev.target).attr('id') == 'timer15But') {
    timer.stop()
    $('#timerent').val('15:00')
    startTimer()
  } else if ($(ev.target).attr('id') == 'timer5But') {
    timer.stop()
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
    timer.stop()
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
  } else if ($(ev.target).hasClass('link') == true) {
    // search the task
    $('#searchbar').val($(ev.target).text().slice(2, -2))
    search(true)
  } else if ($(ev.target).hasClass('deadline') == true) {
    select(dateToHeading(stringToDate(
    $(ev.target).text().slice(1))))
  } else if ($(ev.target).hasClass('duedate') == true) {
    // jump to deadline
    $('#searchbar').val(stripChildren($(ev.target)))
    search('deadline')
  } else if (
    ($(ev.target).parents().toArray().includes($('#flop')[0]) == true ||
    $(ev.target).parents().toArray().includes($('#pop')[0]) == true ||
    ['flop', 'pop'].includes($(ev.target).attr('id')) == true) &&
    ['bold', 'italic', 'bold-italic'].includes(
    $(ev.target).attr('class')) == false
  ) {
    // select allowable elements
    select(ev.target, false)
  } else if (
  ['bold', 'italic', 'bold-italic'].includes(
  $(ev.target).attr('class')) == true) {
    select($(ev.target).parent(), false)
  } else if ($(ev.target).hasClass('dropdown-item') == true) {
    eval($(ev.target).attr('function'))
  } else {
    select()
  }
}

function taskAbove() {
  // returns task above
  if (selected.prev()[0] == undefined &&
  selected.parent()[0].tagName == 'SPAN') {
    return selected.parent()
  } else if (selected.prev()[0] != undefined) {
    let returntask = selected.prev()
    while (returntask.hasClass('in') == false) {
      returntask = returntask.prev()
    }
    return returntask
  } // nonedisplays are not selected
}

function taskBelow() {
  // returns task below
  if (getChildren(selected) != '') {
    for (child of selected.children()) {
      if (isSubtask($(child)) == true) {
        return $(child)
      }
    }
    // if no subtasks
    let returntask = selected.next()
    while (returntask.hasClass('in') == false) {
      returntask = returntask.next()
    }
    return returntask
  } else if (selected.next()[0] == undefined &&
  selected.parent().next()[0] != undefined) {
    // end of parent item
    return selected.parent().next()
  } else if (selected.next()[0] != undefined) {
    let returntask = selected.next()
    while (returntask.hasClass('in') == false) {
      returntask = returntask.next()
    }
    return returntask
  }
}

function moveTask(direction) {
  if (direction == 'pop' &&
  selected.parents().toArray().includes($('#flop')[0]) == true) {
    $('#searchbar').val('d:')
    $('#searchbar').focus()
    movetask = selected
  } else if (direction == 'flop' &&
  selected.parents().toArray().includes($('#pop')[0])) {
    $('#flop').append(selected)
  } else if (direction == 'down') {
    // move the task down
    const oldselect = selected
    while (taskBelow() != undefined &&
    taskBelow().css('display') == 'none') {
      select(taskBelow())
    }
    select(taskBelow())
    if (selected != undefined) {
      selected.after(oldselect)
      select(oldselect)
    } else {
      select(oldselect)
    }
  } else if (direction == 'up') {
    // move the task up
    const oldselect = selected
    while (taskAbove() != undefined &&
    taskAbove().css('display') == 'none') {
      select(taskAbove())
    }
    select(taskAbove())
    if (selected != undefined) {
      selected.before(oldselect)
      select(oldselect)
    } else {
      select(oldselect)
    }
  }
}

function dblclick(ev) {
  if (
    ($(ev.target).hasClass('in') ||
    $(ev.target).hasClass('selected') ||
    $(ev.target).hasClass('buffer') ||
    $(ev.target).hasClass('unselected')) &&
    ev.target.tagName != 'TEXTAREA' &&
    window.innerWidth < 600
  ) {
    context(ev)
  } else if (
    $(ev.target).hasClass('in') &&
    ev.target.tagName != 'TEXTAREA' && 
    $(ev.target).hasClass('dateheading') == false
  ) {
    if (ev.target.tagName == 'P') {
      newTask()
    } else {
      editTask()
    }
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
      selected.remove()
      select()
    } else {
      // select current task if cancelling
      saveTask()
    }
  } else if (evt.key == 'Enter' && $(':focus').attr('id') ==
  'searchbar') {
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
    } else {
      search()
    }
  } else if ($(':focus').attr('id') == 'timerent') {
    timertest(evt);
  } else if (evt.key == 'Escape') {
    // cancel select
    $('#searchbar').val('')
    $('#searchbar-results').hide()
    $(':focus').blur()
    select()
  } else if (evt.key == 'z' && evt.ctrlKey == true) {
    data = JSON.parse(JSON.stringify(savedata))
    select()
    const oldload = loadedlist
    $('#pop').html(data.pop)
    $('#loads').empty()
    for (list of data.flop) {
      newlist(list.title, list.text)
      $('.taskselect').removeClass('taskselect')
    }
    loadedlist = oldload
    loadlist()
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
      moveTask('up')
    } else if (evt.key == 'ArrowDown' && evt.altKey == true) {
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
  } if (selected != undefined && selected[0].tagName != 'TEXTAREA'
  && !event.metaKey && !event.ctrlKey && !event.altKey) {
    // key comms without modifier keys
    // TODO fix to make it so they skip over hidden tasks
    // TODO make so that tasks which don't have subtasks aren't folded
    if (evt.key == 'ArrowUp') {
      while (taskAbove() != undefined && taskAbove().css('display') == 'none') {
        select(taskAbove())
      }
      if (taskAbove() != undefined) {
        select(taskAbove())
      }
    } else if (evt.key == 'ArrowDown') {
      while (
        taskBelow() != undefined && 
        taskBelow().css('display') == 'none' && 
        taskBelow().hasClass('in')
      ) {
        select(taskBelow())
      }
      if (taskBelow() != undefined && taskBelow().hasClass('in')) {
        select(taskBelow())
      }
    } else if (evt.key == 'ArrowRight' &&
    selected.parents().toArray().includes($('#flop')[0])) {
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

function reloadpage() {
  console.log('reloading');
  load()
  $('#pop').empty()
  $('#flop').empty()
  $('#loads').empty()
  loadpage(false)
}

function loadpage(setload) {
  $('#username').val(document.cookie.split(';')[0].split('=')[1].split('_')[0])
  if (setload != false) {
    // prevents endless loading loop
    $(document).on('keydown', keycomms)
    $(document).on('contextmenu', event, context)
    $(document).on('click', event, clicked)
    $(document).on('dblclick', event, dblclick)
    $(window).resize(updateSizes)
    $(window).on('focus', reloadpage)
    $(window).on('beforeunload', finalsave)
  }

  $('#pop').html(data.pop)
  // loads data
  const oldload = Number(data.loadedlist)
  for (i of data.flop) {
    newlist(i.title, i.text)
  }
  loadedlist = oldload
  loadlist()
  // go to today
  $('#searchbar').val('d:t')
  select(dateToHeading(stringToDate($('#searchbar').val().slice(2))))
  $('#searchbar').val('')
  // hide or show buttons via toggle
  if (data.hidebuts == 'true') {
    data.hidebuts = 'false'
  } else {
    data.hidebuts = 'true'
  }
  toggleHelp(); toggleHelp()
  toggleButs()
  $('.taskselect').removeClass('taskselect')
  $('#help').children().toArray().forEach((x) => {helpfold($(x))})
  updateSizes()
  clearEmptyDates()
}

loadpage()